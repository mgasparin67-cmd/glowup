import {describe,it,expect} from 'vitest';
import {createCheckIn,readCheckIns,saveCheckIn,clearCheckIns,compareCheckIns,PROGRESS_KEY} from '../lib/progress';
import {computeRatios} from '../lib/face/geometry';
import {face,aiResult} from './fixtures';

function storage(){const data=new Map<string,string>();return {getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);},removeItem:(k:string)=>{data.delete(k);}};}
describe('private progress history',()=>{
  it('persists only dated numeric measurements, excluding photos and questionnaire/model prose',()=>{
    const store=storage();
    const result={...aiResult,ratios:computeRatios(face()),photo:'private-photo',allergies:'private-answer'};
    const snapshot=createCheckIn(result as any,'2026-10-01T12:00:00.000Z','one');
    saveCheckIn(store,snapshot);
    const encoded=store.getItem(PROGRESS_KEY)!;
    expect(encoded).not.toMatch(/private|texture|recommendations|landmarks/);
    expect(readCheckIns(store)).toEqual([snapshot]);
    expect(readCheckIns(store)).toEqual(readCheckIns(store));
  });
  it('rejects corrupted history, retains at most 30 entries and clears only glowup history',()=>{
    const store=storage();store.setItem(PROGRESS_KEY,'invalid json');
    expect(()=>readCheckIns(store)).toThrow();
    clearCheckIns(store);store.setItem('other-app','keep');
    for(let i=1;i<=31;i++) saveCheckIn(store,createCheckIn({ratios:computeRatios(face())} as any,`2026-10-${String(Math.min(i,31)).padStart(2,'0')}T12:00:00.000Z`,String(i)));
    expect(readCheckIns(store)).toHaveLength(30);
    expect(readCheckIns(store)[0].id).toBe('2');
    clearCheckIns(store);expect(readCheckIns(store)).toEqual([]);expect(store.getItem('other-app')).toBe('keep');
  });
  it('compares exact matching definitions, shows signed changes without grading improvement',()=>{
    const ratios=computeRatios(face());
    const first=createCheckIn({ratios} as any,'2026-10-01T12:00:00.000Z','one');
    const last=createCheckIn({ratios:ratios.map(r=>({...r,value:r.value+.1}))} as any,'2026-10-09T12:00:00.000Z','two');
    const rows=compareCheckIns(first,last,['face_width_height']);
    expect(rows).toHaveLength(1);expect(rows[0].change).toBeCloseTo(.1);
    expect(()=>compareCheckIns(last,first,['face_width_height'])).toThrow();
  });
  it('reports unavailable browser storage instead of claiming a saved check-in',()=>{
    expect(()=>saveCheckIn({getItem:()=>null,setItem:()=>{throw Error('blocked');},removeItem:()=>{}},createCheckIn({ratios:computeRatios(face())} as any,'2026-10-01T12:00:00.000Z','one'))).toThrow('blocked');
  });
});
