// 첫 화면 아래 섹션: AI와 함께 만드는 법, 성장, 기록
window.Sections = (() => {
  const P = window.PORTFOLIO;
  const { $, esc } = window.UI;

  function buildHTML(b) {
    const tabs = b.steps.map((s, i) => `<li class="card"><span class="step__n">${String(i + 1).padStart(2, "0")}</span>
      <b>${esc(s.name)}</b><span class="label">${esc(s.skill)}</span><span>${esc(s.desc)}</span></li>`).join("");
    const principles = b.principles.map((p, i) => `<li class="card"><span class="label">${String(i + 1).padStart(2, "0")}</span>
      <h4>${esc(p.title)}</h4><p>${esc(p.desc)}</p><p class="muted">${esc(p.without)}</p></li>`).join("");
    const cases = b.cases.map((c) => `<details class="more"><summary>${esc(c.title)}</summary>
      <ul>${c.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></details>`).join("");
    return `<header class="sec-head"><div><p class="eyebrow">03 / How I Build</p>
      <h2 id="build-title">문제를 정의하고 AI와 함께 만드는 법</h2></div>
      <p class="lead">각 단계는 제가 승인한 뒤 다음으로 갑니다.</p></header>
      <p class="thesis">${esc(b.thesis)}</p>
      <h3 class="sub">문서 단계</h3>
      <ol class="steps">${tabs}</ol>
      <h3 class="sub">AI와 일할 때 지키는 것</h3>
      <ul class="principles">${principles}</ul>
      <h3 class="sub">실제로 적용한 곳</h3>${cases}`;
  }

  function storyHTML(items) {
    return `<header class="sec-head"><div><p class="eyebrow">04 / Story</p>
      <h2 id="story-title">배움에서 현업까지 한 단계씩</h2></div>
      <p class="lead">배운 것을 직접 배포해 보고 현업의 문제에 써 보며 넓혀 왔습니다.</p></header>
      <ol class="timeline">${items.map((s) => `<li><p class="label">${esc(s.period)} · ${esc(s.stage)}</p>
        <h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></li>`).join("")}</ol>`;
  }

  const rows = (list, dateKey) => list.map((x) => `<li><span class="label">${esc(x[dateKey])}</span>
    <span>${esc(x.name)}${x.desc ? `<span class="muted"> · ${esc(x.desc)}</span>` : ""}</span></li>`).join("");

  function recordsHTML(r) {
    return `<header class="sec-head"><div><p class="eyebrow">05 / Record</p>
      <h2 id="records-title">경력 · 교육 · 자격 · 기술</h2></div></header>
      <div class="records">
        <div class="card"><h3 class="sub">경력</h3><ul class="rows">${rows(r.career, "period")}</ul>
          <h3 class="sub">수상</h3><ul class="rows">${rows(r.awards, "date")}</ul></div>
        <div class="card"><h3 class="sub">교육 · 학력</h3><ul class="rows">${rows(r.education, "period")}</ul></div>
        <div class="card"><h3 class="sub">자격</h3><ul class="rows">${rows(r.certs, "date")}</ul></div>
        <div class="card"><h3 class="sub">기술</h3><dl class="skills">${r.skills.map((s) => `<div><dt>${esc(s.group)}</dt>
          <dd>${s.items.map(esc).join(" · ")}</dd></div>`).join("")}</dl></div>
      </div>`;
  }

  function renderAll() {
    $("#build").innerHTML = buildHTML(P.build);
    $("#story").innerHTML = storyHTML(P.story);
    $("#records").innerHTML = recordsHTML(P.records);
  }

  return { renderAll };
})();
