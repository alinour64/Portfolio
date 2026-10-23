const sectionOrder = ["about", "experience", "projects", "education", "volunteer", "contact"];
const coverColors = ["blue", "coral", "violet", "mint", "pink", "sky"];
const tileColors = ["#b8c7ff", "#ffb4a2", "#d3c4ff", "#a8e8cf", "#ffc2dc", "#b3e1ff"];

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function safeUrl(url) {
  const value = String(url || "").trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) && !/^(https?|mailto):/i.test(value)) return "";
  return value;
}

function addRichText(node, text) {
  const parts = String(text || "").split("**");
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i]) continue;
    if (i % 2 === 1) node.append(make("mark", "", parts[i]));
    else node.append(document.createTextNode(parts[i]));
  }
  return node;
}

function hasItems(list) {
  return Array.isArray(list) && list.length > 0;
}

function clean(list) {
  const out = [];
  if (!Array.isArray(list)) return out;
  for (let i = 0; i < list.length; i++) {
    if (String(list[i] || "").trim()) out.push(list[i]);
  }
  return out;
}

function dateRange(item) {
  if (item.start && item.end) return item.start + " – " + item.end;
  return item.end || item.start || "";
}

function initials(name) {
  const words = String(name || "").split(/\s+/);
  let out = "";
  for (let i = 0; i < words.length && out.length < 2; i++) {
    const word = words[i];
    if (!word || /^(of|the|and|at|for)$/i.test(word)) continue;
    out += word[0].toUpperCase();
  }
  return out || "?";
}

function pickTile(name) {
  let total = 0;
  for (let i = 0; i < name.length; i++) total += name.charCodeAt(i);
  return tileColors[total % tileColors.length];
}

function makeLogo(src, name, fill) {
  const tile = make("span", "logo");
  const url = safeUrl(src);
  if (url) {
    const img = make("img");
    img.src = url;
    img.alt = name + " logo";
    img.loading = "lazy";
    img.width = 40;
    img.height = 40;
    tile.append(img);
    if (fill) tile.classList.add("logo-fill");
  } else {
    tile.classList.add("logo-initials");
    tile.style.background = pickTile(String(name || ""));
    tile.textContent = initials(name);
    tile.setAttribute("aria-hidden", "true");
  }
  return tile;
}

function makeTags(list, className) {
  const tags = make("ul", className || "tags");
  const items = clean(list);
  for (let i = 0; i < items.length; i++) tags.append(make("li", "", items[i]));
  return tags;
}

function makeLinks(list, className) {
  const wrap = make("div", className || "links");
  if (!Array.isArray(list)) return wrap;
  for (let i = 0; i < list.length; i++) {
    const url = safeUrl(list[i].url);
    if (!url || !list[i].label) continue;
    const link = make("a", "", list[i].label + " ↗");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    wrap.append(link);
  }
  return wrap;
}

function renderProfile(profile) {
  document.title = profile.name + " · " + (profile.role || "Portfolio");
  document.getElementById("name").textContent = profile.name || "";
  document.getElementById("brand-name").textContent = profile.name || "";
  document.getElementById("role").textContent = profile.role || "";
  document.getElementById("location").textContent = profile.location || "";
  document.getElementById("full-name").textContent = profile.fullName || profile.name || "";

  const photo = document.getElementById("photo");
  const photoUrl = safeUrl(profile.photo);
  photo.hidden = !photoUrl;
  if (photoUrl) photo.src = photoUrl;
  photo.alt = "Portrait of " + (profile.name || "");

  addRichText(clear("headline"), profile.headline);
  addRichText(clear("intro"), profile.intro);

  resume.share = safeUrl(profile.resumeUrl);
  resume.file = oneDriveFile(resume.share);
  const resumes = [document.getElementById("resume-link"), document.getElementById("header-resume")];
  for (let i = 0; i < resumes.length; i++) {
    resumes[i].hidden = !resume.share;
    resumes[i].href = resume.share;
  }
  document.getElementById("resume-download").href = resume.file || resume.share;
  document.getElementById("resume-tab").href = resume.share;
  document.getElementById("resume-title").textContent = "Resume · " + (profile.name || "");

  const social = clear("social");
  const items = [
    ["GitHub", profile.github, '<path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />', true],
    ["LinkedIn", profile.linkedin, '<path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.2 1.5-2.2 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5zM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1M7.1 20.5H3.6V9h3.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0" />', true],
    ["Email", profile.email ? "mailto:" + profile.email : "", '<rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />', false]
  ];
  for (let i = 0; i < items.length; i++) {
    const url = safeUrl(items[i][1]);
    if (!url) continue;
    const li = make("li");
    const a = make("a");
    a.href = url;
    a.setAttribute("aria-label", items[i][0]);
    if (url.indexOf("mailto:") !== 0) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"' + (items[i][3] ? ' class="fill"' : "") + ">" + items[i][2] + "</svg>";
    li.append(a);
    social.append(li);
  }

  const email = document.getElementById("email-link");
  email.textContent = profile.email || "";
  email.href = profile.email ? "mailto:" + profile.email : "";
  document.getElementById("copy-email").hidden = !profile.email;

  const form = document.getElementById("contact-form");
  form.hidden = !profile.formAction;
  form.action = safeUrl(profile.formAction);
}

