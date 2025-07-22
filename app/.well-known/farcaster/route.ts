import { APP_URL } from '@/lib/constants';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Farcaster Mini App マニフェスト
  const manifest = {
    name: 'Monad クッキークリッカー',
    description: 'Monad Testnetで動作するクッキークリッカーゲーム。クッキーを焼いて、アップグレードを購入しよう！',
    icon: `${APP_URL}/images/icon.png`,
    url: APP_URL,
    buttons: [
      {
        title: 'クッキーを焼く',
        action: 'post',
      },
    ],
    // 実際の本番環境では、ドメイン所有者の署名が必要
    // 以下はテスト用のダミー署名
    signature: {
      token: 'test-token',
      signature: 'test-signature',
      owner: '0x0000000000000000000000000000000000000000',
      deadline: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30日
    },
  };

  return NextResponse.json(manifest);
}
