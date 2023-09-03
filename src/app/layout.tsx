import './globals.scss';
import type { Metadata } from 'next';
import { M_PLUS_1 } from 'next/font/google';

export const metadata: Metadata = {
  title: {
    default: 'hbc-web-app',
    template: '%s | hbc-web-app',
  },
};

const mPlus1 = M_PLUS_1({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <body className={mPlus1.className}>{children}</body>
    </html>
  );
}
