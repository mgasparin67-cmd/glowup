import {it,expect} from 'vitest';
import {computeRatios} from '../lib/face/geometry';
import {face} from './fixtures';
it.each([[1000,1000],[800,1200],[1600,1000]])('measures pixel distances at %sx%s', (w,h)=>{const r=computeRatios(face(w,h));[2/3,.25,.5].forEach((v,i)=>expect(r[i].value).toBeCloseTo(v,12));});
it('is invariant under translation and uniform scale',()=>{const f=face();for(const p of f.landmarks){p.x=p.x*.5+.1;p.y=p.y*.5+.1;}[2/3,.25,.5].forEach((v,i)=>expect(computeRatios(f)[i].value).toBeCloseTo(v,12));});
it('rejects invalid coordinates and zero spans',()=>{for(const x of [NaN,Infinity,-.1,1.1]){const f=face();f.landmarks[234].x=x;expect(()=>computeRatios(f)).toThrow();}const f=face();f.landmarks[454]=f.landmarks[234];expect(()=>computeRatios(f)).toThrow();});

