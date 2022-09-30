function generateCatalog(selector) {
  $(selector).html('')

  $("div.post-container").find('h1,h2,h3,h4').each(function () {
    const tag = $(this).prop('tagName').toLowerCase();
    const id = "#" + $(this).prop('id');
    const text = $(this).text();
    const link = $('<a href="' + id + '" rel="nofollow">' + text + '</a>');
    const listItem = $('<li class="' + tag + '_nav"></li>').append(link);

    $(selector).append(listItem);
  });
}

generateCatalog(".catalog-body");

// toggle side catalog
$(".catalog-toggle").click((function (e) {
  e.preventDefault();
  $('.side-catalog').toggleClass("fold")
}))
