/* ISP promo lives inside the current #paket section; does not change POS modal/chatbot. */
(function(){
  'use strict';
  const inline=document.getElementById('ea-isp-inline');
  const dialog=document.getElementById('ea-isp-dialog');
  if(!inline||!dialog)return;
  const video=dialog.querySelector('video');
  const tabs=[...dialog.querySelectorAll('[data-ea-isp-tab]')];
  const panels=[...dialog.querySelectorAll('[data-ea-isp-panel]')];
  const slides=[...dialog.querySelectorAll('.ea-isp-slide')];
  const dots=[...dialog.querySelectorAll('.ea-isp-dot')];
  const viewer=dialog.querySelector('.ea-isp-viewer');
  const counter=dialog.querySelector('.ea-isp-counter');
  let active=0,timer=null,tab='video',touchX=null;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  function stop(){if(timer){clearInterval(timer);timer=null;}}
  function show(index){
    active=(index+slides.length)%slides.length;
    slides.forEach((el,i)=>{el.hidden=i!==active;});
    dots.forEach((el,i)=>{el.setAttribute('aria-current',i===active?'true':'false');});
    counter.textContent='Foto '+(active+1)+' dari '+slides.length;
  }
  function run(){stop();if(tab==='galeri'&&dialog.open&&!document.hidden&&!reduceMotion.matches){timer=setInterval(()=>show(active+1),5500);}}
  function choose(which){
    tab=which;
    tabs.forEach(el=>el.setAttribute('aria-pressed',el.dataset.eaIspTab===which?'true':'false'));
    panels.forEach(el=>{el.hidden=el.dataset.eaIspPanel!==which;});
    if(which!=='video'){video.pause();show(active);} else stop();
    run();
  }
  function open(which){
    choose(which);
    if(typeof dialog.showModal==='function'){if(!dialog.open)dialog.showModal();}
    else dialog.setAttribute('open','');
    run();
  }
  function close(){stop();video.pause();if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open');}
  inline.querySelectorAll('[data-ea-isp-open]').forEach(el=>el.addEventListener('click',()=>open(el.dataset.eaIspOpen)));
  dialog.querySelector('.ea-isp-close').addEventListener('click',close);
  tabs.forEach(el=>el.addEventListener('click',()=>choose(el.dataset.eaIspTab)));
  dialog.querySelector('.ea-isp-arrow.prev').addEventListener('click',()=>{show(active-1);run();});
  dialog.querySelector('.ea-isp-arrow.next').addEventListener('click',()=>{show(active+1);run();});
  dots.forEach((el,i)=>el.addEventListener('click',()=>{show(i);run();}));
  viewer.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(active+(event.key==='ArrowLeft'?-1:1));run();}
  });
  viewer.addEventListener('touchstart',event=>{if(event.changedTouches.length===1)touchX=event.changedTouches[0].screenX;},{passive:true});
  viewer.addEventListener('touchend',event=>{
    if(touchX===null||event.changedTouches.length!==1)return;
    const diff=event.changedTouches[0].screenX-touchX;touchX=null;
    if(Math.abs(diff)>35){show(active+(diff<0?1:-1));run();}
  },{passive:true});
  dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
  dialog.addEventListener('close',()=>{stop();video.pause();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();video.pause();}else run();});
  show(0);
})();