function clear(id) {
  const node = document.getElementById(id);
  node.textContent = "";
  return node;
}

function sectionVisible(key, data) {
  if (key === "contact") return true;
  if (key === "about") return hasItems(clean(data.about)) || hasItems(data.skills);
  return hasItems(data[key]);
}

function renderSections(data) {
  const sections = data.sections || {};
  const navs = document.querySelectorAll("[data-nav]");
  for (let n = 0; n < navs.length; n++) navs[n].textContent = "";

  let number = 0;
  for (let i = 0; i < sectionOrder.length; i++) {
    const key = sectionOrder[i];
    const info = sections[key] || {};
    const section = document.getElementById(key);
    const visible = sectionVisible(key, data);
    section.hidden = !visible;
    if (!visible) continue;
    number++;
    const label = key === "contact" ? "Contact" : info.title || key;

    for (let n = 0; n < navs.length; n++) {
      const link = make("a");
      link.href = "#" + key;
      link.textContent = label;
      navs[n].append(link);
    }

    const head = section.querySelector(".section-head");
    if (!head) continue;
    head.textContent = "";
    const top = make("div", "section-top");
    top.append(make("span", "section-num", String(number).padStart(2, "0")));
    const title = make("h2", "section-title", info.title || label);
    title.id = key + "-title";
    top.append(title);
    head.append(top);
    section.setAttribute("aria-labelledby", title.id);
    if (info.intro) head.append(addRichText(make("p", "section-intro"), info.intro));
  }

  document.getElementById("contact-title").textContent = (sections.contact && sections.contact.title) || "Contact";
  addRichText(clear("contact-intro"), sections.contact && sections.contact.intro);
}

function renderAbout(data) {
  const text = clear("about-text");
  const paragraphs = clean(data.about);
  for (let i = 0; i < paragraphs.length; i++) text.append(addRichText(make("p"), paragraphs[i]));

  const skills = clear("skills");
  const groups = Array.isArray(data.skills) ? data.skills : [];
  for (let i = 0; i < groups.length; i++) {
    const group = make("div", "skill-group");
    group.append(make("h3", "skill-label", groups[i].label));
    group.append(makeTags(groups[i].items, "chips"));
    skills.append(group);
  }
}

function renderTimeline(id, list) {
  const root = clear(id);
  if (!Array.isArray(list)) return;
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const li = make("li", "stop");
    li.append(makeLogo(item.logo, item.org, item.logoFill));

    const body = make("div", "stop-body");
    const head = make("div", "stop-head");
    const titles = make("div");
    titles.append(make("h3", "stop-role", item.role));
    const org = make("p", "stop-org", item.org);
    const extra = [item.note, item.location].filter(Boolean).join(" · ");
    if (extra) org.append(make("span", "stop-extra", " · " + extra));
    titles.append(org);
    head.append(titles);

    const when = make("span", "when", dateRange(item));
    if (/present|now/i.test(item.end || "")) when.classList.add("when-now");
    if (when.textContent) head.append(when);
    body.append(head);

    if (item.summary) body.append(addRichText(make("p", "stop-summary"), item.summary));
    const bullets = clean(item.bullets);
    if (bullets.length) {
      const ul = make("ul", "stop-bullets");
      for (let j = 0; j < bullets.length; j++) ul.append(addRichText(make("li"), bullets[j]));
      body.append(ul);
    }
    if (clean(item.tags).length) body.append(makeTags(item.tags));
    li.append(body);
    root.append(li);
  }
}

