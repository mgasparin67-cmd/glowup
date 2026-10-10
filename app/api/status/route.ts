import {env} from 'cloudflare:workers';
import {isReady} from '../../../lib/server/environment';
import {loadCatalog} from '../../../lib/catalog';
import {json} from '../../../lib/server/analyze-handler';
export const dynamic='force-dynamic';
export function GET(){return json({ready:isReady(env),model:env.OPENAI_MODEL||'gpt-4o-mini',catalogMode:loadCatalog().length?'provided':'categories'});}
