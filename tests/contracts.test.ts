import { describe, it, expect } from 'vitest';
import { QuestionnaireSchema, ConsentSchema } from '../lib/contracts';
const valid = { concerns: [], sensitivity: 'unknown', allergies: '', currentProducts: '', budget: null, country: '' };
describe('questionnaire boundary', () => {
  it('allows unknown answers', () => expect(QuestionnaireSchema.parse(valid)).toEqual(valid));
  it.each([-1, Infinity, NaN])('rejects budget %s', budget => expect(QuestionnaireSchema.safeParse({...valid,budget}).success).toBe(false));
  it('bounds text and concern count', () => {
    for(const patch of [{allergies:'x'.repeat(501)},{currentProducts:'x'.repeat(501)},{country:'x'.repeat(81)},{concerns:Array(9).fill('dryness')}]) expect(QuestionnaireSchema.safeParse({...valid,...patch}).success).toBe(false);
  });
  it('requires explicit consent', () => { expect(ConsentSchema.safeParse(null).success).toBe(false); expect(ConsentSchema.parse('true')).toBe('true'); });
});
