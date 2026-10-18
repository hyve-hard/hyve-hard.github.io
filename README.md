# HYVE official site + CMS

## GitHubにアップロード
ZIPを展開し、**HYVE_Site_CMSフォルダの中身**（index.html, admin/, assets/, css/, data/, js/ 等）を https://github.com/hyve-hard/hyve-hard.github.io の main ブランチ直下にアップロードします。既存ファイルは上書きしてください。

## 管理画面
GitHub Pagesで公開後 https://hyve-hard.github.io/admin/ を開き、Sign In with Tokenでログインします。
GitHub > Settings > Developer settings > Personal access tokens > Fine-grained tokens で、対象repoを hyve-hard/hyve-hard.github.io のみに指定し、Contents: Read and write の権限を付けてください。
トークンは共有・公開ファイル・ChatGPTチャットには絶対に貼らないでください。CMS上で作品の追加、作品の順番変更、画像のアップロード、代表曲追加などが可能です。変更後はPublish/Saveを実行するとGitHubにコミットされ、Pages更新後サイトに反映されます。

- ファイルとジャケットは作品名で紐づけ済み。9作品。
- ジャケットはWEBP 1100px以下に最適化。元データはアップロードZIP側で保持してください。
- CMSの各フィールドは原則任意入力。URLが空欄の場合リンクが機能しないため適切に入力してください。
- GitHubリポジトリがPublicなのでCMS設定自体は閲覧可能ですが、編集には権限のあるGitHubトークンが必要です。
- フロントエンドの楽曲試聴は外部ページへのリンクです。実際の埋め込み再生は未実装です。
- 完全な永続URLの保証はありません。M3 QRのCloudflare redirect設定は別途維持してください。
