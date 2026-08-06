/* Our Impact — count-up stats and the annual report page navigation.
   Ported from the design's DCLogic class.

   The counters' final values are already in the HTML, so the numbers are
   correct with scripting off and for anyone on prefers-reduced-motion. */

(function () {
  "use strict";

  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length || !("IntersectionObserver" in window)) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          obs.unobserve(el);

          var target = parseInt(el.dataset.count, 10);
          if (isNaN(target)) return;
          var t0 = performance.now();

          el.textContent = "0";
          (function tick(now) {
            var p = Math.min(1, (now - t0) / 1500);
            el.textContent = Math.round(
              target * (1 - Math.pow(1 - p, 3))
            ).toLocaleString("en-US");
            if (p < 1) requestAnimationFrame(tick);
          })(t0);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (c) {
      obs.observe(c);
    });
  }

  function initReport() {
    var label = document.querySelector("[data-page-label]");
    var index = document.querySelector("[data-page-index]");
    var prev = document.querySelector("[data-page-prev]");
    var next = document.querySelector("[data-page-next]");
    if (!label || !prev || !next) return;

    var pages = [
      "Page 1 — Chairperson's statement",
      "Page 2 — Where we work and who we serve",
      "Page 3 — Programme results against the framework",
      "Page 4 — Safeguarding report",
      "Page 5 — Audited statement of income and expenditure",
      "Page 6 — Partners, donors and acknowledgements",
    ];
    var i = 0;

    function paint() {
      label.textContent = pages[i];
      if (index) index.textContent = i + 1 + " of " + pages.length;
    }

    prev.addEventListener("click", function () {
      i = (i - 1 + pages.length) % pages.length;
      paint();
    });
    next.addEventListener("click", function () {
      i = (i + 1) % pages.length;
      paint();
    });

    paint();
  }

  function init() {
    initCounters();
    initReport();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
