@echo off
setlocal enabledelayedexpansion

REM =====================================================
REM ファイルコピーバッチスクリプト (確認モード対応)
REM 
REM 使用方法:
REM   copy_files_confirm_allmode.bat [コピー元] [コピー先] [リストファイル]
REM
REM 例:
REM   copy_files_confirm_allmode.bat
REM   copy_files_confirm_allmode.bat .\02 .\06
REM   copy_files_confirm_allmode.bat .\02 .\06 .\copyfile.txt
REM =====================================================

REM =====================================================
REM デフォルト設定（バッチ内で宣言）
REM 必要に応じてここを変更してください。空にすると引数必須になります。
REM =====================================================
set "DEFAULT_SRC_BASE=.\02"
set "DEFAULT_DST_BASE=.\06"
set "DEFAULT_LIST_FILE=.\copyfile.txt"
REM =====================================================

REM =====================================================
REM ヘルプ表示
REM =====================================================
if "%~1"=="/?" goto :SHOW_HELP
if "%~1"=="-h" goto :SHOW_HELP
if "%~1"=="--help" goto :SHOW_HELP

REM =====================================================
REM 引数またはデフォルトの決定
REM =====================================================
if "%~1" NEQ "" (
    set "SRC_BASE=%~1"
) else (
    if "%DEFAULT_SRC_BASE%" NEQ "" (
        set "SRC_BASE=%DEFAULT_SRC_BASE%"
    ) else (
        echo [ERROR] 引数1(コピー元ディレクトリ)が指定されていません。
        echo 使用方法: copy_files_confirm_allmode.bat [コピー元] [コピー先] [リストファイル]
        echo 詳細は copy_files_confirm_allmode.bat /? を実行してください。
        exit /b 1
    )
)

if "%~2" NEQ "" (
    set "DST_BASE=%~2"
) else (
    if "%DEFAULT_DST_BASE%" NEQ "" (
        set "DST_BASE=%DEFAULT_DST_BASE%"
    ) else (
        echo [ERROR] 引数2(コピー先ディレクトリ)が指定されていません。
        echo 使用方法: copy_files_confirm_allmode.bat [コピー元] [コピー先] [リストファイル]
        echo 詳細は copy_files_confirm_allmode.bat /? を実行してください。
        exit /b 1
    )
)

if "%~3" NEQ "" (
    set "LIST_FILE=%~3"
) else (
    if "%DEFAULT_LIST_FILE%" NEQ "" (
        set "LIST_FILE=%DEFAULT_LIST_FILE%"
    ) else (
        echo [ERROR] 引数3(リストファイル)が指定されていません。
        echo 使用方法: copy_files_confirm_allmode.bat [コピー元] [コピー先] [リストファイル]
        echo 詳細は copy_files_confirm_allmode.bat /? を実行してください。
        exit /b 1
    )
)

REM =====================================================
REM パラメータの検証
REM =====================================================
echo.
echo ========================================
echo ファイルコピー処理を開始します
echo ========================================
echo.
echo [設定情報]
echo コピー元ディレクトリ: %SRC_BASE%
echo コピー先ディレクトリ: %DST_BASE%
echo リストファイル      : %LIST_FILE%
echo.

REM コピー元ディレクトリの存在確認
if not exist "%SRC_BASE%" (
    echo [ERROR] コピー元ディレクトリが存在しません: %SRC_BASE%
    exit /b 1
)

REM リストファイルの存在確認
if not exist "%LIST_FILE%" (
    echo [ERROR] リストファイルが存在しません: %LIST_FILE%
    exit /b 1
)

REM コピー先ディレクトリの存在確認と作成
if not exist "%DST_BASE%" (
    echo [警告] コピー先ディレクトリが存在しません。作成しますか？
    echo ディレクトリ: %DST_BASE%
    set /p "CONFIRM_CREATE=作成する場合は 'y' を入力してください (y/N): "
    if /i "!CONFIRM_CREATE!"=="y" (
        mkdir "%DST_BASE%" 2>nul
        if !errorlevel! neq 0 (
            echo [ERROR] ディレクトリの作成に失敗しました: %DST_BASE%
            exit /b 1
        )
        echo [OK] ディレクトリを作成しました: %DST_BASE%
    ) else (
        echo [キャンセル] 処理を中止します。
        exit /b 0
    )
)

REM =====================================================
REM 実行確認
REM =====================================================
echo.
echo 上記の設定でファイルコピーを実行します。
set /p "CONFIRM_EXEC=続行しますか？ (y/N): "
if /i not "!CONFIRM_EXEC!"=="y" (
    echo [キャンセル] 処理を中止しました。
    exit /b 0
)

