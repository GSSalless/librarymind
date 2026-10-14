(async()=>{
 const $=id=>document.getElementById(id), params=new URLSearchParams(location.search);
 const path=params.get('arquivo')||'', title=params.get('titulo')||'Livro', id=params.get('livro');
 $('title').textContent=title;document.title=title+' · LibraryMind';
 if(id&&/^\d+$/.test(id))$('back').href='biblioteca.html#livro='+id;
 const segments=path.split('/');
 if(segments[0]!=='Biblioteca'||segments.some(s=>s==='..'||s==='.'||s.includes('\\'))){$('status').textContent='O caminho do livro é inválido.';return;}
 const url=segments.map(encodeURIComponent).join('/'), ext=path.split('.').pop().toLowerCase();
 const download=$('download');download.href=url;download.download=segments.at(-1);download.hidden=false;
 if(!['pdf','epub'].includes(ext)){$('status').textContent='A leitura na plataforma está disponível para EPUB e PDF. Baixe este formato para abrir em um aplicativo compatível.';return;}
 let book;
 try{
  const response=await fetch(url);if(!response.ok)throw new Error('Arquivo indisponível (HTTP '+response.status+').');
  if(ext==='pdf'){
   $('viewer').classList.add('pdf-viewer');
   const blobUrl=URL.createObjectURL(await response.blob());const frame=document.createElement('iframe');frame.src=blobUrl;frame.title=title;$('viewer').append(frame);
   $('status').textContent='Use os controles do visualizador de PDF do navegador. Se não aparecer, use “Baixar arquivo”.';
   window.addEventListener('pagehide',()=>URL.revokeObjectURL(blobUrl),{once:true});return;
  }
  if(typeof ePub!=='function'||typeof JSZip==='undefined')throw new Error('Não foi possível carregar o leitor EPUB. Atualize a página.');
  book=ePub(await response.arrayBuffer());await book.ready;
  const rendition=book.renderTo('viewer',{width:'100%',flow:'scrolled-doc',fullsize:true,spread:'none',allowScriptedContent:false});
  // Uma coluna vertical. O conteúdo cresce com o capítulo e a página rola naturalmente.
  rendition.themes.default({
   'html':{'overflow-x':'hidden !important'},
   'body':{'padding':'clamp(20px, 6vw, 64px) !important','margin':'0 !important','box-sizing':'border-box !important','line-height':'1.65 !important','overflow-wrap':'anywhere'},
   'img, svg':{'max-width':'100% !important','height':'auto !important','object-fit':'contain !important'},
   'svg image':{'object-fit':'contain !important'},
   'p':{'margin-top':'0 !important','margin-bottom':'0.8em !important'},
   'table':{'max-width':'100% !important'},
   'pre':{'white-space':'pre-wrap !important'}
  });
  rendition.hooks.content.register(contents=>{
   const style=contents.document.createElement('style');
   style.textContent='@media(max-width:600px){p{text-align:start!important}}';
   contents.document.head.appendChild(style);
  });
  const key='librarymind-reading:'  +path;let saved=null;try{saved=localStorage.getItem(key)}catch(e){}
  $('controls').hidden=false;rendition.themes.fontSize($('font').value);
  rendition.on('relocated',location=>{try{localStorage.setItem(key,location.start.cfi)}catch(e){}$('status').textContent='Leia de cima para baixo. Sua posição é salva neste navegador.';$('prev').disabled=location.atStart;$('next').disabled=location.atEnd;});
  rendition.on('displayError',()=>{$('status').textContent='Não foi possível exibir este trecho. Tente outro capítulo ou baixe o arquivo.'});
  const navigate=async target=>{try{await (target==='prev'?rendition.prev():target==='next'?rendition.next():rendition.display(target))}catch(e){$('status').textContent='Não foi possível abrir este trecho do livro.'}};
  $('prev').onclick=()=>navigate('prev');$('next').onclick=()=>navigate('next');
  $('font').onchange=()=>rendition.themes.fontSize($('font').value);
  const navigation=await book.loaded.navigation;
  function addChapters(items,depth=0){for(const chapter of items){const option=document.createElement('option');option.value=chapter.href;option.textContent='— '.repeat(depth)+chapter.label.trim();$('chapters').append(option);if(chapter.subitems)addChapters(chapter.subitems,depth+1)}}
  addChapters(navigation.toc);$('chapters').onchange=()=>navigate($('chapters').value);
  try{await rendition.display(saved||undefined)}catch(e){if(!saved)throw e;await rendition.display()}
  window.addEventListener('pagehide',()=>book.destroy(),{once:true});
 }catch(e){$('status').textContent='Não foi possível abrir o livro. '+e.message;}
})();
