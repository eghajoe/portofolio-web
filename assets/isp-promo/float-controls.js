/* Standalone upgrade: opens the already-installed ISP promo modal and a location dialog. */
(function(){
  'use strict';
  const ispButton=document.getElementById('ea-isp-floating');
  const locationButton=document.getElementById('ea-location-floating');
  const locationDialog=document.getElementById('ea-location-dialog');
  const locationClose=document.getElementById('ea-location-close');
  const locationFrame=document.getElementById('ea-location-map');
  const chatWindow=document.getElementById('chat-window');
  if(ispButton){
    ispButton.addEventListener('click',function(){
      // Trigger the existing handler to preserve original 5-photo slider, tabs and video state.
      const existing=document.querySelector('#ea-isp-inline [data-ea-isp-open="video"]');
      if(existing)existing.click();
      else document.getElementById('paket')?.scrollIntoView({behavior:'smooth'});
    });
  }
  if(!locationButton||!locationDialog||!locationClose)return;
  function openLocation(){
    if(locationFrame && !locationFrame.getAttribute('src')){
      locationFrame.src=locationFrame.dataset.src;
    }
    if(typeof locationDialog.showModal==='function'){
      if(!locationDialog.open)locationDialog.showModal();
    }else locationDialog.setAttribute('open','');
  }
  function closeLocation(){
    if(typeof locationDialog.close==='function'&&locationDialog.open)locationDialog.close();
    else locationDialog.removeAttribute('open');
  }
  locationButton.addEventListener('click',openLocation);
  locationClose.addEventListener('click',closeLocation);
  locationDialog.addEventListener('click',function(ev){if(ev.target===locationDialog)closeLocation();});
  if(chatWindow){
    const syncChat=function(){
      const open=window.getComputedStyle(chatWindow).display!=='none';
      locationButton.classList.toggle('ea-location-chat-open',open);
    };
    const observer=new MutationObserver(syncChat);
    observer.observe(chatWindow,{attributes:true,attributeFilter:['style','class']});
    syncChat();
  }
})();
