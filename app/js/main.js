$ (function(){
  var $header = $('.header__top');
  $(window).scroll(function () {
    if ($(window).scrollTop() > 50) {
      $header.addClass('fix');
    } else {
      $header.removeClass('fix');
    }
  });
});

var mixer = mixitup('.categories-pop__items');
