import {type CardData,formatCheckInDate} from './progress';

export async function renderProgressCard(data:CardData):Promise<Blob>{
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Card creation is unavailable in this browser.');
  await Promise.all([document.fonts.load('24px "DM Sans"'),document.fonts.load('72px "DM Sans"')]);
  const logo=new Image();logo.src='/glowup-liquid-logo.png';await logo.decode();
  ctx.fillStyle='#f3f9ff';ctx.fillRect(0,0,1080,1350);
  ctx.globalCompositeOperation='multiply';ctx.drawImage(logo,76,72,320,320*logo.height/logo.width);ctx.globalCompositeOperation='source-over';
  ctx.fillStyle='#10283f';ctx.font='20px DM Sans';ctx.fillText('MY PROGRESS / PERSONAL CHECK-INS',76,218);
  ctx.font='72px DM Sans';ctx.fillText('Small steps.',76,323);ctx.fillText('My own pace.',76,414);
  ctx.fillStyle='#465f78';ctx.font='26px DM Sans';ctx.fillText(`${formatCheckInDate(data.before.date)}  →  ${formatCheckInDate(data.after.date)}`,76,492);
  data.rows.forEach((row,i)=>{
    const y=578+i*160;
    ctx.fillStyle='#ceddea';ctx.fillRect(76,y,928,1);
    ctx.fillStyle='#10283f';ctx.font='26px DM Sans';ctx.fillText(row.label,76,y+47);
    ctx.font='52px DM Sans';ctx.fillText(`${row.before.toFixed(3)}  →  ${row.after.toFixed(3)}`,76,y+113);
    ctx.fillStyle='#465f78';ctx.font='24px DM Sans';ctx.fillText(`Δ ${row.change>=0?'+':''}${row.change.toFixed(3)}`,805,y+103);
  });
  ctx.fillStyle='#e4f1ff';ctx.fillRect(76,1110,928,120);
  ctx.fillStyle='#465f78';ctx.font='24px DM Sans';ctx.fillText('Photo estimates. Changes can reflect camera, pose or lighting.',100,1156);
  ctx.fillText('A change is not an improvement score.',100,1195);
  ctx.fillStyle='#10283f';ctx.font='24px DM Sans';ctx.fillText('Made with glowup',76,1282);
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not create the card.')),'image/png'));
}
