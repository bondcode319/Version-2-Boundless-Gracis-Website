/* ==========================================================================
   Boundless Gracia Children's Foundation — shared chrome behaviour
   Enhancement only — nothing here is required to read the page. With
   scripting off the header still renders and the desktop dropdowns still
   open on hover and keyboard focus, because CSS drives them.
   Hooks are data attributes; class names are styling only.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     Sticky header compression
     ------------------------------------------------------------------------ */

  function initStickyHeader() {
    var header = document.querySelector("[data-bgcf-header]");
    if (!header) return;

    var tight = null;
    var queued = false;

    function apply() {
      queued = false;
      var next = window.scrollY > 60;
      if (next === tight) return;
      tight = next;
      header.classList.toggle("is-tight", next);
    }

    window.addEventListener(
      "scroll",
      function () {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(apply);
      },
      { passive: true }
    );

    apply();
  }

  /* ------------------------------------------------------------------------
     Desktop dropdowns

     CSS already opens these on :hover and :focus-within, so this only adds
     click-to-toggle, Escape-to-close, and an aria-expanded value that
     actually tracks the panel.
     ------------------------------------------------------------------------ */

  function initDropdowns() {
    var items = document.querySelectorAll("[data-nav-item]");

    function close(item) {
      item.removeAttribute("data-open");
      var trigger = item.querySelector("[data-nav-link]");
      if (trigger && trigger.hasAttribute("aria-expanded")) {
        trigger.setAttribute("aria-expanded", "false");
      }
    }

    function closeAll(except) {
      Array.prototype.forEach.call(items, function (item) {
        if (item !== except) close(item);
      });
    }

    Array.prototype.forEach.call(items, function (item) {
      var trigger = item.querySelector("[data-nav-link]");
      var panel = item.querySelector("[data-nav-panel]");
      if (!trigger || !panel) return;

      trigger.addEventListener("click", function () {
        var open = item.getAttribute("data-open") !== "true";
        closeAll(item);
        if (open) {
          item.setAttribute("data-open", "true");
          trigger.setAttribute("aria-expanded", "true");
        } else {
          close(item);
        }
      });

      // Let the CSS hover state take back over once the pointer leaves.
      item.addEventListener("mouseleave", function () {
        close(item);
      });

      item.addEventListener("focusin", function () {
        trigger.setAttribute("aria-expanded", "true");
      });

      item.addEventListener("focusout", function (event) {
        if (!item.contains(event.relatedTarget)) close(item);
      });

      item.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        close(item);
        trigger.focus();
      });
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest("[data-nav-item]")) closeAll(null);
    });
  }

  /* ------------------------------------------------------------------------
     Mobile drawer + its accordions

     Like any hamburger menu this needs script to open. The page content
     itself does not: it is plain flow markup, and the footer carries a full
     sitemap for anyone the drawer fails.
     ------------------------------------------------------------------------ */

  function initDrawer() {
    var burger = document.querySelector("[data-bgcf-burger]");
    var drawer = document.querySelector("[data-bgcf-drawer]");

    document.querySelectorAll("[data-acc]").forEach(function (group) {
      var trigger = group.querySelector("[data-acc-trigger]");
      var panel = group.querySelector("[data-acc-panel]");
      if (!trigger || !panel) return;

      trigger.addEventListener("click", function () {
        var open = panel.hidden;
        panel.hidden = !open;
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });

    if (!burger || !drawer) return;

    burger.addEventListener("click", function () {
      var open = drawer.hidden;
      drawer.hidden = !open;
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");

      var icon = burger.querySelector("[data-burger-icon]");
      if (icon) {
        icon.setAttribute(
          "src",
          "assets/icons/" + (open ? "close" : "menu") + "-white.svg"
        );
      }
    });

    // Close the drawer if the viewport grows past the desktop breakpoint
    // while it is open, so the burger state can't get stranded.
    var desktop = window.matchMedia("(min-width: 1024px)");
    var onChange = function (event) {
      if (!event.matches || drawer.hidden) return;
      drawer.hidden = true;
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu");
      var icon = burger.querySelector("[data-burger-icon]");
      if (icon) icon.setAttribute("src", "assets/icons/menu-white.svg");
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
  }

  function init() {
    initStickyHeader();
    initDropdowns();
    initDrawer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
