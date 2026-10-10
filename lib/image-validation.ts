import {AppError} from './contracts';
export const MAX_PHOTO_BYTES=10*1024*1024;
export async function validatePhoto(file:File):Promise<void>{
  if(!file.size) throw new AppError('invalid_image','Choose a nonempty photo.');
  if(file.size>MAX_PHOTO_BYTES) throw new AppError('image_too_large','Choose a photo of 10 MB or less.',413);
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new AppError('invalid_image','Choose a JPEG, PNG, or WebP photo.');
  const b=new Uint8Array(await file.slice(0,12).arrayBuffer());
  const jpeg=b[0]===255&&b[1]===216&&b[2]===255;
  const png=[137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v);
  const webp=b.length>=12&&String.fromCharCode(...b.slice(0,4))==='RIFF'&&String.fromCharCode(...b.slice(8,12))==='WEBP';
  if(!(file.type==='image/jpeg'?jpeg:file.type==='image/png'?png:webp)) throw new AppError('invalid_image','The photo content does not match its file type.');
}
export function validateDimensions(width:number,height:number){if(width<32||height<32||width>4096||height>4096) throw new AppError('invalid_dimensions','Resize your photo to between 32 and 4096 pixels on each side.');}
export async function readPhotoDimensions(file:File):Promise<{width:number;height:number}>{
  await validatePhoto(file);
  // Bounded metadata scan prevents decoding an image with enormous dimensions.
  const b=new Uint8Array(await file.slice(0,1024*1024).arrayBuffer()),v=new DataView(b.buffer);
  let width=0,height=0;
  if(file.type==='image/png'&&b.length>=24&&String.fromCharCode(...b.slice(12,16))==='IHDR'){width=v.getUint32(16);height=v.getUint32(20);}
  else if(file.type==='image/jpeg'){
    let i=2;while(i+3<b.length){if(b[i]!==255)break;while(b[i]===255)i++;const marker=b[i++];if(marker===0xd9||marker===0xda)break;if(marker===0x01||(marker>=0xd0&&marker<=0xd7))continue;if(i+1>=b.length)break;const length=v.getUint16(i);if(length<2||i+length>b.length)break;if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)&&length>=8){height=v.getUint16(i+3);width=v.getUint16(i+5);break;}i+=length;}
  }else if(file.type==='image/webp'&&b.length>=25){
    const chunk=String.fromCharCode(...b.slice(12,16));
    if(chunk==='VP8X'&&b.length>=30){width=1+b[24]+(b[25]<<8)+(b[26]<<16);height=1+b[27]+(b[28]<<8)+(b[29]<<16);}
    else if(chunk==='VP8L'&&b[20]===0x2f){width=1+b[21]+((b[22]&0x3f)<<8);height=1+(b[22]>>6)+(b[23]<<2)+((b[24]&0xf)<<10);}
    else if(chunk==='VP8 '&&b.length>=30&&b[23]===0x9d&&b[24]===0x01&&b[25]===0x2a){width=v.getUint16(26,true)&0x3fff;height=v.getUint16(28,true)&0x3fff;}
  }
  if(!width||!height)throw new AppError('invalid_image','The photo header is incomplete or unsupported. Export a fresh JPEG, PNG, or WebP.');
  validateDimensions(width,height);return {width,height};
}
