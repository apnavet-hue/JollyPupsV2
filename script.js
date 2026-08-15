const loadIncludes = async () => {
  const includeTargets = document.querySelectorAll("[data-include]");

  await Promise.all(
    Array.from(includeTargets).map(async (target) => {
      const response = await fetch(target.dataset.include);
      if (!response.ok) {
        throw new Error(`Unable to load ${target.dataset.include}`);
      }
      target.outerHTML = await response.text();
    })
  );
};

const cleanPageSlugs = new Set(["services", "marketplace", "contact"]);

const getSiteBasePath = () => {
  if (window.location.protocol === "file:") {
    return "";
  }

  const pathname = window.location.pathname.replace(/\/+$/, "");
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "";

  if (lastSegment.includes(".") || cleanPageSlugs.has(lastSegment)) {
    segments.pop();
  }

  return segments.length ? `/${segments.join("/")}/` : "/";
};

const getCurrentPage = () => {
  const pathname = window.location.pathname.replace(/\/+$/, "");
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "";

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
    about: "#about",
    faq: "contact/#faq",
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
  const headerAction = currentPage === "marketplace.html" ? "bag" : "book";

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

const initPage = async () => {
redirectLegacyHtmlPath();
await loadIncludes();
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

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    bookingForm.reset();
    updateServiceLocationField();
    closeModal();
    showToast("Request received.", "Our care team will call you shortly.");
  });
}

if (whatsapp) {
  whatsapp.addEventListener("click", () => {
    window.open(whatsapp.dataset.whatsappUrl, "_blank", "noopener");
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactForm.reset();
    showToast("Message sent.", "We will get back to you within one working day.");
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

/* MAGNETIC BUTTONS */

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
};

initPage().catch((error) => {
  console.error(error);
});
