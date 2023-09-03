import { Metadata } from 'next';
import Maker from './maker';

export const metadata: Metadata = {
  title: 'イベント名札メーカー',
};

export default function Page() {
  return <Maker />;
}
