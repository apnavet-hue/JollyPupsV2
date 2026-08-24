// Paste the deployed Google Apps Script Web App URL here after setup.
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxtk1_Vgil3cA7WaUumtSpvLlc-5EcHmSNGE_95X8Q9dRGVJi8NMzvuDHEZ7EMgESHC/exec";
const cleanPageSlugs = new Set(["services", "marketplace", "contact", "privacy", "faqs", "terms"]);

const getSiteBasePath = () => {
  if (window.location.protocol === "file:") {
    return "";
  }

  const pathname = window.location.pathname.replace(/\/+$/, "");
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "";

  if (segments[0] === "services" && segments.length > 1) {
    return "/";
  }

  if (lastSegment.includes(".") || cleanPageSlugs.has(lastSegment)) {
    segments.pop();
  }

  return segments.length ? `/${segments.join("/")}/` : "/";
};

const getCurrentPage = () => {
  const pathname = window.location.pathname.replace(/\/+$/, "");
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "";

  if (segments[0] === "services" && segments.length > 1) {
    return "services.html";
  }

  if (cleanPageSlugs.has(lastSegment)) {
    return `${lastSegment}.html`;
  }

  return lastSegment.endsWith(".html") ? lastSegment : "index.html";
};

const resolveSitePath = (path) => {
  const basePath = getSiteBasePath();
  return `${basePath}${path}`.replace(/\/{2,}/g, "/");
};

const applyCleanRoutes = () => {
  const routes = {
    home: "",
    services: "services/",
    marketplace: "marketplace/",
    contact: "contact/",
    privacy: "privacy/",
    faqs: "faqs/",
    terms: "terms/",
    about: "#about",
    shop: "marketplace/#shop",
  };

  document.querySelectorAll("[data-route]").forEach((link) => {
    const route = routes[link.dataset.route];
    if (route !== undefined) {
      link.href = resolveSitePath(route);
    }
  });

  document.querySelectorAll("[data-asset]").forEach((asset) => {
    asset.src = resolveSitePath(asset.dataset.asset);
  });

  document.querySelectorAll("[data-srcset]").forEach((asset) => {
    asset.srcset = asset.dataset.srcset
      .split(",")
      .map((candidate) => {
        const [path, descriptor] = candidate.trim().split(/\s+/);
        return `${resolveSitePath(path)} ${descriptor}`;
      })
      .join(", ");
  });
};

const redirectLegacyHtmlPath = () => {
  if (window.location.protocol === "file:") {
    return;
  }

  const legacyRoutes = {
    "services.html": "services/",
    "marketplace.html": "marketplace/",
    "contact.html": "contact/",
    "privacy.html": "privacy/",
    "faqs.html": "faqs/",
    "terms.html": "terms/",
  };
  const currentFile = window.location.pathname.split("/").pop();
  const cleanRoute = legacyRoutes[currentFile];

  if (cleanRoute) {
    window.location.replace(`${resolveSitePath(cleanRoute)}${window.location.hash}`);
  }
};

const initSharedHeader = () => {
  applyCleanRoutes();

  const currentPage = getCurrentPage();
  const hasBookingModal = Boolean(document.querySelector(".booking-modal"));
  const headerAction = currentPage === "marketplace.html" ? "bag" : hasBookingModal ? "book" : "";

  document.querySelectorAll("[data-header-action]").forEach((action) => {
    action.hidden = action.dataset.headerAction !== headerAction;
  });

  document.querySelectorAll(".main-nav a").forEach((link) => {
    const [linkPage = "index.html", linkHash = ""] = (link.dataset.page || link.getAttribute("href")).split("#");
    const isSamePage = (linkPage || "index.html") === currentPage;
    const isActive =
      isSamePage && (currentPage !== "index.html" || !linkHash || `#${linkHash}` === window.location.hash);

    link.classList.toggle("nav-active", isActive);
  });
};

