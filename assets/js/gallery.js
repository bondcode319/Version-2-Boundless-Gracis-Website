/* Gallery — Load More and the lightbox.
   Ported from the design's DCLogic class. Simpler than the original because
   these are real <img> elements rather than <image-slot> custom elements, so
   the stage can read src directly instead of reaching into a shadow root.

   Without script the page still shows the first batch of photographs and
   every caption; only the "show the rest" and zoom affordances are lost. */

(function () {
  "use strict";

  function init() {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-item]"));
    if (!items.length) return;

    var status = document.querySelector("[data-load-status]");
    var more = document.querySelector("[data-load-more]");
    var total = items.length;

    // The markup ships every photograph visible and the button hidden, so a
    // reader without script sees the whole set rather than half of it.
    // Collapsing to the first batch is this script's first act.
    if (more) {
      var batched = items.filter(function (i) { return i.dataset.batch === "2"; });
      if (batched.length) {
        batched.forEach(function (i) { i.hidden = true; });
        more.hidden = false;
        if (status) {
          status.textContent =
            "Showing " + (total - batched.length) + " of " + total + " photographs";
        }
      }

      more.addEventListener("click", function () {
        items.forEach(function (item) {
          if (item.dataset.batch === "2") item.hidden = false;
        });
        more.hidden = true;
        if (status) status.textContent = "Showing " + total + " of " + total + " photographs";
      });
    }

    var lb = document.querySelector("[data-lightbox]");
    if (!lb) return;

    var stage = lb.querySelector("[data-lb-stage]");
    var caption = lb.querySelector("[data-lb-caption]");
    var indexLabel = lb.querySelector("[data-lb-index]");
    var closeBtn = lb.querySelector("[data-lb-close]");
    var current = 0;
    var lastFocus = null;

    function visible() {
      return items.filter(function (i) {
        return !i.hidden;
      });
    }

    function paint() {
      var list = visible();
      var item = list[current];
      if (!item) return;

      var source = item.querySelector("img");
      var cap = item.querySelector("figcaption");

      stage.innerHTML = "";
      if (source) {
        var img = document.createElement("img");
        img.src = source.currentSrc || source.src;
        img.alt = source.alt || "";
        stage.appendChild(img);
      }
      if (caption) caption.textContent = cap ? cap.textContent : "";
      if (indexLabel) indexLabel.textContent = current + 1 + " of " + list.length;
    }

    function open(i) {
      current = i;
      lastFocus = document.activeElement;
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      paint();
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      lb.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    function step(d) {
      var list = visible();
      current = (current + d + list.length) % list.length;
      paint();
    }

    items.forEach(function (item) {
      var btn = item.querySelector("[data-open]");
      if (!btn) return;
      btn.addEventListener("click", function () {
        open(visible().indexOf(item));
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", close);
    lb.querySelector("[data-lb-prev]").addEventListener("click", function () { step(-1); });
    lb.querySelector("[data-lb-next]").addEventListener("click", function () { step(1); });
    lb.addEventListener("click", function (e) {
      if (e.target === lb) close();
    });

    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
