function htmlDecode(input) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = input;

  return textarea.childNodes.length === 0 ? "" : textarea.childNodes[0].nodeValue;
}

SimpleJekyllSearch({
  searchInput: document.getElementById("search-input"),
  resultsContainer: document.getElementById("search-results"),
  json: "/index.json",
  searchResultTemplate:
    '<div class="post-preview item">' +
    '  <a href="{url}">' +
    '    <h2 class="post-title">{title}</h2>' +
    '    <h3 class="post-subtitle">{subtitle}</h3>' +
    '    <hr>' +
    '  </a>' +
    '</div>',
  noResultsText: "No results ¯\\_(ツ)_/¯",
  limit: 50,
  fuzzy: false,
  templateMiddleware: function (prop, value) {
    if (prop === 'subtitle' || prop === 'title') {
      return value.indexOf("code") ? htmlDecode(value) : value;
    }
  }
});

$(document).ready(function () {
  const searchPage = $(".search-page");
  const searchOpen = $(".search-icon");
  const searchClose = $(".search-icon-close");
  const searchInput = $("#search-input");
  const body = $("body");

  searchOpen.on("click", function (element) {
    element.preventDefault();
    searchPage.toggleClass("search-active");
    const prevClasses = body.attr("class") || "";

    setTimeout(function () {
      body.addClass("no-scroll");
    }, 400)

    if (searchPage.hasClass("search-active")) {
      searchClose.on("click", function (element) {
        element.preventDefault();
        searchPage.removeClass("search-active");
        body.attr("class", prevClasses);
      });
      searchInput.focus();
    }
  });
});
