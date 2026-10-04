# 課程開發環境規則（Project Rule）

本專案在 Windows 10/11 上開發，已依《Windows AI / Vibe Coding 開發環境安裝指南》安裝完成以下工具。執行任何操作前請遵守本規則。

## 1. 已安裝的工具

| 工具 | 用途 | 確認指令 |
|---|---|---|
| Git | 版本控制 | `git --version` |
| uv | Python 版本、套件與虛擬環境管理 | `uv --version` |
| Node.js LTS（含 npm、npx） | JavaScript / React / Next.js 開發 | `node --version` |
| GitHub CLI | GitHub 登入、建立 repo、Issue | `gh --version` |

- 終端機是 **Windows PowerShell**，請使用 PowerShell 語法，不要用 bash 語法。
- 不要重新安裝上述工具，也不要另外安裝 Python 官方安裝檔、Anaconda 或 nvm。
- 若 `npm` / `npx` 出現「已停用指令碼執行，無法載入 npm.ps1」，改用 `npm.cmd` / `npx.cmd`，並提醒使用者參考安裝指南第 2 節。

## 2. Python：一律使用 uv 與 .venv

- 開始寫 Python 前，先在專案根目錄建立虛擬環境：
  ```powershell
  uv venv
  ```
  需要指定版本時用 `uv venv --python 3.12`。電腦上沒有該版本時 uv 會自動下載，不需要另外安裝 Python。
- 安裝套件：有 `pyproject.toml` 的專案用 `uv add <套件>`；單純練習用 `uv pip install <套件>`。
- 執行程式：`uv run python main.py`。
- **禁止**使用全域的 `pip install`、`python -m pip install`，也不要把套件裝到虛擬環境以外的地方。
- `.venv/` 必須加入 `.gitignore`，不可提交到 Git。

## 3. Node.js

- 建立專案用官方腳手架，例如：
  - React：`npm create vite@latest <名稱> -- --template react`
  - Next.js：`npx create-next-app@latest <名稱>`
- 套件裝在專案內（`npm install <套件>`），不要用 `npm install -g`。
- `node_modules/` 必須加入 `.gitignore`。

## 4. Git 與 GitHub

- 使用者已註冊 GitHub 帳號。登入一律使用**瀏覽器裝置驗證**：
  ```powershell
  gh auth login --web --git-protocol https
  ```
  - **不要**要求或使用 Personal Access Token。
  - 登入流程會顯示一組一次性代碼與網址，請直接把代碼與網址貼給使用者，由使用者自己在瀏覽器輸入；使用者說完成後，再用 `gh auth status` 確認。
- commit 訊息用繁體中文，簡要說明「做了什麼」。
- push 前先 `git status` 確認要提交的檔案；不要提交 `.venv/`、`node_modules/`、`.env`、金鑰或密碼。
- **禁止**在未經使用者同意下執行 `git push --force`、`git reset --hard`、刪除分支或刪除 GitHub repo。

## 5. 日期與時間

需要日期時，先從系統取得，不要猜：

```powershell
Get-Date -Format "yyyy/MM/dd dddd HH:mm"
```
