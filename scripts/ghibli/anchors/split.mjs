import fs from 'fs';
import { Resvg } from '@resvg/resvg-js';
const dir=new URL('../../../public/ghibli',import.meta.url).pathname;
// Tokenize top-level nodes of the <svg> body with a tolerant scanner (no strict XML).
export function splitTop(svg){
  const open=svg.match(/<svg\b[^>]*>/); const start=open.index+open[0].length; const end=svg.lastIndexOf('</svg>');
  const body=svg.slice(start,end);
  const nodes=[]; let i=0; let comment=null;
  const re=/<!--([\s\S]*?)-->|<\/?([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g; let m; let depth=0; let cur=null;
  while((m=re.exec(body))){
    if(m[1]!==undefined){ if(depth===0) comment=m[1].trim(); continue; }
    const closing=m[0].startsWith('</'); const self=m[4]==='/' ; const tag=m[2];
    if(!closing){
      if(depth===0){cur={tag,start:m.index,attrs:m[3],comment}; comment=null;}
      if(self){ if(depth===0){cur.end=m.index+m[0].length; nodes.push(cur);cur=null;} }
      else depth++;
    } else {
      depth--;
      if(depth===0 && cur){cur.end=m.index+m[0].length;nodes.push(cur);cur=null;}
      if(depth<0) depth=0;
    }
  }
  nodes.forEach(n=>n.markup=body.slice(n.start,n.end));
  return {openTag:open[0], defs:null, body, nodes};
}
export function render(svgFull,scale=0.25){
  const r=new Resvg(svgFull,{fitTo:{mode:'width',value:Math.round(1200*scale)}, background:'rgba(0,0,0,0)'});
  const img=r.render(); return {w:img.width,h:img.height,px:img.pixels};
}
if(process.argv[1].endsWith('split.mjs')){
  const f=process.argv[2]||'cinema-03.svg';
  const svg=fs.readFileSync(`${dir}/${f}`,'utf8');
  const {nodes}=splitTop(svg);
  console.log(f,nodes.length); nodes.forEach((n,i)=>console.log(i,n.tag,(n.attrs||'').slice(0,70),'|',n.comment?.slice(0,40),'|',n.markup.length));
}
