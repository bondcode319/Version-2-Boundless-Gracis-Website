/* Build a Clinic — the fundraising progress bar fills when it scrolls into
   view. Ported from the design's DCLogic class.

   The bar ships at its real width in the HTML, so the figure is correct with
   scripting off; this only animates it from zero on first sight. */

(function () {
  "use strict";

  function init() {
    var bar = document.querySelector("[data-progress]");
    if (!bar || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var target = bar.dataset.target + "%";
    bar.style.width = "0%";

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          obs.unobserve(e.target);
          requestAnimationFrame(function () { bar.style.width = target; });
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(bar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
