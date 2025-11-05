# 使用例とスクリーンショット例

## 基本的な実行例

### 例1: デフォルト設定で実行

```
C:\Projects> copy_files_confirm_allmode.bat

========================================
ファイルコピー処理を開始します
========================================

[設定情報]
コピー元ディレクトリ: .\02
コピー先ディレクトリ: .\06
リストファイル      : .\copyfile.txt

上記の設定でファイルコピーを実行します。
続行しますか？ (y/N): y

========================================
ファイルコピー処理中...
========================================

[OK] folder1\file1.txt
[OK] folder2\subfolder\file2.doc
[OK] data\report.xlsx

========================================
処理完了
========================================

[処理結果]
総ファイル数    : 3
成功            : 3
失敗            : 0
スキップ        : 0

[完了] すべてのファイルのコピーが正常に完了しました。
```

### 例2: カスタムパラメータで実行

```
C:\Projects> copy_files_confirm_allmode.bat C:\Source D:\Backup myfiles.txt

========================================
ファイルコピー処理を開始します
========================================

[設定情報]
コピー元ディレクトリ: C:\Source
コピー先ディレクトリ: D:\Backup
リストファイル      : myfiles.txt

[警告] コピー先ディレクトリが存在しません。作成しますか？
ディレクトリ: D:\Backup
作成する場合は 'y' を入力してください (y/N): y
[OK] ディレクトリを作成しました: D:\Backup

上記の設定でファイルコピーを実行します。
続行しますか？ (y/N): y

========================================
ファイルコピー処理中...
========================================

[スキップ] コメント行: # これは重要なファイル
[OK] important\document.pdf
[エラー] ファイルが見つかりません: missing\file.txt
[OK] config\settings.ini

========================================
処理完了
========================================

[処理結果]
総ファイル数    : 4
成功            : 2
失敗            : 1
スキップ        : 1

[警告] 一部のファイルのコピーに失敗しました。
```

### 例3: ヘルプの表示

```
C:\Projects> copy_files_confirm_allmode.bat /?

========================================
ファイルコピーバッチスクリプト - ヘルプ
========================================

[概要]
  リストファイルに記載されたファイルを、指定されたディレクトリから
  別のディレクトリへコピーします。

[使用方法]
  copy_files_confirm_allmode.bat [コピー元] [コピー先] [リストファイル]

[引数]
  コピー元      : コピー元のベースディレクトリ（省略時: .\02）
  コピー先      : コピー先のベースディレクトリ（省略時: .\06）
  リストファイル: コピーするファイルのリスト（省略時: .\copyfile.txt）

...（続く）
```

## リストファイルの例

### 基本的なリストファイル (copyfile.txt)

```text
# プロジェクトファイルのコピーリスト
# 作成日: 2025-11-05

# ドキュメント
docs\manual.pdf
docs\readme.txt

# 設定ファイル
config\app.config
config\database.ini

# データファイル
data\users.csv
data\logs\2025-11.log

# スクリプト
scripts\backup.bat
scripts\deploy.ps1
```

### 複雑なディレクトリ構造の例

```text
# 本番デプロイ用ファイルリスト

# Webアプリケーション
src\index.html
src\css\style.css
src\css\responsive.css
src\js\app.js
src\js\lib\jquery.min.js
src\images\logo.png
src\images\icons\favicon.ico

# バックエンド
api\app.py
api\models\user.py
api\controllers\auth.py
api\requirements.txt

# 設定
config\production.json
.env.production
```

## エラー処理の例

### エラー: ファイルが見つからない

```
[エラー] ファイルが見つかりません: missing\file.txt
```

**解決方法**: リストファイルのパスを確認するか、該当ファイルをコピー元ディレクトリに配置してください。

### エラー: ディレクトリが存在しない

```
[ERROR] コピー元ディレクトリが存在しません: C:\NonExistent
```

**解決方法**: 正しいディレクトリパスを指定してください。

### キャンセル

```
上記の設定でファイルコピーを実行します。
続行しますか？ (y/N): n
[キャンセル] 処理を中止しました。
```

## 実用的な使用シナリオ

### シナリオ1: 毎日のバックアップ

1. `daily_backup.txt` を作成:
   ```text
   # 毎日バックアップするファイル
   database\users.db
   logs\application.log
   config\settings.ini
   ```

2. バッチファイルを実行:
   ```batch
   copy_files_confirm_allmode.bat C:\App C:\Backup\%DATE% daily_backup.txt
   ```

### シナリオ2: プロジェクトのデプロイ

1. `deploy_prod.txt` を作成:
   ```text
   # 本番環境へのデプロイファイル
   src\index.html
   src\app.js
   config\production.json
   ```

2. デプロイ実行:
   ```batch
   copy_files_confirm_allmode.bat .\dev \\production-server\www deploy_prod.txt
   ```

### シナリオ3: 複数環境への配布

```batch
REM 開発環境
copy_files_confirm_allmode.bat .\master .\dev dev_files.txt

REM ステージング環境
copy_files_confirm_allmode.bat .\master .\staging staging_files.txt

REM 本番環境
copy_files_confirm_allmode.bat .\master .\production prod_files.txt
```

## ディレクトリ構造の例

```
プロジェクトフォルダ/
├── copy_files_confirm_allmode.bat  ← バッチスクリプト
├── copyfile.txt                     ← デフォルトのリストファイル
├── 02/                              ← コピー元（デフォルト）
│   ├── folder1/
│   │   ├── file1.txt
│   │   └── file2.doc
│   ├── folder2/
│   │   └── subfolder/
│   │       └── data.xlsx
│   └── config/
│       └── settings.ini
└── 06/                              ← コピー先（自動作成）
    ├── folder1/
    │   ├── file1.txt
    │   └── file2.doc
    ├── folder2/
    │   └── subfolder/
    │       └── data.xlsx
    └── config/
        └── settings.ini
```

## Tips

### デフォルト設定のカスタマイズ

バッチファイルを開いて、以下の部分を編集:

```batch
set "DEFAULT_SRC_BASE=.\02"      ← コピー元を変更
set "DEFAULT_DST_BASE=.\06"      ← コピー先を変更
set "DEFAULT_LIST_FILE=.\copyfile.txt"  ← リストファイルを変更
```

### ログファイルの作成

```batch
copy_files_confirm_allmode.bat > copy_log_%DATE%.txt 2>&1
```

### 自動実行（確認なし版）

確認プロンプトをスキップしたい場合は、バッチファイルをカスタマイズして以下の行を削除:

```batch
set /p "CONFIRM_EXEC=続行しますか？ (y/N): "
if /i not "!CONFIRM_EXEC!"=="y" (
    echo [キャンセル] 処理を中止しました。
    exit /b 0
)
```
