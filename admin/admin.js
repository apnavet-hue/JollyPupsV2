const contentUrl = "/cms-content.json";
const state = {
  content: null,
  selectedKey: "/",
  activeTab: "content",
  dirty: false
};

const $ = (selector) => document.querySelector(selector);
const pageList = $("#pageList");
const pageTitle = $("#pageTitle");
const statusCard = $("#statusCard");
const textEditors = $("#textEditors");
const imageEditors = $("#imageEditors");
const linkEditors = $("#linkEditors");
const detailEditors = $("#detailEditors");
const advancedJson = $("#advancedJson");
const previewFrame = $("#previewFrame");
const scanResults = $("#scanResults");

const defaultPage = (key = "/new-page/") => ({
  title: key === "global" ? "Global" : "New page",
  url: key === "global" ? "" : key,
  text: [],
  images: [],
  links: [],
  attributes: []
});

const setStatus = (message, type = "") => {
  statusCard.textContent = message;
  statusCard.className = `status-card ${type}`.trim();
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const normalizePath = (path) => {
  let clean = (path || "/").trim();
  if (!clean.startsWith("/")) clean = `/${clean}`;
  clean = clean.replace(/\/index\.html$/, "/").replace(/\.html$/, "/");
  if (clean !== "/" && !clean.endsWith("/")) clean += "/";
  return clean;
};

const getPage = () => {
  if (state.selectedKey === "global") return state.content.global;
  state.content.pages[state.selectedKey] ||= defaultPage(state.selectedKey);
  return state.content.pages[state.selectedKey];
};

const markDirty = () => {
  state.dirty = true;
  state.content.updatedAt = new Date().toISOString();
  syncAdvancedJson();
  setStatus("Unsaved changes. Publish to GitHub when ready.");
};

const routeToPreviewUrl = (key) => {
  if (key === "global") return "/";
  return key || "/";
};

const syncAdvancedJson = () => {
  advancedJson.value = JSON.stringify(state.content, null, 2);
};

const renderPages = () => {
  const pages = state.content.pages || {};
  pageList.innerHTML = "";
  const entries = [["global", { title: "Global content" }], ...Object.entries(pages)];
  entries.forEach(([key, page]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = key === state.selectedKey ? "is-active" : "";
    button.textContent = page.title || key;
    button.addEventListener("click", () => {
      state.selectedKey = key;
      render();
    });
    pageList.append(button);
  });
};

const makeInput = (label, value, onInput) => {
  const wrap = document.createElement("label");
  const span = document.createElement("span");
  const input = document.createElement("input");
  span.textContent = label;
  input.value = value || "";
  input.addEventListener("input", () => onInput(input.value));
  wrap.append(span, input);
  return wrap;
};

const makeTextarea = (label, value, onInput) => {
  const wrap = document.createElement("label");
  const span = document.createElement("span");
  const input = document.createElement("textarea");
  span.textContent = label;
  input.value = value || "";
  input.addEventListener("input", () => onInput(input.value));
  wrap.append(span, input);
  return wrap;
};

const renderTextEditors = () => {
  const page = getPage();
  page.text ||= [];
  textEditors.innerHTML = "";
  page.text.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "editor-card";
    const grid = document.createElement("div");
    grid.className = "editor-grid";
    grid.append(
      makeInput("Label", item.label, (value) => {
        item.label = value;
        markDirty();
      }),
      makeInput("CSS selector", item.selector, (value) => {
        item.selector = value;
        markDirty();
      }),
      makeTextarea("Text or HTML", item.value, (value) => {
        item.value = value;
        markDirty();
      })
    );
    const actions = document.createElement("div");
    actions.className = "editor-actions";
    const mode = makeInput("Mode: text or html", item.mode || "text", (value) => {
      item.mode = value === "html" ? "html" : "text";
      markDirty();
    });
    const remove = document.createElement("button");
    remove.className = "danger-button";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      page.text.splice(index, 1);
      markDirty();
      renderTextEditors();
    });
    actions.append(mode, remove);
    card.append(grid, actions);
    textEditors.append(card);
  });
};

