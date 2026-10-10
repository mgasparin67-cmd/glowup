import {AppError} from '../contracts';
export type ServerEnvironment={DB?:D1Database;OPENAI_API_KEY?:string;OPENAI_MODEL?:string;USAGE_HMAC_SECRET?:string;DAILY_ANALYSIS_LIMIT?:string;PER_VISITOR_HOURLY_LIMIT?:string};
export function positiveLimit(value:string|undefined,fallback:number){if(value===undefined||value==='')return fallback;const n=Number(value);if(!/^\d+$/.test(value)||!Number.isSafeInteger(n)||n<=0)throw new AppError('setup_required','Usage limits need valid server configuration.',503);return n;}
export function isReady(env:ServerEnvironment){try{positiveLimit(env.DAILY_ANALYSIS_LIMIT,20);positiveLimit(env.PER_VISITOR_HOURLY_LIMIT,5);return !!(env.OPENAI_API_KEY&&env.DB&&env.USAGE_HMAC_SECRET&&env.USAGE_HMAC_SECRET.length>=32);}catch{return false;}}
