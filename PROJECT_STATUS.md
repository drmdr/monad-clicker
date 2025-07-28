# Monad クッキークリッカー プロジェクト状況

## プロジェクト概要

Farcaster Mini App（Monad Testnet対応）のクッキークリッカーゲームを開発しています。ユーザーはクッキーをクリックしてポイントを獲得し、アップグレードを購入してクッキー生産を自動化できます。また、Monad Testnetと連携してスコアをブロックチェーン上に保存する機能も実装しています。

## **【重要】開発・デプロイフロー**

**現在、デプロイとプレビューはVercelで行っています。`cloudflared` は使用しません。**

-   **ローカルでの動作確認**: `npm run dev` でサーバーを起動し、`http://localhost:3000` で行います。
-   **本番環境への反映**: 変更をGitHubリポジトリにプッシュすると、自動的にVercelにデプロイされます。

---

## 現在の実装状況

### 完了した作業

1. **ゲーム機能**
   - ✅ クッキークリック機能（クリックでクッキー獲得）
   - ✅ クリック効果アニメーション
   - ✅ アップグレードシステム
     - 自動生成アイテム（カーソル、おばあちゃん、クッキー農場）
     - クリックパワーアップグレード

2. **Monad Testnet連携**
   - ✅ ウォレット接続機能
   - ✅ Monad Testnetへの切り替え機能
   - ✅ スコア保存・読み込み機能

3. **Farcaster対応**
   - ✅ fc:miniappメタタグ設定
   - ✅ フレーム対応（埋め込み表示用）
   - ✅ マニフェスト作成
   - ✅ マニフェスト署名用スクリプト作成

4. **開発環境**
   - ✅ cloudflaredインストール
   - ✅ ローカル環境の公開設定

5. **ドキュメント**
   - ✅ デプロイ手順ドキュメント（DEPLOY.md）

### 現在の環境

- **ローカル開発サーバー**: `npm run dev`で起動中
- **公開URL**: cloudflaredで生成された一時URL
  - https://lafayette-clock-zen-revolutionary.trycloudflare.com
- **ファイル構成**:
  - `components/Home/index.tsx`: メインゲームロジック
  - `components/Home/WalletActions.tsx`: ウォレット連携機能
  - `app/page.tsx`: Farcasterメタタグ設定
  - `app/.well-known/farcaster/route.ts`: Farcasterマニフェスト
  - `scripts/sign-manifest.ts`: マニフェスト署名スクリプト
  - `lib/constants.ts`: 公開URL等の定数

## 残タスク

1. **テスト**
   - [ ] Farcaster Mini App Preview/Debug Toolでの動作確認
   - [ ] ウォレット連携機能のテスト
   - [ ] スマートコントラクト連携のテスト

2. **本番デプロイ**
   - [ ] GitHubリポジトリへのプッシュ
   - [ ] Vercel等のホスティングサービスでのデプロイ
   - [ ] 環境変数の設定（`NEXT_PUBLIC_URL`等）

3. **マニフェスト署名と登録**
   - [ ] 秘密鍵を使用したマニフェスト署名
   - [ ] Farcaster Developer Portalでの登録

4. **公開後の確認**
   - [ ] Farcaster上でのシェアテスト
   - [ ] 発見性の確認

## ローカルテスト手順

1. **開発サーバー起動**
   ```bash
   npm run dev
   ```

2. **cloudflaredトンネル起動**
   ```bash
   ./cloudflared.exe tunnel --url http://localhost:3000
   ```

3. **Farcaster Mini App Preview/Debug Tool**
   - https://warpcast.com/~/developers/frames
   - 上記で生成されたURLを入力してテスト

## スマートコントラクト情報

- **コントラクトアドレス**: `0x7f748f154B6D180D35fA12460C7E4C631e28A9d7`（プレースホルダー）
- **ネットワーク**: Monad Testnet（チェーンID: 10143）
- **機能**:
  - `getScore(address)`: ユーザーのスコアを取得
  - `saveScore(uint256)`: スコアを保存

## 注意点

1. 現在のスマートコントラクトアドレスはプレースホルダーです。実際のデプロイ時に正しいアドレスに置き換える必要があります。

2. マニフェスト署名には秘密鍵が必要です。秘密鍵は安全に管理し、公開リポジトリにコミットしないよう注意してください。

3. 本番デプロイ時には、`lib/constants.ts`の`APP_URL`を実際の本番URLに更新する必要があります。

4. 詳細なデプロイ手順は`DEPLOY.md`を参照してください。
