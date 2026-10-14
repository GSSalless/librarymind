/* Ações web: arquivos servidos pela mesma instalação do LibraryMind. */
function bookUrl(b){return b.path.split('/').map(encodeURIComponent).join('/')}
function bookStatus(message){const el=document.querySelector('#bookStatus');if(el)el.textContent=message}
function readBook(b){
  const url=new URL('leitor.html',location.href);
  url.search=new URLSearchParams({arquivo:b.path,titulo:b.t,livro:b.i});
  location.href=url.href;
}
function downloadBook(b){
  const a=document.createElement('a');a.href=bookUrl(b);a.download=b.path.split('/').pop();
  document.body.appendChild(a);a.click();a.remove();
}
