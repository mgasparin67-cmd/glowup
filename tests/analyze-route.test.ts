import {it,expect} from 'vitest';
import {handleAnalyze} from '../lib/server/analyze-handler';
import {face,answers,aiResult} from './fixtures';
const env={OPENAI_API_KEY:'test-only',USAGE_HMAC_SECRET:'test-secret-'.repeat(4),DB:{} as D1Database};
function request(patch:Record<string,string>={},size=21){const f=new FormData();f.set('image',new File([new Uint8Array([255,216,255,192,0,17,8,3,232,3,232,3,1,17,0,2,17,0,3,17,0]),new Uint8Array(size-21)],'p.jpg',{type:'image/jpeg'}));f.set('questionnaire',JSON.stringify(answers));f.set('geometry',JSON.stringify(face()));f.set('consent','true');for(const [k,v] of Object.entries(patch))f.set(k,v);return new Request('https://site.test/api/analyze',{method:'POST',headers:{Origin:'https://site.test','oai-authenticated-user-id':'owner'},body:f});}
it('invalid input and missing setup make zero provider calls',async()=>{let calls=0;const deps={subscriptionAccess:async()=>true,reserve:async()=>({allowed:true,retryAfterSeconds:0}),analyze:async()=>{calls++;return aiResult as any;}};for(const [req,e,status] of [[request({consent:'false'}),env,400],[request({questionnaire:'{}'}),env,400],[request({geometry:'{}'}),env,422],[request(),{},503],[request({},10*1024*1024+1),env,413]] as const){const r=await handleAnalyze(req,e,deps);expect(r.status).toBe(status);}expect(calls).toBe(0);});
it('recomputes ratios and rejects forged Origin',async()=>{let ratios:any;const deps={subscriptionAccess:async()=>true,reserve:async()=>({allowed:true,retryAfterSeconds:0}),analyze:async(input:any)=>{ratios=input.ratios;return aiResult as any;}};const r=await handleAnalyze(request(),env,deps);expect(r.status).toBe(200);[2/3,.25,.5].forEach((v,i)=>expect(ratios[i].value).toBeCloseTo(v,12));const forged=request();forged.headers.set('Origin','https://evil.test');expect((await handleAnalyze(forged,env,deps)).status).toBe(403);});
it('rejects no identity and denied reservations without provider access',async()=>{let calls=0;const req=request();req.headers.delete('oai-authenticated-user-id');expect((await handleAnalyze(req,env)).status).toBe(403);const r=await handleAnalyze(request(),env,{subscriptionAccess:async()=>true,reserve:async()=>({allowed:false,retryAfterSeconds:123}),analyze:async()=>{calls++;return aiResult as any;}});expect(r.status).toBe(429);expect(r.headers.get('Retry-After')).toBe('123');expect(calls).toBe(0);});
it('does not expose unexpected provider errors or secrets',async()=>{const r=await handleAnalyze(request(),env,{subscriptionAccess:async()=>true,reserve:async()=>({allowed:true,retryAfterSeconds:0}),analyze:async()=>{throw new Error('test-only raw provider stack');}});expect(r.status).toBe(502);expect(await r.text()).not.toContain('test-only');});
it('blocks unsubscribed requests before parsing the photo or calling the provider',async()=>{
  let calls=0;
  const forged=request({consent:'false',subscribed:'true'});
  const response=await handleAnalyze(forged,env,{subscriptionAccess:async()=>false,analyze:async()=>{calls++;return aiResult as any;}});
  expect(response.status).toBe(402);expect((await response.json() as {error:{code:string}}).error.code).toBe('subscription_required');expect(calls).toBe(0);
});


