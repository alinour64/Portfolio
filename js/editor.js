const sectionKeys = ["about", "experience", "projects", "education", "volunteer", "skills", "contact"];
const draftKey = "portfolio-draft";

const highlightHint = "Wrap words in **double stars** to highlight them.";

const jobFields = [
  { key: "logo", label: "Logo", type: "image", folder: "images/logos" },
  { key: "logoFill", label: "Logo fills the whole tile", type: "check", hint: "Turn this on for logos that are a colored square." },
  { key: "role", label: "Role" },
  { key: "org", label: "Organization" },
  { key: "start", label: "Start", half: true, placeholder: "Apr 2025" },
  { key: "end", label: "End", half: true, placeholder: "Present", hint: "Write Present for something you still do." },
  { key: "location", label: "Location", half: true },
  { key: "note", label: "Extra detail", half: true, placeholder: "Team or project name" },
  { key: "summary", label: "Summary", type: "textarea", hint: highlightHint },
  { key: "bullets", label: "Bullet points", type: "lines", hint: "One bullet per line." },
  { key: "tags", label: "Tags", type: "tags", hint: "Separate with commas." }
];

const schema = [
  {
    key: "profile",
    label: "Profile",
    kind: "object",
    scroll: "top",
    fields: [
      { key: "name", label: "Name", half: true },
      { key: "fullName", label: "Full name", half: true, hint: "Used in the footer." },
      { key: "role", label: "Role", half: true },
      { key: "location", label: "Location", half: true },
      { key: "photo", label: "Photo", type: "image", folder: "images" },
      { key: "headline", label: "Big headline", type: "textarea", hint: highlightHint },
      { key: "intro", label: "Intro under the headline", type: "textarea" },
      { key: "resumeUrl", label: "Resume link", hint: "Your OneDrive share link that starts with https://1drv.ms. The site loads the PDF from it, so updating the file in OneDrive updates the site." },
      { key: "email", label: "Email", half: true },
      { key: "github", label: "GitHub link", half: true },
      { key: "linkedin", label: "LinkedIn link", half: true },
      { key: "formAction", label: "Contact form address", half: true, hint: "Your Formspree link. Leave empty to hide the form." }
    ]
  },
  {
    key: "about",
    label: "About",
    kind: "paragraphs",
    scroll: "about",
    hint: "Leave an empty line between paragraphs. " + highlightHint
  },
  {
    key: "skills",
    label: "Skills",
    kind: "list",
    scroll: "skills",
    noun: "skill group",
    title: function (item) { return item.label || "New skill group"; },
    subtitle: function (item) { return (item.items || []).join(", "); },
    blank: function () { return { label: "", items: [] }; },
    fields: [
      { key: "label", label: "Group name" },
      { key: "items", label: "Skills", type: "tags", hint: "Separate with commas." }
    ]
  },
  {
    key: "experience",
    label: "Experience",
    kind: "list",
    scroll: "experience",
    noun: "job",
    title: function (item) { return item.role || "New job"; },
    subtitle: function (item) { return [item.org, dates(item)].filter(Boolean).join(" · "); },
    blank: function () { return { logo: "", org: "", role: "", start: "", end: "", location: "", note: "", summary: "", bullets: [], tags: [] }; },
    fields: jobFields
  },
  {
    key: "projects",
    label: "Projects",
    kind: "list",
    scroll: "projects",
    noun: "project",
    title: function (item) { return item.title || "New project"; },
    subtitle: function (item) { return item.category || ""; },
    blank: function () { return { title: "", category: "", color: "", summary: "", highlights: [], stack: [], links: [], image: "" }; },
    fields: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category", half: true, hint: "Each category gets a filter button." },
      { key: "color", label: "Cover color", type: "color", half: true },
      { key: "summary", label: "Summary", type: "textarea", hint: highlightHint },
      { key: "highlights", label: "What I built", type: "lines", hint: "One point per line. Shown when the card is opened." },
      { key: "stack", label: "Tech stack", type: "tags", hint: "Separate with commas." },
      { key: "links", label: "Links", type: "links" },
      { key: "image", label: "Cover image", type: "image", folder: "images/projects", hint: "Optional. Replaces the colored cover." }
    ]
  },
  {
    key: "education",
    label: "Education",
    kind: "list",
    scroll: "education",
    noun: "school",
    title: function (item) { return item.school || "New school"; },
    subtitle: function (item) { return [item.degree, dates(item)].filter(Boolean).join(" · "); },
    blank: function () { return { logo: "", school: "", degree: "", start: "", end: "", note: "", links: [] }; },
    fields: [
      { key: "logo", label: "Logo", type: "image", folder: "images/logos" },
      { key: "logoFill", label: "Logo fills the whole tile", type: "check", hint: "Turn this on for logos that are a colored square." },
      { key: "school", label: "School" },
      { key: "degree", label: "Degree" },
      { key: "start", label: "Start", half: true, hint: "Optional." },
      { key: "end", label: "End or graduation", half: true, placeholder: "May 2027" },
      { key: "note", label: "Note", hint: "GPA, honors or anything short." },
      { key: "links", label: "Links", type: "links" }
    ]
  },
  {
    key: "volunteer",
    label: "Volunteer",
    kind: "list",
    scroll: "volunteer",
    noun: "role",
    title: function (item) { return item.role || "New role"; },
    subtitle: function (item) { return [item.org, dates(item)].filter(Boolean).join(" · "); },
    blank: function () { return { logo: "", org: "", role: "", start: "", end: "", location: "", note: "", summary: "", bullets: [], tags: [] }; },
    fields: jobFields
  },
  {
    key: "sections",
    label: "Headings",
    kind: "sections",
    scroll: "top"
  }
];

