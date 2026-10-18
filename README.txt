HYVE 表示復旧パッチ（2026-10-18）

問題: main.js の safeAudioUrl() が未定義のため、代表曲の1行目で例外が発生し、リリース一覧とSNSリンクまで描画されなくなっていました。

変更ファイルは2個だけです:
  index.html : 読み込みURLのバージョン番号更新（古いJSキャッシュ対策）
  js/main.js : safeAudioUrlを定義（空白URLを拒否）

data/site.json、admin/config.yml、CSS、画像は一切上書きしないでください。

GitHubの main ブランチの以下2ファイルを必ず更新:
  https://github.com/hyve-hard/hyve-hard.github.io/blob/main/index.html
  https://github.com/hyve-hard/hyve-hard.github.io/blob/main/js/main.js

反映後の確認:
  https://raw.githubusercontent.com/hyve-hard/hyve-hard.github.io/main/js/main.js
に「const safeAudioUrl =」という行があることを確認してください。
  https://hyve-hard.github.io/
で代表曲とVOL/EP作品、SNSリンクが戻ったことを確認してください。

注: サイトのデプロイと実端末での再生は未検証です。
