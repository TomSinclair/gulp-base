BP.Behaviors.ToggleNavigation = function(container) {
  const d = document;
  const dE = d.documentElement;
  const efficientResize = BP.Helpers.debounce(function() {
    _handleResize();
  }, 250);
  const btns = document.querySelectorAll('[data-menuToggle]');

  const _handleResize = () => {
    if (BP.Helpers.is_desktop() || BP.Helpers.is_widescreen()) {
      dE.classList.remove('s-menu-open');
      container.classList.remove('is-active');
    }
  };

  const _handleClicks = event => {
    event.preventDefault();

    dE.classList.toggle('s-menu-open');
    container.classList.toggle('is-active');
  };

  const _init = () => {
    btns.forEach(function(btn) {
      btn.addEventListener('click', _handleClicks);
    });

    window.addEventListener('resize', efficientResize);
  };

  this.init = function() {
    _init();
  };
};
