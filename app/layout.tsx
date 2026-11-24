import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://voidx-gate.vercel.app'),
  title: 'voidx — Project directory',
  description: 'voidx의 프로젝트를 한곳에서. 웹사이트, 도구, 그리고 작은 실험들.',
  icons: { icon: '/icon.svg' },
  alternates: { canonical: '/' },
  openGraph: { title: 'voidx — Project directory', description: '웹사이트, 도구, 그리고 작은 실험들. voidx의 모든 프로젝트를 만나보세요.', url: 'https://voidx-gate.vercel.app', locale: 'ko_KR', type: 'website' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>
    {children}
    <Script type="module" src="/swarm-cursors/launcher.js" crossOrigin="anonymous" strategy="afterInteractive" />
  </body></html>;
}
