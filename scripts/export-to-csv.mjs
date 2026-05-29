#!/usr/bin/env node
/**
 * faqData.ts → 카테고리별 CSV 파일 생성 (TypeScript 모듈을 tsx 로 import)
 * 실행: npx tsx scripts/export-to-csv.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FAQ_CATEGORIES } from '../data/faqData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.join(__dirname, '..', 'sheets');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

function csvEscape(v) {
  if (v == null) return '';
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const summary = [];

for (const cat of FAQ_CATEGORIES) {
  const rows = [['No.', 'Question', 'Answer']];
  cat.items.forEach((it, i) => {
    rows.push([i + 1, it.question, it.answer]);
  });
  const csv = rows.map((r) => r.map(csvEscape).join(',')).join('\n');
  const safeTitle = cat.title.replace(/[\\/]/g, '_');
  const filename = `${cat.id}__${safeTitle}.csv`;
  fs.writeFileSync(path.join(OUT_DIR, filename), csv, 'utf8');
  summary.push({ id: cat.id, title: cat.title, items: cat.items.length, file: filename });
}

// 전체 합본 CSV (Category 컬럼 포함)
const all = [['Category', 'No.', 'Question', 'Answer']];
for (const cat of FAQ_CATEGORIES) {
  cat.items.forEach((it, i) => {
    all.push([cat.title, i + 1, it.question, it.answer]);
  });
}
const allCsv = all.map((r) => r.map(csvEscape).join(',')).join('\n');
fs.writeFileSync(path.join(OUT_DIR, 'ALL__전체.csv'), allCsv, 'utf8');

console.log(`✅ ${summary.length}개 카테고리 + 전체 합본 CSV 생성\n   → ${OUT_DIR}/`);
console.table(summary);
