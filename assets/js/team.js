/* Our Team — bio modal.
   Ported from the design's DCLogic class. Content comes from data-* on each
   trigger, so the bios live in the markup and stay readable without script. */

(function () {
  "use strict";

  function init() {
    var modal = document.querySelector("[data-modal]");
    if (!modal) return;

    var nameEl = modal.querySelector("[data-modal-name]");
    var roleEl = modal.querySelector("[data-modal-role]");
    var textEl = modal.querySelector("[data-modal-text]");
    var closeBtn = modal.querySelector("[data-modal-close]");
    var lastFocus = null;

    function close() {
      modal.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    document.querySelectorAll("[data-bio]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lastFocus = btn;
        if (nameEl) nameEl.textContent = btn.dataset.name || "";
        if (roleEl) roleEl.textContent = btn.dataset.role || "";
        if (textEl) textEl.textContent = btn.dataset.text || "";
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        if (closeBtn) closeBtn.focus();
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", close);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!modal.hidden && e.key === "Escape") close();
    });

    // Keep focus inside the dialog while it is open.
    modal.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || modal.hidden) return;
      var focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
