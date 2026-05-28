import { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FAQ_CATEGORIES } from '../../../data/faqData';
import FAQTabs from '../../../components/FAQ/FAQTabs';
import FAQAccordion from '../../../components/FAQ/FAQAccordion';
import styles from './faq.module.scss';

const SITE_URL = 'https://caring.co.kr';
const PAGE_URL = `${SITE_URL}/menu/faq`;
const PAGE_TITLE = '자주 묻는 질문(FAQ) | 케어링';
const PAGE_DESCRIPTION =
  '장기요양등급, 방문요양, 가족요양, 주간보호센터에 대한 자주 묻는 질문을 모았습니다. 케어링 어르신 돌봄 서비스 안내, 신청 절차, 비용 지원, 이용 방법을 한눈에 확인하세요.';

export default function FaqPage() {
  const [activeId, setActiveId] = useState<string>(FAQ_CATEGORIES[0].id);

  const activeCategory = useMemo(
    () => FAQ_CATEGORIES.find((c) => c.id === activeId) ?? FAQ_CATEGORIES[0],
    [activeId],
  );

  // FAQPage 구조화 데이터 — AI 검색/구글 리치 결과 노출용
  const faqSchema = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_CATEGORIES.flatMap((cat) =>
        cat.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      ),
    };
  }, []);

  const breadcrumbSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: '서비스 안내', item: `${SITE_URL}/menu` },
        { '@type': 'ListItem', position: 3, name: '자주 묻는 질문', item: PAGE_URL },
      ],
    }),
    [],
  );

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta
          name="keywords"
          content="케어링 FAQ, 장기요양등급, 방문요양, 가족요양, 주간보호센터, 방문목욕, 차량목욕, 복지용구, 방문간호, 노인장기요양보험, 요양보호사, 어르신 돌봄"
        />
        <link rel="canonical" href={PAGE_URL} />

        <link rel="icon" href="/favicon.jpg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="theme-color" content="#EF6079" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="케어링" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <main className={styles.page}>
        <div className={styles.shell}>
          <header className={styles.appBar}>
            <Link href="/menu" className={styles.appBarBack} aria-label="뒤로가기">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <h2 className={styles.appBarTitle}>FAQ</h2>
            <span className={styles.appBarSpacer} aria-hidden="true" />
          </header>

          <section className={styles.hero}>
            <p className={styles.eyebrow}>자주묻는질문</p>
            <h1 className={styles.title}>FAQ</h1>
            <p className={styles.subtitle}>
              어르신 돌봄에 대한 궁금증,<br />
              케어링이 가장 많이 받은 질문으로 모았습니다.
            </p>
          </section>

          <section className={styles.content}>
            <FAQTabs
              categories={FAQ_CATEGORIES}
              activeId={activeId}
              onChange={setActiveId}
            />

            <div
              role="tabpanel"
              id={`panel-${activeCategory.id}`}
              aria-labelledby={`tab-${activeCategory.id}`}
              className={styles.panel}
            >
              <header className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>{activeCategory.title}</h2>
                {activeCategory.description && (
                  <p className={styles.panelDesc}>{activeCategory.description}</p>
                )}
              </header>
              <FAQAccordion items={activeCategory.items} idPrefix={activeCategory.id} />
            </div>

          </section>

          <div className={styles.floatingBar} role="group" aria-label="상담 바로가기">
            <a
              href="https://pf.kakao.com/_caring"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.floatBtn} ${styles.kakao}`}
              aria-label="카카오톡으로 상담하기"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.76 1.79 5.19 4.5 6.64-.2.78-.7 2.69-.81 3.11-.13.52.19.51.4.37.16-.11 2.59-1.76 3.64-2.47.74.11 1.5.18 2.27.18 5.52 0 10-3.58 10-8.18S17.52 3 12 3z" />
              </svg>
              <span>카톡 상담</span>
            </a>
            <a
              href="tel:1522-6585"
              className={`${styles.floatBtn} ${styles.tel}`}
              aria-label="전화 상담 1522-6585"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.71 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.71A2 2 0 0 1 22 16.92z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>전화 상담</span>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
