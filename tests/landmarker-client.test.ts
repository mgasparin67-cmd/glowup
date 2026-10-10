import {it,expect,vi,afterEach} from 'vitest';
import {detectFace} from '../lib/face/landmarker.client';
import {face} from './fixtures';
afterEach(()=>vi.unstubAllGlobals());
it('uses a classic worker compatible with MediaPipe importScripts and validates output',async()=>{
  let type:string|undefined;let path:string|URL|undefined;
  class BrowserWorker {onmessage:((event:any)=>void)|null=null;onerror:null=null;constructor(p:string|URL,options?:WorkerOptions){path=p;type=options?.type;}postMessage(){queueMicrotask(()=>this.onmessage?.({data:{face:{...face(),landmarks:face().landmarks.map(p=>({...p,visibility:0,presence:0}))}}}));}terminate(){}}
  vi.stubGlobal('Worker',BrowserWorker);vi.stubGlobal('createImageBitmap',async()=>({close(){}}));vi.stubGlobal('location',{origin:'https://site.test'});
  const geometry=await detectFace({width:1000,height:1000} as ImageBitmap);expect(type).not.toBe('module');expect(String(path)).toBe('/face-worker.js');expect(geometry.landmarks).toHaveLength(478);
});
