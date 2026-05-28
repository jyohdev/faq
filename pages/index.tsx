import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: 'Pretendard, sans-serif' }}>
      <h1>케어링 FAQ 미리보기</h1>
      <p>
        <Link href="/menu/faq">→ /menu/faq 페이지 보기</Link>
      </p>
    </main>
  );
}
