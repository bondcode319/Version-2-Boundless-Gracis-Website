/* Sponsor a Child — age and programme filters.
   Ported from the design's DCLogic class. Uses the hidden attribute rather
   than inline display so the card's own flex layout is untouched, and the
   empty-state message is a real status region. */

(function () {
  "use strict";

  function init() {
    var age = document.querySelector("[data-filter-age]");
    var prog = document.querySelector("[data-filter-prog]");
    var count = document.querySelector("[data-filter-count]");
    var empty = document.querySelector("[data-filter-empty]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-child]"));
    if (!age || !prog || !cards.length) return;

    function apply() {
      var shown = 0;

      cards.forEach(function (card) {
        var ok =
          (age.value === "all" || card.dataset.band === age.value) &&
          (prog.value === "all" || card.dataset.prog === prog.value);
        card.hidden = !ok;
        if (ok) shown++;
      });

      if (count) {
        count.textContent = "Showing " + shown + " of " + cards.length + " children";
      }
      if (empty) empty.hidden = shown > 0;
    }

    age.addEventListener("change", apply);
    prog.addEventListener("change", apply);
    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