function renderProjects(data) {
  const list = clear("project-list");
  const filters = clear("project-filters");
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const cards = [];
  const categories = [];

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const card = make("article", "project");
    card.dataset.category = project.category || "";
    const color = coverColors.indexOf(project.color) !== -1 ? project.color : coverColors[i % coverColors.length];
    card.dataset.color = color;

    const cover = make("div", "cover");
    cover.append(make("span", "cover-num", String(i + 1).padStart(2, "0")));
    const image = safeUrl(project.image);
    if (image) {
      const shot = make("span", "cover-shot");
      const img = make("img");
      img.src = image;
      img.alt = "Screenshot of " + project.title;
      img.loading = "lazy";
      shot.append(img);
      cover.append(shot);
      cover.classList.add("has-shot");
    }
    if (project.category) cover.append(make("span", "cover-kind", project.category));
    card.append(cover);

    const body = make("div", "project-body");
    body.append(make("h3", "project-title", project.title));
    if (project.summary) body.append(addRichText(make("p", "project-summary"), project.summary));

    const highlights = clean(project.highlights);
    if (highlights.length) {
      const details = make("details");
      details.append(make("summary", "", "What I built"));
      const ul = make("ul");
      for (let j = 0; j < highlights.length; j++) ul.append(addRichText(make("li"), highlights[j]));
      details.append(ul);
      body.append(details);
    }

    const foot = make("div", "project-foot");
    if (clean(project.stack).length) foot.append(makeTags(project.stack));
    const links = makeLinks(project.links, "project-links");
    if (links.children.length) foot.append(links);
    if (foot.children.length) body.append(foot);

    card.append(body);
    list.append(card);
    cards.push(card);
    if (project.category && categories.indexOf(project.category) === -1) categories.push(project.category);
  }

  if (categories.length < 2) return;
  const options = ["All"].concat(categories);
  const buttons = [];
  for (let i = 0; i < options.length; i++) {
    const button = make("button", "filter", options[i]);
    button.type = "button";
    button.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    button.addEventListener("click", function () {
      for (let j = 0; j < cards.length; j++) {
        cards[j].hidden = !(options[i] === "All" || cards[j].dataset.category === options[i]);
      }
      for (let j = 0; j < buttons.length; j++) {
        buttons[j].setAttribute("aria-pressed", j === i ? "true" : "false");
      }
    });
    buttons.push(button);
    filters.append(button);
  }
}

function renderEducation(data) {
  const root = clear("education-list");
  const list = Array.isArray(data.education) ? data.education : [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const card = make("article", "school");
    const top = make("div", "school-top");
    top.append(makeLogo(item.logo, item.school, item.logoFill));
    const when = dateRange(item);
    if (when) top.append(make("span", "when", when));
    card.append(top);
    card.append(make("h3", "school-name", item.school));
    if (item.degree) card.append(make("p", "school-degree", item.degree));
    if (item.note) card.append(addRichText(make("p", "school-note"), item.note));
    const links = makeLinks(item.links, "school-links");
    if (links.children.length) card.append(links);
    root.append(card);
  }
}

function render(data) {
  renderProfile(data.profile || {});
  renderSections(data);
  renderAbout(data);
  renderTimeline("experience-list", data.experience);
  renderProjects(data);
  renderEducation(data);
  renderTimeline("volunteer-list", data.volunteer);
  watchSections();
}

function currentTheme() {
  const saved = document.documentElement.dataset.theme;
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setupTheme() {
  const buttons = document.querySelectorAll(".theme-toggle");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      const next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }
}

let spy = null;

function watchSections() {
  if (!("IntersectionObserver" in window)) return;
  if (spy) spy.disconnect();
  const links = document.querySelectorAll("[data-nav] a");
  const topbarNav = document.querySelector(".nav");

  spy = new IntersectionObserver(
    function (entries) {
      for (let i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        const id = entries[i].target.id;
        for (let j = 0; j < links.length; j++) {
          const on = links[j].getAttribute("href") === "#" + id;
          links[j].classList.toggle("active", on);
          if (on && topbarNav && topbarNav.scrollWidth > topbarNav.clientWidth) {
            topbarNav.scrollTo({ left: links[j].offsetLeft - 8, behavior: "smooth" });
          }
        }
      }
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );
  const sections = document.querySelectorAll("main section[id]");
  for (let i = 0; i < sections.length; i++) spy.observe(sections[i]);
}

function setupCopyEmail() {
  const button = document.getElementById("copy-email");
  button.addEventListener("click", function () {
    const email = document.getElementById("email-link").textContent;
    if (!navigator.clipboard) {
      window.location.href = "mailto:" + email;
      return;
    }
    navigator.clipboard.writeText(email).then(function () {
      button.textContent = "Copied";
      setTimeout(function () {
        button.textContent = "Copy";
      }, 1600);
    });
  });
}

function setupForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    button.textContent = "Sending…";
    status.className = "form-status";
    status.textContent = "";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(response.status);
      form.reset();
      status.classList.add("ok");
      status.textContent = "Thanks. Your message was sent and I'll reply soon.";
    } catch (e) {
      status.classList.add("error");
      status.textContent = "That didn't go through. Please email me instead.";
    }

    button.disabled = false;
    button.textContent = "Send message";
  });
}

