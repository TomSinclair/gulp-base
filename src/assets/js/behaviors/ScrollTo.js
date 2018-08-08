BP.Behaviors.ScrollTo = function(container) {
  const scrollToEl = container.getAttribute('href');
  const $body = $('html, body');

  const _init = () => {
    container.addEventListener('click', event => {
      event.preventDefault();

      $body.animate({ scrollTop: $(scrollToEl).offset().top - 100 }, 540);
    });
  };

  this.init = function() {
    _init();
  };
};
