HYVE URL表示修正パッチ（2026-10-18）

差し替えるファイル：
  index.html
  js/main.js

※ data/site.json、admin/config.yml、CSS、画像は上書きしません。
※ 今回指定されたSpotify/Apple Music/YouTube Musicと既存Bandcampを、管理画面で未設定でも表示する初期値として設定しています。
※ 管理画面から有効な別URLを入力・GitHubに保存できれば、そのURLを優先して表示します。
※ SoundCloudのURLは未指定なので空欄のままです（CMSで設定可能）。

確認：GitHubの data/site.json に変更が実際にコミットされているか確認してください。
管理画面で保存してもコミットが増えなければCMSの認証・権限・保存処理の問題です。
コミットされているのに古い表示ならGitHub Actions/Pagesの反映とブラウザの強制再読み込みを確認してください。
