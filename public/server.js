const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const PORT=process.env.PORT||3000,ROOT=__dirname,DB=path.join(ROOT,'data','db.json'),SEED=require('./data/seed.json');
const ADMIN=(process.env.ADMIN_EMAIL||'').toLowerCase(),LQ={pub:process.env.LIQPAY_PUBLIC_KEY,prv:process.env.LIQPAY_PRIVATE_KEY},BASE=process.env.BASE_URL||`http://localhost:${PORT}`;
const PROMO={AGRO10:10,SPRING5:5},ST=['new','paid','shipped','done','cancelled'];
let db;try{db=JSON.parse(fs.readFileSync(DB))}catch(e){db={products:SEED.PRODUCTS,users:[],sessions:{},orders:[],subs:[],seq:1000};save()}
function save(){const t=DB+'.tmp';fs.writeFileSync(t,JSON.stringify(db));fs.renameSync(t,DB)}
/* generated artwork (replace any file in assets/images with a real photo) */
const SH={bag:c=>`<path d="M60 30h120l14 26v170H46V56z" fill="${c}"/><rect x="66" y="100" width="108" height="80" rx="6" fill="#F7F7F0"/><path d="M120 112c18 10 18 34 0 48-18-14-18-38 0-48z" fill="#123C2D"/>`,can:c=>`<rect x="70" y="60" width="100" height="170" rx="14" fill="${c}"/><rect x="95" y="40" width="50" height="24" rx="6" fill="#18231E"/><rect x="82" y="110" width="76" height="70" rx="6" fill="#F7F7F0"/><path d="M120 120c14 8 14 28 0 40-14-12-14-32 0-40z" fill="#123C2D"/>`,kit:c=>`<circle cx="120" cy="140" r="70" fill="none" stroke="${c}" stroke-width="14"/><circle cx="120" cy="140" r="38" fill="none" stroke="${c}" stroke-width="14"/><path d="M190 140h40M50 140H10" stroke="${c}" stroke-width="14"/>`,tool:c=>`<path d="M120 40v140" stroke="#8C6E48" stroke-width="16" stroke-linecap="round"/><path d="M80 170h80l-10 60H90z" fill="${c}"/>`,mach:c=>`<rect x="40" y="110" width="150" height="70" rx="10" fill="${c}"/><rect x="130" y="70" width="60" height="50" rx="8" fill="#18231E"/><circle cx="80" cy="190" r="34" fill="#18231E"/><circle cx="170" cy="200" r="22" fill="#18231E"/>`};
const SHAPE={seeds:'bag',fertilizers:'bag',protection:'can',irrigation:'kit',tools:'tool',equipment:'mach'};
const SC={hero:['#1d3a30','#e0a93b','#3a4a1c'],campaign:['#d9b04c','#7a5f22','#123C2D'],story1:['#c9a24a','#55703a','#123C2D'],story2:['#55703a','#27422f','#09271F'],seeds:['#e6c566','#b8902f','#7a5f22'],fertilizers:['#5fa07a','#2f6a4c','#123C2D'],protection:['#b5c86a','#6f8f3a','#27422f'],irrigation:['#7ab8d9','#3a7ca5','#123C2D'],tools:['#c8a878','#8c6e48','#3b2f1e'],equipment:['#e6b840','#b58a10','#4a3a10']};
(function(){const d=path.join(ROOT,'assets/images'),pd=path.join(d,'products');fs.mkdirSync(pd,{recursive:true});
global.mkImg=p=>{const f=path.join(pd,p.id+'.svg');fs.writeFileSync(f,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 280"><defs><radialGradient id="g" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#F7F7F0"/><stop offset="1" stop-color="#DDE3D8"/></radialGradient></defs><rect width="240" height="280" fill="url(#g)"/><ellipse cx="120" cy="246" rx="64" ry="9" fill="#09271F" opacity=".12"/>${SH[SHAPE[p.c]](p.col)}<text x="120" y="270" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="#18231E">${String(p.b).replace(/[<>&]/g,'')}</text></svg>`)};SEED.PRODUCTS.forEach(mkImg);
for(const[n,[a,b,c]]of Object.entries(SC)){const f=path.join(d,n+'.svg');if(!fs.existsSync(f))fs.writeFileSync(f,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="s" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".6" stop-color="${b}"/></linearGradient></defs><rect width="1600" height="1000" fill="url(#s)"/><circle cx="1150" cy="470" r="120" fill="#fff" opacity=".55"/><path d="M0 620C300 540 600 600 900 560S1400 520 1600 580V1000H0z" fill="${c}"/><path d="M0 760C400 700 800 780 1200 720S1500 720 1600 740V1000H0z" fill="#09271F" opacity=".55"/></svg>`)}})();
/* helpers */
const send=(r,c,o,h={})=>{r.writeHead(c,{'Content-Type':'application/json',...SEC,...h});r.end(JSON.stringify(o))};
const raw=(r,L=1e5)=>new Promise((res,rej)=>{let d='';r.on('data',c=>{d+=c;if(d.length>L){rej(new Error('big'));r.destroy()}});r.on('end',()=>res(d))});
const body=async(r,L)=>JSON.parse(await raw(r,L)||'{}');
const hash=(p,s=crypto.randomBytes(16).toString('hex'))=>s+':'+crypto.scryptSync(p,s,32).toString('hex');
const same=(p,h)=>{const[s,x]=h.split(':'),y=hash(p,s).split(':')[1];return crypto.timingSafeEqual(Buffer.from(x),Buffer.from(y))};
const sid=r=>Object.fromEntries((r.headers.cookie||'').split(';').map(c=>c.trim().split('=')))['sid'];
const sign=d=>crypto.createHash('sha1').update(LQ.prv+d+LQ.prv).digest('base64');
const pub=p=>({id:p.id,n:p.n,b:p.b,c:p.c,p:p.p,o:p.o,k:p.k,s:p.s,col:p.col,img:p.img});
const str=(v,n=200)=>typeof v=='string'?v.trim().slice(0,n):'';
let CFG={};try{CFG=JSON.parse(fs.readFileSync(path.join(ROOT,'config.json'),'utf8'))}catch(e){console.error('УВАГА: config.json не прочитано:',e.message)}
CFG.adminUsername=CFG.adminUsername||'admin555';CFG.adminPassword=CFG.adminPassword||'cursed555';const OWNER=CFG.orderEmail||'romanbaraban509@gmail.com';let TR=null;
try{if(CFG.smtpUser&&CFG.smtpPass)TR=require('nodemailer').createTransport({host:CFG.smtpHost||'smtp.gmail.com',port:CFG.smtpPort||465,secure:(CFG.smtpPort||465)==465,auth:{user:CFG.smtpUser,pass:CFG.smtpPass}})}catch(e){console.error('Пошта вимкнена:',e.message)}
console.log(TR?'Пошта: замовлення надходитимуть на '+OWNER:'Пошта НЕ налаштована: впишіть smtpPass у config.json');
const mail=(to,subject,text,replyTo,fromName)=>TR?TR.sendMail({from:fromName?`"${String(fromName).replace(/[\r\n"<>]+/g,' ').trim().slice(0,60)}" <${CFG.smtpUser}>`:`UKRAGRO <${CFG.smtpUser}>`,to,subject:String(subject).replace(/[\r\n]+/g,' '),text,replyTo}).catch(e=>console.error('Email error:',e.message)):0;
const otext=o=>[`Замовлення №${o.id}`,`Клієнт: ${o.name}`,`Телефон: ${o.phone}`,`Email: ${o.email}`,`Доставка: ${o.delivery}, ${o.city}, ${o.address}`,`Оплата: ${o.pay=='card'?'карткою онлайн':'при отриманні'}`,'',...o.items.map(i=>`• ${i.n} × ${i.q} = ${i.p*i.q} ₴`),'',o.disc?`Знижка: −${o.disc} ₴`:'',`Доставка: ${o.dl} ₴`,`РАЗОМ: ${o.total} ₴`].join('\n');
const notify=o=>{mail(OWNER,`Нове замовлення №${o.id} від ${o.name} (${o.email}) на ${o.total} ₴`,otext(o),o.email,o.name);mail(o.email,`Ваше замовлення №${o.id} | UKRAGRO`,`Дякуємо за замовлення!\n\n${otext(o)}\n\nМи зв’яжемося з вами найближчим часом.`)};
db.reviews=db.reviews||[];db.messages=db.messages||[];
for(const s of SEED.PRODUCTS)if(!db.products.some(x=>x.id==s.id))db.products.push({...s});
if(CFG.adminUsername&&CFG.adminPassword){let a=db.users.find(x=>x.username==CFG.adminUsername);if(!a)db.users.push(a={id:crypto.randomUUID(),name:CFG.adminUsername,username:CFG.adminUsername,email:CFG.adminUsername+'@ukragro.local',pw:'',admin:true});if(!a.pw||!same(CFG.adminPassword,a.pw))a.pw=hash(CFG.adminPassword);a.admin=true}
save();
const sha=t=>crypto.createHash('sha256').update(t).digest('hex'),RL={},now=()=>Date.now(),cl=s=>s.replace(/[<>"`]/g,'');
const recent=(k,w)=>(RL[k]=(RL[k]||[]).filter(t=>now()-t<w));
const hit=(k,max,w)=>{const a=recent(k,w);if(a.length>=max)return false;a.push(now());return true};
const eq=(a,b)=>a.length==b.length&&crypto.timingSafeEqual(Buffer.from(a),Buffer.from(b));
setInterval(()=>{for(const k in RL)if(!recent(k,36e5).length)delete RL[k]},6e5).unref();
const SEC={'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Content-Security-Policy':"default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; form-action 'self' https://www.liqpay.ua; frame-ancestors 'none'; base-uri 'self'; object-src 'none'",...(BASE.startsWith('https')?{'Strict-Transport-Security':'max-age=31536000'}:{})};
db.sessions=Object.fromEntries(Object.entries(db.sessions||{}).filter(([k,v])=>v&&v.exp>now()));
if(db.catalog!==2){db.products=SEED.PRODUCTS.map(p=>({...p}));db.reviews=[];db.catalog=2}
console.log('Адмін-акаунт: '+CFG.adminUsername+' (змініть пароль у config.json)');save();
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp'};
http.createServer(async(q,r)=>{try{
const u=new URL(q.url,BASE),p=u.pathname,m=q.method,S=db.sessions[sha(sid(q)||'')],me=S&&S.exp>now()?db.users.find(x=>x.id==S.uid):undefined;
const ip=q.socket.remoteAddress||'';
if(p.startsWith('/api/')){
 if(!hit('a'+ip,150,6e4))return send(r,429,{error:'Забагато запитів. Зачекайте хвилину'});
 if(m!='GET'&&p!='/api/liqpay/callback'){const og=q.headers.origin;if((og&&new URL(og).host!==q.headers.host)||!/^application\/json/.test(q.headers['content-type']||''))return send(r,403,{error:'Заборонено'})}
 if(m=='POST'&&['/api/orders','/api/contact','/api/subscribe','/api/auth/register'].includes(p)&&!hit('w'+ip,20,36e5))return send(r,429,{error:'Забагато спроб. Спробуйте пізніше'})}
const login=(us)=>{const t=crypto.randomBytes(32).toString('hex');db.sessions[sha(t)]={uid:us.id,exp:now()+2592e6};save();send(r,200,{ok:1},{'Set-Cookie':`sid=${t}; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000${BASE.startsWith('https')?'; Secure':''}`})};
if(p=='/js/products.js'){r.writeHead(200,{'Content-Type':'text/javascript',...SEC,'Cache-Control':'no-store'});return r.end(`const CATS=${JSON.stringify(SEED.CATS)};const PRODUCTS=${JSON.stringify(db.products.map(pub))};`)}
if(p.startsWith('/api/')){
 if(p=='/api/reviews'&&m=='GET')return send(r,200,db.reviews.filter(x=>x.pid==+u.searchParams.get('pid')).reverse().slice(0,50));
 if(p=='/api/reviews'&&m=='POST'){if(!me)return send(r,401,{error:'Увійдіть, щоб залишити відгук'});const b=await body(q),n=Math.floor(b.rating);if(!db.products.some(x=>x.id==b.pid)||!(n>=1&&n<=5)||str(b.text,800).length<3)return send(r,422,{error:'Вкажіть оцінку та текст відгуку'});
  db.reviews=db.reviews.filter(x=>!(x.pid==b.pid&&x.uid==me.id));db.reviews.push({pid:+b.pid,uid:me.id,name:me.name,rating:n,text:str(b.text,800),at:new Date().toISOString()});save();return send(r,201,{ok:1})}
 if(p=='/api/contact'&&m=='POST'){const b=await body(q),c={name:str(b.name,80),email:str(b.email),text:str(b.text,2000)};if(c.name.length<2||!/^\S+@\S+\.\S+$/.test(c.email)||c.text.length<5)return send(r,422,{error:'Заповніть ім’я, email і повідомлення'});db.messages.push({...c,at:new Date().toISOString()});save();mail(OWNER,'Повідомлення з сайту від '+c.name.replace(/[\r\n]+/g,' '),c.text+'\n\n'+c.email,c.email,c.name);return send(r,201,{ok:1})}
 if(p.startsWith('/api/admin/products')&&m!='GET'){if(!me||!me.admin)return send(r,403,{error:'Немає доступу'});let g;
  const fld=(pr,b)=>{if(b.n!==undefined&&str(b.n,120).length>1)pr.n=cl(str(b.n,120));if(b.b!==undefined)pr.b=cl(str(b.b,60));if(b.k!==undefined)pr.k=cl(str(b.k,60));if(SEED.CATS.some(c=>c[0]==b.c))pr.c=b.c;if(b.p!==undefined&&+b.p>=0)pr.p=+b.p;if(b.o!==undefined)pr.o=+b.o>0?+b.o:undefined;if(b.s!==undefined&&Number.isInteger(+b.s)&&+b.s>=0)pr.s=+b.s};
  if(p=='/api/admin/products'&&m=='POST'){const b=await body(q);if(str(b.n,120).length<2||!(+b.p>=0)||!SEED.CATS.some(c=>c[0]==b.c))return send(r,422,{error:'Вкажіть назву, категорію та ціну'});const pr={id:Math.max(0,...db.products.map(x=>x.id))+1,b:'',k:'',s:0,col:'#4A8DB5'};fld(pr,b);pr.img='assets/images/products/'+pr.id+'.svg';mkImg(pr);db.products.push(pr);save();return send(r,201,pr)}
  if((g=p.match(/^\/api\/admin\/products\/(\d+)(\/image)?$/))){const pr=db.products.find(x=>x.id==g[1]);if(!pr)return send(r,404,{error:'Не знайдено'});
   if(g[2]&&m=='POST'){const b=await body(q,4e6),x=/^data:image\/(jpeg|png|webp);base64,/.exec(b.data||'');if(!x)return send(r,422,{error:'Потрібне зображення JPG, PNG або WebP'});const f='assets/images/products/'+pr.id+'.'+(x[1]=='jpeg'?'jpg':x[1]);fs.writeFileSync(path.join(ROOT,f),Buffer.from(b.data.slice(x[0].length),'base64'));pr.img=f+'?v='+Date.now();save();return send(r,200,pr)}
   if(m=='PATCH'){fld(pr,await body(q));save();return send(r,200,pr)}
   if(m=='DELETE'){db.products=db.products.filter(x=>x!==pr);save();return send(r,200,{ok:1})}}}
 if(p=='/api/config')return send(r,200,{liqpay:!!(LQ.pub&&LQ.prv),cursedUrl:CFG.cursedUrl||''});
 if(p=='/api/me')return send(r,200,{user:me?{name:me.name,email:me.email,admin:me.admin,last:db.orders.filter(o=>o.uid==me.id).pop()||{}}:null});
 if(m=='POST'&&p=='/api/auth/register'){const b=await body(q),em=str(b.email).toLowerCase();
  if(!/^\S+@\S+\.\S+$/.test(em)||str(b.password,200).length<8||str(b.name,80).length<2)return send(r,422,{error:'Вкажіть ім’я, email і пароль від 8 символів'});
  if(db.users.some(x=>x.email==em))return send(r,409,{error:'Цей email уже зареєстровано'});
  const us={id:crypto.randomUUID(),name:str(b.name,80),email:em,pw:hash(b.password),admin:ADMIN?em==ADMIN:!db.users.length};db.users.push(us);return login(us)}
 if(m=='POST'&&p=='/api/auth/login'){const b=await body(q),k=str(b.email).toLowerCase(),us=db.users.find(x=>x.email==k||x.username==k);if(recent('l'+ip,9e5).length>=8||recent('u'+k,9e5).length>=8)return send(r,429,{error:'Забагато невдалих спроб входу. Спробуйте за 15 хвилин'});
  if(!us||!same(String(b.password||''),us.pw)){hit('l'+ip,99,9e5);hit('u'+k,99,9e5);await new Promise(z=>setTimeout(z,500));return send(r,401,{error:'Невірний email або пароль'})}return login(us)}
 if(m=='POST'&&p=='/api/auth/logout'){delete db.sessions[sha(sid(q)||'')];save();return send(r,200,{ok:1},{'Set-Cookie':'sid=; Max-Age=0; Path=/'})}
 if(m=='POST'&&p=='/api/subscribe'){const b=await body(q),em=str(b.email).toLowerCase();if(!/^\S+@\S+\.\S+$/.test(em))return send(r,422,{error:'Введіть коректну адресу email'});if(!db.subs.includes(em)){db.subs.push(em);save()}return send(r,200,{ok:1})}
 if(p=='/api/orders'&&m=='GET'){if(!me)return send(r,401,{error:'Потрібен вхід'});return send(r,200,db.orders.filter(o=>o.uid==me.id).reverse())}
 if(p=='/api/orders'&&m=='POST'){const b=await body(q),f={name:str(b.name),phone:str(b.phone),email:str(b.email),city:str(b.city),address:str(b.address)};
  if(f.name.length<2||!/^(\+?38)?0\d{9}$/.test(f.phone.replace(/[\s()-]/g,''))||!/^\S+@\S+\.\S+$/.test(f.email)||f.city.length<2||f.address.length<4)return send(r,422,{error:'Перевірте контактні дані'});
  const items=[];let sub=0;for(const i of(Array.isArray(b.items)?b.items:[]).slice(0,50)){const pr=db.products.find(x=>x.id==i.id),n=Math.floor(i.q);
   if(!pr||!(n>0&&n<100))return send(r,422,{error:'Некоректний товар у кошику'});if(pr.s<n)return send(r,409,{error:`Недостатньо на складі: ${pr.n} (залишилось ${pr.s})`});items.push({id:pr.id,n:pr.n,p:pr.p,q:n});sub+=pr.p*n}
  if(!items.length)return send(r,422,{error:'Кошик порожній'});
  const off=PROMO[str(b.promo,30).toUpperCase()]||0,disc=Math.round(sub*off/100),dl=sub-disc>=5000?0:150,total=sub-disc+dl;
  items.forEach(i=>db.products.find(x=>x.id==i.id).s-=i.q);
  const card=b.payment=='card'&&LQ.pub&&LQ.prv,o={id:++db.seq,uid:me?me.id:null,...f,delivery:str(b.delivery,60),items,sub,disc,dl,total,pay:card?'card':'cod',status:'new',paid:false,at:new Date().toISOString()};
  db.orders.push(o);save();notify(o);let pay;
  if(card){const data=Buffer.from(JSON.stringify({version:3,public_key:LQ.pub,action:'pay',amount:total,currency:'UAH',description:'Замовлення №'+o.id,order_id:String(o.id),result_url:BASE+'/account.html',server_url:BASE+'/api/liqpay/callback',language:'uk'})).toString('base64');pay={data,signature:sign(data)}}
  return send(r,201,{id:o.id,total,disc,pay})}
 if(m=='POST'&&p=='/api/liqpay/callback'){const f=new URLSearchParams(await raw(q)),d=f.get('data')||'';if(!LQ.prv||!eq(sign(d),f.get('signature')||''))return send(r,400,{});
  const j=JSON.parse(Buffer.from(d,'base64')),o=db.orders.find(x=>x.id==j.order_id);if(o&&['success','sandbox'].includes(j.status)&&j.amount==o.total){o.paid=true;if(o.status=='new')o.status='paid';save();mail(OWNER,'Замовлення №'+o.id+' сплачено карткою ('+o.name+', '+o.email+')',otext(o),o.email,o.name)}return send(r,200,{})}
 if(p.startsWith('/api/admin/')){if(!me||!me.admin)return send(r,403,{error:'Немає доступу'});let g;
  if(m=='GET'&&p=='/api/admin/orders')return send(r,200,[...db.orders].reverse());
  if(m=='GET'&&p=='/api/admin/products')return send(r,200,db.products);
  if(m=='PATCH'&&(g=p.match(/^\/api\/admin\/orders\/(\d+)$/))){const o=db.orders.find(x=>x.id==g[1]),b=await body(q);if(!o||!ST.includes(b.status))return send(r,422,{error:'Некоректні дані'});
   if(b.status=='cancelled'&&o.status!='cancelled')o.items.forEach(i=>{const pr=db.products.find(x=>x.id==i.id);if(pr)pr.s+=i.q});o.status=b.status;save();return send(r,200,o)}
  if(m=='PATCH'&&(g=p.match(/^\/api\/admin\/products\/(\d+)$/))){const pr=db.products.find(x=>x.id==g[1]),b=await body(q);if(!pr)return send(r,404,{error:'Не знайдено'});
   if(b.p!==undefined&&Number.isFinite(+b.p)&&+b.p>=0)pr.p=+b.p;if(b.s!==undefined&&Number.isInteger(+b.s)&&+b.s>=0)pr.s=+b.s;save();return send(r,200,pr)}}
 return send(r,404,{error:'Не знайдено'})}
const rel=p=='/'?'/index.html':decodeURIComponent(p),f=path.normalize(path.join(ROOT,rel));
if(!(/^\/(css|js|assets)\//.test(rel)||/^\/[a-z]+\.html$/.test(rel))||!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)){r.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});return r.end('Сторінку не знайдено')}
r.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream',...SEC,'Cache-Control':rel.startsWith('/js/vendor/')?'public, max-age=604800':'no-cache'});fs.createReadStream(f).pipe(r);
}catch(e){send(r,400,{error:'Некоректний запит'})}}).listen(PORT,()=>console.log('UKRAGRO: '+BASE));
