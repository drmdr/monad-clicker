import { Demo } from '@/components/Home';
import { APP_URL } from '@/lib/constants';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const imageUrl = `${APP_URL}/opengraph-image.png`;

  return {
    title: 'Monad Cookie Clicker',
    description: 'A simple cookie clicker game on the Monad Testnet.',
    openGraph: {
      title: 'Monad Cookie Clicker',
      description: 'A simple cookie clicker game on the Monad Testnet.',
      images: [imageUrl],
    },
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': imageUrl,
      'fc:frame:button:1': 'Start Clicking!',
      'fc:frame:button:1:action': 'link',
      'fc:frame:button:1:target': APP_URL,
    },
  };
}

export default function Page() {
  return <Demo />;
}