const renderImageEditors = () => {
  const page = getPage();
  page.images ||= [];
  imageEditors.innerHTML = "";
  page.images.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "editor-card";
    const preview = document.createElement("img");
    preview.className = "image-preview";
    preview.src = item.src || "";
    preview.alt = "";
    const grid = document.createElement("div");
    grid.className = "editor-grid";
    grid.append(
      makeInput("Label", item.label, (value) => {
        item.label = value;
        markDirty();
      }),
      makeInput("CSS selector", item.selector, (value) => {
        item.selector = value;
        markDirty();
      }),
      makeInput("Image URL", item.src, (value) => {
        item.src = value;
        preview.src = value;
        markDirty();
      })
    );
    const meta = document.createElement("div");
    meta.className = "editor-grid";
    meta.append(
      makeInput("Alt text", item.alt, (value) => {
        item.alt = value;
        markDirty();
      }),
      makeInput("Srcset", item.srcset, (value) => {
        item.srcset = value;
        markDirty();
      }),
      makeInput("Sizes", item.sizes, (value) => {
        item.sizes = value;
        markDirty();
      })
    );
    const fileLabel = document.createElement("label");
    fileLabel.className = "file-button";
    fileLabel.textContent = "Choose image";
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/*";
    file.addEventListener("change", () => handleImageFile(file.files[0], item, preview));
    fileLabel.append(file);
    const remove = document.createElement("button");
    remove.className = "danger-button";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      page.images.splice(index, 1);
      markDirty();
      renderImageEditors();
    });
    const actions = document.createElement("div");
    actions.className = "editor-actions";
    actions.append(preview, fileLabel, remove);
    card.append(grid, meta, actions);
    imageEditors.append(card);
  });
};

const renderLinkEditors = () => {
  const page = getPage();
  page.links ||= [];
  linkEditors.innerHTML = "";
  page.links.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "editor-card";
    const grid = document.createElement("div");
    grid.className = "editor-grid";
    grid.append(
      makeInput("Label", item.label, (value) => {
        item.label = value;
        markDirty();
      }),
      makeInput("CSS selector", item.selector, (value) => {
        item.selector = value;
        markDirty();
      }),
      makeInput("Link URL", item.href, (value) => {
        item.href = value;
        markDirty();
      })
    );
    const actions = document.createElement("div");
    actions.className = "editor-actions";
    actions.append(
      makeInput("Link text", item.value, (value) => {
        item.value = value;
        markDirty();
      })
    );
    const remove = document.createElement("button");
    remove.className = "danger-button";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      page.links.splice(index, 1);
      markDirty();
      renderLinkEditors();
    });
    actions.append(remove);
    card.append(grid, actions);
    linkEditors.append(card);
  });
};

const renderDetailEditors = () => {
  const page = getPage();
  page.attributes ||= [];
  detailEditors.innerHTML = "";
  const pageCard = document.createElement("article");
  pageCard.className = "editor-card";
  const pageGrid = document.createElement("div");
  pageGrid.className = "editor-grid";
  pageGrid.append(
    makeInput("Admin title", page.title, (value) => {
      page.title = value;
      markDirty();
      renderPages();
      pageTitle.textContent = value || "Global content";
    }),
    makeInput("Page URL", page.url || state.selectedKey, (value) => {
      if (state.selectedKey === "global") return;
      page.url = normalizePath(value);
      markDirty();
    }),
    makeInput("Notes", page.notes, (value) => {
      page.notes = value;
      markDirty();
    })
  );
  pageCard.append(pageGrid);
  detailEditors.append(pageCard);
  page.attributes.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "editor-card";
    const grid = document.createElement("div");
    grid.className = "editor-grid";
    grid.append(
      makeInput("Label", item.label, (value) => {
        item.label = value;
        markDirty();
      }),
      makeInput("CSS selector", item.selector, (value) => {
        item.selector = value;
        markDirty();
      }),
      makeTextarea("Attributes as JSON", JSON.stringify(item.attributes || {}, null, 2), (value) => {
        try {
          item.attributes = JSON.parse(value || "{}");
          markDirty();
        } catch (error) {
          setStatus(`Invalid attributes JSON: ${error.message}`, "error");
        }
      })
    );
    const actions = document.createElement("div");
    actions.className = "editor-actions";
    const remove = document.createElement("button");
    remove.className = "danger-button";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      page.attributes.splice(index, 1);
      markDirty();
      renderDetailEditors();
    });
    actions.append(remove);
    card.append(grid, actions);
    detailEditors.append(card);
  });
};

const render = () => {
  const page = getPage();
  pageTitle.textContent = page.title || "Global content";
  renderPages();
  renderTextEditors();
  renderImageEditors();
  renderLinkEditors();
  renderDetailEditors();
  syncAdvancedJson();
  previewFrame.src = routeToPreviewUrl(state.selectedKey);
};

const handleImageFile = (file, item, preview) => {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    item.pendingFileName = file.name;
    item.pendingMimeType = file.type || "image/jpeg";
    item.src = reader.result;
    item.srcset = "";
    preview.src = item.src;
    markDirty();
    setStatus("Image staged. Publishing will upload it to GitHub under assets/cms/.");
  });
  reader.readAsDataURL(file);
};

const addItem = (type) => {
  const page = getPage();
  page[type] ||= [];
  if (type === "text") {
    page.text.push({ label: "New text", selector: "", value: "" });
  }
  if (type === "images") {
    page.images.push({ label: "New image", selector: "", src: "", alt: "" });
  }
  if (type === "links") {
    page.links.push({ label: "New link", selector: "", href: "", value: "" });
  }
  if (type === "attributes") {
    page.attributes ||= [];
    page.attributes.push({ label: "New attributes", selector: "", attributes: {} });
  }
  markDirty();
  render();
};

const cssPath = (element) => {
  const parts = [];
  let node = element;
  while (node && node.nodeType === 1 && node !== document.body) {
    let part = node.tagName.toLowerCase();
    if (node.id) {
      parts.unshift(`#${CSS.escape(node.id)}`);
      break;
    }
    const classes = [...node.classList].filter((name) => !name.startsWith("reveal") && !name.startsWith("is-"));
    if (classes.length) part += `.${classes.slice(0, 2).map((name) => CSS.escape(name)).join(".")}`;
    const parent = node.parentElement;
    if (parent) {
      const siblings = [...parent.children].filter((child) => child.tagName === node.tagName);
      if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
    }
    parts.unshift(part);
    node = parent;
  }
  return parts.join(" > ");
};

const scanPreview = () => {
  scanResults.innerHTML = "";
  let doc;
  try {
    doc = previewFrame.contentDocument;
  } catch (error) {
    setStatus("Preview cannot be scanned. Open admin on the same domain as the site.", "error");
    return;
  }
  if (!doc) return;
  const selector = "h1,h2,h3,h4,p,li,summary,blockquote,small,strong,a,button,span,img";
  const items = [...doc.querySelectorAll(selector)]
    .filter((node) => !node.closest(".pet-preloader,.toast,.booking-modal") && !node.closest("script,style"))
    .map((node) => {
      const isImage = node.tagName === "IMG";
      return {
        type: isImage ? "images" : node.tagName === "A" ? "links" : "text",
        label: `${node.tagName.toLowerCase()} on ${state.selectedKey}`,
        selector: cssPath(node),
        value: isImage ? node.getAttribute("src") : node.textContent.trim().replace(/\s+/g, " "),
        alt: isImage ? node.getAttribute("alt") || "" : "",
        href: node.tagName === "A" ? node.getAttribute("href") || "" : ""
      };
    })
    .filter((item) => item.value)
    .slice(0, 180);
  items.forEach((item) => {
    const row = document.createElement("article");
    row.className = "scan-item";
    const kind = document.createElement("strong");
    kind.textContent = item.type === "images" ? "Image" : item.type === "links" ? "Link" : "Text";
    const body = document.createElement("p");
    body.textContent = `${item.value.slice(0, 180)} | ${item.selector}`;
    const add = document.createElement("button");
    add.className = "ghost-button";
    add.type = "button";
    add.textContent = "Add";
    add.addEventListener("click", () => addScannedItem(item));
    row.append(kind, body, add);
    scanResults.append(row);
  });
  setStatus(`Found ${items.length} editable items in the preview.`, "success");
};

const addScannedItem = (item) => {
  const page = getPage();
  page[item.type] ||= [];
  const exists = page[item.type].some((entry) => entry.selector === item.selector);
  if (exists) {
    setStatus("That selector is already editable on this page.");
    return;
  }
  if (item.type === "images") {
    page.images.push({ label: item.label, selector: item.selector, src: item.value, alt: item.alt });
  } else if (item.type === "links") {
    page.links.push({ label: item.label, selector: item.selector, href: item.href, value: item.value });
  } else {
    page.text.push({ label: item.label, selector: item.selector, value: item.value });
  }
  markDirty();
  render();
};

const dataUrlToUpload = (dataUrl, fallbackName) => {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const ext = mime.split("/")[1]?.replace("jpeg", "jpg").replace("svg+xml", "svg") || "jpg";
  return {
    content: match[2],
    path: `assets/cms/${fallbackName}.${ext}`
  };
};

const githubRequest = async (path, options = {}) => {
  const token = $("#githubToken").value.trim();
  if (!token) throw new Error("Paste a GitHub token before publishing.");
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub returned ${response.status}: ${body}`);
  }
  return response.json();
};

const uploadFileToGithub = async ({ owner, repo, branch, path, content, message }) => {
  let sha = null;
  try {
    const current = await githubRequest(`/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`);
    sha = current.sha;
  } catch (error) {
    if (!String(error.message).includes("404")) throw error;
  }
  return githubRequest(`/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({ message, content, branch, sha })
  });
};

const encodeText = (text) => btoa(unescape(encodeURIComponent(text)));

const publishToGithub = async () => {
  const owner = $("#githubOwner").value.trim();
  const repo = $("#githubRepo").value.trim();
  const branch = $("#githubBranch").value.trim() || "main";
  if (!owner || !repo) {
    setStatus("GitHub owner and repo are required.", "error");
    return;
  }
  sessionStorage.setItem("jollyAdminToken", $("#githubToken").value);
  localStorage.setItem("jollyAdminSettings", JSON.stringify({ owner, repo, branch }));
  const draft = clone(state.content);
  setStatus("Publishing images and content to GitHub...");
  const imageLists = [draft.global?.images || [], ...Object.values(draft.pages || {}).map((page) => page.images || [])];
  for (const list of imageLists) {
    for (const item of list) {
      if (!item.src || !item.src.startsWith("data:")) continue;
      const slug = (item.label || "image").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const upload = dataUrlToUpload(item.src, `${slug}-${Date.now()}`);
      if (!upload) continue;
      await uploadFileToGithub({
        owner,
        repo,
        branch,
        path: upload.path,
        content: upload.content,
        message: `Update CMS image: ${item.label || upload.path}`
      });
      item.src = `/${upload.path}`;
      item.pendingFileName = "";
      item.pendingMimeType = "";
      item.srcset = "";
    }
  }
  draft.updatedAt = new Date().toISOString();
  await uploadFileToGithub({
    owner,
    repo,
    branch,
    path: "cms-content.json",
    content: encodeText(`${JSON.stringify(draft, null, 2)}\n`),
    message: "Update website CMS content"
  });
  state.content = draft;
  state.dirty = false;
  syncAdvancedJson();
  render();
  setStatus("Published to GitHub. Hostinger should redeploy from the connected branch.", "success");
};

const loadSettings = () => {
  try {
    const settings = JSON.parse(localStorage.getItem("jollyAdminSettings") || "{}");
    if (settings.owner) $("#githubOwner").value = settings.owner;
    if (settings.repo) $("#githubRepo").value = settings.repo;
    if (settings.branch) $("#githubBranch").value = settings.branch;
  } catch (error) {}
  $("#githubToken").value = sessionStorage.getItem("jollyAdminToken") || "";
};

const loadContent = async () => {
  setStatus("Loading content file...");
  const response = await fetch(`${contentUrl}?v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load ${contentUrl}: ${response.status}`);
  state.content = await response.json();
  state.content.global ||= { text: [], images: [], links: [], attributes: [] };
  state.content.pages ||= {};
  state.selectedKey = state.content.pages[state.selectedKey] ? state.selectedKey : "/";
  state.dirty = false;
  render();
  setStatus("Content loaded. Choose a page, edit, preview, then publish.", "success");
};

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    state.activeTab = tab.dataset.tab;
    document.querySelectorAll(".tab").forEach((button) => button.classList.toggle("is-active", button === tab));
    document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("is-active"));
    $(`#${state.activeTab}Panel`).classList.add("is-active");
  });
});

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => addItem(button.dataset.add));
});

$("#addPageButton").addEventListener("click", () => {
  const answer = prompt("Enter page route, for example /services/grooming/");
  if (!answer || !answer.trim()) return;
  const route = normalizePath(answer);
  state.content.pages[route] ||= defaultPage(route);
  state.selectedKey = route;
  markDirty();
  render();
});

$("#refreshButton").addEventListener("click", loadContent);
$("#scanButton").addEventListener("click", scanPreview);
$("#publishButton").addEventListener("click", () => publishToGithub().catch((error) => setStatus(error.message, "error")));

$("#applyJsonButton").addEventListener("click", () => {
  try {
    state.content = JSON.parse(advancedJson.value);
    markDirty();
    render();
    setStatus("Advanced JSON applied.", "success");
  } catch (error) {
    setStatus(`Invalid JSON: ${error.message}`, "error");
  }
});

$("#exportButton").addEventListener("click", () => {
  const blob = new Blob([`${JSON.stringify(state.content, null, 2)}\n`], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "cms-content.json";
  link.click();
  URL.revokeObjectURL(link.href);
});

$("#importInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    state.content = JSON.parse(await file.text());
    markDirty();
    render();
    setStatus("Imported JSON. Review it before publishing.", "success");
  } catch (error) {
    setStatus(`Import failed: ${error.message}`, "error");
  }
});

window.addEventListener("beforeunload", (event) => {
  if (!state.dirty) return;
  event.preventDefault();
  event.returnValue = "";
});

loadSettings();
loadContent().catch((error) => setStatus(error.message, "error"));
