import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { APP_URL } from '../lib/constants';
import * as fs from 'fs';
import * as path from 'path';

// 環境変数から秘密鍵を取得（実際の使用時には.envファイルなどから安全に取得する）
// 注意: 秘密鍵は絶対に公開リポジトリにコミットしないでください
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

if (!PRIVATE_KEY) {
  console.error('環境変数 PRIVATE_KEY が設定されていません。');
  process.exit(1);
}

async function signManifest() {
  try {
    // 秘密鍵からアカウントを作成
    const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);
    
    // Manifest data
    const manifestData = {
      name: 'Monad Cookie Clicker',
      description: 'A simple cookie clicker game on the Monad Testnet. Click cookies and buy upgrades!',
      icon: `${APP_URL}/images/icon.png`,
      url: APP_URL,
      buttons: [
        {
          title: 'Start Clicking!',
          action: 'post',
        },
      ],
    };
    
    // 署名用のトークン生成（単純なJSONシリアライズ）
    const token = Buffer.from(JSON.stringify(manifestData)).toString('base64');
    
    // 署名の有効期限（30日）
    const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
    
    // 署名対象のメッセージ
    const message = `${token}:${deadline}`;
    
    // メッセージに署名
    const signature = await account.signMessage({ message });
    
    // 署名情報を含むマニフェスト
    const signedManifest = {
      ...manifestData,
      signature: {
        token,
        signature,
        owner: account.address,
        deadline,
      },
    };
    
    // 署名済みマニフェストをファイルに保存
    const outputDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(outputDir, 'signed-manifest.json'),
      JSON.stringify(signedManifest, null, 2)
    );
    
    console.log('署名済みマニフェストを生成しました:', path.join(outputDir, 'signed-manifest.json'));
    console.log('所有者アドレス:', account.address);
    
    // route.tsファイルを更新
    const routeFilePath = path.join(__dirname, '..', 'app', '.well-known', 'farcaster', 'route.ts');
    let routeContent = fs.readFileSync(routeFilePath, 'utf-8');
    
    // ダミー署名を実際の署名で置き換え
    routeContent = routeContent.replace(
      /signature: \{[\s\S]*?\}/,
      `signature: ${JSON.stringify(signedManifest.signature, null, 2)}`
    );
    
    fs.writeFileSync(routeFilePath, routeContent);
    console.log('route.tsファイルを更新しました');
    
  } catch (error) {
    console.error('マニフェスト署名中にエラーが発生しました:', error);
    process.exit(1);
  }
}

signManifest();
