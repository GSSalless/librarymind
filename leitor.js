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
   const blobUrl=URL.createObjectURL(await response.blob());const frame=document.createElement('iframe');frame.src=blobUrl;frame.title=title;$('viewer').append(frame);
   $('status').textContent='Use os controles do visualizador de PDF do navegador. Se não aparecer, use “Baixar arquivo”.';
   window.addEventListener('pagehide',()=>URL.revokeObjectURL(blobUrl),{once:true});return;
  }
  if(typeof ePub!=='function'||typeof JSZip==='undefined')throw new Error('Não foi possível carregar o leitor EPUB. Atualize a página.');
  book=ePub(await response.arrayBuffer());await book.ready;
  const rendition=book.renderTo('viewer',{width:'100%',height:'100%',spread:'none',allowScriptedContent:false});
  const key='librarymind-reading:'+path;let saved=null;try{saved=localStorage.getItem(key)}catch(e){}
  $('controls').hidden=false;rendition.themes.fontSize($('font').value);
  rendition.on('relocated',location=>{try{localStorage.setItem(key,location.start.cfi)}catch(e){}$('status').textContent='Sua posição é salva neste navegador.';$('prev').disabled=location.atStart;$('next').disabled=location.atEnd;});
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
