// loader.js — entry point CDN. Auto-generado por CI en cada release (no editar a mano).
// Elementor carga SOLO este archivo con @latest; el loader inyecta CSS y JS
// apuntando al tag inmutable correcto, evitando el cache agresivo de assets en @latest.
(function () {
  var v = "1.0.12";
  var base = "https://cdn.jsdelivr.net/gh/karenrebecag/SparkMexico";

  var css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = base + "@" + v + "/dist/landing.css";
  document.head.appendChild(css);

  var js = document.createElement("script");
  js.type = "module";
  js.setAttribute("data-cfasync", "false");
  js.src = base + "@" + v + "/dist/landing.js";
  document.head.appendChild(js);
})();
