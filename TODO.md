# mabl-aichat 実行計画

## フェーズ1: プロジェクト初期設定

- [ ] Next.jsプロジェクトの作成（App Router）
- [ ] Tailwind CSSのセットアップ
- [ ] TypeScript設定の確認・調整
- [ ] ESLint / Prettier の設定
- [ ] .gitignoreファイルの作成・設定
- [ ] ディレクトリ構成の作成

## フェーズ2: データベース設定

- [ ] Prismaのインストール・初期化
- [ ] MongoDB接続設定（schema.prisma）
- [ ] Prismaクライアントの生成
- [ ] 環境変数ファイル（.env）の作成

## フェーズ3: バックエンド構築

- [ ] Honoのインストール・セットアップ
- [ ] Next.js App RouterへのHono統合（API Routes）
- [ ] `/api/chat` エンドポイントの作成
- [ ] Mastraのインストール・設定
- [ ] Claude Sonnet 4.5を使用したAIエージェントの構築
- [ ] ストリーミングレスポンスの実装

## フェーズ4: フロントエンド構築

- [ ] レイアウトコンポーネントの作成（Header）
- [ ] チャットコンテナコンポーネントの作成
- [ ] メッセージ一覧コンポーネントの作成
- [ ] メッセージ入力コンポーネントの作成
- [ ] 個別メッセージコンポーネントの作成
- [ ] セッション中の会話履歴管理（useState）
- [ ] APIクライアントの実装
- [ ] ストリーミング応答の表示処理

## フェーズ5: UI/UXの実装

- [ ] グローバルスタイルの設定（Tailwind CSS）
- [ ] ビジネスライクなデザインの適用
- [ ] レスポンシブデザインの実装（PC・タブレット・スマホ）
- [ ] ユーザー/AIメッセージの視覚的区別
- [ ] ローディング状態の表示
- [ ] エラーハンドリングUI

## フェーズ6: テスト・動作確認

- [ ] ローカル環境での動作確認
- [ ] チャット機能のテスト
- [ ] ストリーミング応答のテスト
- [ ] レスポンシブデザインの確認
- [ ] エラーケースの確認

## フェーズ7: デプロイ準備

- [ ] Dockerfileの作成
- [ ] .dockerignoreの作成
- [ ] 環境変数の整理
- [ ] ビルド・起動スクリプトの確認

## フェーズ8: Cloud Runへのデプロイ

- [ ] Google Cloud プロジェクトの設定
- [ ] Cloud Run用の設定（同時接続5〜10人想定）
- [ ] Dockerイメージのビルド・プッシュ
- [ ] Cloud Runへのデプロイ
- [ ] 環境変数の設定（ANTHROPIC_API_KEY等）
- [ ] 本番環境での動作確認

## 補足: 必要なパッケージ一覧

### 本番依存（dependencies）
- next
- react
- react-dom
- hono
- @hono/node-server
- @prisma/client
- @mastra/core
- @anthropic-ai/sdk

### 開発依存（devDependencies）
- typescript
- @types/node
- @types/react
- @types/react-dom
- tailwindcss
- postcss
- autoprefixer
- prisma
- eslint
- eslint-config-next
