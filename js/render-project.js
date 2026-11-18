// 프로젝트 상세 페이지(project.html?id=…)
(() => {
  const P = window.PORTFOLIO;
  const PRINT = new URLSearchParams(location.search).has("print");
  const ROLE = P.roles.find((r) => r.id === new URLSearchParams(location.search).get("role") && r.id !== "all");
  const ROLE_QUERY = ROLE ? `&role=${ROLE.id}` : "";
  const { $, esc, openLightbox, countUp } = window.UI;
  const list = (items) => `<ul class="plain">${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  // 섹션마다 같은 머리말(번호 + 제목)을 두고, 글 내용은 흰 카드에 담는다. 화면, 문제 해결은 각자 카드라 바깥 카드를 두지 않는다.
  const section = (id, title, body, bare) => (body ? `<section class="d-sec" id="${id}"><h2>${title}</h2>${bare ? body : `<div class="card d-card">${body}</div>`}</section>` : "");

  function metricsHTML(metrics) {
    return `<ul class="metrics metrics--detail">${metrics.map((m) => `<li class="metric">
      <span class="metric__value" data-count>${esc(m.value)}</span><span class="metric__label">${esc(m.label)}</span>
      ${m.note ? `<span class="metric__note">${esc(m.note)}</span>` : ""}</li>`).join("")}</ul>`;
  }

  const no = (i) => String(i + 1).padStart(2, "0");
  const WHO = { "사람": "human", "AI": "ai", "시스템": "sys" };
  const note = (label, text, cls = "") => `<p class="flow__note${cls}"><span>${label}</span>${text}</p>`;

  // 인사담당자가 왼쪽에서 오른쪽으로 한 번만 읽으면 되게: 단계 이름을 화살표로 한 줄에 잇고 담당과 설명은 아래에 작게
  function flowHTML(flow) {
    if (!flow) return "";
    const steps = flow.steps.map((st, i) => `<li class="flow__step"><b><span class="flow__no">${no(i)}</span>${esc(st.title)}</b>
      <span class="flow__who flow__who--${WHO[st.actor]}">${esc(st.actor)}</span><span>${esc(st.desc)}</span></li>`).join("");
    return `<figure class="flow" aria-label="처리 흐름">${flow.roles ? note("사용자", flow.roles.map(esc).join(", ")) : ""}
      ${flow.before ? note("바꾸기 전", flow.before.map(esc).join(", ")) : ""}
      <ol class="flow__row" style="--n:${flow.steps.length}">${steps}</ol>
      ${note("결과", esc(flow.result), " flow__result")}</figure>`;
  }

  const roleHTML = (rows) => `<ul class="d-role">${rows.map((r) => `<li><span class="label">${esc(r.kind)}</span>${esc(r.text)}</li>`).join("")}</ul>`;

  // 모든 문제 해결을 원인, 해결(항상 목록), 결과 세 칸으로 같은 모양으로 그린다
  const steps = (s) => {
    const fix = [].concat(s.fix).map((x) => `<li>${esc(x)}</li>`).join("");
    return `<div><dt>원인</dt><dd>${esc(s.cause)}</dd></div><div><dt>해결</dt><dd><ul>${fix}</ul></dd></div><div><dt>결과</dt><dd>${esc(s.result)}</dd></div>`;
  };

  function solveHTML(items) {
    if (!items || !items.length) return "";
    return items.map((s, i) => `<article class="d-ch card"><p class="label">${String(i + 1).padStart(2, "0")} 문제 해결</p>
      <div><h3>${esc(s.title)}</h3><dl class="d-steps">${steps(s)}</dl></div></article>`).join("");
  }

  function shotsHTML(p) {
    if (!p.shots.length) return "";
    const phone = p.id === "tw-mobile";
    return `<ol class="gallery${phone ? " gallery--phone" : ""}">${p.shots.map((s, i) => `<li><figure>
      <button type="button" class="frame" data-shot="${i}" aria-label="${esc(s.caption)} 크게 보기">
        <img src="${esc(s.src)}" alt="${esc(s.alt)}" loading="${PRINT ? "eager" : "lazy"}"></button>
      <figcaption><span class="num">${String(i + 1).padStart(2, "0")}</span>${esc(s.caption)}</figcaption></figure></li>`).join("")}</ol>`;
  }

  function headerHTML(p) {
    const links = p.links.map((l) => `<a class="btn btn--ghost" href="${esc(l.url)}">${esc(l.label)} ↗</a>`).join("");
    return `<header class="d-head">
      <p class="eyebrow">${esc(p.kind)}</p>
      <h1>${esc(p.name)}</h1>
      <p class="easy">${esc(p.easy)}</p>
      <dl class="facts"><div><dt>기간</dt><dd>${esc(p.period)}</dd></div><div><dt>팀</dt><dd>${esc(p.team)}</dd></div><div><dt>내 기여</dt><dd>${esc(p.contribution)}</dd></div></dl>
      <p class="role-line"><span class="label">맡은 일</span> ${esc(p.roleLine)}</p>
      ${links ? `<p class="d-links">${links}</p>` : ""}
      <div class="card d-metrics">${metricsHTML(p.metrics)}</div></header>`;
  }

  function render(p) {
    document.title = `${p.name} | 이한솔 포트폴리오`;
    $("#project-pdf").href = `pdf/project-${p.id}.pdf`;
    const principle = p.principle ? `<p class="d-principle">${esc(p.principle)}</p>` : "";
    $("#detail").innerHTML = headerHTML(p)
      + section("problem", "문제", `<p class="d-text">${esc(p.problem)}</p>`)
      + section("approach", "접근", principle + flowHTML(p.flow) + list(p.approach))
      + section("role", "내 역할", roleHTML(p.myRole))
      + section("shots", `화면 <span class="label">${p.shots.length}장</span>`, shotsHTML(p), true)
      + section("solve", "문제 해결", solveHTML(p.solve), true)
      + section("verify", "검증", p.verify && p.verify.length ? list(p.verify) : "")
      + section("tech", "사용한 기술", `<p>${p.tech.map(esc).join(", ")}</p>`)
      + nextHTML(p);
    $("#detail").addEventListener("click", (e) => {
      const b = e.target.closest("[data-shot]");
      if (b) openLightbox(p.shots, Number(b.dataset.shot));
    });
    countUp($("#detail"));
  }

  function nextHTML(p) {
    // 고른 관점의 대표 프로젝트 순서를 따르고, 둘 미만이면 전체 순서로 돌아간다
    const featured = (ids) => ids.filter((x) => P.projects.some((q) => q.id === x && q.tier === "featured"));
    let order = featured(ROLE ? ROLE.order : []);
    if (order.length < 2) order = featured(P.roles[0].order);
    const next = P.projects.find((x) => x.id === order[(order.indexOf(p.id) + 1) % order.length]);
    return `<nav class="d-next" aria-label="다음 프로젝트"><span class="label">다음 프로젝트</span>
      <a href="project.html?id=${esc(next.id)}${ROLE_QUERY}">${esc(next.name)} →</a></nav>`;
  }

  const id = new URLSearchParams(location.search).get("id");
  if (ROLE_QUERY) $("#back-link").href = `./?role=${ROLE.id}#projects`;
  const project = P.projects.find((p) => p.id === id && p.tier === "featured");
  window.UI.initAll();
  if (project) render(project);
  else {
    $("#detail-missing").hidden = false;
    $("#project-pdf").hidden = true;
  }
})();