const colorOptions = [["", "Automatic"], ["blue", "Blue"], ["coral", "Coral"], ["violet", "Violet"], ["mint", "Mint"], ["pink", "Pink"], ["sky", "Sky"]];

let data = copy(content);
let saved = JSON.stringify(data);
let activeTab = "profile";
let folder = null;
let frameReady = false;
let previewTimer = null;
let pendingImage = null;
const openItems = new Set();

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

function dates(item) {
  if (item.start && item.end) return item.start + " – " + item.end;
  return item.end || item.start || "";
}

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function slug(text) {
  return String(text || "file").toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "file";
}

function isDirty() {
  return JSON.stringify(data) !== saved;
}

function setState(text, tone) {
  const state = document.getElementById("state");
  state.textContent = text;
  state.className = "state" + (tone ? " state-" + tone : "");
}

function refreshState() {
  if (isDirty()) setState(folder ? "Unsaved changes" : "Unsaved changes · connect the folder to save", "warn");
  else setState(folder ? "All changes saved" : "Up to date", "ok");
}

function showNotice(text, actions) {
  const notice = document.getElementById("notice");
  document.getElementById("notice-text").textContent = text;
  const box = document.getElementById("notice-actions");
  box.textContent = "";
  for (let i = 0; i < actions.length; i++) {
    const button = make("button", "tool" + (i === 0 ? " tool-main" : ""), actions[i][0]);
    button.type = "button";
    button.addEventListener("click", function () {
      notice.hidden = true;
      if (actions[i][1]) actions[i][1]();
    });
    box.append(button);
  }
  notice.hidden = false;
}

function changed() {
  refreshState();
  try {
    if (isDirty()) localStorage.setItem(draftKey, JSON.stringify(data));
    else localStorage.removeItem(draftKey);
  } catch (e) {}
  clearTimeout(previewTimer);
  previewTimer = setTimeout(sendPreview, 120);
}

function sendPreview() {
  if (!frameReady) return;
  document.getElementById("frame").contentWindow.postMessage({ type: "content", content: data }, "*");
}

