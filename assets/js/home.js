/* Home — hero slider, reveal-on-scroll, counters and the volunteer sign-up.
   Ported from the design's DCLogic class.

   Nothing here is load-bearing: with scripting off the first hero slide, all
   four programme cards, the real counter figures and the form itself are all
   still present and readable. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- slider */

  function initSlider() {
    var root = document.querySelector("[data-bgcf-slider]");
    if (!root) return;

    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-slide]"));
    var panes = Array.prototype.slice.call(root.querySelectorAll("[data-pane]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-dot]"));
    var pause = root.querySelector("[data-pause]");
    var icon = root.querySelector("[data-pause-icon]");
    if (slides.length < 2) return;

    var i = 0;
    var playing = !reduced;
    var timer = null;

    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
      panes.forEach(function (p, k) { p.classList.toggle("is-active", k === i); });
      dots.forEach(function (d, k) {
        d.setAttribute("aria-selected", k === i ? "true" : "false");
      });
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }
    function start() {
      stop();
      timer = setInterval(function () { show(i + 1); }, 7000);
    }

    dots.forEach(function (d, k) {
      d.addEventListener("click", function () {
        show(k);
        if (playing) start();
      });
    });

    if (pause) {
      // Only meaningful once the slideshow can actually run.
      pause.hidden = false;
      pause.addEventListener("click", function () {
        playing = !playing;
        if (playing) start(); else stop();
        pause.setAttribute("aria-label", playing ? "Pause slideshow" : "Play slideshow");
        if (icon) {
          icon.setAttribute("src", "assets/icons/" + (playing ? "pause" : "play") + "-white.svg");
        }
      });
    }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", function () { if (playing) start(); });
    root.addEventListener("focusin", stop);

    show(0);
    if (playing) start();
  }

  /* ---------------------------------------------------------------- reveal */

  function initReveal() {
    if (reduced || !("IntersectionObserver" in window)) return;
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.remove("is-hidden");
          e.target.classList.add("is-revealed");
          obs.unobserve(e.target);
        });
      },
      { threshold: 0.15 }
    );

    els.forEach(function (el) {
      el.classList.add("is-hidden");
      obs.observe(el);
    });
  }

  /* -------------------------------------------------------------- counters */

  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length || reduced || !("IntersectionObserver" in window)) return;

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          obs.unobserve(el);

          var target = parseInt(el.dataset.count, 10);
          if (isNaN(target)) return;
          var t0 = performance.now();

          el.textContent = "0";
          (function tick(now) {
            var p = Math.min(1, (now - t0) / 1600);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased).toLocaleString("en-US");
            if (p < 1) requestAnimationFrame(tick);
          })(t0);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (c) { obs.observe(c); });
  }

  /* ------------------------------------------------------------ vol signup */

  function initVolForm() {
    var form = document.querySelector("[data-vol-form]");
    if (!form) return;
    var status = form.querySelector("[data-vol-status]");

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var inputs = Array.prototype.slice.call(form.querySelectorAll("input[required]"));
      inputs.forEach(function (i) { i.setAttribute("aria-invalid", "false"); });

      var missing = inputs.filter(function (i) {
        return !i.value.trim() || !i.checkValidity();
      });

      if (missing.length) {
        missing.forEach(function (i) { i.setAttribute("aria-invalid", "true"); });
        if (status) status.textContent = "Please complete the highlighted fields with a valid email.";
        missing[0].focus();
        return;
      }

      if (status) {
        status.textContent =
          "Thank you — we have your details and will be in touch within five working days.";
      }
      form.reset();
    });
  }

  function init() {
    initSlider();
    initReveal();
    initCounters();
    initVolForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
