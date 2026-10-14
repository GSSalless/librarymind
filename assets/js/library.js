(async()=>{
try{
const response=await fetch('index.php?route=api/catalogo');
if(!response.ok)throw new Error('Catálogo indisponível. Atualize a página para tentar novamente.');
const DATA=await response.json();
const CATS = DATA.cats, DESC = DATA.desc;
const AUT = DATA.authors.map(([n,nac,b,d],i)=>({i,n,nac,b,d}));
const B = DATA.books.map((x,i)=>({i,t:x[0],a:x[1],c:x[2],s:x[3],se:x[4],v:x[5],p:x[6],h:x[7],lang:x[8],ed:x[9],isbn:x[10],syn:x[11],dup:x[12],obs:x[13],path:x[14],fmt:x[15],conf:{R:'Revisada',A:'Por autor',S:'Por assuntos/sinopse',E:'Estimada',F:'Pela pasta de origem'}[x[16]],col:x[17]}));
const UNIQ = B.filter(b=>!b.dup);
const HUE = CATS.map((_,i)=>Math.round((i*360/CATS.length + 150) % 360));
const $ = s=>document.querySelector(s);
const esc = s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm = s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const fmt = n=>n.toLocaleString('pt-BR');
const isLit = c=>c<=2;
B.forEach(b=>{b.an=AUT[b.a].n; b.k=norm(b.t+' '+b.an)});
AUT.forEach(a=>{a.books=UNIQ.filter(b=>b.a===a.i); a.cats=[...new Set(a.books.map(b=>b.c))]});

/* ---- favoritos (por navegador) ---- */
let FAV = new Set();
try{ FAV = new Set(JSON.parse(localStorage.getItem('bib-fav')||'[]')) }catch(e){}
function saveFav(){ try{ localStorage.setItem('bib-fav', JSON.stringify([...FAV])) }catch(e){} }

/* ---- capas ---- */
const COV = DATA.cov||'';
function capaStyle(i){
  if(COV[i]!=='1') return '';
  const s=Math.floor(i/100), k=i%100;
  return `;background-image:url(dados/capas_sprites/s${String(s).padStart(3,'0')}.webp);background-size:1000% 1000%;background-position:${(k%10)*100/9}% ${Math.floor(k/10)*100/9}%`;
}
function cover(b){
  const im=capaStyle(b.i);
  return `<div class="cover${im?' img':''}" style="--h:${HUE[b.c]}${im}">${FAV.has(b.i)?'<span class="star" aria-label="Na estante">★</span>':''}
    ${b.se?`<span class="cs">${esc(b.v||'•')}</span>`:''}
    ${im?`<span class="sr">${esc(b.t)}</span>`:`<span class="ct">${esc(b.t)}</span><span class="ca">${esc(b.an)}</span>`}</div>`;
}
function shelf(list){
  return `<div class="shelf">${list.map(b=>`<button class="book" data-b="${b.i}">${cover(b)}<span class="bt">${esc(b.t)}</span><span class="ba">${esc(b.an)}</span></button>`).join('')}</div>`;
}
function table(list){
  return `<div class="tablewrap"><table><thead><tr><th>Título</th><th>Autor</th><th>Categoria</th><th>Gênero</th><th>Série</th><th style="text-align:right">Páginas</th><th style="text-align:right">Horas</th></tr></thead><tbody>
  ${list.map(b=>`<tr data-b="${b.i}"><td>${esc(b.t)}</td><td>${esc(b.an)}</td><td><span class="dot" style="--h:${HUE[b.c]}"></span>${esc(CATS[b.c])}</td><td>${esc(b.s)}</td><td>${esc(b.se?b.se+(b.v?' · '+b.v:''):'')}</td><td class="r">${fmt(b.p)}</td><td class="r">${b.h}</td></tr>`).join('')}
  </tbody></table></div>`;
}

/* ---- abas ---- */
const VIEWS=['painel','catalogo','autores','temas','pesquisa','estante'];
function show(v){
  if(!VIEWS.includes(v)) v='painel';
  VIEWS.forEach(x=>{$('#v-'+x).hidden = x!==v});
  document.querySelectorAll('nav.tabs button').forEach(b=>b.setAttribute('aria-selected', b.dataset.v===v));
  if(v==='estante') renderEstante();
  if(location.hash.slice(1)!==v) history.replaceState(null,'','#'+v);
  window.scrollTo({top:0});
}
document.querySelectorAll('nav.tabs button').forEach(b=>b.onclick=()=>show(b.dataset.v));

/* ---- painel ---- */
const totalPag = UNIQ.reduce((s,b)=>s+b.p,0), totalH = UNIQ.reduce((s,b)=>s+b.h,0);
const series = {}; UNIQ.forEach(b=>{ if(b.se){ (series[b.se] ||= []).push(b) } });
const nSeries = Object.values(series).filter(l=>l.length>1).length;
$('#meta').textContent = `${fmt(UNIQ.length)} títulos · ${fmt(AUT.length)} autores · ${CATS.length} categorias · ${fmt(DATA.reps)} repetidos separados`;
$('#kpis').innerHTML = [
  [UNIQ.length,'títulos'],[AUT.length,'autores'],[CATS.length,'categorias'],
  [totalPag,'páginas estimadas'],[Math.round(totalH),'horas de leitura'],[nSeries,'séries'],[DATA.reps,'repetidos separados']
].map(([n,l])=>`<div class="kpi"><b>${fmt(n)}</b><span>${l}</span></div>`).join('');

function rank(el,items,onClick){
  const max = Math.max(...items.map(x=>x[1]));
  el.innerHTML = items.map(([l,n],k)=>`<li data-k="${k}"><span>${esc(l)}</span><span class="num">${fmt(n)}</span><span class="bar"><i style="width:${(n/max*100).toFixed(1)}%"></i></span></li>`).join('');
  el.querySelectorAll('li').forEach(li=>li.onclick=()=>onClick(+li.dataset.k));
}
const topA = [...AUT].sort((x,y)=>y.books.length-x.books.length).slice(0,12);
rank($('#rkAut'), topA.map(a=>[a.n,a.books.length]), k=>openAuthor(topA[k].i));
const nacC = {}; UNIQ.forEach(b=>{const n=AUT[b.a].nac; if(n) nacC[n]=(nacC[n]||0)+1});
const topN = Object.entries(nacC).sort((a,b)=>b[1]-a[1]).slice(0,12);
rank($('#rkNac'), topN, k=>{ show('autores'); $('#aNac').value=topN[k][0]; renderAuthors(); });
const longB = [...UNIQ].sort((a,b)=>b.p-a.p).slice(0,12);
rank($('#rkLong'), longB.map(b=>[b.t+' — '+b.an, b.p]), k=>openBook(longB[k].i));
const colC={}; UNIQ.forEach(b=>colC[b.col]=(colC[b.col]||0)+1); const topC=Object.entries(colC).sort((a,b)=>b[1]-a[1]);
rank($('#rkCol'), topC, ()=>{});
const cfC={}; UNIQ.forEach(b=>cfC[b.conf]=(cfC[b.conf]||0)+1); const topCf=['Revisada','Por autor','Por assuntos/sinopse','Pela pasta de origem','Estimada'].map(k=>[k,cfC[k]||0]);
rank($('#rkConf'), topCf, k=>{ show('catalogo'); $('#cConf').value=topCf[k][0]; cLimit=60; renderCatalog(); });

function cssVar(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim() }
function century(s){
  if(!s) return null; s=String(s);
  const bc = /a\.C\./.test(s);
  const rom = s.match(/séc\.\s*([IVXL]+)/);
  if(rom){ const v={I:1,V:5,X:10,L:50}; let r=0,p=0; [...rom[1]].reverse().forEach(c=>{const x=v[c]; r+= x<p?-x:x; p=Math.max(p,x)}); return bc?-r:r }
  const y = parseInt(s.replace(/[^0-9]/g,'')); if(!y) return null;
  return bc ? -Math.ceil(y/100) : Math.ceil(y/100);
}
const ROM=['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'];
let charts=[];
function drawCharts(){
  if(!window.Chart) return;
  charts.forEach(c=>c.destroy()); charts=[];
  const ink=cssVar('--ink'), muted=cssVar('--muted'), line=cssVar('--line'), acc=cssVar('--accent'), brass=cssVar('--brass');
  const dark = cssVar('--cover-l')==='34%' && getComputedStyle(document.body).backgroundColor!=='rgb(242, 244, 241)';
  Chart.defaults.font.family = '"IBM Plex Sans", system-ui, sans-serif';
  Chart.defaults.color = muted;
  const grid = {color:line, drawTicks:false}, tip={backgroundColor:cssVar('--surface'),titleColor:ink,bodyColor:ink,borderColor:line,borderWidth:1,padding:10};
  const catHsl = i=>`hsl(${HUE[i]} 45% ${dark?58:44}%)`;
  // categorias
  const cc = CATS.map((_,i)=>UNIQ.filter(b=>b.c===i).length);
  const order = cc.map((n,i)=>i).sort((a,b)=>cc[b]-cc[a]);
  charts.push(new Chart($('#chCat'),{type:'bar',data:{labels:order.map(i=>CATS[i]),datasets:[{data:order.map(i=>cc[i]),backgroundColor:order.map(catHsl),borderRadius:3,barThickness:16}]},
    options:{indexAxis:'y',maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:tip},scales:{x:{grid,border:{display:false},ticks:{padding:6}},y:{grid:{display:false},border:{display:false},ticks:{color:ink,font:{size:12}}}},
    onClick:(e,els)=>{ if(els.length) openTheme(order[els[0].index]) }, onHover:(e,els)=>{e.native.target.style.cursor=els.length?'pointer':'default'}}}));
  // gêneros da literatura
  const g={}; UNIQ.filter(b=>isLit(b.c)).forEach(b=>g[b.s]=(g[b.s]||0)+1);
  let ge=Object.entries(g).sort((a,b)=>b[1]-a[1]); const top=ge.slice(0,7), rest=ge.slice(7).reduce((s,x)=>s+x[1],0); if(rest) top.push(['Outros',rest]);
  const pal=[acc,brass,`hsl(200 40% ${dark?60:42}%)`,`hsl(350 40% ${dark?62:45}%)`,`hsl(270 28% ${dark?66:48}%)`,`hsl(30 50% ${dark?60:46}%)`,`hsl(170 30% ${dark?55:38}%)`,muted];
  charts.push(new Chart($('#chGen'),{type:'doughnut',data:{labels:top.map(x=>x[0]),datasets:[{data:top.map(x=>x[1]),backgroundColor:pal,borderColor:cssVar('--surface'),borderWidth:2}]},
    options:{maintainAspectRatio:false,cutout:'58%',plugins:{tooltip:tip,legend:{position:'bottom',labels:{color:ink,boxWidth:12,boxHeight:12,padding:12,generateLabels:ch=>ch.data.labels.map((l,i)=>({text:`${l}  ${ch.data.datasets[0].data[i]}`,fillStyle:pal[i],strokeStyle:pal[i],fontColor:ink,index:i}))}}}}}));
  // séculos
  const sc={}; UNIQ.forEach(b=>{const c=century(AUT[b.a].b); if(c!==null) sc[c]=(sc[c]||0)+1});
  const keys=Object.keys(sc).map(Number).sort((a,b)=>a-b);
  const buckets=[['Antiguidade',k=>k<=5],['Idade Média',k=>k>5&&k<=15],['séc. XVI',k=>k===16],['séc. XVII',k=>k===17],['séc. XVIII',k=>k===18],['séc. XIX',k=>k===19],['séc. XX',k=>k===20]];
  const bv=buckets.map(([l,f])=>keys.filter(f).reduce((s,k)=>s+sc[k],0));
  const noYear = UNIQ.length - bv.reduce((a,b)=>a+b,0);
  charts.push(new Chart($('#chSec'),{type:'bar',data:{labels:buckets.map(x=>x[0]),datasets:[{data:bv,backgroundColor:brass,borderRadius:3}]},
    options:{maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...tip,callbacks:{label:c=>` ${c.raw} livros`}}},scales:{y:{grid,border:{display:false}},x:{grid:{display:false},ticks:{color:ink}}}}}));
  $('#chSec').closest('.panel').querySelector('.hint').textContent = `Livros agrupados pelo século de nascimento do autor. ${noYear} livros de autores sem data conhecida ficam de fora.`;
  // páginas
  const pb=[['até 100',0,100],['101–200',101,200],['201–300',201,300],['301–400',301,400],['401–600',401,600],['601–800',601,800],['mais de 800',801,1e9]];
  charts.push(new Chart($('#chPag'),{type:'bar',data:{labels:pb.map(x=>x[0]),datasets:[{data:pb.map(([,a,z])=>UNIQ.filter(b=>b.p>=a&&b.p<=z).length),backgroundColor:acc,borderRadius:3}]},
    options:{maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...tip,callbacks:{label:c=>` ${c.raw} livros`}}},scales:{y:{grid,border:{display:false}},x:{grid:{display:false},ticks:{color:ink}}}}}));
}

