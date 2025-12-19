# Basic認証設定

このアプリケーションはBasic認証で保護されています。

## 認証情報

アプリケーションにアクセスするには、以下の認証情報が必要です：

- **ユーザー名**: 環境変数 `BASIC_AUTH_USER` で設定
- **パスワード**: 環境変数 `BASIC_AUTH_PASSWORD` で設定

## 環境変数の設定

### 1. GitHubシークレットの設定

GitHubリポジトリの **Settings** → **Secrets and variables** → **Actions** で以下を追加：

- `BASIC_AUTH_USER`: 任意のユーザー名（例: `admin`）
- `BASIC_AUTH_PASSWORD`: 強力なパスワード

### 2. Cloud Runでの手動設定

GitHubシークレットを設定せずに、Cloud Runコンソールで直接設定することもできます：

```bash
gcloud run services update mabl-aichat \
  --update-env-vars BASIC_AUTH_USER=admin,BASIC_AUTH_PASSWORD=your-secure-password \
  --region=asia-northeast1 \
  --project=mabl-457308
```

### 3. ローカル開発

`.env.local` ファイルに認証情報を設定：

```env
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=your-secure-password
```

ローカル開発時に認証をスキップする場合：

```env
SKIP_BASIC_AUTH=true
```

## セキュリティのベストプラクティス

- パスワードは12文字以上の英数字記号を組み合わせた強力なものを使用
- 定期的にパスワードを変更
- パスワードをGitにコミットしない（環境変数で管理）

## アクセス方法

ブラウザでURLにアクセスすると、認証ダイアログが表示されます。設定したユーザー名とパスワードを入力してください。
