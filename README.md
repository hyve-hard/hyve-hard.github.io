# HYVE official website – starter version

GitHub Pages で公開する静的サイトです。`https://hyve-hard.github.io/` を想定しています。

## 公開手順
1. GitHubで `hyve-hard/hyve-hard.github.io` リポジトリを開く。
2. `index.html`、`css`、`js`、`data`、`assets` をリポジトリのルートにアップロードして Commit。
3. Settings > Pages で Deploy from a branch / main / /(root) を設定。
4. 公式HPが開いたら、Cloudflare Pages 側のリダイレクト先を `https://hyve-hard.github.io/` に変更する。

## 更新方法
- 作品・おすすめ曲: `data/site.json`
- レイアウト: `index.html`
- デザイン: `css/style.css`
- 作品画像: `assets/` に指定ファイル名で画像を置く（一覧表示に自動反映）

## 注意
- 作品画像がまだ入っていない場合はタイポグラフィックな代替画像が表示されます。
- サイト内での音源再生は未実装です。「LISTEN」はBandcampへ遷移します。埋め込みプレーヤーには正確なBandcamp album/track IDが必要です。
- ロゴは文字による仮表現です。正式なロゴへの差し替えを推奨します。
- SNS個別リンクはHYVEの公開ページを確認して差し替える必要があります。
- `index.html` を `file://` で直接開くと JSON の fetch が失敗することがあります。GitHub PagesなどのHTTPサーバー上で動作確認してください。
- 既存の Cloudflare 用 `_redirects` ファイルを本サイトに混ぜないでください。
