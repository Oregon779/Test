(function () {
  "use strict";

  // Mobile navigation toggle
  var navToggle = document.getElementById("nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.hidden = isOpen;
    });

    mobileMenu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        navToggle.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        navToggle.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
        navToggle.focus();
      }
    });
  }

  // FAQ accordion (pricing page)
  var faqButtons = document.querySelectorAll(".faq-question");
  faqButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var expanded = button.getAttribute("aria-expanded") === "true";
      var panel = document.getElementById(button.getAttribute("aria-controls"));

      faqButtons.forEach(function (otherButton) {
        if (otherButton !== button) {
          otherButton.setAttribute("aria-expanded", "false");
          var otherPanel = document.getElementById(otherButton.getAttribute("aria-controls"));
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      button.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  // Pricing billing toggle (monthly / annual)
  var billingSwitch = document.getElementById("billing-switch");
  var labelMonthly = document.getElementById("label-monthly");
  var labelAnnual = document.getElementById("label-annual");

  if (billingSwitch) {
    billingSwitch.addEventListener("change", function () {
      var isAnnual = billingSwitch.checked;

      if (labelMonthly) labelMonthly.setAttribute("data-active", String(!isAnnual));
      if (labelAnnual) labelAnnual.setAttribute("data-active", String(isAnnual));

      document.querySelectorAll("[data-monthly][data-annual]").forEach(function (el) {
        el.innerHTML = isAnnual ? el.getAttribute("data-annual") : el.getAttribute("data-monthly");
      });
    });
  }

  // Contact form (client-side only: no backend in this static site)
  var contactForm = document.getElementById("contact-form");
  var contactStatus = document.getElementById("form-status");

  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      contactStatus.textContent = "Danke für deine Nachricht! Unser Team meldet sich innerhalb eines Werktags.";
      contactStatus.hidden = false;
      contactForm.reset();
      contactStatus.setAttribute("tabindex", "-1");
      contactStatus.focus();
    });
  }
})();
