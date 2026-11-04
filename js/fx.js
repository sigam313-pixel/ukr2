(()=>{
const GL='#hd.solid,.mega,#sg,#sb2,.mp,.op,.season,.btn.o,#pill,.toast,.b3d',RM=matchMedia('(prefers-reduced-motion:reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches,B=document.body;
requestAnimationFrame(()=>requestAnimationFrame(()=>B.classList.add('rdy')));
if(RM)return;
/* liquid glass: refraction filter (Chromium) + ambient colour behind the glass */
if(/Chrom(e|ium)|Edg\//.test(navigator.userAgent))document.documentElement.classList.add('lg-refract');
B.insertAdjacentHTML('beforeend','<svg class="lgs" width="0" height="0" aria-hidden="true"><defs><filter id="lgf" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".012 .02" numOctaves="2" seed="3" result="n"/><feGaussianBlur in="n" stdDeviation="2" result="b"/><feDisplacementMap in="SourceGraphic" in2="b" scale="22" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg><div id="bg" aria-hidden="true"><i></i><i></i><i></i></div>');
const mq=()=>{const h=$('.hero');if(!h||$('#mq'))return;const b=[...new Set(PRODUCTS.map(p=>p.b))].filter(x=>x!='Україна'),r=b.map(x=>`<span>${esc(x)}</span>`).join('');h.insertAdjacentHTML('afterend',`<section id="mq" aria-label="Бренди в каталозі"><div class="mqt">${r}${r}${r}</div></section>`)};
/* page curtain */
document.addEventListener('click',e=>{const l=e.target.closest&&e.target.closest('a[href]');if(!l||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||l.target||l.origin!==location.origin||l.hash||/^(tel|mailto):/.test(l.getAttribute('href'))||l.getAttribute('href')=='#')return;e.preventDefault();e.stopPropagation();B.classList.add('lv');setTimeout(()=>location.href=l.href,480)},true);
addEventListener('pageshow',e=>{if(e.persisted){B.classList.remove('lv');B.classList.add('rdy')}});
/* text splitting */
const wo=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('wv');wo.unobserve(x.target)}}),{threshold:.3});
const words=el=>{if(el.dataset.sp)return;el.dataset.sp=1;const t=el.textContent.trim();el.setAttribute('aria-label',t);el.textContent='';t.split(/\s+/).forEach((w,i)=>{const o=document.createElement('span'),n=document.createElement('span');o.className='w';o.setAttribute('aria-hidden','true');n.style.setProperty('--i',i);n.textContent=w;o.append(n);el.append(o,' ')});wo.observe(el)};
const chars=el=>{if(el.dataset.sp)return;el.dataset.sp=1;const t=el.textContent;el.setAttribute('aria-label',t);el.textContent='';[...t].forEach((c,i)=>{const s=document.createElement('span');s.className='ch';s.setAttribute('aria-hidden','true');s.style.setProperty('--i',i);s.textContent=c==' '?'\u00a0':c;el.append(s)})};
const enhance=()=>{mq();$$('main h2:not(.sub):not(.sub0),.phd h1,.pi h1').forEach(words);$$('.hero h1 .ln>span').forEach(chars);
const h=$('.hero');if(h&&!$('.pts',h)){const p=document.createElement('div');p.className='pts';for(let i=0;i<(FINE?18:8);i++){const d=document.createElement('i'),s=d.style;d.className='pt';s.setProperty('--x',Math.random()*100+'%');s.setProperty('--s',2+Math.random()*5+'px');s.setProperty('--b',Math.random()*2+'px');s.setProperty('--d',9+Math.random()*10+'s');s.setProperty('--dl',-Math.random()*14+'s');s.setProperty('--dx',(Math.random()-.5)*160+'px');p.append(d)}const sp=document.createElement('div');sp.className='spot';h.prepend(p,sp)}};
enhance();new MutationObserver(()=>requestAnimationFrame(enhance)).observe($('#app'),{childList:true});
/* scroll progress + parallax */
const bar=document.createElement('div');bar.id='sp';B.append(bar);let busy=0;
const onS=()=>{if(busy)return;busy=1;requestAnimationFrame(()=>{busy=0;const d=document.documentElement;bar.style.transform=`scaleX(${Math.min(1,Math.max(0,scrollY/((d.scrollHeight-innerHeight)||1)))})`;const c=$('.camp .ph');if(c){const r=c.parentNode.getBoundingClientRect();c.style.translate=`0 ${-((r.top+r.height/2-innerHeight/2)/innerHeight)*44}px`}})};
addEventListener('scroll',onS,{passive:true});onS();
/* fly to bag */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-a]');if(!b||b.disabled)return;const s=(b.closest('.card')||document).querySelector('.art svg,.art img')||$('.art.big svg,.art.big img'),t=$('#cc')&&$('#cc').closest('a');if(!s||!t)return;
const bx=$('.art.big'),hid=!s.getBoundingClientRect().width&&bx&&window.thumb3&&pid(new URLSearchParams(location.search).get('id')),r=(hid?bx:s).getBoundingClientRect(),q=t.getBoundingClientRect(),c=hid?Object.assign(new Image(),{src:window.thumb3(hid)}):s.cloneNode(true),dx=q.left+q.width/2-r.left-r.width/2,dy=q.top+q.height/2-r.top-r.height/2;
c.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:120;pointer-events:none;border-radius:18px;object-fit:cover;background:#E9ECE7`;B.append(c);
c.animate([{transform:'none',opacity:1},{transform:`translate(${dx*.55}px,${dy*.25-70}px) scale(.5) rotate(8deg)`,opacity:.95,offset:.45},{transform:`translate(${dx}px,${dy}px) scale(.06) rotate(20deg)`,opacity:.3}],{duration:850,easing:'cubic-bezier(.45,0,.55,1)'}).onfinish=()=>{c.remove();t.animate([{transform:'scale(1)'},{transform:'scale(1.35) rotate(-8deg)'},{transform:'scale(1)'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'})}},true);
/* desktop only: cursor ring, tilt + glare, magnetic buttons, hero parallax */
if(FINE){let tl=null,mg=null,tx=0,ty=0,cx=0,cy=0,run=0;const ring=document.createElement('div');ring.id='cur';B.append(ring);
const tick=()=>{cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;ring.style.translate=`${cx-18}px ${cy-18}px`;run=Math.abs(tx-cx)+Math.abs(ty-cy)>.5?requestAnimationFrame(tick):0};
addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;ring.style.opacity=1;if(!run)run=requestAnimationFrame(tick);const t=e.target;if(!t.closest)return;
ring.classList.toggle('big',!!t.closest('a,button,.tile,.card,input,select,textarea,label'));
const c=t.closest('.card,.tile');if(tl&&tl!==c){tl.style.rotate='';tl=null}
if(c){if(c.classList.contains('in'))c.classList.remove('rv');tl=c;const b=c.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5,ax=-y*9,ay=x*11;c.style.rotate=`${ax} ${ay} 0 ${Math.hypot(ax,ay)||.01}deg`;c.style.setProperty('--gx',(x+.5)*100+'%');c.style.setProperty('--gy',(y+.5)*100+'%')}
const gl=t.closest(GL);if(gl){const q=gl.getBoundingClientRect();gl.style.setProperty('--lx',e.clientX-q.left+'px');gl.style.setProperty('--ly',e.clientY-q.top+'px')}const m=t.closest('.btn');if(mg&&mg!==m){mg.style.translate='';mg=null}
if(m){mg=m;const b=m.getBoundingClientRect();m.style.translate=`${(e.clientX-b.left-b.width/2)*.22}px ${(e.clientY-b.top-b.height/2)*.3}px`}
const h=$('.hero');if(h&&scrollY<innerHeight){const px=e.clientX/innerWidth-.5,py=e.clientY/innerHeight-.5,r=h.getBoundingClientRect();h.style.setProperty('--mx',e.clientX-r.left+'px');h.style.setProperty('--my',e.clientY-r.top+'px');$('.ph',h).style.translate=`${-px*28}px ${-py*18}px`;$('.hc',h).style.translate=`${px*12}px ${py*8}px`}},{passive:true});
document.documentElement.addEventListener('mouseleave',()=>{ring.style.opacity=0;if(tl)tl.style.rotate=''})}
})();
