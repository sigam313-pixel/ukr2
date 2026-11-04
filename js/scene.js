import * as T from './vendor/three.module.min.js';
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,MOB=!matchMedia('(hover:hover) and (pointer:fine)').matches,$$q=(s,r=document)=>r.querySelector(s);
const ok=(()=>{try{const c=document.createElement('canvas');return!!(c.getContext('webgl2')||c.getContext('webgl'))}catch(e){return false}})();
const tex=c=>{const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t};
const cnv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
/* ---------- hero: 3D wheat field ---------- */
function hero(h){
const cv=document.createElement('canvas');cv.className='gl';h.prepend(cv);
const R=new T.WebGLRenderer({canvas:cv,antialias:!MOB,powerPreference:'high-performance'});R.setPixelRatio(Math.min(devicePixelRatio,MOB?1.5:2));
const S=new T.Scene(),C=new T.PerspectiveCamera(48,1,.1,120),U={uTime:{value:3}};
const g=cnv(2,256),x=g.getContext('2d'),gr=x.createLinearGradient(0,0,0,256);[[0,'#1d3f55'],[.25,'#6d7f78'],[.38,'#d49a58'],[.445,'#f6d28a'],[1,'#f6d28a']].forEach(a=>gr.addColorStop(a[0],a[1]));x.fillStyle=gr;x.fillRect(0,0,2,256);
S.background=tex(g);S.fog=new T.FogExp2(0xf6d28a,.045);
S.add(new T.HemisphereLight(0xffe2b0,0x6b5324,1.4));const sun=new T.DirectionalLight(0xffc27a,2.6);sun.position.set(-6,3,-14);S.add(sun);
const ground=new T.Mesh(new T.PlaneGeometry(80,90),new T.MeshStandardMaterial({color:0x8a6a2e,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.z=-30;S.add(ground);
const mk=()=>{const m=new T.MeshStandardMaterial({roughness:.8,flatShading:true});m.onBeforeCompile=s=>{s.uniforms.uTime=U.uTime;s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float uTime;').replace('#include <begin_vertex>','vec3 transformed=vec3(position);float ph=instanceMatrix[3].x*.6+instanceMatrix[3].z*.45;float hh=position.y;float gust=.55+.45*sin(uTime*.45-instanceMatrix[3].z*.18+instanceMatrix[3].x*.06);transformed.x+=(sin(uTime*1.7+ph)*.07+sin(uTime*.9-instanceMatrix[3].z*.35)*.12*gust)*hh*hh;transformed.z+=cos(uTime*1.3+ph*1.4)*.05*hh*hh*gust;')};return m};
const N=MOB?2800:7000,sg=new T.CylinderGeometry(.012,.022,1,3,1).translate(0,.5,0),eg=new T.SphereGeometry(.055,5,4).scale(1,3.2,1).translate(0,1.03,0);
const stem=new T.InstancedMesh(sg,mk(),N),ear=new T.InstancedMesh(eg,mk(),N),d=new T.Object3D(),col=new T.Color();
for(let i=0;i<N;i++){const s=.9+Math.random()*.55;d.position.set((Math.random()-.5)*28,0,3-Math.random()*37);d.rotation.set((Math.random()-.5)*.15,Math.random()*6.28,(Math.random()-.5)*.15);d.scale.setScalar(s);d.updateMatrix();stem.setMatrixAt(i,d.matrix);ear.setMatrixAt(i,d.matrix);stem.setColorAt(i,col.setHSL(.14,.4,.34+Math.random()*.12));ear.setColorAt(i,col.setHSL(.105+Math.random()*.03,.6+Math.random()*.2,.46+Math.random()*.14))}
S.add(stem,ear);
const gc=cnv(128,128),gx=gc.getContext('2d'),rg=gx.createRadialGradient(64,64,0,64,64,64);[[0,'rgba(255,250,225,1)'],[.18,'rgba(255,214,140,.85)'],[.5,'rgba(255,170,80,.25)'],[1,'rgba(255,150,60,0)']].forEach(a=>rg.addColorStop(a[0],a[1]));gx.fillStyle=rg;gx.fillRect(0,0,128,128);
const glow=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(gc),blending:T.AdditiveBlending,depthWrite:false,transparent:true,fog:false}));glow.position.set(5,4.6,-70);glow.scale.setScalar(34);S.add(glow);
const P=MOB?90:220,pa=new Float32Array(P*3);for(let i=0;i<P;i++){pa[i*3]=(Math.random()-.5)*16;pa[i*3+1]=Math.random()*4;pa[i*3+2]=3-Math.random()*22}
const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pa,3));S.add(new T.Points(pg,new T.PointsMaterial({color:0xfff0b0,size:.06,transparent:true,opacity:.8,blending:T.AdditiveBlending,depthWrite:false})));
/* god rays, drifting clouds, wildflowers, hoverable floating products */
const rcv=cnv(256,256),rx=rcv.getContext('2d');rx.translate(128,128);for(let i=0;i<18;i++){rx.rotate(Math.PI/9);const g=rx.createLinearGradient(0,0,128,0);g.addColorStop(0,'rgba(255,236,180,.55)');g.addColorStop(1,'rgba(255,236,180,0)');rx.fillStyle=g;rx.beginPath();rx.moveTo(0,0);rx.lineTo(128,-5-(i%3)*3);rx.lineTo(128,5+(i%3)*3);rx.fill()}
const rays=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(rcv),blending:T.AdditiveBlending,depthWrite:false,transparent:true,fog:false,opacity:.4}));rays.position.copy(glow.position);rays.scale.setScalar(130);S.add(rays);
const ccv=cnv(256,128),cx2=ccv.getContext('2d');for(let i=0;i<9;i++){const x=40+Math.random()*176,y=48+Math.random()*32,r=22+Math.random()*26,g=cx2.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,240,215,.55)');g.addColorStop(1,'rgba(255,240,215,0)');cx2.fillStyle=g;cx2.fillRect(0,0,256,128)}
const cmat=new T.SpriteMaterial({map:new T.CanvasTexture(ccv),transparent:true,depthWrite:false,fog:false,opacity:.8}),CL=[];
for(let i=0;i<7;i++){const s=new T.Sprite(cmat);s.position.set(-70+i*24+Math.random()*10,12+Math.random()*14,-60-Math.random()*20);s.scale.set(46,23,1);CL.push(s);S.add(s)}
const FN=MOB?60:170,fst=new T.InstancedMesh(new T.CylinderGeometry(.01,.016,1,3,1).translate(0,.5,0),mk(),FN),fbl=new T.InstancedMesh(new T.IcosahedronGeometry(.075,0).translate(0,1.02,0),mk(),FN),fcs=[0xd9432f,0x5b7fe0,0xf6f0d8,0xe8a33d];
for(let i=0;i<FN;i++){const s=.85+Math.random()*.5;d.position.set((Math.random()-.5)*20,0,3-Math.random()*26);d.rotation.set(0,Math.random()*6.28,0);d.scale.setScalar(s);d.updateMatrix();fst.setMatrixAt(i,d.matrix);fbl.setMatrixAt(i,d.matrix);fst.setColorAt(i,col.setHex(0x4f8a3a));fbl.setColorAt(i,col.setHex(fcs[i%4]))}
S.add(fst,fbl);
const S2=new T.Scene();S2.add(C);S2.add(new T.HemisphereLight(0xffe2b0,0x6b5324,1.7));const dl2=new T.DirectionalLight(0xffd9a0,2.6);dl2.position.set(-3,4,3);S2.add(dl2);const draw2=()=>{C.updateMatrixWorld(true);R.autoClear=true;R.render(S,C);R.autoClear=false;R.clearDepth();R.render(S2,C);R.autoClear=true};const FL=[];[['seeds',.55,.3,6.2,.46],['protection',.84,.12,7,.4],['tools',.8,.66,6.4,.38]].forEach(([c,nx,ny,dd,s],i)=>{const p=PRODUCTS.find(q=>q.c==c);if(!p)return;const m=model(p);m.scale.setScalar(s);m.rotation.set(.12,-.5+i,0);m.userData={id:p.id,n:p.n,nx,ny,d:dd,s,i};C.add(m);FL.push(m)});
const place=()=>FL.forEach(m=>{const u=m.userData,hh=u.d*Math.tan(24*Math.PI/180),nr=C.aspect<1;m.visible=!nr||u.i==0;u.bx=(nr?.45:u.nx)*hh*C.aspect;u.by=(nr?.5:u.ny)*hh;u.bz=-u.d;m.position.set(u.bx,u.by,u.bz)});
const hint=document.createElement('div');hint.className='hint';h.append(hint);
const rcast=new T.Raycaster(),pv=new T.Vector2();let hot=null,px=-1,py=-1;
addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY},{passive:true});
const floatTick=t=>{rays.material.rotation=t*.02;glow.scale.setScalar(34+Math.sin(t*.6)*1.6);CL.forEach(s=>{s.position.x+=.012;if(s.position.x>85)s.position.x=-85});
const r=h.getBoundingClientRect();let hit=null;
if(px>=r.left&&px<=r.right&&py>=r.top&&py<=r.bottom){pv.set((px-r.left)/r.width*2-1,-((py-r.top)/r.height)*2+1);rcast.setFromCamera(pv,C);const hs=rcast.intersectObjects(FL.filter(m=>m.visible),true);if(hs.length){let o=hs[0].object;while(o&&!o.userData.id)o=o.parent;const el=document.elementFromPoint(px,py);if(o&&!(el&&el.closest('a,button,.season')))hit=o}}
if(hit!==hot){hot=hit;h.style.cursor=hot?'pointer':'';hint.textContent=hot?hot.userData.n:'';hint.classList.toggle('on',!!hot)}
if(hot)hint.style.transform=`translate(${px-r.left+18}px,${py-r.top+18}px)`;
FL.forEach(m=>{const u=m.userData,k=m===hot?1.16:1;m.scale.x+=(u.s*k-m.scale.x)*.12;m.scale.y=m.scale.z=m.scale.x;m.position.set(u.bx,u.by+Math.sin(t*.9+u.i*2)*.14,u.bz);m.rotation.y+=m===hot?.03:.006;m.rotation.x=.1+Math.sin(t*.6+u.i)*.05})};
h.addEventListener('click',e=>{if(hot&&!e.target.closest('a,button')){const a=document.createElement('a');a.href='product.html?id='+hot.userData.id;document.body.append(a);a.click();a.remove()}});
let mx=0,my=0,vis=true;const t0=performance.now();
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
const rs=()=>{R.setSize(h.clientWidth,h.clientHeight,false);C.aspect=h.clientWidth/h.clientHeight;C.updateProjectionMatrix();place()};rs();addEventListener('resize',rs);
const frame=()=>{const t=(performance.now()-t0)/1000,sc=Math.min(1,scrollY/innerHeight);U.uTime.value=t;
const p=pg.attributes.position;for(let i=0;i<P;i++){let y=p.getY(i)+.004;if(y>4)y=0;p.setY(i,y);p.setX(i,p.getX(i)+Math.sin(t+i)*.0015)}p.needsUpdate=true;
C.position.x+=(mx*1.6-C.position.x)*.04;C.position.y+=(1.7-my*.5+sc*1.8-C.position.y)*.04;const ie=1-Math.pow(1-Math.min(1,t/3),3);C.position.z=6-sc*5+Math.sin(t*.15)*.3+(1-ie)*4;C.fov=48+(1-ie)*12;C.updateProjectionMatrix();C.lookAt(C.position.x*.3,C.position.y-1.9,-30);floatTick(t);draw2()};
const loop=()=>{if(!vis)return;frame();requestAnimationFrame(loop)};
const ph=$$q('.ph',h);if(ph)ph.style.visibility='hidden';
if(RM){U.uTime.value=3;C.position.set(0,1.7,6);C.lookAt(0,-.2,-30);draw2();return}
new IntersectionObserver(([e])=>{if(e.isIntersecting&&!vis){vis=true;loop()}else if(!e.isIntersecting)vis=false}).observe(h);loop()}
/* ---------- products in 3D ---------- */
const wrapT=(x,t,cx,y,w,lh)=>{let l='';for(const wd of t.split(' ')){const n=l?l+' '+wd:wd;if(x.measureText(n).width>w&&l){x.fillText(l,cx,y);y+=lh;l=wd}else l=n}x.fillText(l,cx,y)};
const KIND=p=>/тример/.test(p.n)?'trim':/Бензо/.test(p.n)?'saw':/Секатор|Сучкоріз|Ножиці|Ножівка/.test(p.n)?'shear':/Лопата/.test(p.n)?'spade':/Пакет/.test(p.k)?'pouch':/Обприскувач/.test(p.n)?'can':{seeds:'sack',fertilizers:'sack',protection:'can',irrigation:'coil',equipment:'mach'}[p.c]||'spade';
function model(p){const O=new T.Group(),G=new T.Group(),k=KIND(p),L=cnv(512,512),x=L.getContext('2d');O.add(G);
x.fillStyle='#F7F7F0';x.fillRect(0,0,512,512);x.fillStyle=p.col;x.fillRect(0,0,512,120);x.textAlign='center';x.fillStyle='#09271F';x.font='800 56px Manrope,Arial,sans-serif';x.fillText(p.b,256,82);x.fillStyle='#123C2D';x.font='800 46px Manrope,Arial,sans-serif';wrapT(x,p.n,256,200,440,56);x.fillStyle='#55645c';x.font='500 34px Inter,Arial,sans-serif';x.fillText(p.k,256,470);
const mt=o=>new T.MeshStandardMaterial(o),lab=mt({map:tex(L),roughness:.6}),body=mt({color:p.col,roughness:.6}),dark=mt({color:0x1b1f1d,roughness:.5}),steel=mt({color:0xb9c2c0,metalness:.7,roughness:.3}),wood=mt({color:0x9a7648,roughness:.7}),glass=mt({color:0xcfe8f0,roughness:.15});
const M=(g,m,px=0,py=0,pz=0,rz=0,rx=0,t=G)=>{const o=new T.Mesh(g,m);o.position.set(px,py,pz);o.rotation.set(rx,0,rz);t.add(o);return o},B=(w,h,d)=>new T.BoxGeometry(w,h,d),Y=(r,r2,h,s=32)=>new T.CylinderGeometry(r,r2,h,s);
if(k=='sack'){M(B(2.4,3.1,1.1),[body,body,body,body,lab,lab]);M(B(2.4,.32,.55),body,0,1.7,0)}
else if(k=='pouch'){M(B(1.9,2.7,.22),[body,body,body,body,lab,lab]);M(B(1.9,.2,.27),dark,0,1.45,0)}
else if(k=='can'){M(Y(1.05,1.05,2.7,64),lab);M(Y(.5,.6,.3,32),body,0,1.5,0);M(Y(.28,.28,.3,24),dark,0,1.8,0)}
else if(k=='coil'){M(new T.TorusGeometry(1.25,.3,20,72),body,0,0,0,0,1.1);M(new T.TorusGeometry(.7,.3,20,72),body,0,.06,0,0,1.1);M(Y(.16,.16,2,16),dark,1.9,-.8,0,1.4)}
else if(k=='spade'){M(Y(.13,.13,2.8,16),wood,0,.8,0);M(B(1.1,1.2,.08),steel,0,-1.1,0);M(B(.7,.16,.16),wood,0,2.25,0);G.rotation.z=.35;G.position.y=-.1}
else if(k=='shear'){for(const s of[-1,1]){const g=new T.Group();M(B(.1,1.9,.03),steel,0,.95,0,0,0,g);M(Y(.1,.1,1.7,12),body,0,-1,0,0,0,g);g.rotation.z=s*.2;G.add(g)}M(Y(.14,.14,.12,16),dark,0,0,.1,0,Math.PI/2)}
else if(k=='saw'){M(B(2.2,1.1,.9),body);M(new T.TorusGeometry(.55,.1,10,24,Math.PI),dark,-.2,.55,0);M(B(2.8,.2,.12),steel,2.4,-.1,0);M(B(2.8,.06,.14),dark,2.4,-.2,0);G.scale.setScalar(.8);G.position.x=-1}
else if(k=='trim'){M(Y(.07,.07,4.2,12),steel,0,0,0,Math.PI/2);M(B(.9,.8,.7),body,-2.1,0,0);M(Y(.35,.35,.12,24),dark,2.1,-.05,0);M(B(1.2,.03,.03),dark,2.1,-.05,0);G.rotation.z=.4;G.scale.setScalar(.85)}
else{M(B(2.8,1.2,1.4),body,0,-.1,0);M(B(1.2,1.1,1.3),body,.8,.95,0);M(B(1.3,.6,1.32),glass,.85,.95,0);M(Y(.08,.08,.9,12),dark,-1.1,.9,0);for(const[wx,wz]of[[-.9,.8],[-.9,-.8],[.9,.8],[.9,-.8]])M(Y(.5,.5,.35,28),dark,wx,-.75,wz,0,Math.PI/2)}
return O}
const free=o=>o.traverse(c=>{if(c.geometry)c.geometry.dispose();[].concat(c.material||[]).forEach(m=>{if(m.map)m.map.dispose();m.dispose()})});
const SHT=(()=>{const c=cnv(128,128),x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(9,39,31,.35)');g.addColorStop(1,'rgba(9,39,31,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new T.CanvasTexture(c)})();
const shadow=()=>{const s=new T.Mesh(new T.PlaneGeometry(4.4,4.4),new T.MeshBasicMaterial({map:SHT,transparent:true,depthWrite:false}));s.rotation.x=-Math.PI/2;s.position.y=-1.75;return s};
const lights=S=>{S.add(new T.HemisphereLight(0xffffff,0x9aa59a,1.7));const d=new T.DirectionalLight(0xffffff,2.4);d.position.set(3,5,4);S.add(d,shadow())};
/* catalog thumbnails: every generated product picture becomes a 3D render */
const gen=p=>/\.svg(\?|$)/.test(p.img||''),TH={c:new Map(),q:[],busy:0};let TR,TS,TC;
const render3=p=>{if(TH.c.has(p.id))return TH.c.get(p.id);if(!TR){TR=new T.WebGLRenderer({canvas:cnv(512,512),antialias:true,alpha:true,preserveDrawingBuffer:true});TR.setPixelRatio(1);TR.setSize(512,512,false);TS=new T.Scene();TC=new T.PerspectiveCamera(32,1,.1,50);TC.position.set(0,.5,8.4);TC.lookAt(0,0,0);lights(TS)}
const o=model(p);o.rotation.set(.1,-.55,0);TS.add(o);TR.render(TS,TC);const u=TR.domElement.toDataURL('image/webp',.92);TS.remove(o);free(o);TH.c.set(p.id,u);return u};
const pump=()=>{if(TH.busy)return;TH.busy=1;requestAnimationFrame(()=>{const a=TH.q.shift();TH.busy=0;if(!a)return;const m=/id=(\d+)/.exec(a.getAttribute('href')||''),p=m&&pid(m[1]);if(p&&gen(p)&&a.isConnected){const i=new Image();i.className='r3';i.alt=p.n;i.onload=()=>a.replaceChildren(i);i.src=render3(p)}pump()})};
const io3=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io3.unobserve(e.target);TH.q.push(e.target);pump()}}),{rootMargin:'200px'});
const scan=()=>document.querySelectorAll('a.art:not([data-3d])').forEach(a=>{a.dataset['3d']=1;io3.observe(a)});
/* product page: draggable 3D viewer */
function viewer(box,p){const cv=document.createElement('canvas');cv.className='gl';box.append(cv);
const R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
const S=new T.Scene(),C=new T.PerspectiveCamera(32,1,.1,50),G=model(p);C.position.set(0,.5,8.4);C.lookAt(0,0,0);lights(S);S.add(G);
let ry=.5,vy=0,drag=false,lx=0,on=false;cv.style.touchAction='pan-y';cv.style.cursor='grab';
cv.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;cv.setPointerCapture(e.pointerId);cv.style.cursor='grabbing'});
cv.addEventListener('pointermove',e=>{if(drag){vy=(e.clientX-lx)*.012;ry+=vy;lx=e.clientX}});
const up=()=>{drag=false;cv.style.cursor='grab'};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
const rs=()=>{R.setSize(box.clientWidth,box.clientHeight,false);C.aspect=box.clientWidth/box.clientHeight;C.updateProjectionMatrix()};new ResizeObserver(rs).observe(box);
const loop=()=>{if(!on)return;if(!drag){vy*=.94;ry+=vy+(RM?0:.006)}G.rotation.y=ry;G.rotation.x=.08+Math.sin(performance.now()/1800)*.04;R.render(S,C);requestAnimationFrame(loop)};
return{get on(){return on},set(v){const was=on;on=v;cv.style.display=v?'block':'none';box.querySelectorAll('svg,img').forEach(e=>e.style.display=v?'none':'');if(v&&!was){rs();loop()}}}}
function prod(){const box=$$q('.art.big'),p=box&&pid(new URLSearchParams(location.search).get('id'));if(!p)return;const g=gen(p);box.classList.remove('pre3d');
const w=document.createElement('div');w.className='b3d';w.setAttribute('role','group');w.setAttribute('aria-label','Вигляд товару');let v=null;
const mk=(t,n)=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.onclick=()=>sw(n);w.append(b);return b},b3=mk('3D',true),b2=mk(g?'2D':'Фото',false);
const sw=n=>{if(n&&!v)v=viewer(box,p);if(v)v.set(n);b3.classList.toggle('on',n);b2.classList.toggle('on',!n);b3.setAttribute('aria-pressed',n);b2.setAttribute('aria-pressed',!n)};
box.append(w);sw(!!g)}
if(ok){window.thumb3=render3;const h=$$q('.hero');if(h)hero(h);scan();new MutationObserver(()=>requestAnimationFrame(scan)).observe(document.getElementById('app'),{childList:true,subtree:true});if(document.body.dataset.page=='product')prod()}else{const b=$$q('.art.big');if(b)b.classList.remove('pre3d')}
