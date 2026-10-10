import {it,expect} from 'vitest';
import {validateFaceQuality,selectSingleFace} from '../lib/face/geometry';
import {face} from './fixtures';
it('requires exactly one detected face',()=>{expect(()=>selectSingleFace([],[],1000,1000)).toThrow();expect(()=>selectSingleFace([face().landmarks,face().landmarks],[],1000,1000)).toThrow();});
it('requires landmarks and an affine rotation matrix',()=>{expect(()=>validateFaceQuality({...face(),landmarks:[]})).toThrow();expect(()=>validateFaceQuality({...face(),transform:[]})).toThrow();expect(()=>validateFaceQuality({...face(),transform:Array(16).fill(0)})).toThrow();});
it.each(['pitch','yaw','roll'])('rejects excessive %s (column-major matrix)',axis=>{const f=face(),a=20*Math.PI/180,c=Math.cos(a),s=Math.sin(a);f.transform=axis==='pitch'?[1,0,0,0,0,c,s,0,0,-s,c,0,0,0,-40,1]:axis==='yaw'?[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,-40,1]:[c,s,0,0,-s,c,0,0,0,0,1,0,0,0,-40,1];expect(()=>validateFaceQuality(f)).toThrow();});
it('accepts a front-facing complete mesh',()=>expect(()=>validateFaceQuality(face())).not.toThrow());
