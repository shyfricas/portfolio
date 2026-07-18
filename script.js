/* =========================================================
   Shaliah Fricas — portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const $ = (s, ctx) => (ctx || document).querySelector(s);
  const $$ = (s, ctx) => Array.from((ctx || document).querySelectorAll(s));

  /* ---------- Year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  const menuBtn = $("#menu-btn");
  const menuBar = $("#menu-bar");
  if (menuBtn && menuBar) {
    menuBtn.addEventListener("click", () => {
      menuBar.classList.toggle("active");
      const open = menuBar.classList.contains("active");
      menuBtn.innerHTML = open
        ? '<i class="bx bx-x"></i>'
        : '<i class="bx bx-menu"></i>';
    });
    $$("a", menuBar).forEach((a) =>
      a.addEventListener("click", () => {
        menuBar.classList.remove("active");
        menuBtn.innerHTML = '<i class="bx bx-menu"></i>';
      })
    );
  }

  /* ---------- Header state + scroll progress ---------- */
  const header = $("#header");
  const progress = $("#scroll-progress");
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Scrollspy ---------- */
  const navLinks = $$(".menu-bar a");
  const sections = navLinks
    .map((l) => $(l.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            navLinks.forEach((l) =>
              l.classList.toggle(
                "active",
                l.getAttribute("href") === "#" + e.target.id
              )
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = [
    ".section-index",
    ".heading",
    ".about-text",
    ".about-facts",
    ".poster",
    ".research-body",
    ".research-second",
    ".mission",
    ".unlock",
    ".recognition-band",
    ".lab-card",
    ".tl-item",
    ".skills-card",
    ".media-card",
    ".form",
  ];
  const toReveal = [];
  revealTargets.forEach((sel) =>
    $$(sel).forEach((el) => {
      el.classList.add("reveal");
      toReveal.push(el);
    })
  );
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            const el = e.target;
            setTimeout(
              () => el.classList.add("in"),
              Math.min(i * 60, 240)
            );
            if (el.dataset.count !== undefined || $("[data-count]", el))
              runCounters(el);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    toReveal.forEach((el) => revObs.observe(el));
  } else {
    toReveal.forEach((el) => el.classList.add("in"));
    runCounters(document);
  }

  /* ---------- Stat counters ---------- */
  function runCounters(scope) {
    $$("[data-count]", scope).forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      if (reduceMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }
      const dur = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------- Timeline fill ---------- */
  const timeline = $("#timeline");
  const timelineFill = $("#timeline-fill");
  if (timeline && timelineFill) {
    const updateFill = () => {
      const r = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh * 0.4;
      const passed = vh * 0.55 - r.top;
      const pct = Math.max(0, Math.min(1, passed / total));
      timelineFill.style.height = pct * 100 + "%";
    };
    window.addEventListener("scroll", updateFill, { passive: true });
    window.addEventListener("resize", updateFill);
    updateFill();
  }

  /* ---------- Typed role text ---------- */
  const typedEl = $("#animated-text");
  if (typedEl) {
    const words = [
      "assistive robots",
      "machine-learning models",
      "embedded systems",
      "human-centered tech",
      "solutions",
    ];
    if (reduceMotion) {
      typedEl.textContent = words[0];
    } else {
      let w = 0,
        c = 0,
        deleting = false;
      const type = () => {
        const word = words[w];
        typedEl.textContent = word.slice(0, c);
        if (!deleting && c < word.length) {
          c++;
          setTimeout(type, 70);
        } else if (!deleting && c === word.length) {
          deleting = true;
          setTimeout(type, 1400);
        } else if (deleting && c > 0) {
          c--;
          setTimeout(type, 35);
        } else {
          deleting = false;
          w = (w + 1) % words.length;
          setTimeout(type, 250);
        }
      };
      type();
    }
  }

  /* ---------- Lab scroller: drag + arrows ---------- */
  const scroller = $("#lab-scroller");
  if (scroller) {
    const left = $("#lab-left");
    const right = $("#lab-right");
    const step = () => Math.min(scroller.clientWidth * 0.8, 340);
    if (left)
      left.addEventListener("click", () =>
        scroller.scrollBy({ left: -step(), behavior: "smooth" })
      );
    if (right)
      right.addEventListener("click", () =>
        scroller.scrollBy({ left: step(), behavior: "smooth" })
      );

    let down = false,
      startX = 0,
      startScroll = 0,
      moved = false;
    scroller.addEventListener("pointerdown", (e) => {
      down = true;
      moved = false;
      startX = e.clientX;
      startScroll = scroller.scrollLeft;
      scroller.setPointerCapture(e.pointerId);
    });
    scroller.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) {
        moved = true;
        scroller.classList.add("dragging");
      }
      scroller.scrollLeft = startScroll - dx;
    });
    const end = () => {
      down = false;
      scroller.classList.remove("dragging");
    };
    scroller.addEventListener("pointerup", end);
    scroller.addEventListener("pointercancel", end);
    scroller.addEventListener("pointerleave", end);
    scroller.addEventListener(
      "click",
      (e) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  }

  /* ---------- Lightbox ---------- */
  const poster = $("#poster");
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightbox-img");
  const lightboxClose = $("#lightbox-close");
  if (poster && lightbox && lightboxImg) {
    const openLB = () => {
      const img = $("img", poster);
      lightboxImg.src = img.src;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const closeLB = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    poster.addEventListener("click", openLB);
    if (lightboxClose) lightboxClose.addEventListener("click", closeLB);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLB();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("open")) closeLB();
    });
  }

  /* ---------- Hero constellation / positioning node-mesh ---------- */
  const canvas = $("#signal-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let W, H, dpr, nodes = [], anchors = [];
    const mouse = { x: -999, y: -999, active: false };
    const LINK = 132; // link distance
    const density = 13000; // one node per N px^2

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(26, Math.min(64, Math.round((W * H) / density)));
      nodes = new Array(count).fill(0).map(() => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.3 + 0.9,
      }));
      // a few glowing "anchors" — positioning reference points
      anchors = [
        { x: W * 0.18, y: H * 0.3, label: "BOSTON" },
        { x: W * 0.82, y: H * 0.24, label: "FRICAS" },
        { x: W * 0.7, y: H * 0.74, label: "THE FUTURE" },
      ];
    };
    resize();
    window.addEventListener("resize", resize);

    // track cursor in hero-local coordinates (canvas is pointer-events:none)
    const heroEl = $("#home");
    window.addEventListener(
      "pointermove",
      (e) => {
        const r = heroEl.getBoundingClientRect();
        if (
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom
        ) {
          mouse.x = e.clientX - r.left;
          mouse.y = e.clientY - r.top;
          mouse.active = true;
        } else {
          mouse.active = false;
        }
      },
      { passive: true }
    );
    window.addEventListener("pointerleave", () => (mouse.active = false));

    function link(ax, ay, bx, by, d, max, color) {
      const a = 1 - d / max;
      ctx.strokeStyle = color.replace("A", (a * 0.55).toFixed(3));
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }

    function frame(now) {
      ctx.clearRect(0, 0, W, H);
      const t = now * 0.001;

      // update + draw node links
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        // cursor gentle attraction — the mesh "locates" the pointer
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 170 && dist > 0.1) {
            n.x += (dx / dist) * 0.5;
            n.y += (dy / dist) * 0.5;
          }
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < LINK) link(n.x, n.y, m.x, m.y, d, LINK, "rgba(90,155,255,A)");
        }
        // link to cursor
        if (mouse.active) {
          const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (d < 150) link(n.x, n.y, mouse.x, mouse.y, d, 150, "rgba(255,46,136,A)");
        }
      }

      // nodes — pixel squares
      for (const n of nodes) {
        ctx.fillStyle = "rgba(200,220,255,0.9)";
        const s = Math.max(2, Math.round(n.r * 1.8));
        ctx.fillRect(Math.round(n.x), Math.round(n.y), s, s);
      }

      // anchors — pulsing positioning references, ranging rings to cursor
      anchors.forEach((a, i) => {
        const pulse = 3 + Math.sin(t * 2 + i) * 1.4;
        const isTag = a.label === "TAG";
        const col = isTag ? "255,46,136" : "52,225,212";
        // ranging ring — square pixel pulse
        const ring = (t * 40 + i * 60) % 90;
        ctx.strokeStyle = `rgba(${col},${(1 - ring / 90) * 0.4})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(
          Math.round(a.x - ring),
          Math.round(a.y - ring),
          Math.round(ring * 2),
          Math.round(ring * 2)
        );
        // core — pixel diamond
        const p = Math.max(2, Math.round(pulse));
        ctx.fillStyle = `rgba(${col},0.95)`;
        ctx.shadowColor = `rgba(${col},0.9)`;
        ctx.shadowBlur = 14;
        ctx.fillRect(Math.round(a.x - p), Math.round(a.y - p), p * 2, p * 2);
        ctx.fillRect(Math.round(a.x - p * 2), Math.round(a.y - p), p, p * 2);
        ctx.fillRect(Math.round(a.x + p), Math.round(a.y - p), p, p * 2);
        ctx.shadowBlur = 0;
        // label
        ctx.font = "13px 'VT323', monospace";
        ctx.fillStyle = `rgba(${col},0.85)`;
        ctx.fillText(a.label, a.x + 11, a.y - 10);
      });

      rafId = requestAnimationFrame(frame);
    }

    let rafId;
    const start = () => { if (!rafId) rafId = requestAnimationFrame(frame); };
    const stop = () => { cancelAnimationFrame(rafId); rafId = null; };
    if (reduceMotion) {
      // draw one static frame
      frame(0);
      stop();
    } else {
      start();
      document.addEventListener("visibilitychange", () =>
        document.hidden ? stop() : start()
      );
    }
  }

  /* ---------- Global galaxy starfield ---------- */
  const galaxy = $("#galaxy-canvas");
  if (galaxy) {
    const g = galaxy.getContext("2d");
    let GW, GH, gdpr, stars = [], shooting = null;
    const parallax = { x: 0, y: 0, tx: 0, ty: 0 };

    const gresize = () => {
      gdpr = Math.min(window.devicePixelRatio || 1, 2);
      GW = window.innerWidth;
      GH = window.innerHeight;
      galaxy.width = GW * gdpr;
      galaxy.height = GH * gdpr;
      g.setTransform(gdpr, 0, 0, gdpr, 0, 0);
      const count = Math.round((GW * GH) / 6500);
      stars = new Array(count).fill(0).map(() => {
        const depth = Math.random(); // 0 far … 1 near
        return {
          x: Math.random() * GW,
          y: Math.random() * GH,
          r: depth * 1.5 + 0.3,
          depth,
          tw: Math.random() * Math.PI * 2,
          tws: 0.6 + Math.random() * 1.6,
          hue: Math.random(),
        };
      });
    };
    gresize();
    window.addEventListener("resize", gresize);

    if (!reduceMotion) {
      window.addEventListener(
        "pointermove",
        (e) => {
          parallax.tx = (e.clientX / GW - 0.5) * 2;
          parallax.ty = (e.clientY / GH - 0.5) * 2;
        },
        { passive: true }
      );
    }

    function starColor(hue, a) {
      // mostly white, occasional blue / pink / cyan tint
      if (hue > 0.9) return `rgba(255,120,180,${a})`;
      if (hue > 0.78) return `rgba(120,180,255,${a})`;
      if (hue > 0.68) return `rgba(120,235,225,${a})`;
      return `rgba(234,240,255,${a})`;
    }

    let graf;
    function gframe(now) {
      const t = now * 0.001;
      parallax.x += (parallax.tx - parallax.x) * 0.05;
      parallax.y += (parallax.ty - parallax.y) * 0.05;
      g.clearRect(0, 0, GW, GH);

      for (const s of stars) {
        const tw = 0.55 + Math.sin(t * s.tws + s.tw) * 0.45;
        const px = Math.round(s.x - parallax.x * s.depth * 22);
        const py = Math.round(s.y - parallax.y * s.depth * 22);
        // pixel star: square, snapped to whole pixels
        const size = Math.max(1, Math.round(s.r * 1.6));
        g.fillStyle = starColor(s.hue, tw);
        if (s.depth > 0.75) {
          g.shadowColor = starColor(s.hue, 0.8);
          g.shadowBlur = 6;
        }
        g.fillRect(px, py, size, size);
        // brightest stars get a 4-point pixel sparkle
        if (s.depth > 0.88 && tw > 0.8) {
          g.fillRect(px - size, py, size, size);
          g.fillRect(px + size, py, size, size);
          g.fillRect(px, py - size, size, size);
          g.fillRect(px, py + size, size, size);
        }
        g.shadowBlur = 0;
      }

      // occasional shooting star
      if (!shooting && Math.random() < 0.004) {
        shooting = {
          x: Math.random() * GW * 0.7,
          y: Math.random() * GH * 0.4,
          life: 0,
          len: 120 + Math.random() * 120,
          sp: 8 + Math.random() * 5,
        };
      }
      if (shooting) {
        shooting.life += 1;
        shooting.x += shooting.sp;
        shooting.y += shooting.sp * 0.55;
        const gx = g.createLinearGradient(
          shooting.x, shooting.y,
          shooting.x - shooting.len, shooting.y - shooting.len * 0.55
        );
        gx.addColorStop(0, "rgba(255,255,255,0.9)");
        gx.addColorStop(1, "rgba(255,255,255,0)");
        g.strokeStyle = gx;
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(shooting.x, shooting.y);
        g.lineTo(shooting.x - shooting.len, shooting.y - shooting.len * 0.55);
        g.stroke();
        if (shooting.x > GW + 60 || shooting.life > 90) shooting = null;
      }

      graf = requestAnimationFrame(gframe);
    }

    function drawStatic() {
      g.clearRect(0, 0, GW, GH);
      for (const s of stars) {
        g.fillStyle = starColor(s.hue, 0.8);
        const size = Math.max(1, Math.round(s.r * 1.6));
        g.fillRect(Math.round(s.x), Math.round(s.y), size, size);
      }
    }

    if (reduceMotion) {
      drawStatic();
    } else {
      graf = requestAnimationFrame(gframe);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) cancelAnimationFrame(graf);
        else graf = requestAnimationFrame(gframe);
      });
    }
  }

  /* ---------- TurtleBot3: LiDAR beam scans toward the cursor ---------- */
  const tbot = $("#tbot");
  if (tbot && !reduceMotion) {
    const beam = $("#tbot-beam");
    if (beam) {
      window.addEventListener(
        "pointermove",
        (e) => {
          const r = beam.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const deg = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
          beam.style.setProperty("--a", deg + 90 + "deg");
        },
        { passive: true }
      );
    }
  }

  /* ---------- Code terminal: typed, syntax-highlighted, tabbed ---------- */
  const terminal = $("#terminal");
  const termCode = $("#terminal-code");
  if (terminal && termCode) {
    // Each line = array of [class|"", text] pairs. class "" = plain.
    const k = (t) => ["kw", t], f = (t) => ["fn", t], n = (t) => ["num", t],
      c = (t) => ["com", t], cl = (t) => ["cls", t], v = (t) => ["var", t],
      o = (t) => ["op", t], p = (t) => ["", t];
    const snippets = {
      matlab: [
        [c("% load wireless signal data + build features (MATLAB)")],
        [v("S"), o("   = "), f("load"), p("("), ["str", "'rf_vlp_scan.mat'"], p(");")],
        [v("iq"), o("  = "), v("S"), o("."), v("samples"), p(";        "), c("% complex I/Q")],
        [v("fs"), o("  = "), n("2.4e6"), p(";               "), c("% sample rate")],
        [],
        [c("% power + phase features per window")],
        [v("rssi"), o("  = "), n("20"), o("*"), f("log10"), p("("), f("abs"), p("("), v("iq"), p("));")],
        [v("phase"), o(" = "), f("unwrap"), p("("), f("angle"), p("("), v("iq"), p("));")],
        [v("feat"), o("  = [ "), f("mean"), p("("), v("rssi"), p("), "), f("std"), p("("), v("rssi"), p("), ...")],
        [p("          "), f("mean"), p("("), v("phase"), p("), "), f("bandpower"), p("("), v("iq"), p(") ];")],
        [],
        [f("save"), p("("), ["str", "'features.mat'"], p(", "), ["str", "'feat'"], p(");")],
      ],
      ml: [
        [c("# classify: localization + static vs. dynamic")],
        [k("from"), p(" sklearn.ensemble "), k("import"), p(" RandomForestClassifier")],
        [k("from"), p(" scipy.io "), k("import"), p(" loadmat")],
        [],
        [v("X"), o(", "), v("y"), o(" = "), f("load_features"), p("("), ["str", "'features.mat'"], p(")")],
        [v("clf"), o(" = "), cl("RandomForestClassifier"), p("("), v("n_estimators"), o("="), n("300"), p(")")],
        [v("clf"), o("."), f("fit"), p("("), v("X_train"), p(", "), v("y_train"), p(")")],
        [],
        [v("acc"), o(" = "), v("clf"), o("."), f("score"), p("("), v("X_test"), p(", "), v("y_test"), p(")")],
        [f("print"), p("("), ["str", "f'accuracy: {acc:.1%}'"], p(")")],
        [c("# 85.2% @ 2 ms window  ·  51.0% @ 20 ms window")],
      ],
    };

    function esc(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function lineToHTML(line) {
      return line
        .map(([cls, text]) =>
          cls ? `<span class="t-${cls}">${esc(text)}</span>` : esc(text)
        )
        .join("");
    }
    function renderFull(key) {
      return snippets[key].map(lineToHTML).join("\n");
    }

    let typing = null;
    function typeSnippet(key) {
      if (typing) clearTimeout(typing);
      const full = renderFull(key);
      if (reduceMotion) { termCode.innerHTML = full; return; }
      // type by revealing characters of the plain text, then swap to full HTML
      const lines = snippets[key];
      let li = 0, out = "";
      const step = () => {
        if (li >= lines.length) {
          termCode.innerHTML = full; // final colored version
          return;
        }
        out += (li ? "\n" : "") + lineToHTML(lines[li]);
        termCode.innerHTML = out;
        li++;
        typing = setTimeout(step, 90);
      };
      termCode.innerHTML = "";
      step();
    }

    // tabs
    $$(".tt", terminal).forEach((btn) =>
      btn.addEventListener("click", () => {
        $$(".tt", terminal).forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        typeSnippet(btn.dataset.snippet);
      })
    );

    // start typing when scrolled into view
    let started = false;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && !started) {
              started = true;
              typeSnippet("matlab");
              io.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      io.observe(terminal);
    } else {
      typeSnippet("matlab");
    }
  }

  /* ---------- Active mission photo → lightbox ---------- */
  const m1Photo = $("#m1-photo");
  if (m1Photo && lightbox && lightboxImg) {
    const openMission = () => {
      const img = $("img", m1Photo);
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    m1Photo.addEventListener("click", openMission);
    m1Photo.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openMission();
      }
    });
  }

  /* =========================================================
     INSPECTION PANEL — workbench gear + loadout projects
     ========================================================= */
  const inspect = $("#inspect");
  const inspectPanel = $(".inspect-panel", inspect || document);
  const inspectClose = $("#inspect-close");
  const inspectMedia = $("#inspect-media");
  const inspectImg = $("#inspect-img");
  const inspectKind = $("#inspect-kind");
  const inspectTitle = $("#inspect-title");
  const inspectBody = $("#inspect-body");

  /* ---- workbench: equipment inventory ---- */
  const GEAR = {
    turtlebot: {
      kind: "Equipment inspection",
      title: "TurtleBot3 Burger · Raspberry Pi 4 · OpenCR",
      img: "images/lab-turtlebot.jpg",
      alt: "TurtleBot3 build with Raspberry Pi 4 and OpenCR control board",
      what: "A compact research robot platform — stacked waffle plates carrying a Raspberry Pi 4 brain, OpenCR control board, 360° LiDAR, camera module, and drive motors.",
      used: "Active McNair × ICARUS Lab mission — the field unit for my sensor-reliability research, tested under normal and manipulated sensor conditions.",
      gained: "ROS 2 bring-up, sensor integration (LiDAR / camera / IMU), mapping and navigation testing, and hands-on robot assembly and debugging.",
    },
    zybo: {
      kind: "Equipment inspection",
      title: "Digilent Zybo Z7 (Xilinx Zynq XC7Z010)",
      img: "images/lab-zybo.jpg",
      alt: "Digilent Zybo Z7 FPGA development board",
      what: "An FPGA + ARM system-on-chip development board — programmable logic fabric alongside a hard processor.",
      used: "Digital Systems coursework at UMass Boston — combinational logic, FSMs, and sequence detectors synthesized onto the fabric.",
      gained: "VHDL design, simulation, and synthesis in Vivado; thinking in hardware — timing, state, and parallelism.",
    },
    opalrt: {
      kind: "Equipment inspection",
      title: "OPAL-RT OP4610XG real-time simulator",
      img: "images/lab-opalrt.jpg",
      alt: "OPAL-RT OP4610XG real-time simulator in the ICARUS Lab rack",
      what: "An FPGA-based real-time simulator that runs system models with hardware-grade timing — the core of a hardware-in-the-loop test rig.",
      used: "ICARUS Lab — hardware-in-the-loop experiments supporting the TurtleBot3 sensor-reliability mission.",
      gained: "Hardware-in-the-loop methodology: exercising real control hardware against simulated conditions safely and repeatably.",
    },
    scope: {
      kind: "Equipment inspection",
      title: "Oscilloscope bench — Tektronix 2215",
      img: "images/lab-scope.jpg",
      alt: "Tektronix 2215 oscilloscope and BK Precision function generator",
      what: "A dual-channel analog oscilloscope paired with a BK Precision function generator on the circuits bench.",
      used: "Circuit Analysis labs — reading waveforms for phase, frequency, and filter measurements.",
      gained: "Reading real signals, not just simulations: triggering, probing, and interpreting amplitude / phase behavior.",
    },
    funcgen: {
      kind: "Equipment inspection",
      title: "Tektronix AFG3022C function generator",
      img: "images/lab-funcgen.jpg",
      alt: "Tektronix AFG3022C dual channel arbitrary function generator",
      what: "A dual-channel arbitrary/function generator (25 MHz, 250 MS/s) for driving circuits under test.",
      used: "Circuits and signals labs — sourcing sine, square, and arbitrary waveforms into filters and amplifiers.",
      gained: "Designing stimulus for a measurement: choosing waveforms, frequencies, and amplitudes that reveal how a circuit behaves.",
    },
    psu: {
      kind: "Equipment inspection",
      title: "Keithley 2230-30-1 supply · Tektronix DMM 4020",
      img: "images/lab-psu.jpg",
      alt: "Tektronix DMM 4020 multimeter above a Keithley 2230-30-1 DC power supply",
      what: "A triple-channel programmable DC power supply with a 5½-digit bench multimeter above it.",
      used: "Powering and characterizing circuits across lab coursework and prototyping.",
      gained: "Safe power-up habits — current limits, rail sequencing, and verifying a circuit before trusting it.",
    },
    dmm: {
      kind: "Equipment inspection",
      title: "Keithley DMM6500 benchtop multimeter",
      img: "images/lab-dmm.jpg",
      alt: "Keithley DMM6500 6.5 digit benchtop multimeter",
      what: "A 6½-digit touchscreen multimeter for precision voltage, current, and resistance measurement.",
      used: "Precision characterization on the circuits bench — where a handheld meter isn't accurate enough.",
      gained: "Measurement discipline: resolution vs. accuracy, loading effects, and trusting (or questioning) a reading.",
    },
    matlab: {
      kind: "Toolchain inspection",
      title: "MATLAB & Python",
      what: "My analysis pair — MATLAB for signal work and lab data, Python for ML pipelines and automation.",
      used: "UCaN Lab mission (wireless-signal features and classification models) and ongoing robotics data analysis.",
      gained: "Turning raw captures into evidence: feature extraction, model training, and clear, reusable plots.",
    },
    sdr: {
      kind: "Toolchain inspection",
      title: "SDR & GNU Radio",
      what: "Software-defined radio hardware and flowgraph tooling for capturing and processing RF.",
      used: "UCaN Lab RF localization testbed and the AFRL SDR University Challenge — capturing I/Q data for the ML pipeline.",
      gained: "Practical RF: sample rates, I/Q data, fingerprinting, and building flowgraphs that produce usable datasets.",
    },
    ltspice: {
      kind: "Toolchain inspection",
      title: "LTspice",
      what: "A circuit simulator for validating designs before they touch the bench.",
      used: "Circuit Analysis coursework — RC/RL filters and sinusoidal-response verification.",
      gained: "Predict-then-measure habits: simulate expected behavior, then confirm it with the scope.",
    },
    fab: {
      kind: "Toolchain inspection",
      title: "CAD, 3D printing & prototyping",
      what: "Onshape CAD modeling, 3D printing, and soldering / prototyping equipment for physical builds.",
      used: "Enclosures and mounts for embedded and robotics projects, plus client work through Your Favorite Engineer LLC.",
      gained: "Design-for-manufacture instincts — tolerances, print orientation, and iterating hardware quickly.",
    },
  };

  /* ---- loadout: equipped project systems ---- */
  const PROJECTS = {
    mediseek: {
      kind: "Loadout inspection",
      title: "MediSeek",
      img: "images/Fricas.jpg",
      alt: "MediSeek AI troubleshooting agent",
      overview: "An AI-powered troubleshooting agent that helps healthcare professionals diagnose and resolve biomedical device issues quickly.",
      purpose: "Device downtime in clinical settings costs care time. MediSeek puts guided, source-grounded troubleshooting in front of the people using the equipment.",
      tech: ["NeuralSeek", "LLM agents", "Retrieval & grounding", "Conversational UX"],
      notes: "Built during my AI Agent Builder internship at NeuralSeek — my deep-dive into designing agents that stay grounded in real documentation.",
      links: [
        { label: "Watch the demo", href: "https://drive.google.com/file/d/1Q_cxshvEWa62OMOeEzWxSlPKlFfLyp2v/view?usp=drive_link", icon: "bx-play-circle" },
      ],
    },
    companion: {
      kind: "Loadout inspection",
      title: "Robot Companion Prototype",
      img: "images/robot-companion-print.jpg",
      alt: "3D-printed robot companion parts on the print bed",
      overview: "An embedded robotics prototype made to explore how expressive interfaces can improve human-robot interaction.",
      purpose: "By combining animation, sound, and responsive behaviors, the project creates a fun way to make future assistive robots feel more intuitive, friendly, and approachable.",
      tech: ["ESP32", "Embedded C++", "Sensors", "Displays", "3D printing"],
      notes: "In progress — Adventure Time inspired. Enclosure and parts designed and 3D-printed in-house; expressiveness starts with the physical shell.",
      links: [
        { label: "Project files", href: "https://drive.google.com/drive/folders/1umzrrsLL2Iz6OcSJdVIZnkS8StVDBA4_", icon: "bx-folder-open" },
      ],
    },
    pc: {
      kind: "Loadout inspection",
      title: "Custom PC Build",
      img: "images/built pc.jpg",
      alt: "Custom PC build",
      overview: "A full hardware build assembled from individually selected components.",
      purpose: "Spec, budget, and build a machine for real workloads — and understand every part inside it.",
      tech: ["Component selection", "Assembly & cable management", "BIOS / OS setup", "Thermal planning"],
      notes: "The best way to learn computer architecture is to hold it — compatibility, airflow, and troubleshooting a build that won't POST.",
      links: [],
    },
    cad: {
      kind: "Loadout inspection",
      title: "3D CAD & Manufacturing",
      img: "images/CAD.png",
      alt: "3D CAD design and printing",
      overview: "Parametric CAD design and rapid prototyping for engineering projects.",
      purpose: "Turn ideas into printable, functional parts — enclosures, mounts, and mechanical pieces for robotics and embedded builds.",
      tech: ["Onshape", "3D printing", "Design for manufacture"],
      notes: "Also the fabrication arm of Your Favorite Engineer LLC — client parts have to fit, print cleanly, and survive use.",
      links: [
        { label: "View the CAD document", href: "https://cad.onshape.com/documents/773beb91267d6aa8bda018d6/w/b99abb94f881588028c7297e/e/31bd2a92c06c45acb058853c", icon: "bx-link-external" },
      ],
    },
    binary: {
      kind: "Loadout inspection",
      title: "Binary Calculator",
      img: "images/tinkercad.png",
      alt: "Binary calculator circuit",
      overview: "A logic-circuit calculator designed with discrete components and microcontrollers.",
      purpose: "Prove out binary arithmetic in actual hardware — gates and logic you can point to, not just code.",
      tech: ["Digital logic design", "Discrete components", "Microcontrollers", "Tinkercad"],
      notes: "A bridge project between coursework theory and physical circuits — debugging logic with a truth table in one hand.",
      links: [
        { label: "Project files", href: "https://drive.google.com/drive/folders/1eeOzxrOwPxCz8A4reeVSvs_Iioijv14B?usp=sharing", icon: "bx-folder-open" },
      ],
    },
    audio: {
      kind: "Loadout inspection",
      title: "Audio Processing Engine",
      img: "images/audio-dashboard.jpg",
      alt: "Audio analytics dashboard showing file properties, quality analysis, and waveform preview",
      overview: "Developed a comprehensive solution for managing and processing audio recording files.",
      purpose: "Enhanced user experience with clear prompts and detailed output.",
      tech: ["C++", "Data algorithms", "Input validation", "String manipulation", "Cost calculations"],
      notes: "Applied advanced C++ concepts such as input validation, string manipulation, and cost calculations.",
      links: [
        { label: "GitHub repository", href: "https://github.com/shyfricas/Audio-Recording-Processing-Program", icon: "bxl-github" },
      ],
    },
    speech: {
      kind: "Loadout inspection",
      title: "Speech Recognition",
      img: "images/sr-code.png",
      alt: "Python speech-recognition code snippet using the microphone and Google recognizer",
      overview: "A machine-learning model that processes voice commands, built as assistive technology for people with hearing impairments.",
      purpose: "Assistive tech is why I engineer — this project turns spoken input into something usable for people who can't rely on hearing it.",
      tech: ["Python", "Machine learning", "Speech-to-text"],
      notes: "An early proof of the thread that runs through my research: signals in, genuine help out.",
      links: [
        { label: "GitHub repository", href: "https://github.com/shyfricas/speech-recognition.git", icon: "bxl-github" },
      ],
    },
    tbresearch: {
      kind: "Loadout inspection",
      title: "TurtleBot3 Research",
      img: "images/turtlebot-full.jpg",
      alt: "Fully assembled TurtleBot3 Burger with LiDAR and camera in a pink 3D-printed mount",
      overview: "My McNair × ICARUS Lab research platform — a TurtleBot3 Burger used to study how sensor-based navigation responds to manipulated, delayed, or noisy sensor input.",
      purpose: "Quantify navigation degradation under unreliable sensing and test defenses — filtering, sensor redundancy, validation checks — that restore it.",
      tech: ["TurtleBot3 Burger", "ROS 2", "LiDAR", "Camera", "IMU", "Raspberry Pi", "OpenCR", "Python"],
      notes: "See the full briefing in the Active Mission panel above — this is the field unit itself.",
      links: [
        { label: "Research proposal", href: "images/McNair_Research_Proposal.pdf", icon: "bx-file" },
        { label: "Robotics data", href: "https://drive.google.com/drive/folders/15rwQY5mAljiS1W2zsv25B9lW-M5XYLcm", icon: "bx-folder-open" },
      ],
    },
  };

  if (inspect && inspectPanel && inspectBody) {
    let lastFocused = null;

    const escHTML = (s) =>
      String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const row = (label, text) =>
      `<dl class="ins-row"><dt>${escHTML(label)}</dt><dd>${escHTML(text)}</dd></dl>`;

    const chips = (arr) =>
      `<ul class="chip-row">${arr.map((t) => `<li>${escHTML(t)}</li>`).join("")}</ul>`;

    const linkBtns = (links) =>
      links && links.length
        ? `<div class="ins-links">${links
            .map(
              (l) =>
                `<a class="btn btn-ghost" href="${escHTML(l.href)}" target="_blank" rel="noopener"><i class="bx ${escHTML(l.icon)}"></i> ${escHTML(l.label)}</a>`
            )
            .join("")}</div>`
        : "";

    function openInspect(data) {
      lastFocused = document.activeElement;
      inspectKind.textContent = data.kind;
      inspectTitle.textContent = data.title;

      if (data.img) {
        inspectImg.src = data.img;
        inspectImg.alt = data.alt || data.title;
        inspectMedia.hidden = false;
      } else {
        inspectImg.src = "";
        inspectMedia.hidden = true;
      }

      let html = "";
      if (data.what) {
        // equipment readout
        html += row("What it is", data.what);
        html += row("Used in", data.used);
        html += row("Skill gained", data.gained);
      } else {
        // project readout
        html += `<p>${escHTML(data.overview)}</p>`;
        html += row("Purpose", data.purpose);
        html += `<dl class="ins-row"><dt>Technologies</dt><dd>${chips(data.tech)}</dd></dl>`;
        if (data.notes) html += row("Results & lessons", data.notes);
        html += linkBtns(data.links);
      }
      inspectBody.innerHTML = html;

      inspect.hidden = false;
      document.body.style.overflow = "hidden";
      inspectClose.focus();
    }

    function closeInspect() {
      inspect.hidden = true;
      document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    // wire up inspectable cards (workbench gear + loadout projects)
    const wire = (selector, source, attr) => {
      $$(selector).forEach((card) => {
        const open = () => {
          const data = source[card.dataset[attr]];
          if (data) openInspect(data);
        };
        card.addEventListener("click", (e) => {
          // let real links inside the card (credential / repo buttons) work normally
          if (e.target.closest("a")) return;
          open();
        });
        card.addEventListener("keydown", (e) => {
          if ((e.key === "Enter" || e.key === " ") && e.target === card) {
            e.preventDefault();
            open();
          }
        });
      });
    };
    wire("[data-gear]", GEAR, "gear");
    wire("[data-project]", PROJECTS, "project");

    if (inspectClose) inspectClose.addEventListener("click", closeInspect);
    inspect.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-close")) closeInspect();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !inspect.hidden) closeInspect();
      // simple focus trap while the panel is open
      if (e.key === "Tab" && !inspect.hidden) {
        const focusables = $$(
          "button, a[href], [tabindex]:not([tabindex='-1'])",
          inspectPanel
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
})();
