import {AppError,ConsentSchema,QuestionnaireSchema,FaceGeometrySchema,AnalyzeResultSchema,type AnalyzeResult} from '../contracts';
import {MAX_PHOTO_BYTES,readPhotoDimensions} from '../image-validation';
import {computeRatios} from '../face/geometry';
import {eligibleProducts,loadCatalog,loadReference} from '../catalog';
import {isReady,positiveLimit,type ServerEnvironment} from './environment';
import {createUsageGuard,visitorHash} from './usage';
import {analyzeWithOpenAI} from './openai';
import type {AnalysisInput} from './prompt';
type Dependencies={reserve?:(hash:string,now:Date)=>Promise<{allowed:boolean;retryAfterSeconds:number}>;analyze?:(input:AnalysisInput)=>Promise<Omit<AnalyzeResult,'ratios'>>};
export function json(body:unknown,status=200,extra:Record<string,string>={}){return Response.json(body,{status,headers:{'Cache-Control':'no-store',...extra}});}
async function boundedForm(request:Request){
  const limit=MAX_PHOTO_BYTES+128*1024;
  const declared=Number(request.headers.get('Content-Length'));if(declared>limit)throw new AppError('image_too_large','The upload is too large.',413);
  if(!request.headers.get('Content-Type')?.startsWith('multipart/form-data')||!request.body)throw new AppError('invalid_input','Send a multipart photo submission.');
  const reader=request.body.getReader(),chunks:Uint8Array[]=[];let size=0;
  try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();throw new AppError('image_too_large','The upload is too large.',413);}chunks.push(value);}}finally{reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
  try{return await new Request(request.url,{method:'POST',headers:{'Content-Type':request.headers.get('Content-Type')!},body:bytes}).formData();}catch{throw new AppError('invalid_input','The upload could not be read.');}
}
export async function handleAnalyze(request:Request,environment:ServerEnvironment,dependencies:Dependencies={}):Promise<Response>{
  try{
    const origin=request.headers.get('Origin');if(origin!==new URL(request.url).origin)throw new AppError('forbidden','Only this website can submit an analysis.',403);
    const identity=request.headers.get('oai-authenticated-user-id');if(!identity)throw new AppError('forbidden','Sign in through the private preview host to continue.',403);
    const form=await boundedForm(request);
    for(const key of ['image','questionnaire','geometry','consent'])if(form.getAll(key).length!==1)throw new AppError('invalid_input','The submission is incomplete or duplicated.');
    if([...form.keys()].some(k=>!['image','questionnaire','geometry','consent'].includes(k)))throw new AppError('invalid_input','Unexpected submission fields.');
    if(!ConsentSchema.safeParse(form.get('consent')).success)throw new AppError('consent_required','Confirm consent before sending your photo.');
    const image=form.get('image');if(!(image instanceof File))throw new AppError('invalid_input','Select a photo.');await readPhotoDimensions(image);
    let answers,geometry;
    try{answers=QuestionnaireSchema.parse(JSON.parse(String(form.get('questionnaire'))));}catch{throw new AppError('invalid_input','Check your questionnaire answers.');}
    try{geometry=FaceGeometrySchema.parse(JSON.parse(String(form.get('geometry'))));}catch{throw new AppError('unsuitable_photo','The face geometry is invalid. Choose another photo.',422);}
    const ratios=computeRatios(geometry);
    if(!isReady(environment))throw new AppError('setup_required','Owner setup required: securely configure the analysis service and durable usage protection.',503);
    const products=eligibleProducts(loadCatalog(),answers),reference=loadReference();
    const reserve=dependencies.reserve??createUsageGuard(environment.DB!,{daily:positiveLimit(environment.DAILY_ANALYSIS_LIMIT,20),hourly:positiveLimit(environment.PER_VISITOR_HOURLY_LIMIT,5)});
    const reservation=await reserve(await visitorHash(identity,environment.USAGE_HMAC_SECRET!),new Date());
    if(!reservation.allowed)return json({error:{code:'usage_limit',message:'The analysis limit has been reached. Please try again after the reset.',retryable:true}},429,{'Retry-After':String(reservation.retryAfterSeconds)});
    const bytes=new Uint8Array(await image.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
    const input={imageDataUrl:`data:${image.type};base64,${btoa(binary)}`,ratios,answers,products,reference};
    const analyze=dependencies.analyze??((i:AnalysisInput)=>analyzeWithOpenAI(i,{apiKey:environment.OPENAI_API_KEY,model:environment.OPENAI_MODEL}));
    const result=AnalyzeResultSchema.parse({...await analyze(input),ratios});return json(result);
  }catch(error){const e=error instanceof AppError?error:new AppError('provider_failed','The analysis could not be completed. Please retry.',502,true);return json({error:{code:e.code,message:e.message,retryable:e.retryable}},e.status);}
}
