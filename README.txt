HYVE プレーヤー + Xフッター更新パッチ

上書き対象: index.html, css/style.css, js/main.js, admin/config.yml
既存の data/site.json、assets、管理画面認証ファイルは上書きしません。

変更内容:
- HYVEのYouTube MusicプレイリストをYouTube埋め込みプレーヤーとして表示
- プレイリストのURLを管理画面「サイト基本設定」から変更可能（未設定の場合は既存の指定プレイリスト）
- 最下部のリンク集の先頭にXを追加（X URLは既存の管理画面項目 xUrl を使用）
- フッター順序は X, Bandcamp, Spotify, Apple Music, SoundCloud
- XのURLが空の場合は安全のため表示しません。
- 既存の5曲のLISTENボタンは収録作品への外部リンクとして維持。

重要:
YouTubeの埋め込みは配信側の設定・地域・権利条件により、一部動画が再生できない場合があります。外部プレイリストリンクも併設しています。
現在の公開リポジトリへ適用前に4ファイルをバックアップし、GitHubにアップロード後に再生・保存をテストしてください。
