#!/usr/bin/env node
/**
 * 파일 변경 자동 배포 워처
 * - 감시 폴더의 파일이 저장되면 디바운스 후 `vercel --prod` 실행
 * - 배포 중 추가 저장 발생 시 끝난 직후 1회만 더 배포
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const WATCH_DIRS = ['pages', 'components', 'data', 'styles', 'public'];
const IGNORE = /node_modules|\.next|\.vercel|\.git|DS_Store/;
const DEBOUNCE_MS = 8000;

let timer = null;
let deploying = false;
let pendingDeploy = false;

const stamp = () => `[${new Date().toLocaleTimeString('ko-KR')}]`;

function deploy() {
  if (deploying) {
    pendingDeploy = true;
    console.log(`${stamp()} ⏳ 배포 중 — 끝난 후 다시 배포 예약됨`);
    return;
  }
  deploying = true;
  console.log(`\n${stamp()} 🚀 Vercel 프로덕션 배포 시작...`);
  const proc = spawn('npx', ['vercel', '--prod', '--yes'], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  proc.on('close', (code) => {
    deploying = false;
    if (code === 0) {
      console.log(`${stamp()} ✅ 배포 완료\n`);
    } else {
      console.log(`${stamp()} ❌ 배포 실패 (exit ${code})\n`);
    }
    if (pendingDeploy) {
      pendingDeploy = false;
      schedule();
    }
  });
  proc.on('error', (err) => {
    deploying = false;
    console.error(`${stamp()} ❌ 배포 실행 에러:`, err.message);
  });
}

function schedule() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(deploy, DEBOUNCE_MS);
  console.log(`${stamp()} ⏱  ${DEBOUNCE_MS / 1000}초 뒤 배포 예정 (추가 변경 시 리셋)`);
}

console.log('👀 파일 자동 배포 워처 시작');
console.log(`   감시 폴더: ${WATCH_DIRS.join(', ')}`);
console.log(`   디바운스: ${DEBOUNCE_MS / 1000}초`);
console.log(`   종료: Ctrl+C\n`);

const watched = [];
WATCH_DIRS.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) return;
  try {
    fs.watch(fullPath, { recursive: true }, (event, filename) => {
      if (!filename) return;
      if (IGNORE.test(filename)) return;
      console.log(`${stamp()} 📝 변경: ${dir}/${filename}`);
      schedule();
    });
    watched.push(dir);
  } catch (err) {
    console.error(`⚠️  ${dir} 감시 실패:`, err.message);
  }
});

if (watched.length === 0) {
  console.error('❌ 감시할 폴더가 없습니다. 종료합니다.');
  process.exit(1);
}

process.on('SIGINT', () => {
  console.log('\n👋 자동 배포 워처 종료');
  process.exit(0);
});
