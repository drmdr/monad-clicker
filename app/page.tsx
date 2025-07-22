import App from '@/components/pages/app'
import { APP_URL } from '@/lib/constants'
import type { Metadata } from 'next'

const miniappEmbed = {
  version: '1',
  imageUrl: `${APP_URL}/images/feed.png`,
  button: {
    title: 'クッキーを焼く',
    action: {
      type: 'launch_frame',
      name: 'Monad クッキークリッカー',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: '#2d1606',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Monad クッキークリッカー',
    openGraph: {
      title: 'Monad クッキークリッカー',
      description: 'Monad Testnet上で楽しむ、世界一シンプルなクッキークリッカーゲームです。',
      images: [
        {
          url: `${APP_URL}/images/feed.png`,
        },
      ],
    },
    twitter: {
      images: [
        {
          url: `${APP_URL}/images/feed.png`,
        },
      ],
    },
    other: {
      'fc:miniapp': JSON.stringify(miniappEmbed),
      // fc:frame for backward compatibility
      'fc:frame': JSON.stringify(miniappEmbed),
    },
  }
}

export default function Home() {
  return <App />
}
