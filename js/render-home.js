// 첫 화면: 관점 전환, 프로젝트 장면, 그 외 프로젝트, 문제 해결, PDF 창
(() => {
  const P = window.PORTFOLIO;
  const { $, esc, copyText, flash, countUp } = window.UI;
  const byId = (id) => P.projects.find((p) => p.id === id);
  const pdfFor = { role: (r) => `pdf/role-${r.id}.pdf`, onepager: "pdf/onepager-all.pdf", project: (id) => `pdf/project-${id}.pdf` };
  const roleLink = (r) => P.site.url + (r.id === "all" ? "" : `?role=${r.id}`);
  let currentRole = P.roles[0];
  // 상세 페이지에서 돌아오거나 다음 프로젝트로 넘어가도 고른 관점이 유지되게 주소에 함께 넘긴다
  const detailHref = (id) => `project.html?id=${esc(id)}${currentRole.id === "all" ? "" : `&role=${currentRole.id}`}`;

  // 카드에는 숫자 두 칸만 두고 나머지는 상세 페이지에서 보여 준다
  function metricsHTML(metrics) {
    return `<ul class="metrics">${metrics.slice(0, 2).map((m) => `
      <li class="metric"${m.note ? ` title="${esc(m.note)}"` : ""}>
        <span class="metric__value" data-count>${esc(m.value)}</span>
        <span class="metric__label">${esc(m.label)}</span>
      </li>`).join("")}</ul>`;
  }

  function actionsHTML(p) {
    if (p.tier !== "featured") {
      return p.links.map((l) => `<a class="more-link" href="${esc(l.url)}">${esc(l.label)} ↗</a>`).join(" ");
    }
    return `<a class="more-link" href="${detailHref(p.id)}">프로젝트 전체 보기 →</a>`;
  }

  function sceneHTML(p, n) {
    const title = p.tier === "featured" ? `<a href="${detailHref(p.id)}">${esc(p.name)}</a>` : esc(p.name);
    return `<article class="scene card" id="ps-${esc(p.id)}">
      <p class="label">Project ${String(n).padStart(2, "0")}, ${esc(p.kind)}</p>
      <h3 class="scene__title">${title}</h3>
      <p class="easy">${esc(p.easy)}</p>
      <dl class="facts"><div><dt>기간</dt><dd>${esc(p.period)}</dd></div><div><dt>팀</dt><dd>${esc(p.team)}</dd></div><div><dt>내 기여</dt><dd>${esc(p.contribution)}</dd></div></dl>
      <p class="role-line"><span class="label">맡은 일</span> ${esc(p.roleLine)}</p>
      ${metricsHTML(p.metrics)}
      <p class="scene__actions">${actionsHTML(p)}</p>
    </article>`;
  }

  function renderScenes(role) {
    const box = $("#scenes");
    box.innerHTML = role.order.map((id, i) => sceneHTML(byId(id), i + 1)).join("");
    countUp(box);
  }

  // 오른쪽 점 목차: 섹션과 지금 관점의 프로젝트
  function renderToc(role) {
    const item = (id, label, proj) => `<li><a href="#${esc(id)}"${proj ? ' class="toc--proj"' : ""}><span>${esc(label)}</span><i aria-hidden="true"></i></a></li>`;
    const tail = [["debug", "문제 해결"], ["build", "일하는 방식"], ["story", "성장"], ["records", "기록"], ["contact", "연락처"]];
    $("#toc").innerHTML = item("top", "첫 화면") + item("projects", "프로젝트")
      + role.order.map((id) => item(`ps-${id}`, byId(id).name, true)).join("")
      + tail.map(([id, label]) => item(id, label)).join("");
  }

  function renderOthers(role) {
    const shown = new Set(role.order);
    $("#others").innerHTML = P.others.map((o) => (o.projectId ? { ...byId(o.projectId), id: o.projectId } : o))
      .filter((o) => !shown.has(o.id))
      .map((o) => `<li class="other card"><p class="label">${esc(o.period)}, ${esc(o.kind)}</p>
        <h4>${esc(o.name)}</h4><p>${esc(o.easy)}</p>
        <p class="muted">${esc(o.result || o.roleLine || "")}</p>
        ${(o.links || []).map((l) => `<a class="more-link" href="${esc(l.url)}">${esc(l.label)} ↗</a>`).join(" ")}</li>`).join("");
  }

  function debugCard(d) {
    const names = ["무슨 일이", "원인", "해결", "결과"];
    return `<article class="dbg card"><p class="label">${esc(byId(d.project).name)}</p>
      <h3 class="dbg__title">${esc(d.title)}</h3>
      <p class="dbg__res"><b>${esc(d.result.value)}</b> <span>${esc(d.result.label)}</span></p>
      <ol class="dbg__steps">${d.steps.map((s, i) => `<li><span class="label">${names[i]}</span>${esc(s)}</li>`).join("")}</ol></article>`;
  }

  // 관점마다 앞에 세울 3건이 다르고, 나머지는 '더 보기'에 넣는다
  function renderDebug(role) {
    const front = role.debug.map((id) => P.debug.find((d) => d.id === id));
    const rest = P.debug.filter((d) => !role.debug.includes(d.id));
    $("#debug-list").innerHTML = front.map(debugCard).join("");
    $("#debug-rest").innerHTML = rest.map(debugCard).join("");
    $("#debug-more-n").textContent = rest.length;
  }

  function renderPdfDialog() {
    const roleRows = P.roles.map((r) => `<li class="dl__row${r === currentRole ? " is-current" : ""}">
      <span>${esc(`${r.label} 관점`)}${r === currentRole ? ' <span class="label">지금 보는 관점</span>' : ""}</span>
      <a href="${pdfFor.role(r)}" download>PDF</a>
      <button type="button" class="btn btn--link" data-copy="${esc(roleLink(r))}">링크 복사</button></li>`).join("");
    const projectRows = P.projects.filter((p) => p.tier === "featured").map((p) => `<li class="dl__row">
      <span>${esc(p.name)}</span><a href="${pdfFor.project(p.id)}" download>PDF</a></li>`).join("");
    $("#pdf-dialog").innerHTML = `<h2 id="pdf-title">PDF 받기</h2>
      <h3 class="label">관점별</h3><ul class="dl">${roleRows}
        <li class="dl__row"><span>전체 원페이저 (1쪽 요약)</span><a href="${pdfFor.onepager}" download>PDF</a></li></ul>
      <h3 class="label">프로젝트별</h3><ul class="dl">${projectRows}</ul>
      <span class="flash" id="dl-flash" role="status" aria-live="polite"></span>
      <form method="dialog"><button class="btn">닫기</button></form>`;
  }

  function setRole(id, push) {
    currentRole = P.roles.find((r) => r.id === id) || P.roles[0];
    $("#hero-intro").textContent = currentRole.intro;
    $("#hero-label").textContent = `이한솔 Lee Hansol / ${currentRole.id === "all" ? "AI, AX, 서비스 기획" : currentRole.label}`;
    $("#hero-proof").innerHTML = currentRole.proof.map((x) => `<li>${esc(x)}</li>`).join("");
    document.querySelectorAll("#roles button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.role === currentRole.id)));
    const onepager = $("#hero-onepager");
    onepager.href = currentRole.id === "all" ? pdfFor.onepager : pdfFor.role(currentRole);
    onepager.textContent = currentRole.id === "all" ? "원페이저 PDF" : `${currentRole.label} PDF`;
    renderScenes(currentRole);
    renderToc(currentRole);
    renderOthers(currentRole);
    renderDebug(currentRole);
    renderPdfDialog();
    if (push) history.replaceState(null, "", currentRole.id === "all" ? location.pathname : `?role=${currentRole.id}`);
  }

  function bindEvents() {
    $("#roles").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setRole(b.dataset.role, true); });
    document.addEventListener("click", async (e) => {
      if (e.target.closest("[data-open-pdf]")) $("#pdf-dialog").showModal();
      const copyBtn = e.target.closest("[data-copy]");
      if (copyBtn) flash($("#dl-flash"), (await copyText(copyBtn.dataset.copy)) ? "링크를 복사했습니다" : copyBtn.dataset.copy);
    });
  }

  function init() {
    const print = new URLSearchParams(location.search).get("print");
    if (print) document.documentElement.classList.add(`print-${print}`);
    $("#hero-sub").textContent = P.site.subline;
    $("#roles").innerHTML = P.roles.map((r) => `<button type="button" data-role="${r.id}" aria-pressed="false">${esc(r.label)}</button>`).join("");
    window.Sections.renderAll();
    bindEvents();
    window.UI.initAll();
    setRole(new URLSearchParams(location.search).get("role"), false);
    // 내용을 그린 뒤라야 #debug 같은 주소의 위치가 맞으므로 다시 이동한다.
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "instant" });
  }
  init();
})();
