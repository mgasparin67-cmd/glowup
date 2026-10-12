// USD launch prices; native checkout must use StoreKit's localized displayPrice.
// Budgets are launch policy, pending billing-period metering integration.
export const subscriptionPlans=[
  {id:'essential',name:'glowup Essential',monthlyUsd:9.99,scansPerMonth:12,inputTokensPerMonth:300_000,outputTokensPerMonth:60_000,description:'For regular skincare check-ins.'},
  {id:'plus',name:'glowup Plus',monthlyUsd:39.99,scansPerMonth:120,inputTokensPerMonth:3_000_000,outputTokensPerMonth:600_000,description:'Ten times the scan allowance for frequent use.'}
] as const;
export const analysisBudget={inputTokensPerAttempt:25_000,outputTokensPerAttempt:5_000} as const;
