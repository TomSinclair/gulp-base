import $ from 'jquery';

BP.Behaviors.ScrollTo = function(container) {
  const scrollToEl = container.dataset.scrollto;
  const $body = $('html, body');

  const _init = () => {
    container.addEventListener('click', event => {
      event.preventDefault();

      $body.animate({ scrollTop: $(scrollToEl).offset().top - 20 }, 540);
    });
  };

  this.init = function() {
    _init();
  };
};