const initPage = () => {
redirectLegacyHtmlPath();
initSharedHeader();

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const modal = document.querySelector(".booking-modal");
const modalClose = document.querySelector(".modal-close");
const bookingForm = document.querySelector(".booking-form");
const toast = document.querySelector(".toast");
const whatsapp = document.querySelector(".whatsapp-pill");
const contactForm = document.querySelector(".contact-form");
const cartCount = document.querySelector(".cart-count");
const cartLabel = document.querySelector(".cart-label");
const locationField = document.querySelector(".service-location-field");
const serviceLocationSelect = document.querySelector("[name='serviceLocation']");
const preferredDateInput = document.querySelector("[name='preferredDate']");
const locationChoiceServices = new Set([
  "Grooming",
  "Vet consultation",
  "Vaccinations",
  "Training",
]);

const updateServiceLocationField = () => {
  const careSelect = modal?.querySelector("[name='care']");
  if (!careSelect || !locationField || !serviceLocationSelect) return;

  const needsLocationChoice = locationChoiceServices.has(careSelect.value);
  locationField.hidden = !needsLocationChoice;
  serviceLocationSelect.required = needsLocationChoice;

  if (!needsLocationChoice) {
    serviceLocationSelect.value = "";
  }
};

const syncPreferredDate = () => {
  if (!preferredDateInput) return;

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const todayValue = today.toISOString().slice(0, 10);
  preferredDateInput.min = todayValue;

  if (!preferredDateInput.value) {
    preferredDateInput.value = todayValue;
  }
};

const closeMenu = () => {
  if (!menuToggle || !mainNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  mainNav.classList.remove("is-open");
};

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mainNav.classList.toggle("is-open", !isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

modal?.querySelector("[name='care']")?.addEventListener("change", updateServiceLocationField);

document.querySelectorAll(".js-book").forEach((button) => {
  button.addEventListener("click", () => {
    const requestedService = button.dataset.service;
    if (requestedService) {
      const careSelect = modal.querySelector("[name='care']");
      const matchingOption = Array.from(careSelect.options).find(
        (option) => option.value === requestedService
      );
      if (matchingOption) careSelect.value = requestedService;
    }
    updateServiceLocationField();
    syncPreferredDate();
    modal.showModal();
    document.body.classList.add("modal-open");
  });
});

const closeModal = () => {
  modal.close();
  document.body.classList.remove("modal-open");
};

if (modalClose) modalClose.addEventListener("click", closeModal);

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

const showToast = (title, message) => {
  if (!toast) return;
  toast.querySelector("strong").textContent = title;
  toast.querySelector("span").textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 3600);
};

const setFormLoading = (form, isLoading) => {
  const submitButton = form.querySelector("button[type='submit']");
  if (!submitButton) return;

  if (!submitButton.dataset.originalLabel) {
    submitButton.dataset.originalLabel = submitButton.innerHTML;
  }

  submitButton.disabled = isLoading;
  submitButton.setAttribute("aria-busy", String(isLoading));
  submitButton.innerHTML = isLoading ? "Sending..." : submitButton.dataset.originalLabel;
};

const submitToGoogleSheet = async (form, type, successTitle, successMessage, afterSuccess) => {
  if (!GOOGLE_SHEET_WEB_APP_URL) {
    showToast("Setup needed.", "Google Sheet endpoint is not connected yet.");
    return;
  }

  const formData = new FormData(form);
  const payload = new URLSearchParams();

  formData.forEach((value, key) => {
    payload.append(key, value);
  });

  payload.append("type", type);
  payload.append("page", window.location.href);
  payload.append("userAgent", window.navigator.userAgent);
  payload.append("submittedAt", new Date().toISOString());

  setFormLoading(form, true);

  try {
    await fetch(GOOGLE_SHEET_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      body: payload,
    });

    form.reset();
    if (typeof afterSuccess === "function") afterSuccess();
    showToast(successTitle, successMessage);
  } catch (error) {
    console.error(error);
    showToast("Could not send.", "Please try again or call us directly.");
  } finally {
    setFormLoading(form, false);
  }
};

if (bookingForm) {
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitToGoogleSheet(
      bookingForm,
      "booking",
      "Appointment request received.",
      "Our care team will confirm your slot shortly.",
      () => {
        updateServiceLocationField();
        closeModal();
      }
    );
  });
}

if (whatsapp) {
  whatsapp.addEventListener("click", () => {
    window.open(whatsapp.dataset.whatsappUrl, "_blank", "noopener");
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitToGoogleSheet(
      contactForm,
      "contact",
      "Message sent.",
      "We will get back to you within one working day."
    );
  });
}

let bagItems = 0;
document.querySelectorAll(".js-add-cart").forEach((button) => {
  button.addEventListener("click", () => {
    bagItems += 1;
    if (cartCount) cartCount.textContent = bagItems;
    if (cartLabel) cartLabel.textContent = bagItems === 1 ? "1 item" : `${bagItems} items`;
    button.textContent = "Added";
    button.classList.add("is-added");
    showToast("Added to your bag.", `${button.dataset.product} is ready for checkout.`);
    window.setTimeout(() => {
      button.textContent = "Add to bag";
      button.classList.remove("is-added");
    }, 1600);
  });
});

