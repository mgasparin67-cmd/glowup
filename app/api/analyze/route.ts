import {env} from 'cloudflare:workers';
import {handleAnalyze} from '../../../lib/server/analyze-handler';
export const dynamic='force-dynamic';
export async function POST(request:Request){return handleAnalyze(request,env);}
