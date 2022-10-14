// Responsive tables
$(document).ready(function () {
  $("table")
    .wrap("<div class='table-responsive'></div>")
    .addClass("table table-striped");
});

// Responsive embed videos
$(document).ready(function () {
  const youtube = $('iframe[src*="youtube.com"]');
  youtube.wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
  youtube.addClass("embed-responsive-item");

  const vimeo = $('iframe[src*="youtube.com"]');
  vimeo.wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
  vimeo.addClass("embed-responsive-item");
});

// Navigation Scripts to Show Header on Scroll-Up
$(document).ready(function ($) {
  const minMediaWidth = 1170;

  //primary navigation slide-in effect
  if ($(window).width() > minMediaWidth) {
    const customNavbar = $(".navbar-custom");
    const headerHeight = customNavbar.height();
    const bannerHeight = $(".intro-header .container").height();

    $(window).on("scroll", {previousTop: 0}, () => {
      const currentTop = $(window).scrollTop();
      const catalog = $(".side-catalog");

      //check if user is scrolling up by mouse or keyborad
      if (currentTop < this.previousTop) {
        //if scrolling up...
        if (currentTop > 0 && customNavbar.hasClass("is-fixed")) {
          customNavbar.addClass("is-visible");
        } else {
          customNavbar.removeClass("is-visible is-fixed");
        }
      } else {
        //if scrolling down...
        customNavbar.removeClass("is-visible");
        if (currentTop > headerHeight && !customNavbar.hasClass("is-fixed")) {
          customNavbar.addClass("is-fixed");
        }
      }
      this.previousTop = currentTop;

      //adjust the appearance of side-catalog
      catalog.show();
      if (currentTop > bannerHeight + 41) {
        catalog.addClass("fixed");
      } else {
        catalog.removeClass("fixed");
      }
    });
  }
});
