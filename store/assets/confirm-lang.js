/* Dil, e-posta şablonundan ?lang= ile gelir; store.js yüklenmeden basılmalı */
(function () {
  var lang = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "tr";
  document.documentElement.lang = lang;
  document.addEventListener("DOMContentLoaded", function () {
    document.body.dataset.lang = lang;
  });
  window.__confirmLang = lang;
})();