function scrollPreview() {
  const tab = findTab(activeTab);
  if (!frameReady || !tab) return;
  const frame = document.getElementById("frame").contentWindow;
  if (tab.scroll === "top") frame.scrollTo({ top: 0, behavior: "instant" });
  else frame.postMessage({ type: "scroll", section: tab.scroll }, "*");
}

function findTab(key) {
  for (let i = 0; i < schema.length; i++) {
    if (schema[i].key === key) return schema[i];
  }
  return null;
}

function renderTabs() {
  const tabs = document.getElementById("tabs");
  tabs.textContent = "";
  for (let i = 0; i < schema.length; i++) {
    const tab = schema[i];
    const button = make("button", "tab", tab.label);
    button.type = "button";
    button.setAttribute("aria-current", tab.key === activeTab ? "true" : "false");
    if (tab.kind === "list") button.append(make("span", "tab-count", String((data[tab.key] || []).length)));
    button.addEventListener("click", function () {
      activeTab = tab.key;
      renderTabs();
      renderForm();
      scrollPreview();
    });
    tabs.append(button);
  }
}

function renderForm() {
  const form = document.getElementById("form");
  form.textContent = "";
  const tab = findTab(activeTab);
  form.append(make("h2", "form-title", tab.label));

  if (tab.kind === "object") {
    if (!data[tab.key]) data[tab.key] = {};
    form.append(makeFields(data[tab.key], tab.fields, null));
  }

  if (tab.kind === "paragraphs") {
    const field = makeField(data, { key: "about", label: "About text", type: "paragraphs", hint: tab.hint }, null);
    field.querySelector("textarea").rows = 16;
    form.append(field);
  }

  if (tab.kind === "sections") {
    if (!data.sections) data.sections = {};
    for (let i = 0; i < sectionKeys.length; i++) {
      const key = sectionKeys[i];
      if (!data.sections[key]) data.sections[key] = { title: "", intro: "" };
      const group = make("fieldset", "group");
      group.append(make("legend", "", key[0].toUpperCase() + key.slice(1)));
      group.append(makeFields(data.sections[key], [
        { key: "title", label: "Heading" },
        { key: "intro", label: "Line under the heading", type: "textarea", hint: key === "contact" ? "Shown in the blue contact box." : "Optional." }
      ], null));
      form.append(group);
    }
  }

  if (tab.kind === "list") renderList(form, tab);
}

function renderList(form, tab) {
  if (!Array.isArray(data[tab.key])) data[tab.key] = [];
  const list = data[tab.key];

  const top = make("div", "list-top");
  top.append(make("p", "hint", list.length ? "Click an entry to edit it. Entries show on the site in this order." : "This section is hidden on the site until you add something."));
  const add = make("button", "tool tool-main", "+ Add " + tab.noun);
  add.type = "button";
  add.addEventListener("click", function () {
    const item = tab.blank();
    list.unshift(item);
    openItems.add(item);
    changed();
    renderTabs();
    renderForm();
    const first = document.querySelector(".item input, .item textarea");
    if (first) first.focus();
  });
  top.append(add);
  form.append(top);

  for (let i = 0; i < list.length; i++) {
    form.append(makeItem(tab, list, i));
  }
}

