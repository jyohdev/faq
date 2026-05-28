# 케어링 FAQ 프로젝트 — Claude 작업 규칙

## 콘텐츠 작성 규칙 (중요)

스크린샷이나 제공된 자료에 적힌 내용만 그대로 FAQ에 반영한다. 보충 설명, 인트로 문장, 부연 안내, "안내드립니다" 류의 영업 표현 등을 임의로 덧붙이지 않는다.

- 스크린샷의 텍스트를 받으면 그 문장만 옮긴다. 줄바꿈·문장부호·존댓말 톤 다듬기는 OK.
- "안내해드립니다", "친절히 도와드립니다", "걱정 마세요"(자료에 없을 때) 등 출처 없는 추가 문장 금지.
- 자료에 없는 추가 항목·예시·번호·카테고리 추가 금지.
- 의심스러우면 추가하지 말고 사용자에게 확인.

## 프로젝트 개요

- **목적**: caring.co.kr 의 `/menu/faq` FAQ 페이지
- **기술 스택**: Next.js 13.1.6, React 18.2.0, SCSS 1.58.0 (CSS Modules), TypeScript
- **배포**: Vercel (https://caring-faq.vercel.app), 계정 jyoh-7387
- **자동 배포**: `npm run deploy:watch` 실행 시 파일 저장 후 8초 디바운스로 자동 `vercel --prod`

## 디자인 토큰

- 브랜드 컬러(주): `#EF6079` (코랄)
- 모바일 캔버스 최대 폭: 375px
- 폰트: Pretendard (CDN)
- eyebrow 그린: `#9CB54A` (현재는 검정으로 변경됨 — `$text-primary`)

## 폴더 구조

- `pages/menu/faq/index.tsx` — FAQ 메인 페이지 (메타·JSON-LD 포함)
- `pages/menu/faq/faq.module.scss` — 페이지 스타일
- `components/FAQ/FAQTabs.tsx` + `.module.scss` — 카테고리 탭
- `components/FAQ/FAQAccordion.tsx` + `.module.scss` — Q&A 아코디언
- `data/faqData.ts` — 모든 FAQ 데이터 (`\n` 줄바꿈은 CSS `white-space: pre-line` 으로 렌더링)
- `scripts/auto-deploy.js` — 파일 변경 자동 배포 워처
- `public/favicon.jpg` — caring.co.kr 공식 파비콘

## 답변 줄바꿈 패턴 (기존 데이터 유지)

- 번호 항목(①②③④): 각 항목마다 줄바꿈
- 불릿 리스트(`·`): 항목별 줄바꿈
- 섹션 헤더(`[재가급여]`, `[90분 적용 조건]`): 위아래 한 줄 띄움
- 시간표·표 형식: 한 줄씩
- 인트로 + 본문: 인트로 뒤 줄바꿈
