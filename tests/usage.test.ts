import {it,expect} from 'vitest';
import {Miniflare} from 'miniflare';
import {readFileSync} from 'node:fs';
import {createUsageGuard} from '../lib/server/usage';
it('atomically enforces durable global and visitor caps under concurrency',async()=>{
  const mf=new Miniflare({modules:true,script:'export default {fetch(){return new Response("ok")}}',d1Databases:['DB'],d1Persist:'.wrangler/test-usage'});
  try{
    const db=await mf.getD1Database('DB');await db.exec(readFileSync('tests/usage-schema.sql','utf8'));
    const now=new Date('2026-10-10T01:00:00Z');const reserve=createUsageGuard(db as unknown as D1Database,{daily:20,hourly:5});
    const same=await Promise.all(Array.from({length:15},()=>reserve('visitor-a',now)));expect(same.filter(x=>x.allowed)).toHaveLength(5);
    const many=await Promise.all(Array.from({length:40},(_,i)=>reserve(`visitor-${i}`,now)));expect(many.filter(x=>x.allowed)).toHaveLength(15);
    const reopened=createUsageGuard(db as unknown as D1Database,{daily:20,hourly:5});expect((await reopened('new-visitor',now)).allowed).toBe(false);
    expect((await reopened('visitor-a',new Date('2026-10-11T00:00:01Z'))).allowed).toBe(true);
  }finally{await mf.dispose();}
},30000);
