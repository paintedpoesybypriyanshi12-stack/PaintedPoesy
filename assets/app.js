(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const SITE = window.SITE, WORKS = window.WORKS;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const tag = (t = "To confirm") => SITE.draft ? ` <span class="draft-tag">${t}</span>` : "";
  const titleOf = w => w.title || w.gem;
  const sold = w => /sold/i.test(w.availability || "");

  document.documentElement.classList.toggle("draft", !!SITE.draft);
  $("#year").textContent = new Date().getFullYear();
  if (SITE.instagram) { const ig = $("#foot-ig"); ig.href = SITE.instagram; ig.hidden = false; }
  if (SITE.contactEmail) {
    const p = $("#privacy-email"); p.textContent = SITE.contactEmail; p.classList.remove("todo");
    const m = $("#foot-email"); m.textContent = SITE.contactEmail; m.href = "mailto:" + SITE.contactEmail; m.hidden = false;
  }

  /* ---------- Series page: index + entries ---------- */
  $("#gem-index").innerHTML = WORKS.map((w, i) =>
    `<a href="#/navarathna" data-jump="${w.id}"><span class="n">${i + 1}</span>${esc(w.gem)}</a>`).join("");

  function facts(w) {
    return [["Medium", w.medium], ["Dimensions", w.dimensions], ["Year", w.year]]
      .filter(r => r[1]).map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("");
  }
  $("#entries").innerHTML = WORKS.map(w => `
    <article class="entry" id="work-${w.id}">
      <button type="button" class="entry-img" data-work="${w.id}" aria-label="View ${esc(titleOf(w))} larger">
        <img src="${w.image}" alt="${esc(w.alt)}" loading="lazy">
      </button>
      <div class="entry-text">
        <p class="eyebrow">Traditional association: ${esc(w.association)}${w.gemConfirmed ? "" : tag()}</p>
        <h3>${esc(titleOf(w))}</h3>
        <p class="tagline">${esc(w.tagline)}</p>
        <dl class="facts">${facts(w)}</dl>
        <div class="desc">${w.statement.map(p => `<p>${esc(p)}</p>`).join("")}</div>
        <div class="actions">
          <button type="button" class="btn ghost" data-work="${w.id}">View Full Painting</button>
        </div>
      </div>
    </article>`).join("");

  /* ---------- Contact select ---------- */
  $("#c-work").insertAdjacentHTML("beforeend",
    WORKS.map(w => `<option value="${esc(titleOf(w))}">${esc(titleOf(w))}</option>`).join("") +
    `<option value="Not sure yet">Not sure yet</option>`);

  /* ---------- Dialogs ---------- */
  const artDlg = $("#artwork"), contactDlg = $("#contact");
  const openDialog = d => { if (!d.open) { d.showModal(); document.body.style.overflow = "hidden"; } };
  const closeDialog = d => { if (d.open) d.close(); };
  [artDlg, contactDlg].forEach(d => {
    d.addEventListener("close", () => {
      if (!artDlg.open && !contactDlg.open) document.body.style.overflow = "";
      if (d === artDlg && /^#\/navarathna\/.+/.test(location.hash)) history.replaceState(null, "", "#/navarathna");
    });
    d.addEventListener("click", e => { if (e.target === d) closeDialog(d); });
  });

  document.addEventListener("click", e => {
    const t = e.target;
    const c = t.closest("[data-close]"); if (c) closeDialog(c.closest("dialog"));
    if (t.closest("[data-close-link]")) closeDialog(contactDlg);
    if (t.closest("[data-contact]")) openContact();
    const inq = t.closest("[data-inquire]"); if (inq) openContact(inq.dataset.inquire);
    const w = t.closest("[data-work]"); if (w) location.hash = "#/navarathna/" + w.dataset.work;
    const j = t.closest("[data-jump]");
    if (j) {
      e.preventDefault();
      const el = $("#work-" + j.dataset.jump);
      if (el) el.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "start" });
    }
  });

  const DEFAULT_TITLE = $("#contact-title").textContent, DEFAULT_INTRO = $("#contact-intro").textContent;
  function openContact(workId) {
    const w = workId && WORKS.find(x => x.id === workId);
    closeDialog(artDlg);
    const st = $("#c-status"); st.textContent = ""; st.className = "form-status";
    $("#contact-title").textContent = w ? `A conversation about ${titleOf(w)}` : DEFAULT_TITLE;
    $("#contact-intro").textContent = w
      ? `Ask about this ${w.dimensions} painting’s availability, pricing, or details. The artwork title is already included with your inquiry.`
      : DEFAULT_INTRO;
    if (w) { $("#c-work").value = titleOf(w); $("#c-type").value = "An artwork inquiry"; }
    openDialog(contactDlg);
    setTimeout(() => $("#c-name").focus(), 30);
  }

  function openArtwork(id) {
    const i = WORKS.findIndex(x => x.id === id); if (i < 0) return;
    const w = WORKS[i];
    const views = [{ src: w.image, label: "View Full Painting", alt: w.alt }]
      .concat(w.views.map(v => ({ src: v.src, label: v.label, alt: `${titleOf(w)}. ${v.label}.` })));
    const img = $("#art-img");
    const show = k => {
      img.src = views[k].src; img.alt = views[k].alt;
      $$("#art-thumbs button").forEach((b, n) => b.setAttribute("aria-pressed", String(n === k)));
    };
    $("#art-thumbs").innerHTML = views.length > 1
      ? views.map(v => `<button type="button" title="${esc(v.label)}" aria-label="${esc(v.label)}"><img src="${v.src}" alt=""></button>`).join("")
      : "";
    $$("#art-thumbs button").forEach((b, k) => b.addEventListener("click", () => show(k)));
    $("#art-closer").hidden = views.length < 2;
    show(0);

    $("#art-eyebrow").innerHTML = `Navarathna · ${esc(w.association)}${w.gemConfirmed ? "" : tag()}`;
    $("#art-title").textContent = titleOf(w);
    $("#art-tagline").textContent = w.tagline;
    $("#art-meta").innerHTML =
      `<dt>Series</dt><dd>Navarathna</dd>` + facts(w) +
      (SITE.draft && !w.year ? `<dt>Year</dt><dd class="todo">[Year completed]</dd>` : "");
    $("#art-desc").innerHTML = w.statement.map(p => `<p>${esc(p)}</p>`).join("");
    $("#art-inquiry").innerHTML = sold(w)
      ? `<h3>This painting has found a home.</h3><p>You are welcome to get in touch about other works in the series.</p>
         <button type="button" class="btn ghost" data-contact>Get in Touch</button>`
      : `<h3>Interested in this work?</h3><p>Get in touch to ask about availability, pricing, or viewing the painting in greater detail.</p>
         <button type="button" class="btn" data-inquire="${w.id}">Inquire About This Work</button>`;
    const prev = WORKS[(i - 1 + WORKS.length) % WORKS.length], next = WORKS[(i + 1) % WORKS.length];
    $("#art-prev").onclick = () => { location.hash = "#/navarathna/" + prev.id; };
    $("#art-next").onclick = () => { location.hash = "#/navarathna/" + next.id; };
    $("#art-prev").title = titleOf(prev); $("#art-next").title = titleOf(next);
    $(".art-info").scrollTop = 0;
    openDialog(artDlg);
  }

  /* ---------- Contact form ---------- */
  const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  $("#contact-form").addEventListener("submit", async e => {
    e.preventDefault();
    const f = e.target, status = $("#c-status");
    const name = f.name.value.trim(), email = f.email.value.trim(), msg = f.message.value.trim();
    const invalid = !name ? ["Please enter your name.", "#c-name"]
      : !EMAIL.test(email) ? ["Please enter a valid email address.", "#c-email"]
      : !msg ? ["Please add a message before sending.", "#c-msg"] : null;
    if (invalid) {
      status.className = "form-status warn"; status.textContent = invalid[0]; $(invalid[1]).focus();
      return;
    }
    if (!SITE.formEndpoint) {
      status.className = "form-status warn";
      status.textContent = "This preview isn’t connected to a form service yet, so nothing was sent. Add one in works.js to receive inquiries.";
      return;
    }
    const btn = $("#c-send"); btn.disabled = true; btn.textContent = "Sending your message…";
    try {
      const res = await fetch(SITE.formEndpoint, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(f))),
      });
      if (!res.ok) throw new Error(res.status);
      f.reset();
      status.className = "form-status ok";
      status.innerHTML = "<strong>Thank you for reaching out.</strong> Your message has been sent. I look forward to reading it and continuing the conversation.";
    } catch (err) {
      status.className = "form-status warn";
      status.textContent = "Your message could not be sent. Please try again" +
        (SITE.contactEmail ? `, or contact me directly at ${SITE.contactEmail}.` : ".");
    } finally { btn.disabled = false; btn.textContent = "Send Inquiry"; }
  });

  /* ---------- Flow background ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const flow = window.FlowSapphire($("#flow"));
  const mbtn = $("#motion-btn");
  // ?t=12 opens the background paused at that second of the loop (for reviewing frames)
  const seekTo = new URLSearchParams(location.search).get("t");
  let userPaused = reduce.matches || seekTo !== null;
  let currentRoute = null;
  function syncMotion() {
    if (flow.ready && currentRoute === "home" && !userPaused && !document.hidden) flow.play(); else flow.pause();
    mbtn.setAttribute("aria-pressed", String(userPaused));
    mbtn.querySelector("span").textContent = userPaused ? "Play motion" : "Pause motion";
    mbtn.querySelector("svg").innerHTML = userPaused
      ? '<path d="M2 1l7 4-7 4z"/>'
      : '<rect x="1" y="1" width="3" height="8"/><rect x="6" y="1" width="3" height="8"/>';
  }
  flow.onready = () => {
    if (seekTo !== null) flow.seek(parseFloat(seekTo) || 0);
    $("#flow").classList.add("on"); mbtn.hidden = false; syncMotion();
  };
  mbtn.addEventListener("click", () => { userPaused = !userPaused; syncMotion(); });
  document.addEventListener("visibilitychange", syncMotion);

  // keep sticky elements tucked under the header, whatever height it wraps to
  const head = $("#site-head");
  const setHeadH = () => {
    if (!head.hidden) document.documentElement.style.setProperty("--head-h", head.offsetHeight + "px");
  };
  window.addEventListener("resize", setHeadH);

  /* ---------- Router ---------- */
  const TITLES = {
    home: "Painted Poesy by Priyanshi | Contemporary Mixed-Media Art",
    about: "About Priyanshi Pandey | Painted Poesy",
    navarathna: "Navarathna Series | Nine Gems in Contemporary Abstraction",
    privacy: "Privacy Notice | Painted Poesy by Priyanshi",
    notfound: "Page not found | Painted Poesy by Priyanshi",
  };
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/");
    let r = parts[0] || "home";
    if (!TITLES[r] || r === "notfound") r = "notfound";
    const home = r === "home";
    if (r !== currentRoute) {
      document.body.classList.toggle("is-home", home);
      $("#home").hidden = !home;
      $("#site-head").hidden = home; $("#interior").hidden = home; $("#site-foot").hidden = home;
      $$("#interior [data-route]").forEach(s => { s.hidden = s.dataset.route !== r; });
      $$("[data-nav]").forEach(a => {
        if (a.dataset.nav === r) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
      document.title = TITLES[r];
      if (currentRoute !== null) window.scrollTo(0, 0);
      currentRoute = r;
      closeDialog(contactDlg);
      syncMotion();
      setHeadH();
    }
    if (r === "navarathna" && parts[1]) openArtwork(parts[1]); else closeDialog(artDlg);
  }
  window.addEventListener("hashchange", route);
  route();
})();
