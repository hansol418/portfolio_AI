// 공통 동작: 이스케이프, 테마, 복사, 진행 막대, 목차, 라이트박스, 숫자 효과
window.UI = (() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function initTheme() {
    const root = document.documentElement;
    const sync = () => $$("[data-theme-toggle]").forEach((b) => {
      const dark = root.dataset.theme === "dark";
      b.setAttribute("aria-pressed", String(dark));
      b.textContent = "다크 모드";
    });
    $$("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) { /* 저장이 막혀도 이번 화면에는 적용된다 */ }
      sync();
    }));
    sync();
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* 아래 대체 방식으로 */ }
    const area = Object.assign(document.createElement("textarea"), { value: text, readOnly: true });
    area.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    area.remove();
    return ok;
  }

  function flash(el, message) {
    if (!el) return;
    el.textContent = message;
    clearTimeout(el._timer);
    el._timer = setTimeout(() => { el.textContent = ""; }, 4000);
  }

  // 위쪽 메뉴와 오른쪽 점 목차에서 지금 보는 섹션을 표시한다. 목차는 관점을 바꾸면 다시 그려지므로 매번 찾는다.
  function markCurrent(links, y) {
    let current = -1;
    links.forEach((a, i) => { const s = document.getElementById(a.hash.slice(1)); if (s && s.getBoundingClientRect().top + window.scrollY <= y) current = i; });
    links.forEach((a, i) => a.toggleAttribute("aria-current", i === current));
  }

  function initProgress() {
    const bar = $("#progress-bar");
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
      const y = window.scrollY + window.innerHeight * 0.35;
      markCurrent($$("#nav-links a"), y);
      markCurrent($$("#toc a"), y);
      $("#nav")?.classList.toggle("nav--scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  const lightbox = { list: [], index: 0 };
  function showShot(i) {
    const dialog = $("#lightbox");
    lightbox.index = (i + lightbox.list.length) % lightbox.list.length;
    const s = lightbox.list[lightbox.index];
    $("#lb-img").src = s.src;
    $("#lb-img").alt = s.alt;
    $("#lb-cap").textContent = `${lightbox.index + 1} / ${lightbox.list.length} — ${s.caption || s.alt}`;
    if (!dialog.open) dialog.showModal();
  }
  function openLightbox(list, i) { lightbox.list = list; showShot(i); }
  function initLightbox() {
    const dialog = $("#lightbox");
    if (!dialog) return;
    dialog.addEventListener("click", (e) => {
      const action = e.target.closest("[data-lb]")?.dataset.lb;
      if (action === "prev") showShot(lightbox.index - 1);
      else if (action === "next") showShot(lightbox.index + 1);
      else if (action === "close" || e.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") showShot(lightbox.index - 1);
      if (e.key === "ArrowRight") showShot(lightbox.index + 1);
    });
  }

  function countUp(root) {
    const els = $$("[data-count]", root);
    // PDF로 인쇄할 때는 애니메이션 도중의 숫자가 찍히지 않게 효과를 끈다
    if (reduceMotion || new URLSearchParams(location.search).has("print") || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      animateNumber(entry.target);
    }), { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }
  function animateNumber(el) {
    const text = el.textContent;
    const match = text.match(/\d[\d,.]*/);
    if (!match) return;
    const target = parseFloat(match[0].replace(/,/g, ""));
    const decimals = (match[0].split(".")[1] || "").length;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / 700, 1);
      const value = (target * t).toFixed(decimals);
      const shown = match[0].includes(",") ? Number(value).toLocaleString("ko-KR") : value;
      el.textContent = text.replace(match[0], shown);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = text;
    };
    requestAnimationFrame(tick);
  }

  function initAll() { initTheme(); initProgress(); initLightbox(); }
  return { $, $$, esc, copyText, flash, openLightbox, countUp, initAll };
})();
