import {z} from 'zod';
import {RatioIdSchema,type AnalyzeResult} from './contracts';

export const PROGRESS_KEY='glowup.progress.v1';
export const measurementLabels={face_width_height:'Face width / mesh height',inner_eye_gap_width:'Inner eye gap / face width',mouth_width_face_width:'Mouth width / face width'} as const;
export type MeasurementId=keyof typeof measurementLabels;
const measurement=z.object({id:RatioIdSchema,value:z.number().finite().positive()}).strict();
const checkInSchema=z.object({id:z.string().min(1).max(80),date:z.string().datetime(),definitionVersion:z.literal(1),measurements:z.array(measurement).length(3).refine(a=>new Set(a.map(r=>r.id)).size===3)}).strict();
const historySchema=z.object({version:z.literal(1),checkIns:z.array(checkInSchema).max(30)}).strict();
export type CheckIn=z.infer<typeof checkInSchema>;
export type ProgressStorage=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
export type ComparisonRow={id:MeasurementId;label:string;before:number;after:number;change:number};
export type CardData={before:CheckIn;after:CheckIn;rows:ComparisonRow[]};

export function createCheckIn(result:Pick<AnalyzeResult,'ratios'>,date:string,id:string):CheckIn{
  return checkInSchema.parse({id,date,definitionVersion:1,measurements:result.ratios.map(({id,value})=>({id,value}))});
}
export function readCheckIns(storage:ProgressStorage):CheckIn[]{
  const raw=storage.getItem(PROGRESS_KEY);
  if(raw===null)return [];
  if(raw.length>30000)throw new Error('Saved check-ins could not be read.');
  return historySchema.parse(JSON.parse(raw)).checkIns;
}
export function saveCheckIn(storage:ProgressStorage,checkIn:CheckIn):CheckIn[]{
  const parsed=checkInSchema.parse(checkIn);
  const next=[...readCheckIns(storage).filter(item=>item.id!==parsed.id),parsed].sort((a,b)=>Date.parse(a.date)-Date.parse(b.date)).slice(-30);
  storage.setItem(PROGRESS_KEY,JSON.stringify({version:1,checkIns:next}));
  return next;
}
export function clearCheckIns(storage:ProgressStorage):void{storage.removeItem(PROGRESS_KEY);}
export function compareCheckIns(before:CheckIn,after:CheckIn,ids:MeasurementId[]):ComparisonRow[]{
  checkInSchema.parse(before);checkInSchema.parse(after);
  if(before.id===after.id||Date.parse(before.date)>=Date.parse(after.date))throw new Error('Choose an earlier and a later check-in.');
  return [...new Set(ids)].map(id=>{
    const first=before.measurements.find(r=>r.id===id),last=after.measurements.find(r=>r.id===id);
    if(!first||!last)throw new Error('These measurements cannot be compared.');
    return {id,label:measurementLabels[id],before:first.value,after:last.value,change:last.value-first.value};
  });
}
export const formatCheckInDate=(date:string)=>new Intl.DateTimeFormat('en',{year:'numeric',month:'short',day:'numeric'}).format(new Date(date));
