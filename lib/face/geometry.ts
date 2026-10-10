import {AppError,FaceGeometrySchema,type FaceGeometry,type Point,type Ratio} from '../contracts';
export const spans=[[234,454],[10,152],[133,362],[61,291]] as const;
const unsuitable=(message:string)=>new AppError('unsuitable_photo',message,422);
export function selectSingleFace(faces:Point[][],matrices:number[][],width:number,height:number):FaceGeometry {
  if(faces.length!==1) throw unsuitable(faces.length?'Use a photo with only one face.':'No clear face found. Use an evenly lit, front-facing photo.');
  const face={landmarks:faces[0],transform:matrices[0],width,height};validateFaceQuality(face);return face;
}
export function validateFaceQuality(face:FaceGeometry):void {
  if(!FaceGeometrySchema.safeParse(face).success) throw unsuitable('The face mesh is incomplete or outside the photo. Try another photo.');
  const m=face.transform;
  // MediaPipe serializes MatrixData column-major. R = Rz(roll) Ry(yaw) Rx(pitch).
  const columns=[[m[0],m[1],m[2]],[m[4],m[5],m[6]],[m[8],m[9],m[10]]];
  const lengths=columns.map(v=>Math.hypot(...v));
  if(lengths.some(n=>n<.5||n>2)||Math.abs(m[3])+Math.abs(m[7])+Math.abs(m[11])>.01||Math.abs(m[15]-1)>.01) throw unsuitable('The face pose could not be verified.');
  const r=columns.map((v,i)=>v.map(x=>x/lengths[i]));
  if(Math.abs(r[0].reduce((s,v,i)=>s+v*r[1][i],0))>.05||Math.abs(r[0].reduce((s,v,i)=>s+v*r[2][i],0))>.05||Math.abs(r[1].reduce((s,v,i)=>s+v*r[2][i],0))>.05) throw unsuitable('The face pose is unreliable.');
  const deg=180/Math.PI,yaw=Math.asin(Math.max(-1,Math.min(1,-r[0][2])))*deg,pitch=Math.atan2(r[1][2],r[2][2])*deg,roll=Math.atan2(r[0][1],r[0][0])*deg;
  if(Math.abs(yaw)>15||Math.abs(pitch)>15||Math.abs(roll)>10) throw unsuitable('Look straight at the camera and keep your head level.');
}
export function computeRatios(face:FaceGeometry):Ratio[]{
  validateFaceQuality(face);
  const distance=(a:number,b:number)=>Math.hypot((face.landmarks[a].x-face.landmarks[b].x)*face.width,(face.landmarks[a].y-face.landmarks[b].y)*face.height);
  const [width,height,eyes,mouth]=spans.map(([a,b])=>distance(a,b));
  if([width,height,eyes,mouth].some(x=>!Number.isFinite(x)||x<=0)) throw unsuitable('The measured spans are not usable. Choose another photo.');
  return [{id:'face_width_height',label:'Face width / mesh height',value:width/height,definition:'Cheek span (234–454) divided by upper face-mesh to chin span (10–152); this is not a hairline measurement.'},{id:'inner_eye_gap_width',label:'Inner eye gap / face width',value:eyes/width,definition:'Inner eye corners (133–362) divided by cheek span (234–454).'},{id:'mouth_width_face_width',label:'Mouth width / face width',value:mouth/width,definition:'Mouth corners (61–291) divided by cheek span (234–454).'}];
}
