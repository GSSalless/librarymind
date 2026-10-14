(()=>{
 const sidebar=document.getElementById('appSidebar'),toggle=document.getElementById('menuToggle'),close=document.getElementById('menuClose'),backdrop=document.getElementById('menuBackdrop');
 const mobile=matchMedia('(max-width:900px)');let open=false;
 function setMenu(value,returnFocus=false){
  open=value&&mobile.matches;document.body.classList.toggle('sidebar-open',open);backdrop.hidden=!open;sidebar.inert=mobile.matches&&!open;toggle.setAttribute('aria-expanded',String(open));
  document.getElementById('mainContent').inert=open;
  if(open)(sidebar.querySelector('[aria-current="page"]')||close).focus();else if(returnFocus&&mobile.matches)toggle.focus();
 }
 toggle.onclick=()=>setMenu(!open,true);close.onclick=()=>setMenu(false,true);backdrop.onclick=()=>setMenu(false,true);
 document.addEventListener('keydown',event=>{
  if(!open)return;
  if(event.key==='Escape'){event.preventDefault();setMenu(false,true);return;}
  if(event.key==='Tab'){
   const items=[...sidebar.querySelectorAll('a,button')].filter(el=>el.getClientRects().length),first=items[0],last=items[items.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
 });
 mobile.addEventListener('change',()=>setMenu(false));
 document.addEventListener('library:viewchange',event=>{
  const active=sidebar.querySelector('[data-v="'+event.detail.view+'"]');
  if(active){document.getElementById('pageTitle').textContent=active.textContent.trim();document.title=active.textContent.trim()+' · LibraryMind';}
  const wasOpen=open;setMenu(false);if(wasOpen)document.getElementById('mainContent').focus({preventScroll:true});
 });
 setMenu(false);
})();
