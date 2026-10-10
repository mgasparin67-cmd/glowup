import {AppError} from '../contracts';
export function createUsageGuard(db:D1Database,limits:{daily:number;hourly:number}){
  return async function reserveAnalysis(visitorKey:string,now:Date):Promise<{allowed:boolean;retryAfterSeconds:number}>{
    const iso=now.toISOString(),day=iso.slice(0,10),hour=iso.slice(0,13),timestamp=now.getTime();
    try{
      // One SQLite INSERT statement serializes count checking and reservation.
      // Each admitted attempt remains counted even if its provider call fails.
      const result=await db.prepare(`INSERT INTO analysis_reservations(visitor_hash,day,hour,created_at)
        SELECT ?1,?2,?3,?4
        WHERE (SELECT COUNT(*) FROM analysis_reservations WHERE day=?2) < ?5
        AND (SELECT COUNT(*) FROM analysis_reservations WHERE visitor_hash=?1 AND hour=?3) < ?6`).bind(visitorKey,day,hour,timestamp,limits.daily,limits.hourly).run();
      await db.prepare('DELETE FROM analysis_reservations WHERE created_at < ?').bind(timestamp-48*60*60*1000).run();
      if(result.meta.changes===1)return {allowed:true,retryAfterSeconds:0};
      const global=await db.prepare('SELECT COUNT(*) AS count FROM analysis_reservations WHERE day=?').bind(day).first<{count:number}>();
      const reset=global&&global.count>=limits.daily?Date.parse(`${day}T00:00:00Z`)+86400000:Date.parse(`${hour}:00:00Z`)+3600000;
      return {allowed:false,retryAfterSeconds:Math.max(1,Math.ceil((reset-timestamp)/1000))};
    }catch{throw new AppError('setup_required','Durable usage protection is unavailable. No analysis was sent.',503,true);}
  };
}
export async function visitorHash(identity:string,secret:string):Promise<string>{const enc=new TextEncoder(),key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,enc.encode(identity)))).map(x=>x.toString(16).padStart(2,'0')).join('');}
