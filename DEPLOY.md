# Monad クッキークリッカー デプロイ手順

このドキュメントでは、Monad クッキークリッカーアプリケーションを本番環境にデプロイする手順を説明します。

## 前提条件

- GitHubアカウント
- Vercelアカウント（または他のNext.js対応ホスティングサービス）
- Ethereumウォレット（マニフェスト署名用）

## デプロイ手順

### 1. GitHubリポジトリの準備

1. GitHubに新しいリポジトリを作成します。
2. ローカルのプロジェクトをリポジトリにプッシュします。

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <リポジトリURL>
git push -u origin main
```

### 2. Vercelでのデプロイ

1. [Vercel](https://vercel.com/)にログインします。
2. 「New Project」をクリックします。
3. GitHubリポジトリをインポートします。
4. 環境変数を設定します：
   - `NEXT_PUBLIC_URL`: 本番環境のURL（例：`https://monad-cookie-clicker.vercel.app`）
5. 「Deploy」ボタンをクリックしてデプロイを開始します。

### 3. マニフェスト署名

1. デプロイが完了したら、環境変数に秘密鍵を設定します：
   ```bash
   export PRIVATE_KEY=<あなたの秘密鍵（0xプレフィックスなし）>
   ```

2. 署名スクリプトを実行します：
   ```bash
   npx tsx scripts/sign-manifest.ts
   ```

3. 生成された署名情報をVercelの環境変数に追加します：
   - `MANIFEST_SIGNATURE`: 生成された署名情報

4. 再デプロイして変更を反映させます。

### 4. Farcasterへの登録

1. [Farcaster Developer Portal](https://warpcast.com/~/developers)にアクセスします。
2. 「Register Mini App」をクリックします。
3. デプロイしたアプリケーションのURLを入力します。
4. マニフェストが正しく署名されていることを確認します。
5. 登録を完了します。

## トラブルシューティング

- マニフェスト署名エラー：秘密鍵が正しく設定されているか確認してください。
- デプロイエラー：Vercelのログを確認して、エラーの詳細を確認してください。
- 接続エラー：ネットワーク設定とファイアウォールを確認してください。

## 参考リンク

- [Farcaster Mini App ドキュメント](https://docs.farcaster.xyz/reference/mini-apps/overview)
- [Vercel デプロイドキュメント](https://vercel.com/docs/deployments/overview)
- [Next.js デプロイドキュメント](https://nextjs.org/docs/deployment)