const pdfScript = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const pdfWorker = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const resume = { share: "", file: "", shown: "" };

function oneDriveFile(url) {
  const match = String(url || "").match(/1drv\.ms\/[a-z]\/c\/([0-9a-f]+)\/([\w-]+)/i);
  if (!match) return "";
  return "https://my.microsoftpersonalcontent.com/personal/" + match[1].toLowerCase() + "/_layouts/15/download.aspx?share=" + match[2];
}

function loadScript(src) {
  return new Promise(function (resolve, reject) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
}

async function showResume() {
  const status = document.getElementById("resume-status");
  const pages = document.getElementById("resume-pages");
  if (resume.shown === resume.file) return;
  resume.shown = resume.file;
  pages.textContent = "";
  status.className = "resume-status";
  status.textContent = "Loading resume from OneDrive…";

  try {
    if (typeof pdfjsLib === "undefined") await loadScript(pdfScript);
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
    const response = await fetch(resume.file, { cache: "no-cache" });
    if (!response.ok) throw new Error(response.status);
    const pdf = await pdfjsLib.getDocument({ data: await response.arrayBuffer() }).promise;
    const width = Math.max(pages.clientWidth, 816) * Math.min(window.devicePixelRatio || 1, 2);

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
      const sheet = make("div", "resume-page");
      const canvas = make("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "Resume page " + i);
      await page.render({ canvasContext: canvas.getContext("2d"), viewport: viewport }).promise;
      sheet.append(canvas);

      const notes = await page.getAnnotations();
      for (let j = 0; j < notes.length; j++) {
        const url = safeUrl(notes[j].url);
        if (notes[j].subtype !== "Link" || !url) continue;
        const box = viewport.convertToViewportRectangle(notes[j].rect);
        const link = make("a", "resume-link");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener";
        link.setAttribute("aria-label", url.replace(/^mailto:/, ""));
        link.style.left = (Math.min(box[0], box[2]) / viewport.width) * 100 + "%";
        link.style.top = (Math.min(box[1], box[3]) / viewport.height) * 100 + "%";
        link.style.width = (Math.abs(box[2] - box[0]) / viewport.width) * 100 + "%";
        link.style.height = (Math.abs(box[3] - box[1]) / viewport.height) * 100 + "%";
        sheet.append(link);
      }
      pages.append(sheet);
    }
    status.textContent = "";
  } catch (e) {
    resume.shown = "";
    status.className = "resume-status resume-error";
    status.textContent = "The resume couldn't load from OneDrive. ";
    const link = make("a", "", "Open it in OneDrive ↗");
    link.href = resume.share;
    link.target = "_blank";
    link.rel = "noopener";
    status.append(link);
  }
}

function setupResume() {
  const dialog = document.getElementById("resume-dialog");
  if (!dialog.showModal) return;

  function open(event) {
    if (!resume.file || event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    dialog.showModal();
    document.documentElement.classList.add("modal-open");
    showResume();
  }

  document.getElementById("resume-link").addEventListener("click", open);
  document.getElementById("header-resume").addEventListener("click", open);
  document.getElementById("resume-close").addEventListener("click", function () {
    dialog.close();
  });
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", function () {
    document.documentElement.classList.remove("modal-open");
  });
}

function setupLinks() {
  document.addEventListener("click", function (event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    const id = link.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!id || id === "top" || !target) {
      window.scrollTo({ top: 0 });
      return;
    }
    target.scrollIntoView({ block: "start" });
    if (id === "main") {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  });

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("pagehide", function () {
    try {
      sessionStorage.setItem("scroll", String(window.scrollY));
    } catch (e) {}
  });

  const visit = performance.getEntriesByType ? performance.getEntriesByType("navigation")[0] : null;
  const reload = visit && visit.type === "reload";
  const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);

  let saved = null;
  try {
    saved = sessionStorage.getItem("scroll");
  } catch (e) {}

  if (reload && saved !== null) window.scrollTo({ top: Number(saved), behavior: "instant" });
  else if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
  else window.scrollTo({ top: 0, behavior: "instant" });
}

function setupPreview() {
  if (window.parent === window) return;
  window.addEventListener("message", function (event) {
    if (event.source !== window.parent || !event.data) return;
    if (event.data.type === "content") render(event.data.content);
    if (event.data.type === "scroll") {
      const target = document.getElementById(event.data.section);
      if (target && !target.hidden) target.scrollIntoView({ block: "start", behavior: "instant" });
    }
  });
  window.parent.postMessage({ type: "ready" }, "*");
}

document.getElementById("year").textContent = new Date().getFullYear();
render(content);
setupTheme();
setupCopyEmail();
setupForm();
setupLinks();
setupResume();
setupPreview();