function makeItem(tab, list, index) {
  const item = list[index];
  const box = make("details", "item");
  box.open = openItems.has(item);
  box.addEventListener("toggle", function () {
    if (box.open) openItems.add(item);
    else openItems.delete(item);
  });

  const summary = make("summary", "item-head");
  const thumb = make("span", "item-thumb");
  const thumbSrc = item.logo || item.image || "";
  if (thumbSrc) {
    const img = make("img");
    img.src = thumbSrc;
    img.alt = "";
    thumb.append(img);
  } else {
    thumb.textContent = String(index + 1);
  }
  summary.append(thumb);

  const text = make("span", "item-text");
  const title = make("span", "item-title", tab.title(item));
  const subtitle = make("span", "item-sub", tab.subtitle(item));
  text.append(title, subtitle);
  summary.append(text);

  const tools = make("span", "item-tools");
  tools.append(iconButton("↑", "Move up", index === 0, function () { move(list, index, -1); }));
  tools.append(iconButton("↓", "Move down", index === list.length - 1, function () { move(list, index, 1); }));
  tools.append(iconButton("✕", "Remove", false, function () {
    if (!confirm("Remove \"" + tab.title(item) + "\"? You can't undo this after you save.")) return;
    list.splice(index, 1);
    openItems.delete(item);
    changed();
    renderTabs();
    renderForm();
  }, "danger"));
  summary.append(tools);
  box.append(summary);

  const body = make("div", "item-body");
  body.append(makeFields(item, tab.fields, function () {
    title.textContent = tab.title(item);
    subtitle.textContent = tab.subtitle(item);
  }));
  box.append(body);
  return box;
}

function iconButton(symbol, label, disabled, action, tone) {
  const button = make("button", "icon" + (tone ? " icon-" + tone : ""), symbol);
  button.type = "button";
  button.title = label;
  button.setAttribute("aria-label", label);
  button.disabled = disabled;
  button.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    action();
  });
  return button;
}

function move(list, index, step) {
  const target = index + step;
  if (target < 0 || target >= list.length) return;
  const item = list[index];
  list[index] = list[target];
  list[target] = item;
  changed();
  renderForm();
}

function makeFields(obj, fields, onChange) {
  const grid = make("div", "fields");
  for (let i = 0; i < fields.length; i++) grid.append(makeField(obj, fields[i], onChange));
  return grid;
}

function makeField(obj, field, onChange) {
  const type = field.type || "text";
  const wrap = make("div", "field" + (field.half ? " half" : ""));
  const id = "f" + Math.random().toString(36).slice(2, 9);
  const label = make("label", "field-label", field.label);
  label.htmlFor = id;
  wrap.append(label);

  function update(value) {
    obj[field.key] = value;
    if (onChange) onChange();
    changed();
  }

  if (type === "text" || type === "textarea" || type === "lines" || type === "tags" || type === "paragraphs") {
    const multi = type !== "text" && type !== "tags";
    const input = make(multi ? "textarea" : "input");
    input.id = id;
    if (!multi) input.type = "text";
    if (multi) input.rows = type === "textarea" ? 3 : 5;
    if (field.placeholder) input.placeholder = field.placeholder;

    const value = obj[field.key];
    if (type === "lines") input.value = (value || []).join("\n");
    else if (type === "tags") input.value = (value || []).join(", ");
    else if (type === "paragraphs") input.value = (value || []).join("\n\n");
    else input.value = value || "";

    input.addEventListener("input", function () {
      const raw = input.value;
      if (type === "lines") update(trimList(raw.split("\n")));
      else if (type === "tags") update(trimList(raw.split(",")));
      else if (type === "paragraphs") update(trimList(raw.split(/\n\s*\n/)));
      else update(raw);
    });
    wrap.append(input);
  }

  if (type === "color") {
    const select = make("select");
    select.id = id;
    for (let i = 0; i < colorOptions.length; i++) {
      const option = make("option", "", colorOptions[i][1]);
      option.value = colorOptions[i][0];
      select.append(option);
    }
    select.value = obj[field.key] || "";
    select.addEventListener("change", function () { update(select.value); });
    wrap.append(select);
  }

  if (type === "check") {
    const box = make("input");
    box.type = "checkbox";
    box.id = id;
    box.checked = !!obj[field.key];
    box.addEventListener("change", function () { update(box.checked); });
    wrap.classList.add("field-check");
    wrap.prepend(box);
  }

  if (type === "links") {
    label.removeAttribute("for");
    wrap.append(makeLinksEditor(obj, field, update));
  }

  if (type === "image") {
    wrap.append(makeImageEditor(obj, field, id, update));
  }

  if (field.hint) wrap.append(make("p", "hint", field.hint));
  return wrap;
}

