export const answers = {concerns: ['dryness'], sensitivity:'unknown' as const,allergies:'',currentProducts:'',budget:null,country:''};
export function face(width=1000,height=1000){
  const landmarks = Array.from({length:478},()=>({x:.5,y:.5,z:0}));
  for(const [i,x,y] of [[234,300,500],[454,700,500],[10,500,200],[152,500,800],[133,450,400],[362,550,400],[61,400,650],[291,600,650]]) landmarks[i]={x:x/width,y:y/height,z:0};
  return {landmarks,width,height,transform:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,-40,1]};
}
export const aiResult={ratioExplanations:[{id:'face_width_height',explanation:'Photo estimate.'},{id:'inner_eye_gap_width',explanation:'Photo estimate.'},{id:'mouth_width_face_width',explanation:'Photo estimate.'}],observations:[{feature:'texture',description:'Not clearly assessable.',uncertainty:'Lighting affects visibility.'}],recommendations:[{kind:'category',productId:null,category:'Gentle cleanser',reason:'Basic cleansing category.',usage:'Follow the product label.',cautions:['Ingredient synonyms and allergy compatibility are unresolved.']}],limitations:['Cosmetic observations only.'],catalogMode:'categories'};
