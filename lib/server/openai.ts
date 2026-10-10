import {AppError,ModelResultSchema,type AnalyzeResult} from '../contracts';
import {buildPrompt,type AnalysisInput} from './prompt';
import {categoryGuidance,constrainRecommendations} from '../recommendations';
type TestDependencies={apiKey?:string;model?:string;fetch?:typeof fetch};
const str={type:'string'};
const obj=(properties:Record<string,unknown>)=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const arr=(items:unknown)=>({type:'array',items});
const schema=obj({ratioExplanations:arr(obj({id:{type:'string',enum:['face_width_height','inner_eye_gap_width','mouth_width_face_width']},explanation:str})),observations:arr(obj({feature:str,description:str,uncertainty:str})),recommendations:arr(obj({kind:{type:'string',enum:['catalog','category']},productId:{type:['string','null']},category:str,reason:str,usage:str,cautions:arr(str)})),limitations:arr(str),catalogMode:{type:'string',enum:['provided','categories']}});
const failed=()=>new AppError('provider_failed','The analysis service could not return a complete, supported result. Please retry.',502,true);
export async function analyzeWithOpenAI(input:AnalysisInput,dependencies:TestDependencies={}):Promise<Omit<AnalyzeResult,'ratios'>>{
  const key=dependencies.apiKey;
  if(!key)throw new AppError('setup_required','The owner must securely configure the analysis service before photo analysis is available.',503);
  const prompt=buildPrompt(input),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);
  try{
    const response=await (dependencies.fetch??fetch)('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({model:dependencies.model??'gpt-4o-mini',store:false,max_output_tokens:1800,instructions:prompt.instructions,input:[{role:'user',content:[{type:'input_text',text:prompt.data},{type:'input_image',image_url:input.imageDataUrl,detail:'high'}]}],text:{format:{type:'json_schema',name:'cosmetic_analysis',strict:true,schema}}})});
    if(!response.ok)throw failed();
    const body=await response.json() as {status?:string;output?:{type:string;content?:{type:string;text?:string}[]}[]};
    if(body.status!=='completed'||!Array.isArray(body.output))throw failed();
    const content=body.output.filter(x=>x.type==='message').flatMap(x=>x.content??[]);
    if(content.some(x=>x.type==='refusal'))throw failed();
    const outputs=content.filter(x=>x.type==='output_text');if(outputs.length!==1||!outputs[0].text)throw failed();
    const result=ModelResultSchema.parse(JSON.parse(outputs[0].text));
    const ids=result.ratioExplanations.map(x=>x.id);
    if(new Set(ids).size!==3||input.ratios.some(x=>!ids.includes(x.id)))throw failed();
    const mode=input.products.length?'provided':'categories';if(result.catalogMode!==mode)throw failed();
    for(const r of result.recommendations){if(mode==='categories'?(r.kind!=='category'||r.productId!==null||!Object.hasOwn(categoryGuidance,r.category)):(r.kind!=='catalog'||!input.products.some(p=>p.id===r.productId)))throw failed();}
    // A bounded guard complements the task instructions; free text is never a medical verdict.
    result.recommendations=constrainRecommendations(result.recommendations,input.products,input.answers);
    const text=JSON.stringify({...result,recommendations:[]}).replace(/\bnot (?:a )?diagnosis\b/gi,'').replace(/\bnot guaranteed\b/gi,'');
    if(/\b(diagnos(?:is|ed|e)|you have (?:melanoma|rosacea|eczema)|guaranteed|allergy[- ]safe|safe for (?:you|your skin)|will cure|cures? (?:acne|eczema))\b/i.test(text))throw failed();
    return result;
  }catch(error){if(error instanceof AppError)throw error;throw failed();}finally{clearTimeout(timer);}
}
