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

  // FAQ accordion
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

  // Scroll showcase: pinned card does a dramatic tilt/scale/glow reveal as the section scrolls through view
  var scrollHero = document.querySelector(".scroll-hero");
  var scrollHeroTitle = document.querySelector(".scroll-hero-title");
  var scrollHeroCard = document.querySelector(".scroll-hero-card");
  var scrollHeroGlow = document.querySelector(".scroll-hero-glow");
  var scrollHeroFloats = document.querySelectorAll(".scroll-hero-float");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (scrollHero && scrollHeroTitle && scrollHeroCard && !reducedMotion) {
    var ticking = false;

    var clamp = function (value, min, max) {
      return Math.max(min, Math.min(max, value));
    };

    var lerp = function (start, end, progress) {
      return start + (end - start) * progress;
    };

    var updateScrollHero = function () {
      ticking = false;

      var rect = scrollHero.getBoundingClientRect();
      var viewportHeight = window.innerHeight;
      var scrollable = rect.height - viewportHeight;
      var progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : (rect.top <= 0 ? 1 : 0);

      var isMobile = window.innerWidth < 768;
      var rotate = lerp(55, 0, progress);
      var scale = lerp(isMobile ? 0.78 : 0.6, 1, progress);
      var lift = lerp(70, 0, progress);
      var cardOpacity = lerp(0.3, 1, clamp(progress * 1.6, 0, 1));
      var titleShift = lerp(0, -70, progress);

      scrollHeroCard.style.transform =
        "translateY(" + lift.toFixed(1) + "px) rotateX(" + rotate.toFixed(2) + "deg) scale(" + scale.toFixed(3) + ")";
      scrollHeroCard.style.opacity = cardOpacity.toFixed(3);
      scrollHeroTitle.style.transform = "translateY(" + titleShift.toFixed(1) + "px)";

      if (scrollHeroGlow) {
        var glowScale = lerp(0.7, 1.25, progress);
        var glowOpacity = lerp(0.15, 0.7, progress);
        scrollHeroGlow.style.transform = "translate(-50%, -50%) scale(" + glowScale.toFixed(3) + ")";
        scrollHeroGlow.style.opacity = glowOpacity.toFixed(3);
      }

      scrollHeroFloats.forEach(function (el, index) {
        var start = 0.2 + index * 0.18;
        var floatProgress = clamp((progress - start) / 0.55, 0, 1);
        var dir = el.classList.contains("scroll-hero-float--chat") ? 1 : -1;
        var offset = lerp(46, 0, floatProgress);

        el.style.transform = "translate(" + (dir * offset).toFixed(1) + "px, " + (offset * 0.5).toFixed(1) + "px)";
        el.style.opacity = floatProgress.toFixed(3);
      });
    };

    var onScroll = function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrollHero);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateScrollHero();
  }
})();
