import './globals.scss';
import type { Metadata } from 'next';
import { Noto_Color_Emoji, Noto_Sans_JP, Noto_Sans_Mono } from 'next/font/google';

const url = process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`;
const defaultTitle = 'hbc-web-tools';
const defaultDescription = '県広放送部員のためのオンラインツール';
const siteName = 'hbc-web-tools';

export { url, siteName, defaultTitle, defaultDescription };

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  openGraph: {
    type: 'website',
    url,
    title: `${defaultTitle} | ${siteName}`,
    description: defaultDescription,
    siteName,
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
    <html
      lang='ja'
      className={`${notoColorEmoji.variable} ${notoSansJp.variable} ${notoSansMono.variable}`}
    >
      <body>
        <header className='border-b'>
          <div className='mx-auto max-w-7xl px-4 py-2'>
            <h1 className='font-mono text-2xl'>hbc-web-tools</h1>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