function trimList(parts) {
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const value = parts[i].trim();
    if (value) out.push(value);
  }
  return out;
}

function makeLinksEditor(obj, field, update) {
  const box = make("div", "links-editor");
  if (!Array.isArray(obj[field.key])) obj[field.key] = [];
  const links = obj[field.key];

  function draw() {
    box.textContent = "";
    for (let i = 0; i < links.length; i++) {
      const row = make("div", "link-row");
      const label = make("input");
      label.placeholder = "Label, like Code";
      label.value = links[i].label || "";
      label.setAttribute("aria-label", "Link label");
      label.addEventListener("input", function () {
        links[i].label = label.value;
        update(links);
      });
      const url = make("input");
      url.placeholder = "https://…";
      url.value = links[i].url || "";
      url.setAttribute("aria-label", "Link address");
      url.addEventListener("input", function () {
        links[i].url = url.value.trim();
        update(links);
      });
      row.append(label, url, iconButton("✕", "Remove link", false, function () {
        links.splice(i, 1);
        update(links);
        draw();
      }, "danger"));
      box.append(row);
    }
    const add = make("button", "tool tool-small", "+ Add link");
    add.type = "button";
    add.addEventListener("click", function () {
      links.push({ label: "", url: "" });
      update(links);
      draw();
      const inputs = box.querySelectorAll(".link-row input");
      if (inputs.length) inputs[inputs.length - 2].focus();
    });
    box.append(add);
  }

  draw();
  return box;
}

function makeImageEditor(obj, field, id, update) {
  const row = make("div", "image-row");
  const thumb = make("span", "image-thumb");
  const input = make("input");
  input.id = id;
  input.type = "text";
  input.placeholder = field.folder + "/name.png";
  input.value = obj[field.key] || "";

  function drawThumb() {
    thumb.textContent = "";
    if (input.value) {
      const img = make("img");
      img.src = input.value;
      img.alt = "";
      thumb.append(img);
    } else {
      thumb.textContent = "None";
    }
  }

  input.addEventListener("input", function () {
    update(input.value.trim());
    drawThumb();
  });

  const upload = make("button", "tool tool-small", "Upload");
  upload.type = "button";
  upload.addEventListener("click", function () {
    if (!folder) {
      showNotice("Connect the site folder first so the image can be copied into it.", [["Connect site folder", connectFolder], ["Cancel"]]);
      return;
    }
    pendingImage = function (path) {
      input.value = path;
      update(path);
      drawThumb();
    };
    pendingImage.folder = field.folder;
    pendingImage.name = obj.org || obj.school || obj.title || obj.name || "image";
    document.getElementById("file-picker").click();
  });

  drawThumb();
  row.append(thumb, input, upload);
  return row;
}

async function handleImage(file) {
  if (!file || !pendingImage || !folder) return;
  const ext = (file.name.match(/\.[a-z0-9]+$/i) || [".png"])[0].toLowerCase();
  const name = slug(pendingImage.name) + ext;
  try {
    let dir = folder;
    const parts = pendingImage.folder.split("/");
    for (let i = 0; i < parts.length; i++) dir = await dir.getDirectoryHandle(parts[i], { create: true });
    const handle = await dir.getFileHandle(name, { create: true });
    const writer = await handle.createWritable();
    await writer.write(file);
    await writer.close();
    pendingImage(pendingImage.folder + "/" + name);
  } catch (e) {
    showNotice("Couldn't save that image: " + e.message, [["OK"]]);
  }
  pendingImage = null;
}

function serialize() {
  return "const content = " + JSON.stringify(data, null, 2) + ";\n";
}

function parse(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  return JSON.parse(text.slice(start, end + 1));
}

