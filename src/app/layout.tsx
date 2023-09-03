import './globals.scss';
import type { Metadata } from 'next';
import { Noto_Color_Emoji, Noto_Sans_JP, Noto_Sans_Mono } from 'next/font/google';

export const metadata: Metadata = {
  title: {
    default: 'hbc-web-app',
    template: '%s | hbc-web-app',
  },
};

const notoColorEmoji = Noto_Color_Emoji({
  weight: '400',
  subsets: ['emoji'],
  variable: '--font-noto-color-emoji',
});

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
});

const notoSansMono = Noto_Sans_Mono({
  subsets: ['latin'],
  variable: '--font-noto-sans-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <body
        className={`${notoColorEmoji.variable} ${notoSansJp.variable} ${notoSansMono.variable}`}
      >
        <header className='border-b'>
          <div className='mx-auto max-w-7xl px-4 py-2'>
            <h1 className='font-mono text-3xl'>hbc-web-app</h1>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
