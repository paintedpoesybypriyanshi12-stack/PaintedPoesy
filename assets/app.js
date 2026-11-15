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

  // The painting a visitor is asking about, when the form is opened from a
  // painting's "Inquire About This Work" button; sent with the message.
  let inquiryWork = null;

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
    inquiryWork = w ? titleOf(w) : null;
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

  /* ---------- Contact form (Web3Forms) ---------- */
  // Submits in the background to Web3Forms, which emails the inquiry to the
  // inbox the access key was verified for. The visitor's address goes in the
  // `email` field, which Web3Forms uses as the Reply-To; the sender name is
  // the site's own (`from_name`), never the visitor's.
  const FORM = SITE.web3forms || {};
  const MSG_SUCCESS = "Thank you for reaching out to Painted Poesy by Priyanshi. Your inquiry has been received, and I’ll be in touch soon.";
  const MSG_FAILURE = "Your message couldn’t be sent. Please try again or email paintedpoesybypriyanshi12@gmail.com.";
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const LIMITS = { name: 100, email: 254, message: 3000 };
  const form = $("#contact-form"), status = $("#c-status"), sendBtn = $("#c-send");
  const msgBox = $("#c-msg"), msgCount = $("#c-msg-count");
  let sending = false;

  // Free hCaptcha through Web3Forms' own script (zero-config on the free plan).
  if (FORM.hcaptcha) {
    $("#c-captcha-wrap").hidden = false;
    const dark = document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    $("#c-captcha").setAttribute("data-theme", dark ? "dark" : "light");
    const s = document.createElement("script");
    s.src = "https://web3forms.com/client/script.js"; s.async = true; s.defer = true;
    document.body.appendChild(s);
  }
  const captchaToken = () => (form.querySelector('textarea[name="h-captcha-response"]') || {}).value || "";
  const resetCaptcha = () => { try { window.hcaptcha && window.hcaptcha.reset(); } catch (_) {} };

  function setFieldError(input, errEl, text) {
    errEl.textContent = text || ""; errEl.hidden = !text;
    if (input) input.setAttribute("aria-invalid", text ? "true" : "false");
  }
  function clearErrors() {
    setFieldError($("#c-name"), $("#c-name-err"));
    setFieldError($("#c-email"), $("#c-email-err"));
    setFieldError(msgBox, $("#c-msg-err"));
    setFieldError(null, $("#c-captcha-err"));
  }
  function setStatus(kind, text) { status.className = "form-status" + (kind ? " " + kind : ""); status.textContent = text || ""; }
  function updateCount() { msgCount.textContent = `${msgBox.value.length} / ${LIMITS.message}`; }
  msgBox.addEventListener("input", updateCount); updateCount();
  // Clear a field's error as soon as the visitor edits it.
  [["#c-name", "#c-name-err"], ["#c-email", "#c-email-err"], ["#c-msg", "#c-msg-err"]].forEach(([i, e]) =>
    $(i).addEventListener("input", () => { if ($(i).getAttribute("aria-invalid") === "true") setFieldError($(i), $(e)); }));

  function validate() {
    const name = $("#c-name").value.trim(), email = $("#c-email").value.trim(), msg = msgBox.value.trim();
    const errs = [];
    if (!name) errs.push(["#c-name", "#c-name-err", "Please enter your name."]);
    else if (name.length > LIMITS.name) errs.push(["#c-name", "#c-name-err", `Please keep your name under ${LIMITS.name} characters.`]);
    if (!email) errs.push(["#c-email", "#c-email-err", "Please enter your email address."]);
    else if (email.length > LIMITS.email || !EMAIL.test(email)) errs.push(["#c-email", "#c-email-err", "Please enter a valid email address, like name@example.com."]);
    if (!msg) errs.push(["#c-msg", "#c-msg-err", "Please add a message before sending."]);
    else if (msg.length > LIMITS.message) errs.push(["#c-msg", "#c-msg-err", `Please keep your message under ${LIMITS.message} characters.`]);
    errs.forEach(([i, e, t]) => setFieldError($(i), $(e), t));
    return { ok: !errs.length, first: errs[0] && errs[0][0], name, email, msg };
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (sending) return;                                   // duplicate-submit guard
    clearErrors(); setStatus("", "");
    const v = validate();
    if (!v.ok) { setStatus("warn", "Please check the highlighted fields."); $(v.first).focus(); return; }
    if (!FORM.accessKey) {
      setStatus("warn", "The contact form isn’t connected yet, so nothing was sent. Please email paintedpoesybypriyanshi12@gmail.com.");
      return;
    }
    const token = captchaToken();
    if (FORM.hcaptcha && window.hcaptcha && !token) {
      setFieldError(null, $("#c-captcha-err"), "Please complete the verification check above.");
      setStatus("warn", "Please complete the verification check before sending.");
      return;
    }

    const payload = {
      access_key: FORM.accessKey,
      subject: FORM.subject,
      from_name: FORM.fromName,
      name: v.name,
      email: v.email,                                      // Web3Forms uses this as Reply-To
      message: v.msg,
    };
    if (inquiryWork) payload.artwork = inquiryWork;
    if (token) payload["h-captcha-response"] = token;

    sending = true;
    sendBtn.disabled = true; sendBtn.textContent = "Sending your message…";
    form.setAttribute("aria-busy", "true");
    const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 20000);
    let ok = false;
    try {
      const res = await fetch(FORM.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      let data = null;
      try { data = await res.json(); } catch (_) { /* non-JSON error page */ }
      // Success only when the HTTP status is OK *and* Web3Forms says success.
      ok = res.ok && !!data && data.success === true;
      if (!ok) console.warn("Web3Forms did not accept the submission:", res.status, data && (data.message || (data.body && data.body.message)));
    } catch (err) {
      console.warn("Contact form request failed:", err);
    } finally {
      clearTimeout(timer);
      sending = false;
      sendBtn.disabled = false; sendBtn.textContent = "Send Inquiry";
      form.removeAttribute("aria-busy");
    }
    if (ok) {
      form.reset(); updateCount();
      setStatus("ok", MSG_SUCCESS);
    } else {
      setStatus("warn", MSG_FAILURE);                      // the visitor's input is kept as typed
    }
    resetCaptcha();                                        // a captcha token can only be used once
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
