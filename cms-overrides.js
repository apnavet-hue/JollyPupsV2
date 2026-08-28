(function () {
  const endpoint = "/cms-content.json";
  const cacheKey = "jollyCmsContent";

  const normalizePath = (path) => {
    let clean = path.split("?")[0].split("#")[0] || "/";
    clean = clean.replace(/\/index\.html$/, "/").replace(/\.html$/, "/");
    if (clean !== "/" && !clean.endsWith("/")) clean += "/";
    return clean;
  };

  const getPageContent = (content) => {
    const path = normalizePath(window.location.pathname);
    const pages = content.pages || {};
    return pages[path] || pages[path.replace(/\/$/, "")] || pages["/"] || {};
  };

  const applyText = (item) => {
    if (!item || !item.selector || typeof item.value !== "string") return;
    document.querySelectorAll(item.selector).forEach((element, index) => {
      if (Number.isInteger(item.index) && item.index !== index) return;
      if (item.mode === "html") {
        element.innerHTML = item.value;
      } else {
        element.textContent = item.value;
      }
    });
  };

  const applyImage = (item) => {
    if (!item || !item.selector) return;
    document.querySelectorAll(item.selector).forEach((element, index) => {
      if (Number.isInteger(item.index) && item.index !== index) return;
      const image = element.tagName === "IMG" ? element : element.querySelector("img");
      if (!image) return;
      if (item.src) image.src = item.src;
      if (item.srcset !== undefined) {
        if (item.srcset) image.srcset = item.srcset;
        else image.removeAttribute("srcset");
      }
      if (item.sizes !== undefined) {
        if (item.sizes) image.sizes = item.sizes;
        else image.removeAttribute("sizes");
      }
      if (item.alt !== undefined) image.alt = item.alt;
      image.decoding = image.decoding || "async";
    });
  };

  const applyLink = (item) => {
    if (!item || !item.selector) return;
    document.querySelectorAll(item.selector).forEach((element, index) => {
      if (Number.isInteger(item.index) && item.index !== index) return;
      if (item.href) element.setAttribute("href", item.href);
      if (item.target) element.setAttribute("target", item.target);
      if (typeof item.value === "string") element.textContent = item.value;
    });
  };

  const applyAttributes = (item) => {
    if (!item || !item.selector || !item.attributes) return;
    document.querySelectorAll(item.selector).forEach((element, index) => {
      if (Number.isInteger(item.index) && item.index !== index) return;
      Object.entries(item.attributes).forEach(([name, value]) => {
        if (value === null || value === false) element.removeAttribute(name);
        else element.setAttribute(name, String(value));
      });
    });
  };

  const applyContent = (content) => {
    if (!content) return;
    const global = content.global || {};
    const page = getPageContent(content);
    [...(global.text || []), ...(page.text || [])].forEach(applyText);
    [...(global.images || []), ...(page.images || [])].forEach(applyImage);
    [...(global.links || []), ...(page.links || [])].forEach(applyLink);
    [...(global.attributes || []), ...(page.attributes || [])].forEach(applyAttributes);
    window.JOLLY_CMS_CONTENT = content;
  };

  const loadContent = async () => {
    try {
      const response = await fetch(`${endpoint}?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`CMS file returned ${response.status}`);
      const content = await response.json();
      sessionStorage.setItem(cacheKey, JSON.stringify(content));
      return content;
    } catch (error) {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
      throw error;
    }
  };

  const boot = () => {
    loadContent()
      .then((content) => {
        applyContent(content);
        setTimeout(() => applyContent(content), 300);
        setTimeout(() => applyContent(content), 1200);
      })
      .catch(() => {});
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
