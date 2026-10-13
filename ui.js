import {SEASONS,landing,isHit,aimError} from './aim.js';
const $=id=>document.getElementById(id), canvas=$('field'),ctx=canvas.getContext('2d'),keys=new Set();
let season='biobuzz',x,y,heading,range,score=0,shots=0,flight=null,last=performance.now();
function reset(){const s=SEASONS[season];({x,y}=s.start);heading=s.heading;range=s.range;score=shots=0;flight=null;keys.clear();$('heading').value=Math.round(heading);$('range').value=range;$('status').textContent='Click the field, then move and fine-tune your aim.';sync();}
function sync(){const t=SEASONS[season].target;$('headingValue').value=`${heading.toFixed(1)}°`;$('rangeValue').value=`${Math.round(range)} units`;$('position').textContent=`${Math.round(x)}, ${Math.round(y)}`;$('distance').textContent=`${Math.round(Math.hypot(t.x-x,t.y-y))} units`;$('error').textContent=`${aimError(x,y,heading,t).toFixed(1)}°`;$('score').textContent=score;$('shots').textContent=shots;$('accuracy').textContent=shots?`${Math.round(score/shots*100)}%`:'—';}
function shoot(){if(flight)return;const end=landing(x,y,heading,range);shots++;flight={start:{x,y},end,t:0,hit:isHit(end,SEASONS[season].target)};$('status').textContent='Shot in flight…';sync();}
for(const button of document.querySelectorAll('.season'))button.onclick=()=>{season=button.dataset.season;for(const b of document.querySelectorAll('.season')){const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',selected);}$('fieldLabel').textContent=`${SEASONS[season].label} / TOP DOWN`;$('targetTitle').textContent=season==='biobuzz'?'Aim for the Hive':'Score an Artifact';$('description').textContent=season==='biobuzz'?'Move around the center Hive and land your shot in its highlighted cell.':'Line up a purple Artifact with the highlighted blue Goal in the upper-left corner.';document.documentElement.style.setProperty('--accent',season==='biobuzz'?'#f6c663':'#bba2ff');reset();};
$('heading').oninput=e=>{heading=+e.target.value;sync();};$('range').oninput=e=>{range=+e.target.value;sync();};$('shoot').onclick=shoot;$('reset').onclick=reset;
canvas.addEventListener('pointerdown',()=>canvas.focus());
window.addEventListener('keydown',e=>{if(['INPUT','BUTTON'].includes(e.target.tagName))return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyQ','KeyE','Space'].includes(e.code)){e.preventDefault();keys.add(e.code);if(e.code==='Space'&&!e.repeat)shoot();}});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());
for(const button of document.querySelectorAll('[data-move]')){const key={up:'KeyW',down:'KeyS',left:'KeyA',right:'KeyD'}[button.dataset.move];button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);keys.add(key);};button.onpointerup=button.onpointercancel=()=>keys.delete(key);}

function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
function circle(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
function label(text,x,y,color='#91a4ba',size=11){
  ctx.fillStyle=color;ctx.font=`600 ${size}px system-ui`;ctx.textAlign='center';ctx.fillText(text,x,y);
}
function panel(x,y,w,h,fill,stroke='#344759',radius=10){
  ctx.beginPath();ctx.roundRect(x,y,w,h,radius);ctx.fillStyle=fill;ctx.fill();
  ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();
}
function ring(x,y,r,color,width=2){
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
}
function drawField(){
  rect(0,0,720,720,'#0c1420');
  panel(35,35,650,650,'#172431','#52667a',14);
  ctx.save();ctx.beginPath();ctx.roundRect(38,38,644,644,12);ctx.clip();
  for(let row=0;row<6;row++)for(let col=0;col<6;col++){
    rect(35+col*650/6,35+row*650/6,650/6,650/6,(row+col)%2?'#192735':'#1c2b39');
  }
  ctx.strokeStyle='#2c3c4b';ctx.lineWidth=1;
  for(let n=35;n<=685;n+=650/6){
    ctx.beginPath();ctx.moveTo(n,35);ctx.lineTo(n,685);ctx.moveTo(35,n);ctx.lineTo(685,n);ctx.stroke();
  }
  ctx.restore();
  if(season==='biobuzz'){
    panel(70,600,125,50,'#203752','#426da0');panel(525,600,125,50,'#492a35','#8a4b5a');
    label('BLUE ALLIANCE',132,630,'#99bde6');label('RED ALLIANCE',587,630,'#dca3af');
    panel(311,293,98,142,'#323228','#675e3d',20);
    panel(327,361,66,57,'#4c422a','#80704a',14);
    label('LOWER CELL',360,400,'#b0a075',9);
    for(const [fx,fy] of [[55,180],[665,180],[55,520],[665,520]]){
      for(let a=0;a<6;a++){const r=a*Math.PI/3;circle(fx+Math.cos(r)*12,fy+Math.sin(r)*12,8,'#827047');}
      circle(fx,fy,10,'#d6b563');
    }
    for(const [bx,by] of [[195,245],[215,490],[515,230],[525,470]]){circle(bx,by,7,'#cbb675');ring(bx,by,7,'#f0d89c',1);}
  }else{
    ctx.fillStyle='#6396df0b';ctx.beginPath();ctx.moveTo(45,45);ctx.lineTo(675,45);ctx.lineTo(360,360);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#54708a';ctx.lineWidth=1;ctx.setLineDash([6,10]);ctx.stroke();ctx.setLineDash([]);
    panel(60,60,110,75,'#25436b','#6f9bcd');panel(550,60,110,75,'#593340','#b96a7e');
    panel(76,143,65,100,'#20344d','#42607e',7);panel(580,143,65,100,'#432c37','#75505e',7);
    for(let i=0;i<3;i++){circle(109,162+i*30,8,i===2?'#80c9a0':'#a58adb');circle(612,162+i*30,8,i===2?'#80c9a0':'#a58adb');}
    label('CLASSIFIER',109,261,'#7c97b2',9);label('CLASSIFIER',612,261,'#af8b96',9);
    label('RED GOAL',605,113,'#e7acb8',11);
    panel(325,50,70,40,'#3b384b','#6e657f',6);label('OBELISK',360,75,'#beb6d3',9);
    panel(60,585,110,70,'#20344d','#42607e');panel(550,585,110,70,'#432c37','#75505e');
    label('BLUE BASE',115,627,'#91b2d6');label('RED BASE',605,627,'#d0a0ad');
    for(const bx of [210,510])for(let i=0;i<3;i++){circle(bx,300+i*26,9,i===2?'#7cda9b':'#b295ec');ring(bx,300+i*26,9,'#ffffff44',1);}
  }
}
function drawTarget(target){
  const accent=season==='biobuzz'?'#f6c663':'#bba2ff';
  // Inner opening matches the hit check, including the ball's clearance.
  circle(target.x,target.y,target.r+14,accent+'16');
  ring(target.x,target.y,target.r+12,accent,2);
  circle(target.x,target.y,target.r,'#101c27');
  circle(target.x,target.y,target.r-7,accent+'40');
  ring(target.x,target.y,target.r-7,accent,3);
  for(let a=0;a<4;a++){
    const angle=a*Math.PI/2;
    ctx.strokeStyle=accent;ctx.lineWidth=3;ctx.beginPath();
    ctx.moveTo(target.x+Math.cos(angle)*(target.r+8),target.y+Math.sin(angle)*(target.r+8));
    ctx.lineTo(target.x+Math.cos(angle)*(target.r+20),target.y+Math.sin(angle)*(target.r+20));ctx.stroke();
  }
  circle(target.x,target.y,3,'#ffffff');
  const cx=season==='biobuzz'?426:192,cy=season==='biobuzz'?276:104;
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
  ctx.moveTo(target.x+target.r+20,target.y);ctx.lineTo(cx-12,cy+20);ctx.lineTo(cx,cy+20);ctx.stroke();
  panel(cx,cy,190,58,'#0b1520',accent,9);
  label('SHOOT HERE',cx+95,cy+23,accent,15);
  label(season==='biobuzz'?'HIVE • UPPER CELL':'BLUE GOAL • ARTIFACTS',cx+95,cy+43,'#c7d5e3',10);
}
function draw(){
  drawField();
  const target=SEASONS[season].target,end=landing(x,y,heading,range),hit=isHit(end,target);
  const pathColor=hit?'#7de7ae':'#c5d2df';
  ctx.save();ctx.strokeStyle=pathColor;ctx.globalAlpha=.7;ctx.lineWidth=2;
  ctx.setLineDash([5,9]);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(end.x,end.y);ctx.stroke();ctx.restore();
  drawTarget(target);
  // A diamond distinguishes the predicted landing from the circular target.
  ctx.save();ctx.translate(end.x,end.y);ctx.rotate(Math.PI/4);
  ctx.strokeStyle=hit?'#7de7ae':'#ffae80';ctx.lineWidth=2.5;ctx.strokeRect(-7,-7,14,14);ctx.restore();
  if(!hit){ctx.strokeStyle='#ffae80';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(end.x-4,end.y);ctx.lineTo(end.x+4,end.y);ctx.moveTo(end.x,end.y-4);ctx.lineTo(end.x,end.y+4);ctx.stroke();}
  ctx.save();ctx.translate(x,y);ctx.rotate(heading*Math.PI/180);
  ctx.shadowColor='#00000066';ctx.shadowBlur=10;ctx.shadowOffsetY=4;
  panel(-23,-23,46,46,'#d6e3ee','#ffffff',8);ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  panel(-28,-17,8,34,'#08121b','#485d70',3);panel(20,-17,8,34,'#08121b','#485d70',3);
  panel(-7,-35,14,29,season==='biobuzz'?'#f6c663':'#bba2ff','#ffffff77',4);
  panel(-13,-9,26,26,'#355268','#6a8a9f',5);
  ctx.fillStyle='#edf5fc';ctx.beginPath();ctx.moveTo(0,-17);ctx.lineTo(-5,-10);ctx.lineTo(5,-10);ctx.closePath();ctx.fill();ctx.restore();
  label('EAGLE',x,Math.min(672,y+42),'#dae6f2',10);
  if(flight){const t=flight.t,fx=flight.start.x+(flight.end.x-flight.start.x)*t,fy=flight.start.y+(flight.end.y-flight.start.y)*t;circle(fx+3,fy+5,7,'#00000066');circle(fx,fy,7+Math.sin(t*Math.PI)*5,season==='biobuzz'?'#ffe19a':'#bba2ff');}
  // Keep the alignment cue readable regardless of field geometry.
  panel(226,643,268,29,'#0b1520',hit?'#5fae86':'#4b5c6d',8);
  label(hit?'✓ ON TARGET — PRESS SPACE':'◇ LANDING POINT — ADJUST AIM / RANGE',360,662,hit?'#7de7ae':'#bfccd9',10);
  label('◎ SCORING OPENING',155,710,'#b7c7d8',10);
  label('◇ PREDICTED LANDING',410,710,'#b7c7d8',10);
  label('TOP DOWN',626,710,'#738a9f',9);
}
function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;let dx=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0),dy=(keys.has('KeyS')?1:0)-(keys.has('KeyW')?1:0);const length=Math.hypot(dx,dy)||1;x=Math.max(65,Math.min(655,x+dx/length*180*dt));y=Math.max(65,Math.min(655,y+dy/length*180*dt));heading=(heading+((keys.has('KeyE')||keys.has('ArrowRight')?1:0)-(keys.has('KeyQ')||keys.has('ArrowLeft')?1:0))*35*dt+360)%360;if(keys.has('KeyQ')||keys.has('KeyE')||keys.has('ArrowLeft')||keys.has('ArrowRight'))$('heading').value=Math.round(heading)%360;if(keys.has('ArrowUp')||keys.has('ArrowDown')){range=Math.max(60,Math.min(850,range+((keys.has('ArrowUp')?1:0)-(keys.has('ArrowDown')?1:0))*150*dt));$('range').value=range;}if(flight){flight.t=Math.min(1,flight.t+dt*1.5);if(flight.t>=1){if(flight.hit)score++;$('status').textContent=flight.hit?'Hit! Great alignment. Try another position.':'Miss. Adjust your heading and shot range, then try again.';flight=null;}}sync();draw();requestAnimationFrame(frame);}
reset();requestAnimationFrame(frame);
