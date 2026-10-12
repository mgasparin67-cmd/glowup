import {it,expect} from 'vitest';
import {hasActiveSubscription} from '../lib/server/subscriptions';
import {subscriptionPlans,analysisBudget} from '../lib/subscription-plans';
const secret='test-secret-'.repeat(4);
function environment(row:unknown){return {USAGE_HMAC_SECRET:secret,DB:{prepare:()=>({bind:()=>({first:async()=>row})})} as unknown as D1Database};}
it('locks missing, expired and revoked subscriptions',async()=>{
  expect(await hasActiveSubscription('user',{})).toBe(false);
  expect(await hasActiveSubscription('',environment(null))).toBe(false);
  for(const row of [null,{expires_at_ms:999,revoked_at_ms:null},{expires_at_ms:2000,revoked_at_ms:500}])expect(await hasActiveSubscription('user',environment(row),1000)).toBe(false);
  expect(await hasActiveSubscription('user',environment({expires_at_ms:2000,revoked_at_ms:null}),1000)).toBe(true);
});
it('plan budgets support the advertised scan allowance with ten times the Plus usage',()=>{
  for(const p of subscriptionPlans){expect(p.inputTokensPerMonth).toBe(p.scansPerMonth*analysisBudget.inputTokensPerAttempt);expect(p.outputTokensPerMonth).toBe(p.scansPerMonth*analysisBudget.outputTokensPerAttempt);}
  expect(subscriptionPlans[1].scansPerMonth).toBe(subscriptionPlans[0].scansPerMonth*10);
});
