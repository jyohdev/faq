#!/usr/bin/env node
/**
 * faqData.ts → 카테고리별 CSV 파일 생성
 * Google Sheets 가져오기 또는 복사/붙여넣기용
 */
const fs = require('fs');
const path = require('path');

const SOURCE = path.join(__dirname, '..', 'data', 'faqData.ts');
const OUT_DIR = path.join(__dirname, '..', 'sheets');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

// faqData.ts 를 직접 평가하지 않고 TS 컴파일러 없이 쓰기 위해 동적 import 대신 sucrase 같은 게 필요함
// 간단히 ts-node 또는 ESM dynamic import 우회: 컴파일된 JS 출력
// 여기서는 require로 ts 파일을 직접 evaluate 하기 어려우므로,
// 카테고리/Q&A 구조를 정규식으로 추출.

const src = fs.readFileSync(SOURCE, 'utf8');

// 카테고리 블록 매칭
const categoryRegex = /\{\s*id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*description:\s*'([^']*)',\s*items:\s*\[([\s\S]*?)\n\s{4}\],\s*\}/g;
const itemRegex = /\{\s*question:\s*'((?:\\'|[^'])*)',\s*answer:\s*\n?\s*['"]((?:\\['"]|[^'"])*?)['"],?\s*\}/g;

function csvEscape(v) {
  if (v == null) return '';
  const s = String(v)
    .replace(/\\n/g, '\n')
    .replace(/\\'/g, "'");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

let categoryCount = 0;
const summary = [];

let m;
while ((m = categoryRegex.exec(src)) !== null) {
  const [, id, title, description, itemsBlock] = m;
  const rows = [['No.', 'Question', 'Answer']];
  let i = 1;
  let im;
  // reset item regex for each block
  const itemR = new RegExp(itemRegex.source, 'g');
  while ((im = itemR.exec(itemsBlock)) !== null) {
    const [, q, a] = im;
    rows.push([i++, q.replace(/\\'/g, "'"), a]);
  }
  const csv = rows
    .map((r) => r.map(csvEscape).join(','))
    .join('\n');
  const filename = `${id}__${title}.csv`;
  fs.writeFileSync(path.join(OUT_DIR, filename), csv, 'utf8');
  categoryCount++;
  summary.push({ id, title, items: i - 1, file: filename });
}

console.log(`✅ ${categoryCount}개 카테고리 CSV 생성 완료\n   → ${OUT_DIR}/`);
console.table(summary);
