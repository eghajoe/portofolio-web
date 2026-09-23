/* EghaApp STUDIO POS Promo • independent of existing site and chatbot scripts */
(() => {
  'use strict';
  const dialog = document.getElementById('ea-pos-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const video = dialog.querySelector('#ea-pos-video');
  const tabs = [...dialog.querySelectorAll('[data-ea-pos-tab]')];
  const panels = [...dialog.querySelectorAll('[data-ea-pos-panel]')];
  const images = [...dialog.querySelectorAll('.ea-pos-slide')];
  const dots = [...dialog.querySelectorAll('.ea-pos-dot')];
  const count = dialog.querySelector('#ea-pos-counter');
  const viewer = dialog.querySelector('.ea-pos-viewer');
  let current = 0;
  let slideTimer = null;
  let launchButton = null;
  let touchStartX = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function stopSlides() {
    if (slideTimer !== null) window.clearInterval(slideTimer);
    slideTimer = null;
  }
  function renderSlide(index) {
    current = (index + images.length) % images.length;
    images.forEach((img, i) => { img.hidden = i !== current; });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
    if (count) count.textContent = `${current + 1} / ${images.length}`;
  }
  function startSlides() {
    stopSlides();
    if (reducedMotion.matches || !dialog.open || dialog.querySelector('[data-ea-pos-panel="gallery"]').hidden) return;
    slideTimer = window.setInterval(() => renderSlide(current + 1), 5000);
  }
  function selectTab(name) {
    tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.eaPosTab === name)));
    panels.forEach(panel => { panel.hidden = panel.dataset.eaPosPanel !== name; });
    if (name === 'gallery') { video.pause(); startSlides(); }
    else { stopSlides(); }
  }
  function openPromo(trigger, tab = 'video') {
    launchButton = trigger;
    selectTab(tab);
    if (!dialog.open) dialog.showModal();
    if (tab === 'gallery') startSlides();
    dialog.querySelector('.ea-pos-close').focus({preventScroll:true});
  }
  document.querySelectorAll('[data-ea-pos-open]').forEach(button => {
    button.addEventListener('click', () => openPromo(button, button.dataset.eaPosOpen || 'video'));
  });
  dialog.querySelector('.ea-pos-close').addEventListener('click', () => dialog.close());
  tabs.forEach(tab => tab.addEventListener('click', () => selectTab(tab.dataset.eaPosTab)));
  dialog.querySelector('.ea-pos-arrow.prev').addEventListener('click', () => { renderSlide(current - 1); startSlides(); });
  dialog.querySelector('.ea-pos-arrow.next').addEventListener('click', () => { renderSlide(current + 1); startSlides(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { renderSlide(i); startSlides(); }));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { video.pause(); video.currentTime = 0; stopSlides(); launchButton?.focus({preventScroll:true}); });
  dialog.addEventListener('keydown', event => {
    if (dialog.querySelector('[data-ea-pos-panel="gallery"]').hidden) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); renderSlide(current + (event.key === 'ArrowLeft' ? -1 : 1)); startSlides();
    }
  });
  viewer.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') touchStartX = event.clientX; }, {passive:true});
  viewer.addEventListener('pointerup', event => {
    if (touchStartX === null) return;
    const distance = event.clientX - touchStartX; touchStartX = null;
    if (Math.abs(distance) < 42) return;
    renderSlide(current + (distance < 0 ? 1 : -1)); startSlides();
  }, {passive:true});
  viewer.addEventListener('pointercancel', () => {touchStartX = null;});
  viewer.addEventListener('mouseenter', stopSlides);
  viewer.addEventListener('mouseleave', startSlides);
  viewer.addEventListener('focusin', stopSlides);
  viewer.addEventListener('focusout', event => { if (!viewer.contains(event.relatedTarget)) startSlides(); });
  document.addEventListener('visibilitychange', () => {if (document.hidden) { video.pause(); stopSlides(); } else if (dialog.open) startSlides();});
  renderSlide(0);
})();
