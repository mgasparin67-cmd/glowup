import {it,expect} from 'vitest';
import {parseCatalog,eligibleProducts,loadCatalog} from '../lib/catalog';
import {answers} from './fixtures';
const p={id:'cleanser-1',name:'Owner supplied cleanser',category:'Cleanser',ingredients:['Fragrance','Water'],price:20,currency:'CAD',countries:['Canada'],purchaseUrl:'https://example.com/product',usageNotes:'Follow label.'};
it('starts in category mode with no real catalog',()=>expect(loadCatalog()).toEqual([]));
it('rejects duplicate IDs, malformed entries and unsafe URLs',()=>{for(const input of [[p,p],[{...p,ingredients:'water'}],[{...p,purchaseUrl:'http://example.com'}],[{...p,purchaseUrl:'javascript:alert(1)'}],[{...p,purchaseUrl:'https://user:pass@example.com'}]])expect(()=>parseCatalog(input)).toThrow();});
it('excludes known ingredients case-insensitively and filters countries',()=>{expect(eligibleProducts([p],{...answers,allergies:'FRAGRANCE',country:'Canada'})).toEqual([]);expect(eligibleProducts([p],{...answers,country:'US'})).toEqual([]);expect(eligibleProducts([p],{...answers,country:'canada'})).toHaveLength(1);});
it('uses budget only with known matching currency context',()=>{expect(eligibleProducts([p],{...answers,budget:10,country:'Canada'})).toEqual([]);expect(eligibleProducts([{...p,countries:[],currency:'EUR'}],{...answers,budget:10,country:'Canada'})).toHaveLength(1);});