/* ---- catálogo ---- */
let cMode='grid', cLimit=60;
$('#cCat').innerHTML = `<option value="">Todas as categorias</option>` + CATS.map((c,i)=>`<option value="${i}">${esc(c)}</option>`).join('');
function fillSub(){
  const c=$('#cCat').value; const subs=[...new Set(UNIQ.filter(b=>c===''||b.c==c).map(b=>b.s))].sort((a,b)=>a.localeCompare(b,'pt'));
  $('#cSub').innerHTML = `<option value="">Todos os gêneros</option>`+subs.map(s=>`<option>${esc(s)}</option>`).join('');
}
function sortBooks(l,mode){
  const s=[...l];
  if(mode==='t') s.sort((a,b)=>a.t.localeCompare(b.t,'pt'));
  if(mode==='a') s.sort((a,b)=>a.an.localeCompare(b.an,'pt')||a.t.localeCompare(b.t,'pt'));
  if(mode==='pd') s.sort((a,b)=>b.p-a.p); if(mode==='pa') s.sort((a,b)=>a.p-b.p);
  return s;
}
function renderCatalog(){
  const q=norm($('#cQ').value), c=$('#cCat').value, s=$('#cSub').value, cf=$('#cConf').value;
  const l=sortBooks(UNIQ.filter(b=>(c===''||b.c==c)&&(!s||b.s===s)&&(!cf||b.conf===cf)&&(!q||b.k.includes(q))), $('#cSort').value);
  $('#cCount').textContent = `${fmt(l.length)} ${l.length===1?'livro':'livros'}`;
  const shown=l.slice(0,cLimit);
  $('#cOut').innerHTML = l.length? (cMode==='grid'?shelf(shown):table(shown)) : `<p class="empty">Nenhum livro encontrado com esses filtros.</p>`;
  $('#cMore').hidden = l.length<=cLimit; $('#cMore').textContent = `Mostrar mais (${fmt(l.length-cLimit)} restantes)`;
}
['cQ','cSub','cSort','cConf'].forEach(id=>$('#'+id).addEventListener('input',()=>{cLimit=60;renderCatalog()}));
$('#cCat').addEventListener('input',()=>{fillSub();cLimit=60;renderCatalog()});
$('#cMore').onclick=()=>{cLimit+=120;renderCatalog()};
$('#mGrid').onclick=()=>{cMode='grid';$('#mGrid').setAttribute('aria-pressed',true);$('#mList').setAttribute('aria-pressed',false);renderCatalog()};
$('#mList').onclick=()=>{cMode='list';$('#mList').setAttribute('aria-pressed',true);$('#mGrid').setAttribute('aria-pressed',false);cLimit=Math.max(cLimit,300);renderCatalog()};

