/**
 * Asha Tuition Bureau — Main JavaScript
 * Handles: loader, navbar, theme, form, slider, counters, scroll animations
 */

(function () {
  "use strict";

  /* --- DOM References --- */
  const loader = document.getElementById("loader");
  const header = document.getElementById("header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navOverlay = document.getElementById("nav-overlay");
  const navLinks = document.querySelectorAll(".nav__link");
  const themeToggle = document.getElementById("theme-toggle");
  const tuitionForm = document.getElementById("tuitionForm");
  const submitRequirement = document.getElementById("submitRequirement");
  const testimonialTrack = document.getElementById("testimonial-track");
  const testimonialPrev = document.getElementById("testimonial-prev");
  const testimonialNext = document.getElementById("testimonial-next");
  const testimonialDots = document.getElementById("testimonial-dots");
  const yearEl = document.getElementById("year");

  /* ==========================================================================
     LOADING SCREEN
     ========================================================================== */
  function initLoader() {
    window.addEventListener("load", function () {
      setTimeout(function () {
        document.body.classList.add("loaded");
      }, 800);
    });

    // Fallback if load event already fired
    if (document.readyState === "complete") {
      setTimeout(function () {
        document.body.classList.add("loaded");
      }, 800);
    }
  }

  /* ==========================================================================
     STICKY NAVBAR + SCROLL STATE
     ========================================================================== */
  function initHeader() {
    function onScroll() {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ==========================================================================
     MOBILE MENU
     ========================================================================== */
  function openMenu() {
    navMenu.classList.add("open");
    navOverlay.classList.add("visible");
    navToggle.classList.add("active");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    navMenu.classList.remove("open");
    navOverlay.classList.remove("visible");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("menu-open");
  }

  function initMobileMenu() {
    if (!navToggle) return;

    navToggle.addEventListener("click", function () {
      if (navMenu.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navOverlay.addEventListener("click", closeMenu);

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) {
        closeMenu();
      }
    });
  }

  /* ==========================================================================
     SMOOTH SCROLL + ACTIVE NAV LINK
     ========================================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#" || href.length < 2) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const offset = header.offsetHeight + 12;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });

    // Highlight active section in nav
    const sections = document.querySelectorAll("section[id]");

    function setActiveLink() {
      const scrollPos = window.scrollY + 120;

      sections.forEach(function (section) {
        const id = section.getAttribute("id");
        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(function (link) {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + id) {
              link.classList.add("active");
            }
          });
        }
      });
    }

    window.addEventListener("scroll", setActiveLink, { passive: true });
    setActiveLink();
  }

  /* ==========================================================================
     DARK MODE TOGGLE
     ========================================================================== */
  function initTheme() {
    const saved = localStorage.getItem("asha-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.setAttribute("data-theme", "dark");
    }

    themeToggle.addEventListener("click", function () {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("asha-theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("asha-theme", "dark");
      }
    });
  }

  /* ==========================================================================
     TUITION FORM → WHATSAPP ENQUIRY
     Opens https://wa.me/ with pre-filled message (no backend)
     ========================================================================== */
  const WHATSAPP_ENQUIRY_NUMBER = "917755039996";
  const WHATSAPP_REDIRECT_MS = 1000;

  function getFormFieldValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function getSelectedTuitionType(form) {
    const selected = form.querySelector('input[name="tuitionType"]:checked');
    return selected ? selected.value : "";
  }

  function buildWhatsAppEnquiryMessage(form) {
    const studentName = getFormFieldValue("student-name");
    const parentNumber = getFormFieldValue("parent-contact");
    const studentClass = getFormFieldValue("class");
    const subject = getFormFieldValue("subject");
    const area = getFormFieldValue("area");
    const timing = getFormFieldValue("timing") || "Not specified";
    const tuitionType = getSelectedTuitionType(form);

    const message =
      "• New Tuition Enquiry\n\n" +
      "• Student Name: " + studentName + "\n" +
      "• Parent Contact: " + parentNumber + "\n" +
      "• Class: " + studentClass + "\n" +
      "• Subject: " + subject + "\n" +
      "• Area: " + area + "\n" +
      "• Preferred Timing: " + timing + "\n" +
      "• Tuition Type: " + tuitionType;

    return message;
  }

  function buildWhatsAppUrl(message) {
    return (
      "https://wa.me/" +
      WHATSAPP_ENQUIRY_NUMBER +
      "?text=" +
      encodeURIComponent(message)
    );
  }

  function setSubmitButtonState(state) {
    if (!submitRequirement) return;
    submitRequirement.classList.remove("is-loading", "is-success");
    if (state) {
      submitRequirement.classList.add(state);
    }
    submitRequirement.disabled = state === "is-loading";
  }

  function openWhatsAppEnquiry(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function resetTuitionFormDefaults(form) {
    form.reset();
    const homeRadio = form.querySelector('input[value="Home Tuition"]');
    if (homeRadio) {
      homeRadio.checked = true;
    }
  }

  function initTuitionForm() {
    if (!tuitionForm || !submitRequirement) return;

    tuitionForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!tuitionForm.checkValidity()) {
        tuitionForm.reportValidity();
        return;
      }

      const message = buildWhatsAppEnquiryMessage(tuitionForm);
      const whatsappUrl = buildWhatsAppUrl(message);

      setSubmitButtonState("is-loading");

      setTimeout(function () {
        openWhatsAppEnquiry(whatsappUrl);
        setSubmitButtonState("is-success");

        setTimeout(function () {
          setSubmitButtonState(null);
          resetTuitionFormDefaults(tuitionForm);
        }, 2200);
      }, WHATSAPP_REDIRECT_MS);
    });
  }

  /* ==========================================================================
     TESTIMONIAL SLIDER
     ========================================================================== */
  function initTestimonialSlider() {
    const cards = testimonialTrack.querySelectorAll(".testimonial-card");
    const total = cards.length;
    let current = 0;
    let autoplayTimer;

    // Build dots
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("button");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Review " + (i + 1));
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", function () {
        goTo(i);
        resetAutoplay();
      });
      testimonialDots.appendChild(dot);
    }

    const dots = testimonialDots.querySelectorAll("button");

    function goTo(index) {
      current = (index + total) % total;
      testimonialTrack.style.transform = "translateX(-" + current * 100 + "%)";
      dots.forEach(function (d, i) {
        d.classList.toggle("active", i === current);
      });
    }

    function next() {
      goTo(current + 1);
    }

    function prev() {
      goTo(current - 1);
    }

    testimonialNext.addEventListener("click", function () {
      next();
      resetAutoplay();
    });

    testimonialPrev.addEventListener("click", function () {
      prev();
      resetAutoplay();
    });

    // Touch swipe support
    let touchStartX = 0;
    testimonialTrack.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    testimonialTrack.addEventListener(
      "touchend",
      function (e) {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) next();
          else prev();
          resetAutoplay();
        }
      },
      { passive: true }
    );

    function startAutoplay() {
      autoplayTimer = setInterval(next, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    startAutoplay();

    // Pause on hover (desktop)
    const slider = document.querySelector(".testimonial-slider");
    slider.addEventListener("mouseenter", function () {
      clearInterval(autoplayTimer);
    });
    slider.addEventListener("mouseleave", startAutoplay);
  }

  /* ==========================================================================
     ANIMATED COUNTERS
     ========================================================================== */
  function initCounters() {
    const statNumbers = document.querySelectorAll(".stat-item__number");
    let animated = false;

    function animateCounter(el) {
      const target = parseInt(el.getAttribute("data-target"), 10);
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = value + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + suffix;
        }
      }

      requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !animated) {
            animated = true;
            statNumbers.forEach(animateCounter);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsSection = document.getElementById("stats");
    if (statsSection) observer.observe(statsSection);
  }

  /* ==========================================================================
     SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  function initReveal() {
    const reveals = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ==========================================================================
     FOOTER YEAR
     ========================================================================== */
  function initYear() {
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     INIT
     ========================================================================== */
  function init() {
    initLoader();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initTheme();
    initTuitionForm();
    initTestimonialSlider();
    initCounters();
    initReveal();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
