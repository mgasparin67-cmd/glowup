import {AppError,type FaceGeometry,type Point} from '../contracts';
import {readPhotoDimensions,validateDimensions} from '../image-validation';
import {validateFaceQuality} from './geometry';
export type PreparedPhoto={bitmap:ImageBitmap;url:string;submission:File};
export async function preparePhoto(file:File):Promise<PreparedPhoto>{
  await readPhotoDimensions(file);
  let bitmap:ImageBitmap;
  try{bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});}catch{throw new AppError('invalid_image','This photo could not be decoded. Try another JPEG, PNG, or WebP.');}
  try{
    validateDimensions(bitmap.width,bitmap.height);
    const upright=document.createElement('canvas');upright.width=bitmap.width;upright.height=bitmap.height;
    const context=upright.getContext('2d');if(!context)throw new Error('Canvas unavailable');context.drawImage(bitmap,0,0);
    const preview=await canvasBlob(upright);
    const scale=Math.min(1,1536/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
    const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
    const submission=new File([await canvasBlob(canvas)],'photo.jpg',{type:'image/jpeg'});
    return {bitmap,url:URL.createObjectURL(preview),submission};
  }catch(error){bitmap.close();throw error;}
}
function canvasBlob(canvas:HTMLCanvasElement):Promise<Blob>{return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new AppError('invalid_image','Photo preparation failed.')),'image/jpeg',.9));}
export function detectFace(bitmap:ImageBitmap,signal?:AbortSignal):Promise<FaceGeometry>{return new Promise((resolve,reject)=>{
  // MediaPipe's WASM loader calls importScripts, which module workers prohibit.
  const worker=new Worker('/face-worker.js');
  let settled=false;
  const finish=(error?:Error,face?:FaceGeometry)=>{if(settled)return;settled=true;clearTimeout(timer);signal?.removeEventListener('abort',abort);worker.terminate();error?reject(error):resolve(face!);};
  const abort=()=>finish(new DOMException('Cancelled','AbortError'));
  const timer=setTimeout(()=>finish(new AppError('detection_failed','Face detection timed out. Try a smaller photo or a different browser.',422,true)),60000);
  worker.onmessage=e=>{if(e.data.error){finish(new AppError('unsuitable_photo',e.data.error,422));return;}try{const face={...e.data.face,landmarks:e.data.face.landmarks.map((p:Point)=>({x:p.x,y:p.y,z:p.z}))};validateFaceQuality(face);finish(undefined,face);}catch(error){finish(error instanceof AppError?error:new AppError('detection_failed','The detected face mesh is incomplete. Try another photo.',422));}};
  worker.onerror=()=>finish(new AppError('detection_failed','Face detection could not start. Try a current browser with WebAssembly support.',422,true));
  signal?.addEventListener('abort',abort,{once:true});
  if(signal?.aborted){abort();return;}
  // Transfer a clone; keep the original upright bitmap for repeatable retry and overlay.
  createImageBitmap(bitmap).then(copy=>{if(settled){copy.close();return;}worker.postMessage({bitmap:copy,origin:location.origin},[copy]);}).catch(()=>finish(new AppError('detection_failed','Photo preparation failed.',422)));
});}