document.querySelectorAll(".shop-categories button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelector(".shop-categories .is-selected")?.classList.remove("is-selected");
    button.classList.add("is-selected");
    document.querySelectorAll(".product-card").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

const runAfterFirstPaint = (callback) => {
  const run = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(callback, { timeout: 1400 });
      return;
    }

    window.setTimeout(callback, 350);
  };

  if (document.readyState === "complete") {
    run();
    return;
  }

  window.addEventListener("load", run, { once: true });
};

runAfterFirstPaint(() => {
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const value = Number(entry.target.dataset.count);
      const decimal = String(value).includes(".");
      const duration = 1200;
      const startedAt = performance.now();

      const animateCount = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = value * eased;
        entry.target.textContent = decimal ? current.toFixed(1) : Math.round(current);

        if (progress < 1) {
          requestAnimationFrame(animateCount);
        }
      };

      requestAnimationFrame(animateCount);
      countObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll("[data-count]").forEach((counter) => {
  countObserver.observe(counter);
});
const isTouchOrMobile = window.matchMedia("(pointer: coarse), (max-width: 700px)").matches;
const dot = isTouchOrMobile ? null : document.querySelector('.cursor-dot');
const ring = isTouchOrMobile ? null : document.querySelector('.cursor-ring');

if(dot && ring){

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animate() {

        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        requestAnimationFrame(animate);
    }

    animate();

    document.querySelectorAll('a, button').forEach(el => {

        el.addEventListener('mouseenter', () => {
            ring.style.transform = 'translate(-50%, -50%) scale(1.6)';
        });

        el.addEventListener('mouseleave', () => {
            ring.style.transform = 'translate(-50%, -50%) scale(1)';
        });

    });

}

/* ========= CINEMATIC PARALLAX ========= */

if (!isTouchOrMobile) {
const parallaxElement =
  document.querySelector(".hero-image-wrap") ||
  document.querySelector(".art-circle-main") ||
  document.querySelector(".market-hero-image");

if (parallaxElement) {

  window.addEventListener("mousemove", (e) => {

    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;

    parallaxElement.style.transform =
      `translate(${x}px, ${y}px)`;

  });

}
}

/* FLOATING PAW SCROLL INDICATOR */

const pawProgress =
document.querySelector('.paw-progress');

if(pawProgress){

    function updatePaw(){

        const scrollTop =
            window.pageYOffset;

        const docHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress =
            scrollTop / docHeight;

        const travelDistance =
            window.innerHeight - 220;

        const y =
            120 + (travelDistance * progress);

        pawProgress.style.transform =
            `translateY(${y - 120}px)`;

    }

    window.addEventListener('scroll', updatePaw);

    updatePaw();

}

/* SPOTLIGHT CARD EFFECT */

if (!isTouchOrMobile) {
document.querySelectorAll(
'.service-card, .story-card, .catalog-card, .product-card, .contact-option'
).forEach(card => {

    card.addEventListener('mousemove', (e) => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);

    });

});
}

/* MAGNETIC BUTTONS */

if (!isTouchOrMobile) {
document.querySelectorAll(
'.button, .header-cta, .catalog-action'
).forEach(button => {

    button.addEventListener('mousemove', (e) => {

        const rect = button.getBoundingClientRect();

        const x =
            e.clientX - rect.left - rect.width / 2;

        const y =
            e.clientY - rect.top - rect.height / 2;

        button.style.transform =
            `translate(${x * 0.15}px, ${y * 0.15}px)`;

    });

    button.addEventListener('mouseleave', () => {

        button.style.transform =
            'translate(0,0)';

    });

});
}


/* TEXT HIGHLIGHT SWEEP */

const headingObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if(entry.isIntersecting){

                entry.target.classList.add('highlight-active');

                headingObserver.unobserve(entry.target);

            }

        });

    },

    { threshold:0.35 }

);

document.querySelectorAll(
'.section-heading h2, .intro h2, .about-copy h2, .journey h2, .closing-copy h2'
).forEach(heading => {

    headingObserver.observe(heading);

});

const cards = document.querySelectorAll('.service-card');

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }

    });

},{threshold:0.25});

cards.forEach(card=>{
    observer.observe(card);
});
});
};

try {
  initPage();
} catch (error) {
  console.error(error);
}
