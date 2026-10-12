import {skincareGuide} from './skincare-guide';
import type {AnalyzeResult,Questionnaire} from './contracts';
import type {Product} from './catalog';
const baseGuidance={
  'Gentle cleanser':{reason:'A basic cleansing category to consider when reviewing your routine.',usage:'Choose an appropriate formula and follow its label. Avoid adding several new products together.'},
  'Moisturizer':{reason:'A basic moisturizing category to consider when reviewing dryness or your everyday routine.',usage:'Review the complete ingredient list and follow the product label.'},
  'Sunscreen':{reason:'A sun-care category to consider as part of an everyday routine.',usage:'Follow the selected product’s sun-protection and reapplication instructions.'}
};
export const categoryGuidance:Record<string,{reason:string;usage:string;caution?:string;concern?:string;ingredients?:readonly string[]}>={
  ...baseGuidance,
  ...Object.fromEntries(skincareGuide.map(g=>[g.category,{reason:g.reason,usage:g.usage,caution:g.caution,concern:g.concern,ingredients:g.ingredients}]))
};
// Model selections are allowed, but free-form suitability, usage, and safety claims
// are not authoritative recommendation content. Emit reviewed templates instead.
export function constrainRecommendations(recommendations:AnalyzeResult['recommendations'],products:Product[],answers:Questionnaire):AnalyzeResult['recommendations']{
  return recommendations.map(r=>{
    const product=products.find(p=>p.id===r.productId);
    const guidance=categoryGuidance[r.category]??baseGuidance['Gentle cleanser'];
    const reported=guidance.concern&&answers.concerns.includes(guidance.concern)?`You reported ${guidance.concern.toLowerCase()}. `:'';
    return {...r,category:product?.category??r.category,reason:product?'This owner-supplied entry matches the available catalog filters. A match does not establish suitability, effectiveness, or regional availability.':`${reported}${guidance.reason}${guidance.ingredients?` Ingredients to explore: ${guidance.ingredients.join(', ')}.`:''}`,usage:product?'Check the full product label and consult a qualified professional about suitability. Unreviewed catalog usage notes are not used as instructions.':guidance.usage,cautions:[...(guidance.caution?[guidance.caution]:[]),'Ingredient synonyms and allergy compatibility remain unresolved. Verify the complete ingredient list with a qualified professional.',...(answers.sensitivity==='yes'?['You reported sensitivity. Review new products with a qualified professional before use.']:[]),'A photo and questionnaire cannot establish whether a product is safe or effective for you.']};
  });
}
