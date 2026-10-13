import {SEASONS,landing,isHit} from './aim.js';
import {randomTarget,targetLifetime} from './targets.js';
const $=id=>document.getElementById(id), canvas=$('field'),ctx=canvas.getContext('2d'),keys=new Set();
const ROUND_MS=30000;
let running=false,deadline=0,points=0,combo=0,lastHit=0,target=null,targetId=0,targetEnds=0,targetBorn=0,expired=0;
function currentTarget(){return target;}
function spawnTarget(now=performance.now()){
  target=randomTarget({x,y},target,score);targetId++;targetBorn=now;targetEnds=now+targetLifetime(score);
}
let season='biobuzz',x,y,heading,range,score=0,shots=0,flight=null,last=performance.now();
function reset(){const s=SEASONS[season];({x,y}=s.start);heading=s.heading;range=s.range;score=shots=points=combo=0;lastHit=0;expired=0;target=null;spawnTarget();running=false;deadline=0;flight=null;keys.clear();$('start').disabled=false;$('shoot').disabled=true;$('timer').textContent='30.0';$('timer').classList.remove('urgent');$('combo').textContent='×1';$('heading').value=Math.round(heading);$('range').value=range;$('status').textContent='Ready for Target Blitz? Start your 30-second challenge.';sync();}
function sync(){const t=currentTarget();$('headingValue').value=`${heading.toFixed(1)}°`;$('rangeValue').value=`${Math.round(range)} units`;$('position').textContent=`${Math.round(x)}, ${Math.round(y)}`;$('distance').textContent=`${Math.round(Math.hypot(t.x-x,t.y-y))} units`;$('error').textContent=isHit(landing(x,y,heading,range),t)?'ON TARGET':'Adjust aim / range';$('targetTime').textContent=running?`${Math.max(0,(targetEnds-performance.now())/1000).toFixed(1)}s`:'—';$('expired').textContent=expired;$('score').textContent=points;$('combo').textContent=`×${Math.max(1,combo)}`;$('shots').textContent=shots;$('accuracy').textContent=shots?`${Math.round(score/shots*100)}%`:'—';}
function shoot(){if(!running||performance.now()>=deadline||flight)return;const end=landing(x,y,heading,range);shots++;flight={start:{x,y},end,t:0,targetId,hit:isHit(end,currentTarget())};$('status').textContent='Shot in flight…';sync();}
for(const button of document.querySelectorAll('.season'))button.onclick=()=>{season=button.dataset.season;for(const b of document.querySelectorAll('.season')){const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',selected);}$('fieldLabel').textContent=`${SEASONS[season].label} / TOP DOWN`;$('targetTitle').textContent=season==='biobuzz'?'Pollen Pop':'Artifact Hunt';$('description').textContent=season==='biobuzz'?'Hit the glowing Hive cell. Every hit switches the target. Chain hits within 3 seconds for up to ×5 points.':'Hit the glowing Goal. Every hit switches blue and red targets. Chain hits within 3 seconds for up to ×5 points.';document.documentElement.style.setProperty('--accent',season==='biobuzz'?'#f6c663':'#bba2ff');reset();};
$('heading').oninput=e=>{if(!running)return;heading=+e.target.value;sync();};$('range').oninput=e=>{if(!running)return;range=+e.target.value;sync();};$('shoot').onclick=shoot;
$('start').onclick=()=>{reset();running=true;deadline=performance.now()+ROUND_MS;spawnTarget();$('start').disabled=true;$('shoot').disabled=false;$('status').textContent='Go! Targets appear anywhere. Hit before the ring runs out!';canvas.focus();};$('reset').onclick=reset;
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
  const accent=season==='biobuzz'?'#f6c663':'#bba2ff';
  // Season-flavored arena, rather than fixed competition goals.
  for(const [px,py] of [[60,60],[660,60],[60,660],[660,660]]){
    ring(px,py,10,accent+'55',2);circle(px,py,3,accent);
  }
  label(season==='biobuzz'?'POLLEN POP / RANDOM TARGET ARENA':'ARTIFACT HUNT / RANDOM TARGET ARENA',360,62,'#7890a8',10);

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
  const remaining=running?Math.max(0,(targetEnds-performance.now())/targetLifetime(score)):1;
  ctx.beginPath();ctx.arc(target.x,target.y,target.r+12,-Math.PI/2,-Math.PI/2+remaining*Math.PI*2);
  ctx.strokeStyle=remaining<.3?'#ff907c':accent;ctx.lineWidth=5;ctx.stroke();
  label('SHOOT HERE',target.x,target.y-target.r-28,accent,13);
  label(running?`${Math.max(0,(targetEnds-performance.now())/1000).toFixed(1)}s LEFT`:'RANDOM TARGET',target.x,target.y+target.r+30,'#d7e3ef',11);

}
function draw(){
  drawField();
  const target=currentTarget(),end=landing(x,y,heading,range),hit=isHit(end,target);
  ctx.strokeStyle=hit?'#7de7ae':'#c5d2df';ctx.lineWidth=2;ctx.setLineDash([5,8]);
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(end.x,end.y);ctx.stroke();ctx.setLineDash([]);
  drawTarget(target);
  ring(end.x,end.y,10,hit?'#7de7ae':'#ffae80',3);
  ctx.strokeStyle=hit?'#7de7ae':'#ffae80';ctx.lineWidth=2;ctx.beginPath();
  ctx.moveTo(end.x-15,end.y);ctx.lineTo(end.x+15,end.y);ctx.moveTo(end.x,end.y-15);ctx.lineTo(end.x,end.y+15);ctx.stroke();
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
  panel(226,643,268,29,'#0b1520','#4b5c6d',8);
  label(running?hit?'ON TARGET — FIRE!':'CHASE THE TARGET • BEAT ITS CLOCK':'TARGET BLITZ • 30-SECOND AIM CHALLENGE',360,662,'#bfccd9',10);
  label('◎ SCORING OPENING',155,710,'#b7c7d8',10);
  label('⊕ PREDICTED LANDING',410,710,'#b7c7d8',10);
  label('TOP DOWN',626,710,'#738a9f',9);
}

function frame(now){
  const dt=Math.min((now-last)/1000,.05);last=now;
  if(running){
    const remaining=Math.max(0,deadline-now);
    $('timer').textContent=(remaining/1000).toFixed(1);
    $('timer').classList.toggle('urgent',remaining<=10000);
    if(!remaining){
      running=false;flight=null;keys.clear();$('shoot').disabled=true;$('start').disabled=false;
      $('status').textContent=`Time! ${points} points · ${score} hits / ${shots} shots. Start again to beat your score.`;
    }
  }
  if(running){
    let dx=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0);
    let dy=(keys.has('KeyS')?1:0)-(keys.has('KeyW')?1:0);
    const length=Math.hypot(dx,dy)||1;
    x=Math.max(65,Math.min(655,x+dx/length*180*dt));
    y=Math.max(65,Math.min(655,y+dy/length*180*dt));
    heading=(heading+((keys.has('KeyE')||keys.has('ArrowRight')?1:0)-(keys.has('KeyQ')||keys.has('ArrowLeft')?1:0))*70*dt+360)%360;
    if(keys.has('KeyQ')||keys.has('KeyE')||keys.has('ArrowLeft')||keys.has('ArrowRight'))$('heading').value=Math.round(heading)%360;
    if(keys.has('ArrowUp')||keys.has('ArrowDown')){
      range=Math.max(60,Math.min(850,range+((keys.has('ArrowUp')?1:0)-(keys.has('ArrowDown')?1:0))*220*dt));$('range').value=range;
    }
    if(combo&&now-lastHit>3000)combo=0;
    if(now>=targetEnds){
      expired++;combo=0;spawnTarget(now);
      $('status').textContent='Target escaped! New location—re-aim quickly.';
    }
    if(flight){
      flight.t=Math.min(1,flight.t+dt*2.5);
      if(flight.t>=1){
        if(flight.hit&&flight.targetId===targetId&&now<targetEnds){
          score++;combo=now-lastHit<=3000?Math.min(5,combo+1):1;
          lastHit=now;
          const bonus=Math.round(100*Math.max(0,1-(now-targetBorn)/targetLifetime(score-1)));
          const earned=(100+bonus)*combo;points+=earned;spawnTarget(now);
          $('status').textContent=`+${earned}! Speed bonus ${bonus} · ×${combo} combo. Find the next target!`;
        }else{
          combo=0;
          const error=Math.round(Math.hypot(flight.end.x-currentTarget().x,flight.end.y-currentTarget().y));
          $('status').textContent=`Miss by ${error} units. Adjust heading and range. Combo reset.`;
        }
        flight=null;
      }
    }
  }
  sync();draw();requestAnimationFrame(frame);
}
reset();requestAnimationFrame(frame);
