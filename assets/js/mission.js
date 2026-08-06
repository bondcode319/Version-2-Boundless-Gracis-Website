/* Outreach Missions — application form validation.
   Ported from the design's DCLogic class. Client-side only, as the design
   was; wire to the backend with bgcf_verify_request(), a honeypot and rate
   limiting before launch. */

(function () {
  "use strict";

  function init() {
    var form = document.querySelector("[data-mission-form]");
    if (!form) return;

    var status = form.querySelector("[data-form-status]");

    function errFor(field) {
      var wrap = field.parentElement;
      return wrap ? wrap.querySelector("[data-err]") : null;
    }

    function setErr(field, msg) {
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      var p = errFor(field);
      if (p) p.textContent = msg || "";
      return !msg;
    }

    function validate(field) {
      var v = (field.value || "").trim();

      if (field.hasAttribute("required") && !v) {
        return setErr(field, "This field is required.");
      }
      if (field.type === "email" && v && !field.checkValidity()) {
        return setErr(field, "Enter a valid email address.");
      }
      if (field.dataset.match) {
        var other = document.getElementById(field.dataset.match);
        if (other && other.value.trim() !== v) {
          return setErr(field, "The two email addresses do not match.");
        }
      }
      if (field.type === "tel" && v && v.replace(/[^0-9]/g, "").length < 8) {
        return setErr(field, "Enter a full phone number including country code.");
      }
      return setErr(field, "");
    }

    var fields = Array.prototype.slice.call(
      form.querySelectorAll("input, select, textarea")
    );

    fields.forEach(function (f) {
      f.addEventListener("blur", function () { validate(f); });
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var bad = fields.filter(function (f) { return !validate(f); });
      if (bad.length) {
        if (status) {
          status.classList.add("is-error");
          status.textContent =
            bad.length + " field(s) need attention before we can accept this application.";
        }
        bad[0].focus();
        return;
      }

      if (status) {
        status.classList.remove("is-error");
        status.textContent = "Application received — taking you to the confirmation page…";
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
