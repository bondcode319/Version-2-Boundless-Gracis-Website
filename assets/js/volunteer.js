/* Volunteer — the year-by-year mission archive accordion.
   Ported from the design's DCLogic class.

   Every panel ships open, so the whole archive is readable without script;
   collapsing all but the first is this script's opening move. */

(function () {
  "use strict";

  function init() {
    var groups = document.querySelectorAll("[data-year]");
    if (!groups.length) return;

    groups.forEach(function (acc, i) {
      var trigger = acc.querySelector("[data-year-trigger]");
      var panel = acc.querySelector("[data-year-panel]");
      if (!trigger || !panel) return;

      // Leave the most recent year open, collapse the rest.
      var open = i === 0;
      panel.hidden = !open;
      trigger.setAttribute("aria-expanded", open ? "true" : "false");

      trigger.addEventListener("click", function () {
        var willOpen = panel.hidden;
        panel.hidden = !willOpen;
        trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