async function connectFolder() {
  if (!window.showDirectoryPicker) {
    showNotice("This browser can't save files directly. Use Chrome or Edge, or press Save to download content.js and put it in the js folder.", [["OK"]]);
    return;
  }
  try {
    const picked = await window.showDirectoryPicker({ id: "portfolio", mode: "readwrite" });
    const js = await picked.getDirectoryHandle("js");
    const file = await (await js.getFileHandle("content.js")).getFile();
    const fromDisk = parse(await file.text());
    folder = picked;
    document.getElementById("connect").textContent = "Connected: " + picked.name;
    document.getElementById("connect").classList.add("tool-on");
    if (!isDirty()) {
      data = fromDisk;
      saved = JSON.stringify(data);
      renderTabs();
      renderForm();
      sendPreview();
    } else {
      saved = JSON.stringify(fromDisk);
    }
    refreshState();
  } catch (e) {
    if (e.name === "AbortError") return;
    showNotice("Pick the Portfolio folder, the one with index.html and a js folder inside it.", [["Try again", connectFolder], ["Cancel"]]);
  }
}

async function save() {
  if (!folder) {
    const blob = new Blob([serialize()], { type: "text/javascript" });
    const link = make("a");
    link.href = URL.createObjectURL(blob);
    link.download = "content.js";
    link.click();
    URL.revokeObjectURL(link.href);
    showNotice("Downloaded content.js. Replace js/content.js with it. Next time, connect the site folder and Save writes the file for you.", [["Connect site folder", connectFolder], ["OK"]]);
    return;
  }
  try {
    const js = await folder.getDirectoryHandle("js");
    const handle = await js.getFileHandle("content.js");
    const writer = await handle.createWritable();
    await writer.write(serialize());
    await writer.close();
    saved = JSON.stringify(data);
    try {
      localStorage.removeItem(draftKey);
    } catch (e) {}
    refreshState();
  } catch (e) {
    showNotice("Couldn't save: " + e.message, [["OK"]]);
  }
}

function fitPreview() {
  const stage = document.getElementById("stage");
  const frame = document.getElementById("frame");
  const width = Number(frame.dataset.width || 1280);
  const scale = Math.min(1, (stage.clientWidth - 32) / width);
  frame.style.width = width + "px";
  frame.style.height = (stage.clientHeight - 32) / scale + "px";
  frame.style.transform = "scale(" + scale + ")";
}

function setupPreview() {
  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "ready") {
      frameReady = true;
      sendPreview();
      scrollPreview();
    }
  });
  document.getElementById("frame").addEventListener("load", function () {
    frameReady = true;
    sendPreview();
  });

  const buttons = document.querySelectorAll("[data-size]");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      document.getElementById("frame").dataset.width = buttons[i].dataset.size;
      for (let j = 0; j < buttons.length; j++) buttons[j].setAttribute("aria-pressed", j === i ? "true" : "false");
      fitPreview();
    });
  }
  window.addEventListener("resize", fitPreview);
  fitPreview();
}

function checkDraft() {
  let draft = null;
  try {
    draft = localStorage.getItem(draftKey);
  } catch (e) {}
  if (!draft || draft === saved) return;
  showNotice("You have edits from last time that were never saved.", [
    ["Bring them back", function () {
      data = JSON.parse(draft);
      renderTabs();
      renderForm();
      changed();
    }],
    ["Throw them away", function () {
      try {
        localStorage.removeItem(draftKey);
      } catch (e) {}
    }]
  ]);
}

document.getElementById("connect").addEventListener("click", connectFolder);
document.getElementById("save").addEventListener("click", save);
document.getElementById("file-picker").addEventListener("change", function (event) {
  handleImage(event.target.files[0]);
  event.target.value = "";
});
document.addEventListener("keydown", function (event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    save();
  }
});
window.addEventListener("beforeunload", function (event) {
  if (isDirty()) event.preventDefault();
});

renderTabs();
renderForm();
setupPreview();
refreshState();
checkDraft();
