/* Contact — inline validation and the arithmetic anti-spam check.
   Ported from the design's DCLogic class.

   Client-side only, exactly as the design was. Before launch this must be
   wired to Contact Form 7 or inc/ajax.php with bgcf_verify_request(), a
   honeypot and rate limiting — see the design README §5. */

(function () {
  "use strict";

  function init() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var status = form.querySelector("[data-contact-status]");

    // Fresh sum each load so the answer cannot be hard-coded by a scraper.
    var a = 2 + Math.floor(Math.random() * 8);
    var b = 2 + Math.floor(Math.random() * 8);
    var aEl = form.querySelector("[data-sum-a]");
    var bEl = form.querySelector("[data-sum-b]");
    if (aEl) aEl.textContent = String(a);
    if (bEl) bEl.textContent = String(b);
    var answer = a + b;

    function errFor(field) {
      var p = field.parentElement ? field.parentElement.querySelector("[data-err]") : null;
      if (!p && field.closest("fieldset")) p = field.closest("fieldset").querySelector("[data-err]");
      return p;
    }

    function setErr(field, msg) {
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      var p = errFor(field);
      if (p) p.textContent = msg || "";
      return !msg;
    }

    function validate(field) {
      var v = (field.value || "").trim();

      if (field.type === "radio") {
        var chosen = form.querySelector('input[name="reply"]:checked');
        return setErr(field, chosen ? "" : "Choose phone or email.");
      }
      if (field.hasAttribute("required") && !v) {
        return setErr(field, "This field is required.");
      }
      if (field.type === "email" && v && !field.checkValidity()) {
        return setErr(field, "Enter a valid email address.");
      }
      if (field.id === "c-spam" && v && parseInt(v, 10) !== answer) {
        return setErr(field, "That sum is not right — please try again.");
      }
      return setErr(field, "");
    }

    var fields = Array.prototype.slice
      .call(form.querySelectorAll("input, textarea"))
      .filter(function (f) {
        return f.type !== "radio" || f.value === "phone";
      });

    fields.forEach(function (f) {
      f.addEventListener("blur", function () { validate(f); });
    });

    form.querySelectorAll('input[name="reply"]').forEach(function (r) {
      r.addEventListener("change", function () { validate(r); });
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var bad = fields.filter(function (f) { return !validate(f); });
      if (bad.length) {
        if (status) {
          status.classList.add("is-error");
          status.textContent = "Please correct the highlighted fields.";
        }
        bad[0].focus();
        return;
      }

      if (status) {
        status.classList.remove("is-error");
        status.textContent = "Message sent — thank you. Taking you to the confirmation page…";
      }
      window.setTimeout(function () {
        window.location.href = "thank-you.html";
      }, 1200);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
