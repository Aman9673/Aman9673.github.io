(function () {
  "use strict";

  /* ---- Sticky Header Blur ---- */
  const header = document.getElementById("header");

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* ---- Mobile Menu ---- */
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");

  menuBtn.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.querySelector("i").className = open ? "ph ph-x" : "ph ph-list";
  });

  mobileNav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.querySelector("i").className = "ph ph-list";
    });
  });

  /* ---- Scroll-triggered Reveal Animations ---- */
  const revealEls = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* Hero intro fades in on load */
  requestAnimationFrame(() => {
    document.querySelectorAll(".hero__intro, .hero__tagline").forEach((el) => {
      if (el) el.classList.add("visible");
    });
  });

  /* ---- Staggered Form Inputs ---- */
  const contactForm = document.getElementById("contactForm");
  const staggerItems = contactForm.querySelectorAll(".stagger-item");

  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          staggerItems.forEach((item, i) => {
            setTimeout(() => item.classList.add("visible"), i * 100);
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  staggerObserver.observe(contactForm);

  /* ---- Gallery Lightbox ---- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const galleryTiles = document.querySelectorAll(".gallery__tile");

  galleryTiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      const img = tile.querySelector("img");
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });

  /* ---- Contact Form Submit ---- */
  const submitBtn = document.getElementById("submitBtn");
  const formFeedback = document.getElementById("formFeedback");
  const FORM_ENDPOINT = "https://formsubmit.co/ajax/amangautam592@gmail.com";
  const defaultBtnHtml = 'Send Message <i class="ph ph-paper-plane-tilt"></i>';

  function showFeedback(message, type) {
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback form-feedback--${type}`;
  }

  function resetSubmitBtn() {
    submitBtn.classList.remove("bounce");
    submitBtn.disabled = false;
    submitBtn.innerHTML = defaultBtnHtml;
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const formData = new FormData(contactForm);
    formData.append("_subject", "Portfolio contact from " + formData.get("name"));
    formData.append("_template", "table");
    formData.append("_captcha", "false");

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending… <i class="ph ph-circle-notch"></i>';
    formFeedback.className = "form-feedback";
    formFeedback.textContent = "";

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send message.");
      }

      submitBtn.classList.add("bounce");
      submitBtn.innerHTML = 'Sent! <i class="ph ph-check"></i>';
      showFeedback("Message sent! I'll get back to you soon.", "success");
      contactForm.reset();

      setTimeout(resetSubmitBtn, 3000);
    } catch (err) {
      showFeedback(err.message || "Something went wrong. Please email me directly.", "error");
      resetSubmitBtn();
    }
  });

  /* ---- Smooth nav active state on scroll ---- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".header__nav .nav-link");

  window.addEventListener(
    "scroll",
    () => {
      let current = "";
      sections.forEach((section) => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) current = section.id;
      });
      navLinks.forEach((link) => {
        link.style.color =
          link.getAttribute("href") === `#${current}` ? "var(--accent)" : "";
      });
    },
    { passive: true }
  );
})();
