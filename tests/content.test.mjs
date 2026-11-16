// 내용 검사: Spec SC-001, SC-003, SC-004, SC-005(대체 텍스트)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { loadPortfolio, ROOT } from "./load-data.mjs";

const P = loadPortfolio();
const byId = (id) => P.projects.find((p) => p.id === id);
const FEATURED = ["noti", "contest", "veriorder", "agentpool", "steel", "tw-web", "tw-mobile"];

test("관점 4개와 순서가 결정 D13~D16과 같다", () => {
  const order = Object.fromEntries(P.roles.map((r) => [r.id, r.order]));
  assert.deepEqual(Object.keys(order), ["all", "ax", "data", "sw"]);
  assert.deepEqual(order.all, FEATURED);
  assert.deepEqual(order.ax, ["agentpool", "noti", "veriorder", "contest", "tw-web", "tw-mobile"]);
  assert.deepEqual(order.data, ["steel", "okm", "gyeongnam"]);
  assert.deepEqual(order.sw, ["contest", "tw-web", "tw-mobile", "noti"]);
});

test("관점 순서의 id는 모두 실제 프로젝트다", () => {
  for (const role of P.roles) for (const id of role.order) assert.ok(byId(id), `${role.id}: ${id} 없음`);
});

test("대표 프로젝트 7개는 상세 페이지에 필요한 칸을 모두 갖는다", () => {
  for (const id of FEATURED) {
    const p = byId(id);
    for (const key of ["name", "easy", "period", "team", "contribution", "problem"]) assert.ok(p[key], `${id}.${key} 비어 있음`);
    assert.ok(p.metrics.length >= 2, `${id} 숫자 2개 미만`);
    assert.ok(p.myRole.length >= 1, `${id} 역할 비어 있음`);
    assert.ok(!("limits" in p), `${id} 한계는 넣지 않기로 함`);
  }
});

test("대표 프로젝트마다 접근 도식이 있고 단계마다 맡은 주체(사람·AI·시스템)가 있다", () => {
  for (const id of FEATURED) {
    const f = byId(id).flow;
    assert.ok(f && f.steps.length >= 3 && f.result, `${id} 도식 없음`);
    for (const st of f.steps) assert.ok(["사람", "AI", "시스템"].includes(st.actor) && st.title && st.desc, `${id} '${st.title}'`);
  }
});

test("숫자마다 배지(확인함·조건부·팀)가 있다", () => {
  for (const p of P.projects) for (const m of p.metrics || []) {
    assert.ok(["확인함", "조건부", "팀"].includes(m.badge), `${p.id} '${m.label}' 배지 없음`);
  }
});

test("상세 문제 해결은 원인·해결·결과 세 칸으로 통일되어 있다", () => {
  for (const p of P.projects.filter((x) => x.tier === "featured")) for (const s of p.solve) {
    for (const key of ["title", "cause", "fix", "result"]) assert.ok(s[key] && s[key].length, `${p.id} '${s.title}' ${key} 없음`);
    assert.deepEqual(Object.keys(s).sort(), ["cause", "fix", "result", "title"], `${p.id} '${s.title}' 원인·해결·결과 외 칸`);
    for (const t of [s.cause, ...[].concat(s.fix), s.result]) assert.doesNotMatch(t, /니다\.?(\s|\(|$)/, `${p.id} 명사형이 아님: ${t.slice(0, 30)}`);
  }
});

test("그 외 프로젝트에 '수상 없음' 같은 불필요한 설명이 없다", () => {
  for (const p of P.projects) assert.doesNotMatch(JSON.stringify(p), /수상 없음/, p.id);
});

test("관점마다 '막혔던 순간' 앞 3건이 사용자가 고른 대로다", () => {
  const picks = Object.fromEntries(P.roles.map((r) => [r.id, r.debug]));
  assert.deepEqual(picks, {
    all: ["veriorder-gmail", "agentpool-format", "noti-hallucination"],
    ax: ["agentpool-format", "noti-hallucination", "veriorder-mail-purpose"],
    data: ["steel-shift", "steel-timestamp", "steel-chatbot"],
    sw: ["contest-admin-guard", "contest-oracle-env", "tw-mobile-auth"],
  });
  const ids = P.debug.map((d) => d.id);
  for (const r of P.roles) for (const id of r.debug) assert.ok(ids.includes(id), `${r.id}: 카드 ${id} 없음`);
  for (const d of P.debug) assert.equal(d.steps.length, 4, `${d.title} 단계 4개 아님`);
});

test("모든 캡처에 대체 텍스트가 있다", () => {
  for (const p of P.projects) for (const s of p.shots || []) assert.ok(s.alt && s.alt.length >= 4, `${p.id} ${s.src} alt 없음`);
});

test("모든 캡처 파일이 실제로 있다", () => {
  for (const p of P.projects) for (const s of p.shots || []) assert.ok(existsSync(join(ROOT, s.src)), `${p.id} ${s.src} 파일 없음`);
  assert.ok(existsSync(join(ROOT, P.site.photo)), "증명사진 없음");
});

const SITE_FILES = () => {
  const out = [];
  const walk = (dir) => readdirSync(dir).forEach((name) => {
    if ([".git", "docs", "tests", "node_modules", "tools", "assets-src"].includes(name)) return;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if ([".html", ".js", ".css", ".md"].includes(extname(name)) && !["Spec.md", "Plan.md", "CLAUDE.md"].includes(name)) out.push(full);
  });
  walk(ROOT);
  return out;
};

test("사이트 파일에 전화번호와 '인턴'이 없다", () => {
  for (const file of SITE_FILES()) {
    const text = readFileSync(file, "utf8");
    assert.doesNotMatch(text, /01[016789][-. ]?\d{3,4}[-. ]?\d{4}/, `${file} 전화번호`);
    assert.doesNotMatch(text, /인턴/, `${file} '인턴'`);
  }
});

test("PDF 받기 목록의 파일이 모두 있다(관점 4개 전체 판, 원페이저, 대표 프로젝트)", () => {
  const files = [...P.roles.map((r) => `pdf/role-${r.id}.pdf`), "pdf/onepager-all.pdf",
    ...P.projects.filter((p) => p.tier === "featured").map((p) => `pdf/project-${p.id}.pdf`)];
  for (const f of files) assert.ok(existsSync(join(ROOT, f)), `${f} 없음: tools/make-pdf.ps1로 만든다`);
});
