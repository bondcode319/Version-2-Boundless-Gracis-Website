/* ==========================================================================
   BGCF — site behaviour. One file, no dependencies.

   Every block is feature-detected from a data attribute, so each page runs
   only the behaviour it actually contains. Nothing here is required for the
   content to be readable: with scripting off the pages still render, the
   navigation still works, and every form still posts.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* ------------------------------------------------------------------------
     1. Header — solid chrome once scrolled past the hero scrim
     ------------------------------------------------------------------------ */

  var header = $("[data-header]");
  if (header && !header.classList.contains("is-plain")) {
    var onScroll = function () {
      header.classList.toggle("is-solid", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------------
     2. Mega menu — click to open, Escape to close, click-away to close
     ------------------------------------------------------------------------ */

  var megaItems = $$("[data-mega-item]");

  function closeAllMegas(except) {
    megaItems.forEach(function (item) {
      if (item === except) return;
      var trigger = $("[data-mega-trigger]", item);
      var panel = $("[data-mega-panel]", item);
      if (!trigger || !panel) return;
      trigger.setAttribute("aria-expanded", "false");
      panel.removeAttribute("data-open");
    });
  }

  megaItems.forEach(function (item) {
    var trigger = $("[data-mega-trigger]", item);
    var panel = $("[data-mega-panel]", item);
    if (!trigger || !panel) return;

    trigger.addEventListener("click", function () {
      var open = trigger.getAttribute("aria-expanded") === "true";
      closeAllMegas(item);
      trigger.setAttribute("aria-expanded", String(!open));
      if (open) panel.removeAttribute("data-open");
      else panel.setAttribute("data-open", "");
    });

    // Pointer users get hover, which is what they expect from a mega menu,
    // but the click handler above remains the accessible path.
    item.addEventListener("mouseenter", function () {
      if (!window.matchMedia("(hover: hover)").matches) return;
      closeAllMegas(item);
      trigger.setAttribute("aria-expanded", "true");
      panel.setAttribute("data-open", "");
    });

    item.addEventListener("mouseleave", function () {
      if (!window.matchMedia("(hover: hover)").matches) return;
      trigger.setAttribute("aria-expanded", "false");
      panel.removeAttribute("data-open");
    });

    // Tabbing out of the last link in a panel closes it.
    item.addEventListener("focusout", function (e) {
      if (!item.contains(e.relatedTarget)) {
        trigger.setAttribute("aria-expanded", "false");
        panel.removeAttribute("data-open");
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-mega-item]")) closeAllMegas(null);
  });

  /* ------------------------------------------------------------------------
     3. Drawer (mobile navigation)
     ------------------------------------------------------------------------ */

  var drawer = $("[data-drawer]");
  var burger = $("[data-burger]");
  var lastFocus = null;

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.setAttribute("data-open", "");
    document.body.classList.add("is-locked");
    if (burger) burger.setAttribute("aria-expanded", "true");
    var close = $("[data-drawer-close]", drawer);
    if (close) close.focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.removeAttribute("data-open");
    document.body.classList.remove("is-locked");
    if (burger) burger.setAttribute("aria-expanded", "false");
    if (lastFocus) lastFocus.focus();
  }

  if (burger) burger.addEventListener("click", openDrawer);

  if (drawer) {
    $$("[data-drawer-close]", drawer).forEach(function (btn) {
      btn.addEventListener("click", closeDrawer);
    });
    drawer.addEventListener("click", function (e) {
      if (e.target === drawer) closeDrawer();
    });
  }

  /* ------------------------------------------------------------------------
     4. Accordions — drawer sub-menus and FAQ panels share this
     ------------------------------------------------------------------------ */

  $$("[data-acc-trigger]").forEach(function (trigger) {
    var panel = trigger.nextElementSibling;
    if (!panel) return;
    trigger.addEventListener("click", function () {
      var open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
  });

  /* ------------------------------------------------------------------------
     5. Escape closes whatever is open
     ------------------------------------------------------------------------ */

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeAllMegas(null);
    if (drawer && drawer.hasAttribute("data-open")) closeDrawer();
    $$("[data-modal][data-open], .promo[data-open]").forEach(function (m) {
      closeModal(m);
    });
  });

  /* ------------------------------------------------------------------------
     6. Modal helper (team bios, gallery lightbox, promo)
     ------------------------------------------------------------------------ */

  var modalReturn = null;

  function openModal(modal) {
    modalReturn = document.activeElement;
    modal.setAttribute("data-open", "");
    document.body.classList.add("is-locked");
    var close = $("[data-modal-close]", modal);
    if (close) close.focus();
  }

  function closeModal(modal) {
    modal.removeAttribute("data-open");
    document.body.classList.remove("is-locked");
    if (modalReturn) {
      modalReturn.focus();
      modalReturn = null;
    }
  }

  $$("[data-modal], .promo").forEach(function (modal) {
    $$("[data-modal-close]", modal).forEach(function (btn) {
      btn.addEventListener("click", function () { closeModal(modal); });
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal(modal);
    });
    // Keep tab focus inside an open dialog.
    modal.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var focusable = $$(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        modal
      ).filter(function (el) { return el.offsetParent !== null; });
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
  });

  /* ------------------------------------------------------------------------
     7. Reveal on scroll
     ------------------------------------------------------------------------ */

  var revealables = $$("[data-reveal]");
  if (revealables.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry, i) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            window.setTimeout(function () { el.classList.add("is-in"); }, i * 60);
            io.unobserve(el);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ------------------------------------------------------------------------
     8. Count-up numbers
     ------------------------------------------------------------------------ */

  var counters = $$("[data-count]");
  if (counters.length) {
    var runCount = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      if (isNaN(target)) return;
      if (reduceMotion) {
        el.textContent = target.toLocaleString("en-GB");
        return;
      }
      var started = null;
      var duration = 1400;
      var step = function (ts) {
        if (!started) started = ts;
        var p = Math.min((ts - started) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString("en-GB");
        if (p < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCount);
    } else {
      var cio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            runCount(entry.target);
            cio.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ------------------------------------------------------------------------
     9. Hero slider
     ------------------------------------------------------------------------ */

  var slider = $("[data-slider]");
  if (slider) {
    var slides = $$("[data-slide]", slider);
    var panes = $$("[data-pane]", slider);
    var dots = $$("[data-dot]", slider);
    var pause = $("[data-pause]", slider);
    var index = 0;
    var timer = null;
    var playing = !reduceMotion;

    var show = function (i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle("is-active", n === index); });
      panes.forEach(function (p, n) { p.classList.toggle("is-active", n === index); });
      dots.forEach(function (d, n) { d.setAttribute("aria-selected", String(n === index)); });
    };

    var start = function () {
      if (!playing || timer) return;
      timer = window.setInterval(function () { show(index + 1); }, 7000);
    };

    var stop = function () {
      window.clearInterval(timer);
      timer = null;
    };

    dots.forEach(function (dot, n) {
      dot.addEventListener("click", function () {
        show(n);
        stop();
        start();
      });
    });

    if (pause) {
      pause.hidden = false;
      pause.addEventListener("click", function () {
        playing = !playing;
        if (playing) {
          start();
          pause.setAttribute("aria-label", "Pause slideshow");
        } else {
          stop();
          pause.setAttribute("aria-label", "Play slideshow");
        }
        var icon = $("[data-pause-icon]", pause);
        if (icon) icon.src = playing ? "assets/icons/pause-white.svg" : "assets/icons/play-white.svg";
      });
    }

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    show(0);
    start();
  }

  /* ------------------------------------------------------------------------
     10. Team bios
     ------------------------------------------------------------------------ */

  var bioModal = $("[data-bio-modal]");
  if (bioModal) {
    $$("[data-bio]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $("[data-bio-name]", bioModal).textContent = btn.getAttribute("data-name") || "";
        $("[data-bio-role]", bioModal).textContent = btn.getAttribute("data-role") || "";
        $("[data-bio-text]", bioModal).textContent = btn.getAttribute("data-text") || "";
        openModal(bioModal);
      });
    });
  }

  /* ------------------------------------------------------------------------
     11. Gallery — filters and lightbox
     ------------------------------------------------------------------------ */

  var galleryGrid = $("[data-gallery]");
  if (galleryGrid) {
    var figures = $$("[data-gal-item]", galleryGrid);

    $$("[data-gal-filter]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var want = chip.getAttribute("data-gal-filter");
        $$("[data-gal-filter]").forEach(function (c) {
          c.setAttribute("aria-pressed", String(c === chip));
        });
        figures.forEach(function (fig) {
          var tags = fig.getAttribute("data-tags") || "";
          fig.hidden = want !== "all" && tags.indexOf(want) === -1;
        });
      });
    });

    var lightbox = $("[data-lightbox]");
    if (lightbox) {
      var lbImg = $("[data-lightbox-img]", lightbox);
      var lbCap = $("[data-lightbox-cap]", lightbox);
      figures.forEach(function (fig) {
        var btn = fig.querySelector("button");
        if (!btn) return;
        btn.addEventListener("click", function () {
          var img = btn.querySelector("img");
          lbImg.src = img.getAttribute("data-full") || img.src;
          lbImg.alt = img.alt;
          lbCap.textContent = fig.getAttribute("data-caption") || img.alt;
          openModal(lightbox);
        });
      });
    }
  }

  /* ------------------------------------------------------------------------
     12. Donate — amount picker and frequency toggle
     ------------------------------------------------------------------------ */

  var amounts = $("[data-amounts]");
  if (amounts) {
    var custom = $("[data-amount-custom]");
    $$("button", amounts).forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$("button", amounts).forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        if (custom) custom.value = btn.getAttribute("data-value") || "";
      });
    });
  }

  $$("[data-toggle-group]").forEach(function (group) {
    $$("button", group).forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$("button", group).forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        var target = group.getAttribute("data-toggle-group");
        if (!target) return;
        $$('[data-toggle-panel="' + target + '"]').forEach(function (panel) {
          panel.hidden = panel.getAttribute("data-toggle-value") !== btn.getAttribute("data-value");
        });
      });
    });
  });

  /* ------------------------------------------------------------------------
     13. Forms — client-side validation only. Wire to a real endpoint before
         launch; every form posts to thank-you.html on success.
     ------------------------------------------------------------------------ */

  function fieldError(input, message) {
    var holder = input.closest(".field, .fieldset") || input.parentNode;
    var slot = holder.querySelector("[data-err]");
    if (!slot) return;
    slot.textContent = message || "";
    slot.classList.toggle("is-shown", Boolean(message));
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function validate(form) {
    var firstBad = null;
    $$("input, textarea, select", form).forEach(function (input) {
      if (input.type === "hidden" || input.name === "website") return;
      var message = "";
      if (input.required && !input.value.trim()) {
        message = "This field is required.";
      } else if (input.type === "email" && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value)) {
        message = "Enter a valid email address, for example name@example.com.";
      } else if (input.hasAttribute("data-sum")) {
        if (input.value.trim() !== input.getAttribute("data-sum")) {
          message = "That answer is not right — please try again.";
        }
      }
      fieldError(input, message);
      if (message && !firstBad) firstBad = input;
    });

    // Radio groups validate as a set.
    $$("fieldset[data-required-group]", form).forEach(function (set) {
      var checked = set.querySelector("input:checked");
      var slot = set.querySelector("[data-err]");
      if (slot) {
        slot.textContent = checked ? "" : "Choose one option.";
        slot.classList.toggle("is-shown", !checked);
      }
      if (!checked && !firstBad) firstBad = set.querySelector("input");
    });

    return firstBad;
  }

  $$("[data-validate]").forEach(function (form) {
    var status = $("[data-status]", form);

    $$("input, textarea", form).forEach(function (input) {
      input.addEventListener("blur", function () {
        if (input.getAttribute("aria-invalid") === "true") validate(form);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Honeypot: a filled hidden field means a bot, so fail silently.
      var trap = form.querySelector('input[name="website"]');
      if (trap && trap.value) return;

      var bad = validate(form);
      if (bad) {
        if (status) {
          status.textContent = "Please correct the highlighted fields and try again.";
          status.className = "form-status is-error";
        }
        bad.focus();
        return;
      }

      if (status) {
        status.textContent = "Thank you — your message is on its way.";
        status.className = "form-status is-ok";
      }
      var go = form.getAttribute("data-success");
      if (go) window.setTimeout(function () { window.location.href = go; }, 500);
      else form.reset();
    });
  });

  /* ------------------------------------------------------------------------
     14. Promo announcement — shown once per browser session
     ------------------------------------------------------------------------ */

  var promo = $("[data-promo]");
  if (promo) {
    var key = "bgcf-promo-" + (promo.getAttribute("data-promo") || "default");
    var seen = false;
    try { seen = window.sessionStorage.getItem(key) === "1"; } catch (err) { seen = true; }
    if (!seen) {
      window.setTimeout(function () { openModal(promo); }, 2500);
      try { window.sessionStorage.setItem(key, "1"); } catch (err) { /* private mode */ }
    }
  }

  /* ------------------------------------------------------------------------
     15. Current year in the footer
     ------------------------------------------------------------------------ */

  $$("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
