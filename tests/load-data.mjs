// 브라우저와 같은 순서로 data/*.js를 읽어 window.PORTFOLIO를 만든다.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const DATA_FILES = ["data/site.js", "data/projects-company.js", "data/projects-ls.js", "data/projects-more.js", "data/sections.js"];

export function loadPortfolio() {
  const context = { window: {} };
  vm.createContext(context);
  for (const file of DATA_FILES) {
    vm.runInContext(readFileSync(join(ROOT, file), "utf8"), context, { filename: file });
  }
  // vm 안에서 만든 배열은 프로토타입이 달라 deepStrictEqual이 실패하므로 이 영역 값으로 옮긴다.
  return JSON.parse(JSON.stringify(context.window.PORTFOLIO));
}
