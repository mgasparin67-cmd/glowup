'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowRight,ShieldCheck,RotateCcw,LoaderCircle} from 'lucide-react';
import {AnalyzeResultSchema,QuestionnaireSchema,StatusSchema,ApiErrorSchema,emptyAnswers,type AnalyzeResult,type FaceGeometry,type Questionnaire} from '../lib/contracts';
import {preparePhoto,detectFace,type PreparedPhoto} from '../lib/face/landmarker.client';
import type {Product} from '../lib/catalog';
import {PhotoInput} from './photo-input';
import {SkinQuestionnaire} from './skin-questionnaire';
import {ProgressCards} from './progress-cards';
import {AnalysisResults} from './analysis-results';
type State='idle'|'photo-ready'|'detecting'|'submitting'|'complete'|'error';
type Dependencies={prepare:typeof preparePhoto;detect:typeof detectFace;fetch:typeof fetch;revoke:typeof URL.revokeObjectURL};
const defaults:Dependencies={prepare:preparePhoto,detect:detectFace,fetch:(...args)=>fetch(...args),revoke:url=>URL.revokeObjectURL(url)};
export function AnalysisFlow({products,dependencies=defaults}:{products:Product[];dependencies?:Dependencies}){
  const [photo,setPhoto]=useState<PreparedPhoto>(),[answers,setAnswers]=useState<Questionnaire>({...emptyAnswers}),[consent,setConsent]=useState(false),[state,setState]=useState<State>('idle'),[preparing,setPreparing]=useState(false),[error,setError]=useState(''),[ready,setReady]=useState<boolean|null>(null),[face,setFace]=useState<FaceGeometry>(),[result,setResult]=useState<AnalyzeResult>();
  const generation=useRef(0),active=useRef(false),abort=useRef<AbortController|null>(null),currentPhoto=useRef<PreparedPhoto|undefined>(undefined),resultRef=useRef<HTMLDivElement>(null);
  const busy=state==='detecting'||state==='submitting';
  useEffect(()=>{const controller=new AbortController();dependencies.fetch('/api/status',{signal:controller.signal}).then(r=>r.json()).then(s=>setReady(StatusSchema.parse(s).ready)).catch(()=>{if(!controller.signal.aborted)setReady(false);});return()=>{controller.abort();generation.current++;abort.current?.abort();const p=currentPhoto.current;if(p){p.bitmap.close();dependencies.revoke(p.url);}};},[dependencies]);
  useEffect(()=>{if(result)resultRef.current?.focus();},[result]);
  const release=()=>{const p=currentPhoto.current;if(p){p.bitmap.close();dependencies.revoke(p.url);}currentPhoto.current=undefined;setPhoto(undefined);};
  const invalidate=()=>{generation.current++;abort.current?.abort();active.current=false;setResult(undefined);setFace(undefined);setError('');};
  const select=async(file:File)=>{invalidate();release();setConsent(false);setPreparing(true);setState('idle');const token=generation.current;try{const p=await dependencies.prepare(file);if(token!==generation.current){p.bitmap.close();dependencies.revoke(p.url);return;}currentPhoto.current=p;setPhoto(p);setState('photo-ready');}catch(e){if(token===generation.current){setError(e instanceof Error?e.message:'Photo preparation failed.');setState('error');}}finally{if(token===generation.current)setPreparing(false);}};
  const restart=()=>{invalidate();release();setPreparing(false);setAnswers({...emptyAnswers,concerns:[]});setConsent(false);setState('idle');};
  const cancel=()=>{invalidate();setState(photo?'photo-ready':'idle');};
  const submit=async()=>{
    if(!photo||!consent||active.current||ready!==true||preparing)return;
    const validated=QuestionnaireSchema.safeParse(answers);if(!validated.success){setError('Check your questionnaire: use a nonnegative budget and keep answers within their limits.');setState('error');return;}
    active.current=true;const token=generation.current,controller=new AbortController();abort.current=controller;setError('');setResult(undefined);setState('detecting');
    try{
      const geometry=await dependencies.detect(photo.bitmap,controller.signal);if(token!==generation.current)return;setFace(geometry);setState('submitting');
      const body=new FormData();body.set('image',photo.submission);body.set('questionnaire',JSON.stringify(validated.data));body.set('geometry',JSON.stringify(geometry));body.set('consent','true');
      const response=await dependencies.fetch('/api/analyze',{method:'POST',body,signal:controller.signal});const payload=await response.json();if(token!==generation.current)return;
      if(!response.ok){const parsed=ApiErrorSchema.safeParse(payload);if(parsed.success&&parsed.data.error.code==='setup_required')setReady(false);throw new Error(parsed.success?parsed.data.error.message:'Analysis failed. Please retry.');}
      setResult(AnalyzeResultSchema.parse(payload));setState('complete');
    }catch(e){if(token===generation.current&&!controller.signal.aborted){setError(e instanceof Error?e.message:'The analysis failed. Please retry.');setState('error');}}finally{if(token===generation.current){active.current=false;abort.current=null;}}
  };
  return <div id="analysis" className="analysis-flow">{ready===false&&<div className="setup-notice" role="status"><ShieldCheck size={21} aria-hidden="true"/><div><strong>Owner setup required</strong><p>Photo analysis is unavailable until the owner securely configures the API key and usage protection. You can explore the photo and questionnaire steps. No sample analysis is shown.</p></div></div>}<div className="flow-grid"><aside className="photo-panel"><div className="section-heading"><span className="step-number">01</span><h2>Start with a clear photo</h2></div><p className="muted">One face. Straight on. Even, natural light.</p><PhotoInput url={photo?.url} onSelect={select}/><div className="photo-tips"><h3>A few things make a difference</h3><ul><li>Keep your head level and expression relaxed.</li><li>Include your full face, without filters or heavy shadows.</li><li>Remove glasses or anything covering your features.</li></ul></div><div className="privacy-note"><ShieldCheck size={20} aria-hidden="true"/><p>Landmarks are detected on your device. Your photo and answers are sent to our analysis provider only when you consent and analyze. This app does not save them.</p></div></aside><section className="form-panel"><SkinQuestionnaire answers={answers} onChange={setAnswers} disabled={busy}/><div className="consent"><label><input type="checkbox" checked={consent} disabled={busy} onChange={e=>setConsent(e.target.checked)}/><span>I consent to sending my photo, answers and calculated proportions to our analysis provider for cosmetic analysis.</span></label><p>glowup does not store your photos or questionnaire answers. Progress check-ins stay on this device only when you choose to save them.</p></div><div className="action-row"><button className="primary-button" disabled={!photo||!consent||busy||preparing||ready!==true} onClick={submit}>{busy?<LoaderCircle className="spinner" size={18} aria-hidden="true"/>:<ArrowRight size={18} aria-hidden="true"/>}{busy?'Analyzing…':'Analyze my photo'}</button>{busy?<button className="text-button" onClick={cancel}>Cancel</button>:<button className="text-button" onClick={restart}><RotateCcw size={15} aria-hidden="true"/>Start again</button>}</div><p className="progress" role="status" aria-live="polite">{preparing?'Preparing your upright photo…':state==='detecting'?'Finding landmarks on your device…':state==='submitting'?'Preparing cosmetic guidance…':ready===null?'Checking analysis availability…':state==='complete'?'Analysis complete. Results below.':''}</p>{error&&<p className="error-message" role="alert">{error}</p>}<p className="fine-print">Image-based estimates and cosmetic observations. Not a diagnosis or a guarantee of product suitability.</p></section></div>{result&&face&&photo&&<div ref={resultRef} tabIndex={-1}><AnalysisResults result={result} face={face} imageUrl={photo.url} products={products}/></div>}<ProgressCards result={result??undefined}/></div>;
}

