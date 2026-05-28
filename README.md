# 케어링 FAQ 페이지 (caring.co.kr)

caring.co.kr 의 `/menu/faq` 페이지에 통합하기 위한 Next.js 13 (pages router) 기반 FAQ 컴포넌트 묶음입니다.

## 기술 스택 (요구사항 일치)

- Next.js **13.1.6**
- React **18.2.0**
- SCSS **1.58.0** (CSS Modules)
- TypeScript

> 추가 라이브러리 의존성 없음. 외부 패키지 설치 불필요.

## 폴더 구조

```
FAQ/
├── pages/
│   └── menu/
│       └── faq/
│           ├── index.tsx          # /menu/faq 라우트 (메인 페이지)
│           └── faq.module.scss    # 페이지 레이아웃 스타일
├── components/
│   └── FAQ/
│       ├── FAQTabs.tsx            # 카테고리 탭
│       ├── FAQTabs.module.scss
│       ├── FAQAccordion.tsx       # Q&A 아코디언
│       └── FAQAccordion.module.scss
├── data/
│   └── faqData.ts                 # FAQ 데이터(4개 카테고리)
└── README.md
```

## 통합 방법

기존 caring.co.kr 프로젝트의 동일한 경로에 그대로 복사하면 됩니다. 별칭(`@/...`)을 쓰는 경우 import 경로만 프로젝트 컨벤션에 맞게 수정해 주세요.

1. `pages/menu/faq/` → 기존 `pages/menu/` 하위에 `faq/` 추가
2. `components/FAQ/` → 기존 `components/` 하위에 추가
3. `data/faqData.ts` → 기존 `data/` 또는 `src/data/` 위치에 추가
4. `Pretendard` 폰트가 전역으로 적용되어 있다고 가정. 없다면 `_app.tsx`에 로드되어 있는지 확인.

## `/menu/` 페이지 하단 카테고리에 FAQ 링크 추가

기존 `pages/menu/index.tsx` 하단 카테고리 영역에 아래와 같이 링크를 추가하시면 됩니다.

```tsx
import Link from 'next/link';

// 메뉴 하단 카테고리 그리드 안에 항목 추가
<Link href="/menu/faq" className={styles.menuCard}>
  <span className={styles.menuLabel}>자주 묻는 질문</span>
  <span className={styles.menuDesc}>장기요양등급·방문요양·가족요양·주간보호</span>
</Link>
```

## AI / SEO 최적화 포인트

이 페이지는 AI 검색엔진(ChatGPT, Perplexity, Google AI Overview 등) 인용과 구글 리치 결과를 동시에 노리도록 다음을 구현했습니다.

- **JSON-LD `FAQPage` 스키마**: 모든 카테고리의 Q&A를 단일 `mainEntity` 배열로 직렬화. AI/검색엔진이 질문-답변 쌍을 정확히 파싱.
- **JSON-LD `BreadcrumbList`**: 사이트 위치 신호 강화.
- **시멘틱 HTML**: `<main>`, `<section>`, `<h1>`, `<h2>`, `<h3>` 의 명확한 위계.
- **ARIA**: 탭(`role=tablist`/`tab`/`tabpanel`), 아코디언(`aria-expanded`/`aria-controls`) 완비. 스크린리더 + AI 크롤러 모두 친화적.
- **메타 태그**: title, description, canonical, OG, Twitter Card 일체 포함.
- **키워드 자연 배치**: 본문 답변에 "장기요양등급", "방문요양", "가족요양", "주간보호센터" 등 핵심 검색어가 자연스럽게 반복됨.
- **TTFB 최적화**: 외부 라이브러리 없이 순수 컴포넌트로 구성.

## 디자인 톤앤매너

caring.co.kr 의 시각 언어를 반영했습니다.

- 메인 컬러: `#00b58e` (케어링 시그니처 그린)
- 폰트: Pretendard 우선, 시스템 폰트 폴백
- 카드/버튼: 부드러운 라운드(8px ~ 999px), 옅은 배경(`#f7f9fa`)
- 헤더 그라데이션: 시그니처 그린의 옅은 톤으로 페이지 진입감 부여
- 모바일 반응형: 768px 이하에서 탭 가로 스크롤, 아코디언 패딩 축소

색상값을 caring.co.kr 의 정확한 디자인 토큰(예: `$caring-green`)으로 바꾸시려면 각 `.module.scss` 상단의 `$primary` 변수만 수정하시면 됩니다.

## 데이터 수정

FAQ 내용 추가/수정은 `data/faqData.ts` 만 편집하면 됩니다. 카테고리 추가도 동일 파일에서 `FAQ_CATEGORIES` 배열에 새 객체를 추가하기만 하면 자동으로 탭과 패널이 생성됩니다.

```ts
{
  id: 'new-category',
  title: '새 카테고리',
  description: '설명',
  items: [
    { question: '...', answer: '...' },
  ],
}
```

## 라우트

- 페이지 URL: `https://caring.co.kr/menu/faq`
- 캐노니컬: `pages/menu/faq/index.tsx` 상단의 `PAGE_URL` 상수에서 관리.

## 접근성 체크리스트

- [x] 키보드 포커스 가능 (`Tab`)
- [x] 아코디언 토글 (`Enter` / `Space`)
- [x] `prefers-reduced-motion` 친화적 (트랜지션 0.2~0.25s)
- [x] `focus-visible` 아웃라인 명시
- [x] 시멘틱 헤딩 구조 (h1 → h2 → h3)
- [x] 모든 인터랙티브 요소에 `aria-*` 속성 부여

## 빌드 / 테스트

이 폴더를 기존 caring.co.kr Next.js 프로젝트에 복사한 뒤:

```bash
yarn dev
# 또는
npm run dev
```

브라우저에서 `http://localhost:3000/menu/faq` 접속 후 확인하시면 됩니다.

구조화 데이터 검증: https://search.google.com/test/rich-results 에 배포 URL 입력.
