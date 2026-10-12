import {visitorHash} from './usage';
import type {ServerEnvironment} from './environment';
// Only a trusted store verification service may write this table.
// No browser flag, receipt claim or payment redirect can unlock analysis.
export async function hasActiveSubscription(identity:string,env:ServerEnvironment,now=Date.now()):Promise<boolean>{
  if(!identity||!env.DB||!env.USAGE_HMAC_SECRET||env.USAGE_HMAC_SECRET.length<32)return false;
  try{
    const subject=await visitorHash(identity,env.USAGE_HMAC_SECRET);
    const row=await env.DB.prepare('SELECT expires_at_ms, revoked_at_ms FROM app_subscription_access WHERE subject_hash = ? AND provider = ?').bind(subject,'apple').first<{expires_at_ms:number;revoked_at_ms:number|null}>();
    return !!row&&Number.isSafeInteger(row.expires_at_ms)&&row.expires_at_ms>now&&row.revoked_at_ms===null;
  }catch{return false;}
}
