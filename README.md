# Diet Tracker (ダイエット記録アプリ)

HTML, CSS, JavaScript (Vanilla JS) で作成された、GitHub Pages で公開可能なシンプルなダイエット記録アプリです。

## 特徴

- **体重の記録**: 日々の体重を日付とともに簡単に記録できます。
- **ダッシュボード**: 現在の体重、前回比、目標までの残り体重をひと目で確認できます。
- **進捗グラフ**: 体重の推移を Chart.js を使用して美しく可視化します。
- **目標設定**: 開始時の体重と目標体重を設定し、進捗率を確認できます。
- **データ保存**: ブラウザの `localStorage` を使用するため、サーバーなしでデータが保存されます。
- **バックアップ**: 記録したデータを JSON 形式でエクスポート・インポートできます。

## 使い方

1. `index.html` をブラウザで開きます。
2. 右上の設定アイコンから「開始時の体重」と「目標体重」を設定します。
3. 日々の体重を入力して「記録する」ボタンを押します。

## GitHub Pages での公開方法

1. このプロジェクトのファイルを GitHub リポジトリにプッシュします。
2. リポジトリの `Settings` > `Pages` に移動します。
3. `Build and deployment` > `Source` で `Deploy from a branch` を選択します。
4. `Branch` で `main` (または `master`) ブランチを選択し、フォルダを `/ (root)` に設定して `Save` をクリックします。
5. 数分後に公開された URL にアクセスできるようになります。

## 技術スタック

- HTML5 / CSS3 (Vanilla)
- JavaScript (ES6+ Modules)
- [Chart.js](https://www.chartjs.org/) (グラフ表示)
- [Lucide Icons](https://lucide.dev/) (アイコン)
