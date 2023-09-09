import { Metadata } from 'next';
import { Maker } from './maker';
import { url, siteName } from '@/app/layout';

const title = 'イベント名札メーカー';
const description = 'イベント用の名札を制作するツールです。';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    url: `${url}/tools/name-tag-maker`,
    title: `${title} | ${siteName}`,
    description,
    siteName,
  },
};

export default function Page() {
  return (
    <main>
      <header className='mx-auto my-6 max-w-7xl px-4'>
        <h1 className='mb-2 text-3xl font-bold'>イベント名札メーカー</h1>
        <p>イベント用の名札を制作するツールです。</p>
        <p>
          現在は（株）大創産業の販売する「
          <a
            className='text-blue-500 hover:text-blue-400'
            href='https://jp.daisonet.com/products/4984343925328'
            target='_blank'
          >
            名札 イベント用 ひも吊下げ 10枚セット
          </a>
          」にのみ対応しています。
        </p>
      </header>
      <Maker />
    </main>
  );
}
