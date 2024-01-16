$ (function(){
  var $header = $('.header__top');
  $(window).scroll(function () {
    if ($(window).scrollTop() > 50) {
      $header.addClass('fix');
    } else {
      $header.removeClass('fix');
    }
  });
  $('.reviews__wrapper').slick ({
    dots: true,
    arrows: false,
    fade: true,
/*     autoplay: true,
    autoplaySpeed: 2000 */
  });
  
});

var mixer = mixitup('.categories-pop__items');
