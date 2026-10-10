// Classic worker: MediaPipe's WASM loader requires importScripts.
self.onmessage=async(event)=>{
  const {bitmap,origin}=event.data;let detector;
  try{
    const {FaceLandmarker,FilesetResolver}=await import(`${origin}/mediapipe/vision_bundle.mjs`);
    const wasm=await FilesetResolver.forVisionTasks(`${origin}/mediapipe`);
    const options={runningMode:'IMAGE',numFaces:2,minFaceDetectionConfidence:.7,minFacePresenceConfidence:.7,outputFacialTransformationMatrixes:true};
    try{detector=await FaceLandmarker.createFromOptions(wasm,{...options,baseOptions:{modelAssetPath:`${origin}/models/face_landmarker.task`,delegate:'GPU'}});}catch{detector=await FaceLandmarker.createFromOptions(wasm,{...options,baseOptions:{modelAssetPath:`${origin}/models/face_landmarker.task`,delegate:'CPU'}});}
    const result=detector.detect(bitmap);
    if(result.faceLandmarks.length!==1){self.postMessage({error:result.faceLandmarks.length?'Use a photo with only one face.':'No clear face found. Use an evenly lit, front-facing photo.'});return;}
    self.postMessage({face:{landmarks:result.faceLandmarks[0],transform:result.facialTransformationMatrixes[0]?.data,width:bitmap.width,height:bitmap.height}});
  }catch{self.postMessage({error:'The face detector could not start. Try a current browser with WebAssembly support.'});}finally{detector?.close();bitmap.close();}
};
