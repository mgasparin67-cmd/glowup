// Run after the locked dependency install. Assets are served locally, never by a CDN.
import {copyFile,mkdir,readdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
await mkdir('public/mediapipe',{recursive:true});await mkdir('public/models',{recursive:true});
const root='node_modules/@mediapipe/tasks-vision/wasm';
await copyFile('node_modules/@mediapipe/tasks-vision/vision_bundle.mjs','public/mediapipe/vision_bundle.mjs');
for(const name of await readdir(root))if(/\.(?:js|wasm)$/.test(name))await copyFile(path.join(root,name),path.join('public/mediapipe',name));
const url='https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
const response=await fetch(url);if(!response.ok)throw new Error('Face model download failed.');const bytes=new Uint8Array(await response.arrayBuffer());
await writeFile('public/models/face_landmarker.task',bytes);
const hashes={modelSource:url,runtimeVersion:'0.10.32',files:{}};
for(const dir of ['public/mediapipe','public/models'])for(const name of await readdir(dir)){if(name==='assets.json')continue;const file=path.join(dir,name);hashes.files[file.replaceAll('\\','/')]=createHash('sha256').update(await readFile(file)).digest('hex');}
await writeFile('public/models/assets.json',JSON.stringify(hashes,null,2));console.log('Pinned landmark assets prepared.');
