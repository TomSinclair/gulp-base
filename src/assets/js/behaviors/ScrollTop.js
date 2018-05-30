BP.Behaviors.ScrollTop = function(container) {
  const cssClass = 'is-scrolled';
  const headerHeight = container.clientHeight;

  const _handleScroll = () => {
    let scrollPos = getCurrentScroll();

    if (scrollPos >= headerHeight) {
      container.classList.add(cssClass);
    } else {
      container.classList.remove(cssClass);
    }
  };

  const getCurrentScroll = () => {
    return window.pageYOffset || document.documentElement.scrollTop;
  };

  const _init = () => {
    window.addEventListener('scroll', _handleScroll, false);
  };

  this.init = function() {
    _init();
  };
};