REM =====================================================
REM ファイルコピー処理
REM =====================================================
echo.
echo ========================================
echo ファイルコピー処理中...
echo ========================================
echo.

set "SUCCESS_COUNT=0"
set "FAIL_COUNT=0"
set "SKIP_COUNT=0"
set "TOTAL_COUNT=0"

REM リストファイルを1行ずつ読み込み
for /f "usebackq delims=" %%F in ("%LIST_FILE%") do (
    set "FILE_PATH=%%F"
    
    REM コメント行やブランク行をスキップ
    if "!FILE_PATH:~0,1!"=="#" (
        echo [スキップ] コメント行: !FILE_PATH!
        set /a SKIP_COUNT+=1
        set /a TOTAL_COUNT+=1
    ) else if not "!FILE_PATH!"=="" (
        set /a TOTAL_COUNT+=1
        REM ソースファイルのフルパス
        set "SRC_FILE=%SRC_BASE%\!FILE_PATH!"
        set "DST_FILE=%DST_BASE%\!FILE_PATH!"
        
        REM ソースファイルの存在確認
        if exist "!SRC_FILE!" (
            REM コピー先のディレクトリを作成
            for %%D in ("!DST_FILE!") do (
                if not exist "%%~dpD" (
                    mkdir "%%~dpD" 2>nul
                )
            )
            
            REM ファイルをコピー
            copy /y "!SRC_FILE!" "!DST_FILE!" >nul 2>&1
            if !errorlevel! equ 0 (
                echo [OK] !FILE_PATH!
                set /a SUCCESS_COUNT+=1
            ) else (
                echo [エラー] コピー失敗: !FILE_PATH!
                set /a FAIL_COUNT+=1
            )
        ) else (
            echo [エラー] ファイルが見つかりません: !FILE_PATH!
            set /a FAIL_COUNT+=1
        )
    )
)

REM =====================================================
REM 結果サマリー
REM =====================================================
echo.
echo ========================================
echo 処理完了
echo ========================================
echo.
echo [処理結果]
echo 総ファイル数    : %TOTAL_COUNT%
echo 成功            : %SUCCESS_COUNT%
echo 失敗            : %FAIL_COUNT%
echo スキップ        : %SKIP_COUNT%
echo.

if %FAIL_COUNT% gtr 0 (
    echo [警告] 一部のファイルのコピーに失敗しました。
    exit /b 1
) else (
    echo [完了] すべてのファイルのコピーが正常に完了しました。
    exit /b 0
)

REM =====================================================
REM ヘルプ表示
REM =====================================================
:SHOW_HELP
echo.
echo ========================================
echo ファイルコピーバッチスクリプト - ヘルプ
echo ========================================
echo.
echo [概要]
echo   リストファイルに記載されたファイルを、指定されたディレクトリから
echo   別のディレクトリへコピーします。
echo.
echo [使用方法]
echo   copy_files_confirm_allmode.bat [コピー元] [コピー先] [リストファイル]
echo.
echo [引数]
echo   コピー元      : コピー元のベースディレクトリ（省略時: .\02）
echo   コピー先      : コピー先のベースディレクトリ（省略時: .\06）
echo   リストファイル: コピーするファイルのリスト（省略時: .\copyfile.txt）
echo.
echo [リストファイルの形式]
echo   - 1行に1つのファイルパスを記述します
echo   - パスはコピー元ベースディレクトリからの相対パスです
echo   - # で始まる行はコメントとして扱われます
echo   - 空行は無視されます
echo.
echo [例]
echo   copy_files_confirm_allmode.bat
echo     ^-^> デフォルト設定でコピーを実行
echo.
echo   copy_files_confirm_allmode.bat C:\Source D:\Dest
echo     ^-^> C:\Source から D:\Dest へコピー（デフォルトのリストファイル使用）
echo.
echo   copy_files_confirm_allmode.bat .\data .\backup .\files.txt
echo     ^-^> .\data から .\backup へ .\files.txt のリストに従ってコピー
echo.
echo [リストファイルの例 (copyfile.txt)]
echo   # これはコメント行です
echo   folder1\file1.txt
echo   folder2\subfolder\file2.doc
echo   data\report.xlsx
echo.
echo [終了コード]
echo   0 : 正常終了
echo   1 : エラー発生またはキャンセル
echo.
exit /b 0