/* ---- autores ---- */
let aLetter='', aLimit=120;
const nacs=[...new Set(AUT.map(a=>a.nac).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt'));
$('#aNac').innerHTML=`<option value="">Todas as nacionalidades</option>`+nacs.map(n=>`<option>${esc(n)}</option>`).join('');
const letters=[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'], have=new Set(AUT.map(a=>norm(a.n)[0].toUpperCase()));
$('#az').innerHTML=`<button data-l="" aria-pressed="true" style="width:auto;padding:0 10px;font-family:var(--f-body)">Todos</button>`+letters.map(l=>`<button data-l="${l}" aria-pressed="false" ${have.has(l)?'':'disabled'}>${l}</button>`).join('');
$('#az').querySelectorAll('button').forEach(b=>b.onclick=()=>{aLetter=b.dataset.l;$('#az').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderAuthors()});
function yr(s){const c=century(s); if(c===null) return 1e9; const y=parseInt(String(s).replace(/[^0-9]/g,'')); return /a\.C\./.test(s)?-(y||c*100):(y||c*100)}
function life(a){ return a.b? `${a.b}${a.d?' – '+a.d:''}` : '' }
function renderAuthors(){
  const q=norm($('#aQ').value), n=$('#aNac').value, srt=$('#aSort').value;
  let l=AUT.filter(a=>(!q||norm(a.n).includes(q))&&(!n||a.nac===n)&&(!aLetter||norm(a.n)[0].toUpperCase()===aLetter));
  if(srt==='n') l.sort((a,b)=>a.n.localeCompare(b.n,'pt')); if(srt==='c') l.sort((a,b)=>b.books.length-a.books.length||a.n.localeCompare(b.n,'pt')); if(srt==='y') l.sort((a,b)=>yr(a.b)-yr(b.b));
  $('#aCount').textContent=`${fmt(l.length)} ${l.length===1?'autor':'autores'}`;
  const tot=l.length; l=l.slice(0,aLimit); $('#aMore').hidden = tot<=aLimit; $('#aMore').textContent=`Mostrar mais (${fmt(tot-aLimit)} restantes)`;
  $('#aOut').innerHTML = l.length? l.map(a=>`<button class="author" data-a="${a.i}"><span class="an">${esc(a.n)}</span><span class="am">${esc([a.nac,life(a)].filter(Boolean).join(' · '))}</span><span class="ac">${a.books.length} ${a.books.length===1?'livro':'livros'} · ${esc(a.cats.map(c=>CATS[c]).join(', '))}</span></button>`).join('') : `<p class="empty">Nenhum autor encontrado.</p>`;
}
['aQ','aNac','aSort'].forEach(id=>$('#'+id).addEventListener('input',()=>{aLimit=120;renderAuthors()}));
$('#aMore').onclick=()=>{aLimit+=240;renderAuthors()};
$('#aOut').addEventListener('click',e=>{const b=e.target.closest('[data-a]'); if(b) openAuthor(+b.dataset.a)});
function openAuthor(i){
  const a=AUT[i]; show('autores'); $('#aList').hidden=true; const d=$('#aDetail'); d.hidden=false;
  const pages=a.books.reduce((s,b)=>s+b.p,0);
  d.innerHTML=`<div style="display:grid;gap:18px"><button class="back" id="aBack">← Todos os autores</button>
   <div class="panel"><h2 style="font-size:1.7rem">${esc(a.n)}</h2><p class="hint" style="margin:6px 0 0">${esc([a.nac,life(a)].filter(Boolean).join(' · '))} · ${a.books.length} ${a.books.length===1?'livro':'livros'} · ${fmt(pages)} páginas</p></div>
   ${shelf(sortBooks(a.books,'t'))}</div>`;
  $('#aBack').onclick=()=>{d.hidden=true;$('#aList').hidden=false};
}

/* ---- temas ---- */
function renderThemes(){
  $('#tOut').innerHTML=CATS.map((c,i)=>{const l=UNIQ.filter(b=>b.c===i); const subs=new Set(l.map(b=>b.s)).size;
    return `<button class="theme" data-c="${i}" style="--h:${HUE[i]}"><span class="tn">${esc(c)}</span><span class="td">${esc(DESC[i])}</span><span class="tc">${l.length} livros · ${subs} ${subs===1?'gênero':'gêneros'}</span></button>`}).join('');
  const sl=Object.entries(series).filter(([,l])=>l.length>=3).sort((a,b)=>b[1].length-a[1].length).slice(0,90);
  $('#sOut').innerHTML=sl.map(([s,l])=>`<button class="chip" data-s="${esc(s)}">${esc(s)} <span class="n">${l.length}</span></button>`).join('');
}
$('#tOut').addEventListener('click',e=>{const b=e.target.closest('[data-c]'); if(b) openTheme(+b.dataset.c)});
$('#sOut').addEventListener('click',e=>{const b=e.target.closest('[data-s]'); if(b) openSeries(b.dataset.s)});
function themeDetail(html){ show('temas'); $('#tList').hidden=true; const d=$('#tDetail'); d.hidden=false; d.innerHTML=`<div style="display:grid;gap:22px"><button class="back" id="tBack">← Todos os temas</button>${html}</div>`; $('#tBack').onclick=()=>{d.hidden=true;$('#tList').hidden=false} }
function openTheme(i){
  const l=UNIQ.filter(b=>b.c===i); const g={}; l.forEach(b=>(g[b.s] ||= []).push(b));
  const gs=Object.entries(g).sort((a,b)=>b[1].length-a[1].length);
  themeDetail(`<div class="panel" style="border-left:6px solid hsl(${HUE[i]} 45% 46%)"><h2 style="font-size:1.7rem">${esc(CATS[i])}</h2><p class="hint" style="margin:6px 0 10px">${esc(DESC[i])} · ${l.length} livros</p>
    <div class="chips">${gs.map(([s,x])=>`<a class="chip" href="#g-${encodeURIComponent(s)}" data-jump="${esc(s)}">${esc(s)} <span class="n">${x.length}</span></a>`).join('')}</div></div>
    ${gs.map(([s,x])=>`<div class="group" id="g-${esc(s)}"><h3>${esc(s)} <small>${x.length}</small></h3>${shelf(sortBooks(x,'a').slice(0,24))}${x.length>24?`<button class="more" style="margin-top:14px" data-cat="${i}" data-sub="${esc(s)}">Ver os ${fmt(x.length)} livros de ${esc(s)} no catálogo</button>`:''}</div>`).join('')}`);
  $('#tDetail').querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{ show('catalogo'); $('#cCat').value=b.dataset.cat; fillSub(); $('#cSub').value=b.dataset.sub; cLimit=60; renderCatalog(); });
  $('#tDetail').querySelectorAll('[data-jump]').forEach(a=>a.onclick=e=>{e.preventDefault(); document.getElementById('g-'+a.dataset.jump)?.scrollIntoView({behavior:'smooth'})});
}
function openSeries(s){
  const l=[...series[s]].sort((a,b)=>(parseFloat(a.v)||99)-(parseFloat(b.v)||99)||a.t.localeCompare(b.t,'pt'));
  themeDetail(`<div class="panel"><h2 style="font-size:1.7rem">${esc(s)}</h2><p class="hint" style="margin:6px 0 0">${esc([...new Set(l.map(b=>b.an))].join(', '))} · ${l.length} volumes</p></div>${shelf(l)}`);
}

/* ---- pesquisa ---- */
const SUG=['Segunda Guerra','vampiros','Sherlock','Nietzsche','sertão','templários','Harry Potter','Roma','Fundação','espiritismo'];
$('#sugg').innerHTML='<span class="count" style="align-self:center">Experimente:</span>'+SUG.map(s=>`<button class="chip" data-q="${esc(s)}">${esc(s)}</button>`).join('');
$('#sugg').addEventListener('click',e=>{const b=e.target.closest('[data-q]'); if(b){$('#sQ').value=b.dataset.q; renderSearch()}});
function hl(text,q){ if(!q) return esc(text); const n=norm(text); let out='',i=0,k; while((k=n.indexOf(q,i))>-1){ out+=esc(text.slice(i,k))+'<mark>'+esc(text.slice(k,k+q.length))+'</mark>'; i=k+q.length } return out+esc(text.slice(i)) }
function snippet(text,q){ const n=norm(text), k=n.indexOf(q); if(k<0) return text.slice(0,220)+(text.length>220?'…':''); const a=Math.max(0,k-90); return (a?'…':'')+text.slice(a,k+q.length+130)+(k+q.length+130<text.length?'…':'') }
function renderSearch(){
  const q=norm($('#sQ').value.trim()), mn=+$('#pMin').value||0, mx=+$('#pMax').value||1e9, onlySyn=$('#fSyn').checked;
  if(!q && !$('#pMin').value && !$('#pMax').value && !onlySyn){ $('#sCount').textContent='Digite algo para buscar em todo o acervo.'; $('#sOut2').innerHTML=''; return }
  const fT=$('#fT').checked,fA=$('#fA').checked,fS=$('#fS').checked,fSe=$('#fSe').checked;
  const l=UNIQ.map(b=>{ if(b.p<mn||b.p>mx||(onlySyn&&!b.syn)) return null; if(!q) return [b,0];
      let sc=0; if(fT&&norm(b.t).includes(q)) sc+=10; if(fA&&norm(b.an).includes(q)) sc+=8; if(fSe&&norm(b.se+' '+b.ed+' '+b.s).includes(q)) sc+=4; if(fS&&norm(b.syn).includes(q)) sc+=2; return sc?[b,sc]:null })
    .filter(Boolean).sort((a,b)=>b[1]-a[1]||a[0].t.localeCompare(b[0].t,'pt'));
  $('#sCount').textContent=`${fmt(l.length)} ${l.length===1?'resultado':'resultados'}`;
  $('#sOut2').innerHTML = l.length? l.slice(0,150).map(([b])=>`<button class="res" data-b="${b.i}"><span class="mini${capaStyle(b.i)?' img':''}" style="--h:${HUE[b.c]}${capaStyle(b.i)}"></span><span style="min-width:0"><span class="rt">${hl(b.t,q)}</span><br><span class="rm">${hl(b.an,q)} · ${esc(CATS[b.c])} · ${esc(b.s)}${b.se?' · '+hl(b.se,q):''} · ${fmt(b.p)} p.</span>${b.syn&&q&&fS&&norm(b.syn).includes(q)?`<div class="rs">${hl(snippet(b.syn,q),q)}</div>`:''}</span></button>`).join('') : `<p class="empty">Nada encontrado. Tente outra palavra ou desmarque algum filtro.</p>`;
}
['sQ','pMin','pMax','fT','fA','fS','fSe','fSyn'].forEach(id=>$('#'+id).addEventListener('input',renderSearch));

/* ---- estante ---- */
function renderEstante(){
  const l=sortBooks(UNIQ.filter(b=>FAV.has(b.i)),'a');
  $('#eOut').innerHTML = l.length? shelf(l) : `<p class="empty">Sua estante está vazia. Abra qualquer livro e toque em “★ Pôr na estante”.</p>`;
}

/* ---- ficha do livro ---- */
const dlg=$('#dlg');
function openBook(i){
  const b=B[i], a=AUT[b.a], fav=FAV.has(i);
  const facts=[['Categoria',CATS[b.c]],['Gênero',b.s],b.se&&['Série',b.se+(b.v?' · vol. '+b.v:'')],['Autor',[a.nac,life(a)].filter(Boolean).join(' · ')],['Extensão',`${fmt(b.p)} páginas · ${b.h} h de leitura`],['Idioma',b.lang],['Formato',(b.fmt||'').toUpperCase()],['Classificação',b.conf],b.col&&['Veio de',b.col],b.ed&&['Editora',b.ed],b.isbn&&['ISBN',b.isbn],['Arquivo',b.path]].filter(Boolean);
  $('#dlgBody').innerHTML=`<div class="dlg">${cover(b)}<div style="min-width:0"><h2>${esc(b.t)}</h2><p class="by" data-a="${a.i}">${esc(a.n)} →</p>
    <dl class="facts">${facts.map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>${b.obs?`<p class="warn">${esc(b.obs)}</p>`:''}</div>
    <div class="syn">${b.syn?esc(b.syn):'<span style="color:var(--muted)">Este arquivo não traz sinopse.</span>'}</div>
    <div class="dlg-actions"><p class="book-status" id="bookStatus" role="status"></p><button class="btn" id="op">Ler na plataforma</button><button class="btn" id="downloadBook">Baixar arquivo</button><button class="btn" id="cp">Copiar link do livro</button><button class="btn primary" id="fv">${fav?'★ Tirar da estante':'★ Pôr na estante'}</button></div></div>`;
  $('#dlgBody .by').onclick=()=>{dlg.close(); openAuthor(a.i)};
  $('#fv').onclick=()=>{ FAV.has(i)?FAV.delete(i):FAV.add(i); saveFav(); $('#fv').textContent=FAV.has(i)?'★ Tirar da estante':'★ Pôr na estante'; refreshAfterFav() };
  $('#cp').onclick=async()=>{try{await navigator.clipboard.writeText(new URL('index.php#livro='+b.i,location.href).href);$('#cp').textContent='Link copiado'}catch(e){bookStatus('Copie este link: '+new URL('index.php#livro='+b.i,location.href).href)}};
  $('#op').onclick=()=>readBook(b);
  $('#downloadBook').onclick=()=>downloadBook(b);
  if(!dlg.open) dlg.showModal();
}
function refreshAfterFav(){ if(!$('#v-estante').hidden) renderEstante(); if(!$('#v-catalogo').hidden) renderCatalog() }
$('#dlgX').onclick=()=>dlg.close();
dlg.addEventListener('click',e=>{ if(e.target===dlg) dlg.close() });
document.addEventListener('click',e=>{ const b=e.target.closest('[data-b]'); if(b && !dlg.contains(b)) openBook(+b.dataset.b) });

/* ---- início ---- */
fillSub(); renderCatalog(); renderAuthors(); renderThemes(); renderSearch();
drawCharts();
const mq=matchMedia('(prefers-color-scheme: dark)'); mq.addEventListener?.('change',drawCharts);
new MutationObserver(drawCharts).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
(async()=>{
  const h=location.hash.slice(1), m=h.match(/^livro=(\d+)(?:&acao=(\w+))?/);
  if(!m){ show(h||'painel'); return }
  show('catalogo'); const i=+m[1]; if(!B[i]) return;
  openBook(i);
  if(m[2]==='abrir'){ readBook(B[i]); }
})();

}catch(error){const status=document.getElementById('appStatus');status.hidden=false;status.textContent=error.message;}
})();
