// Arcade target generation, independent of FTC field geometry.
export function randomTarget(robot, previous, hits=0, random=Math.random){
  let point;
  for(let attempt=0;attempt<100;attempt++){
    point={x:100+random()*520,y:115+random()*485,r:Math.max(23,35-Math.floor(hits/3))};
    if(Math.hypot(point.x-robot.x,point.y-robot.y)>=140&&(!previous||Math.hypot(point.x-previous.x,point.y-previous.y)>=170))return point;
  }
  // Deterministic fallback keeps every spawn playable even with repeated RNG values.
  for(const x of [110,360,610])for(const y of [125,355,590]){
    point={x,y,r:Math.max(23,35-Math.floor(hits/3))};
    if(Math.hypot(x-robot.x,y-robot.y)>=140&&(!previous||Math.hypot(x-previous.x,y-previous.y)>=170))return point;
  }
  throw new Error('No valid target location');
}
export function targetLifetime(hits){return Math.max(3000,5500-hits*150);}
