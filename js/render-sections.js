// 첫 화면 아래 섹션: AI와 함께 만드는 법, 성장, 기록
window.Sections = (() => {
  const P = window.PORTFOLIO;
  const { $, esc } = window.UI;

  function buildHTML(b) {
    return `<header class="sec-head"><div><p class="eyebrow">03 / How I Build</p>
      <h2 id="build-title">${esc(b.title)}</h2></div></header>
      <ol class="steps">${b.steps.map((s, i) => `<li class="card"><span class="step__n">${String(i + 1).padStart(2, "0")}</span>
        <b>${esc(s.name)}</b><span>${esc(s.desc)}</span></li>`).join("")}</ol>`;
  }

  function storyHTML(items) {
    return `<header class="sec-head"><div><p class="eyebrow">04 / Story</p>
      <h2 id="story-title">배움에서 현업까지 한 단계씩</h2></div></header>
      <ol class="timeline">${items.map((s) => `<li><p class="label">${esc(s.period)}, ${esc(s.stage)}</p>
        <h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></li>`).join("")}</ol>`;
  }

  const rows = (list, dateKey) => list.map((x) => `<li><span class="label">${esc(x[dateKey])}</span>
    <span>${esc(x.name)}${x.desc ? `<span class="muted">, ${esc(x.desc)}</span>` : ""}</span></li>`).join("");

  function recordsHTML(r) {
    return `<header class="sec-head"><div><p class="eyebrow">05 / Record</p>
      <h2 id="records-title">경력, 교육, 자격, 기술</h2></div></header>
      <div class="records">
        <div class="card"><h3 class="sub">경력</h3><ul class="rows">${rows(r.career, "period")}</ul>
          <h3 class="sub">수상</h3><ul class="rows">${rows(r.awards, "date")}</ul></div>
        <div class="card"><h3 class="sub">교육, 학력</h3><ul class="rows">${rows(r.education, "period")}</ul></div>
        <div class="card"><h3 class="sub">자격</h3><ul class="rows">${rows(r.certs, "date")}</ul></div>
        <div class="card"><h3 class="sub">기술</h3><dl class="skills">${r.skills.map((s) => `<div><dt>${esc(s.group)}</dt>
          <dd>${s.items.map(esc).join(", ")}</dd></div>`).join("")}</dl></div>
      </div>`;
  }

  function renderAll() {
    $("#build").innerHTML = buildHTML(P.build);
    $("#story").innerHTML = storyHTML(P.story);
    $("#records").innerHTML = recordsHTML(P.records);
  }

  return { renderAll };
})();
