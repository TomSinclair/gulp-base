BP.Helpers.disableScroll = function() {
  const d = document;
  const dE = d.documentElement;
  const disableScroll = 's-disable-scroll';
  let scrollPosY = window.pageYOffset;

  if (!dE.classList.contains(disableScroll)) {
    dE.classList.add(disableScroll);
    d.body.style.top = `-${scrollPosY}px`;
    localStorage.setItem('scrollPosition', scrollPosY);
  } else {
    dE.classList.remove(disableScroll);
    window.scrollTo(0, localStorage.getItem('scrollPosition'));
    d.body.removeAttribute('style');
  }
};
