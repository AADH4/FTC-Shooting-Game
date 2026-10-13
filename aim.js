export const SEASONS = {
  biobuzz: {label:'BIOBUZZ', target:{x:360,y:328,r:25}, start:{x:360,y:590}, heading:0, range:260},
  decode: {label:'DECODE', target:{x:115,y:105,r:31}, start:{x:360,y:570}, heading:332, range:525}
};
export function landing(x,y,heading,range){const a=heading*Math.PI/180;return {x:x+Math.sin(a)*range,y:y-Math.cos(a)*range};}
export function isHit(point,target){return Math.hypot(point.x-target.x,point.y-target.y)<=target.r-7;}
export function aimError(x,y,heading,target){const ideal=Math.atan2(target.x-x,y-target.y)*180/Math.PI;return Math.abs(((heading-ideal+540)%360)-180);}
