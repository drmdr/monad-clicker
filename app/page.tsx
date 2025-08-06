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
      'fc:frame': JSON.stringify({
        version: '1',
        imageUrl: imageUrl,
        button: {
          title: 'Start Clicking!',
          action: {
            type: 'launch_frame',
            name: 'Monad Cookie Clicker',
            url: APP_URL,
          },
        },
      }),
    },
  };
}

// Vercelのキャッシュをクリアするためのコメント
export default function Page() {
  return <Demo />;
}
