import {z} from 'zod';
import rawProducts from '../data/products.json';
import rawReference from '../data/reference.json';
import type {Questionnaire} from './contracts';
const https=z.string().url().refine(s=>{try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}},'Purchase links must be HTTPS without embedded credentials.');
export const ProductSchema=z.object({id:z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/),name:z.string().min(1).max(150),category:z.string().min(1).max(100),ingredients:z.array(z.string().min(1).max(100)).max(100),price:z.number().finite().nonnegative().nullable(),currency:z.string().regex(/^[A-Z]{3}$/).nullable(),countries:z.array(z.string().max(80)).max(80),purchaseUrl:https.nullable(),usageNotes:z.string().max(500)}).strict();
export type Product=z.infer<typeof ProductSchema>;
export function parseCatalog(input:unknown):Product[]{const p=z.array(ProductSchema).max(1000).parse(input);if(new Set(p.map(x=>x.id)).size!==p.length)throw new Error('Duplicate product IDs.');return p;}
export function loadCatalog():Product[]{return parseCatalog(rawProducts);}
export function loadReference():string{return z.object({text:z.string().max(6000)}).strict().parse(rawReference).text;}
const currencies:Record<string,string>={canada:'CAD',us:'USD',usa:'USD','united states':'USD',uk:'GBP','united kingdom':'GBP',australia:'AUD','new zealand':'NZD'};
export function eligibleProducts(products:Product[],answers:Questionnaire):Product[]{
  const country=answers.country.trim().toLowerCase();
  const allergies=answers.allergies.toLowerCase().split(/[,;\n]+/).map(x=>x.trim()).filter(Boolean);
  return products.filter(p=>!p.ingredients.some(i=>allergies.includes(i.trim().toLowerCase()))&&(!country||!p.countries.length||p.countries.some(c=>c.toLowerCase()===country))&&(answers.budget===null||p.price===null||!p.currency||p.currency!==currencies[country]||p.price<=answers.budget)).slice(0,30);
}
