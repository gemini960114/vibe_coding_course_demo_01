# 課程開發環境規則（Project Rule）

本專案在 Windows 10/11 上開發，已依 [Windows AI / Vibe Coding 開發環境安裝指南](https://github.com/gemini960114/vibe_coding_course_demo_01/blob/main/01_windows_環境安裝.md) 安裝完成以下工具。執行任何操作前請遵守本規則。

## 1. 已安裝的工具

| 工具 | 用途 | 確認指令 |
|---|---|---|
| Git | 版本控制 | `git --version` |
| uv | Python 版本、套件與虛擬環境管理 | `uv --version` |
| Node.js LTS（含 npm、npx） | JavaScript / React / Next.js 開發 | `node --version` |
| GitHub CLI | GitHub 登入、建立 repo、Issue | `gh --version` |

- 終端機是 **Windows PowerShell**，請使用 PowerShell 語法，不要用 bash 語法。
- 不要重新安裝上述工具，也不要另外安裝 Python 官方安裝檔、Anaconda 或 nvm。
- 若 `npm` / `npx` 出現「已停用指令碼執行，無法載入 npm.ps1」，改用 `npm.cmd` / `npx.cmd`，並提醒使用者參考[安裝指南](https://github.com/gemini960114/vibe_coding_course_demo_01/blob/main/01_windows_環境安裝.md)第 2 節。
- 處理中文前，先在同一個終端機設定 UTF-8，避免 `gh` / `git` 的中文輸出變亂碼：
  ```powershell
  [Console]::OutputEncoding = [Text.Encoding]::UTF8; $OutputEncoding = [Text.Encoding]::UTF8
  git config --global core.quotepath false
  ```
- 寫入含中文的檔案一律用編輯工具存成 UTF-8（無 BOM），不要用 Windows PowerShell 5.1 的 `Set-Content` / `Out-File` / `>` 預設編碼。

## 2. Python：一律使用 uv 與 .venv

- 建立新專案一律加 `--no-package`（才會產生 `main.py`，結構最單純）：
  ```powershell
  uv init <名稱> --python 3.12 --no-package
  ```
- 虛擬環境：
  - 有 `pyproject.toml` 時，`uv add` / `uv run` 會自動建立 `.venv`；clone 下來的專案用 `uv sync` 還原。
  - 沒有 `pyproject.toml` 的單純練習資料夾，且**還沒有** `.venv` 時才執行 `uv venv`（已存在再執行會報錯）。
  - 電腦上沒有指定的 Python 版本時 uv 會自動下載，不需要另外安裝 Python。
- 安裝套件：有 `pyproject.toml` 用 `uv add <套件>`；沒有則用 `uv pip install <套件>`。
- 執行程式：`uv run python main.py`。
- **禁止**使用全域的 `pip install`、`python -m pip install`，也不要把套件裝到虛擬環境以外的地方。
- `.venv/` 必須加入 `.gitignore`，不可提交到 Git。

## 3. Node.js

- 建立專案用官方腳手架，並使用**不會詢問問題**的寫法（互動提問會讓 AI 卡住）：
  - React：
    ```powershell
    npm create --yes vite@latest <名稱> -- --template react --no-interactive --no-immediate
    ```
  - Next.js：
    ```powershell
    npx --yes create-next-app@latest <名稱> --yes --ts --app --tailwind --eslint --no-src-dir --use-npm
    ```
    create-next-app 會在新專案裡自動 `git init`，並產生它自己的 `AGENTS.md` / `CLAUDE.md`，屬正常現象；第一次安裝可能需要數分鐘。
- 套件裝在專案內（`npm install <套件>`），不要用 `npm install -g`。
- `npm run dev`、`streamlit run` 這類**不會自己結束**的伺服器要在背景執行，啟動後把網址告訴使用者。
- 需要使用者鍵盤輸入的程式（例如 `input()` 遊戲）不要由 AI 執行，改為告訴使用者執行指令讓他自己操作。
- `node_modules/` 必須加入 `.gitignore`。

## 4. Git 與 GitHub

- 使用者已註冊 GitHub 帳號。登入一律使用**瀏覽器裝置驗證**：
  ```powershell
  gh auth login --web --git-protocol https
  ```
  - **不要**要求或使用 Personal Access Token。
  - 登入流程會顯示一組一次性代碼與網址，請直接把代碼與網址貼給使用者，由使用者自己在瀏覽器輸入；使用者說完成後，再用 `gh auth status` 確認。
- 登入成功後，完成 Git 的身分與認證設定（只需做一次；未設定時第一次 commit 會出現「Author identity unknown」而失敗）：
  ```powershell
  gh auth setup-git
  git config --global user.name    # 沒有輸出代表尚未設定
  git config --global user.email
  ```
  尚未設定時，用使用者的 GitHub 帳號與 noreply 信箱設定（不會公開真實 Email）：
  ```powershell
  $u = gh api user | ConvertFrom-Json
  git config --global user.name  $u.login
  git config --global user.email "$($u.id)+$($u.login)@users.noreply.github.com"
  ```
- commit 訊息用繁體中文，簡要說明「做了什麼」。
- push 前先 `git status` 確認要提交的檔案；不要提交 `.venv/`、`node_modules/`、`.env`、金鑰或密碼。
- **禁止**在未經使用者同意下執行 `git push --force`、`git reset --hard`、刪除分支或刪除 GitHub repo。

## 5. 日期與時間

需要日期時，先從系統取得，不要猜：

```powershell
Get-Date -Format "yyyy/MM/dd dddd HH:mm"
```
