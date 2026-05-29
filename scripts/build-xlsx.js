#!/usr/bin/env node
/**
 * faqData.ts → 카테고리별 시트가 있는 단일 XLSX 파일 생성
 * 산출: sheets/faq-all.xlsx (Google Sheets 업로드용)
 */
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const SOURCE = path.join(__dirname, '..', 'data', 'faqData.ts');
const OUT_DIR = path.join(__dirname, '..', 'sheets');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);
const OUT_FILE = path.join(OUT_DIR, 'faq-all.xlsx');

// TS 모듈을 정규식으로 파싱
const src = fs.readFileSync(SOURCE, 'utf8');

const categories = [];
const catRe =
  /\{\s*id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*description:\s*'([^']*)',\s*items:\s*\[([\s\S]*?)\n\s{4}\],\s*\}/g;
let cm;
while ((cm = catRe.exec(src)) !== null) {
  const [, id, title, description, itemsBlock] = cm;
  const items = [];
  // question/answer 매칭 - answer는 '...' 또는 "..." 가능
  const itemRe =
    /\{\s*question:\s*'((?:\\.|[^'\\])*)',\s*answer:\s*\n?\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)"),?\s*\}/g;
  let im;
  while ((im = itemRe.exec(itemsBlock)) !== null) {
    const q = im[1]
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\');
    const a = (im[2] ?? im[3])
      .replace(/\\n/g, '\n')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
    items.push({ q, a });
  }
  categories.push({ id, title, description, items });
}

console.log(`📊 카테고리 ${categories.length}개 파싱 완료`);
categories.forEach((c) => console.log(`   - ${c.title}: ${c.items.length}개`));

const wb = new ExcelJS.Workbook();
wb.creator = '케어링 FAQ';
wb.created = new Date();

// 전체 합본 시트 (탭 1번)
const allSheet = wb.addWorksheet('전체', {
  views: [{ state: 'frozen', ySplit: 1 }],
});
allSheet.columns = [
  { header: '카테고리', key: 'category', width: 16 },
  { header: 'No.', key: 'no', width: 6 },
  { header: '질문', key: 'q', width: 60 },
  { header: '답변', key: 'a', width: 100 },
];
allSheet.getRow(1).font = { bold: true };
allSheet.getRow(1).alignment = { vertical: 'middle' };

categories.forEach((cat) => {
  cat.items.forEach((it, i) => {
    allSheet.addRow({
      category: cat.title,
      no: i + 1,
      q: it.q,
      a: it.a,
    });
  });
});
allSheet.eachRow((row) => {
  row.alignment = { wrapText: true, vertical: 'top' };
});

// 카테고리별 탭
categories.forEach((cat) => {
  const sheet = wb.addWorksheet(cat.title, {
    views: [{ state: 'frozen', ySplit: 1 }],
  });
  sheet.columns = [
    { header: 'No.', key: 'no', width: 6 },
    { header: '질문', key: 'q', width: 70 },
    { header: '답변', key: 'a', width: 110 },
  ];
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).alignment = { vertical: 'middle' };
  cat.items.forEach((it, i) => {
    sheet.addRow({ no: i + 1, q: it.q, a: it.a });
  });
  sheet.eachRow((row) => {
    row.alignment = { wrapText: true, vertical: 'top' };
  });
});

wb.xlsx.writeFile(OUT_FILE).then(() => {
  const stat = fs.statSync(OUT_FILE);
  console.log(`✅ XLSX 생성 완료: ${OUT_FILE} (${(stat.size / 1024).toFixed(1)} KB)`);
});
