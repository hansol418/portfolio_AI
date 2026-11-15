// 프로젝트 상세 페이지(project.html?id=…)
(() => {
  const P = window.PORTFOLIO;
  const PRINT = new URLSearchParams(location.search).has("print");
  const { $, esc, badge, openLightbox, countUp } = window.UI;
  const list = (items) => `<ul class="plain">${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  // 섹션마다 같은 머리말(번호 + 제목)을 두고, 글 내용은 흰 카드에 담는다. 화면·문제 해결은 각자 카드라 바깥 카드를 두지 않는다.
  const section = (id, title, body, bare) => (body ? `<section class="d-sec" id="${id}"><h2>${title}</h2>${bare ? body : `<div class="card d-card">${body}</div>`}</section>` : "");

  function metricsHTML(metrics) {
    return `<ul class="metrics metrics--detail">${metrics.map((m) => `<li class="metric">
      <span class="metric__value" data-count>${esc(m.value)}</span><span class="metric__label">${esc(m.label)}</span>
      ${badge(m.badge)}${m.note ? `<span class="metric__note">${esc(m.note)}</span>` : ""}</li>`).join("")}</ul>`;
  }

  const ACTOR = { "사람": "human", "AI": "ai", "시스템": "sys" };

  // 경영진이 한눈에 읽도록: 바꾸기 전 → 단계(주체별 색) → 결과
  function flowHTML(flow) {
    if (!flow) return "";
    const before = flow.before ? `<div class="flow__before"><p class="flow__tag">바꾸기 전</p>
      <ul>${flow.before.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` : "";
    const roles = flow.roles ? `<p class="flow__roles"><span>사용자</span>${flow.roles.map((r) => `<b>${esc(r)}</b>`).join("")}</p>` : "";
    const steps = flow.steps.map((st, i) => `<li class="flow__step flow__step--${ACTOR[st.actor]}">
      <span class="flow__no">${String(i + 1).padStart(2, "0")}</span><span class="flow__actor">${esc(st.actor)}</span>
      <b>${esc(st.title)}</b><span class="flow__desc">${esc(st.desc)}</span></li>`).join("");
    return `<figure class="flow" aria-label="처리 흐름">${before}
      <div class="flow__after"><p class="flow__tag">바꾼 뒤</p>${roles}<ol class="flow__steps">${steps}</ol></div>
      <p class="flow__result"><span>결과</span>${esc(flow.result)}</p>
      <figcaption class="flow__legend"><span class="flow__key flow__key--human">사람</span><span class="flow__key flow__key--ai">AI</span><span class="flow__key flow__key--sys">시스템</span>이 맡는 단계</figcaption></figure>`;
  }

  const roleHTML = (rows) => `<ul class="d-role">${rows.map((r) => `<li><span class="label">${esc(r.kind)}</span>${esc(r.text)}</li>`).join("")}</ul>`;

  // 모든 문제 해결을 원인 · 해결(항상 목록) · 결과 세 칸으로 같은 모양으로 그린다
  const steps = (s) => {
    const fix = [].concat(s.fix).map((x) => `<li>${esc(x)}</li>`).join("");
    return `<div><dt>원인</dt><dd>${esc(s.cause)}</dd></div><div><dt>해결</dt><dd><ul>${fix}</ul></dd></div><div><dt>결과</dt><dd>${esc(s.result)}</dd></div>`;
  };

  function solveHTML(items) {
    if (!items || !items.length) return "";
    return items.map((s, i) => `<article class="d-ch card"><p class="label">${String(i + 1).padStart(2, "0")} · 문제 해결</p>
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
    document.title = `${p.name} · 이한솔 포트폴리오`;
    $("#project-pdf").href = `pdf/project-${p.id}.pdf`;
    const principle = p.principle ? `<p class="d-principle">${esc(p.principle)}</p>` : "";
    $("#detail").innerHTML = headerHTML(p)
      + section("problem", "문제", `<p class="d-text">${esc(p.problem)}</p>`)
      + section("approach", "접근", principle + flowHTML(p.flow) + list(p.approach))
      + section("role", "내 역할", roleHTML(p.myRole))
      + section("shots", `화면 <span class="label">${p.shots.length}장</span>`, shotsHTML(p), true)
      + section("solve", "문제 해결", solveHTML(p.solve), true)
      + section("verify", "검증", p.verify && p.verify.length ? list(p.verify) : "")
      + section("tech", "사용한 기술", `<p class="d-tech">${p.tech.map(esc).join(" · ")}</p>`)
      + nextHTML(p);
    $("#detail").addEventListener("click", (e) => {
      const b = e.target.closest("[data-shot]");
      if (b) openLightbox(p.shots, Number(b.dataset.shot));
    });
    countUp($("#detail"));
  }

  function nextHTML(p) {
    const order = P.roles[0].order;
    const next = P.projects.find((x) => x.id === order[(order.indexOf(p.id) + 1) % order.length]);
    return `<nav class="d-next" aria-label="다음 프로젝트"><span class="label">다음 프로젝트</span>
      <a href="project.html?id=${esc(next.id)}">${esc(next.name)} →</a></nav>`;
  }

  const id = new URLSearchParams(location.search).get("id");
  const project = P.projects.find((p) => p.id === id && p.tier === "featured");
  window.UI.initAll();
  if (project) render(project);
  else {
    $("#detail-missing").hidden = false;
    $("#project-pdf").hidden = true;
  }
})();
