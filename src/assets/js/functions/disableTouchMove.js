BP.Functions.disableTouchMove = function() {
  document.ontouchmove = function(event) {
    var isTouchMoveAllowed = true;
    var target = event.target;

    while (target !== null) {
      if (
        document.documentElement.classList.contains('s-disable-touchmove') &&
        target.id === 'content'
      ) {
        isTouchMoveAllowed = false;
        break;
      }
      target = target.parentNode;
    }

    if (!isTouchMoveAllowed) {
      event.preventDefault();
    }
  };
};
