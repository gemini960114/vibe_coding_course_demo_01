# Vibe Coding 課程範例（demo_01）

Windows 10/11 上用 **Antigravity** 或 **Claude**，以自然語言完成 Python（uv）、Node.js（React / Next.js）與 GitHub 練習的課程範例。

## 內容

| 檔案 | 說明 |
|---|---|
| `windows_ai_vibe_coding_setup.md` | **第一步**：Windows 開發環境安裝指南（Git、uv、Node.js、GitHub CLI、ChatGPT Desktop、Antigravity IDE、Notepad++） |
| `AGENTS.md` | 課程環境規則（Antigravity 讀取） |
| `CLAUDE.md` | 課程環境規則（Claude 讀取，內容同 `AGENTS.md`） |
| `範例練習_uv_nodejs_github.md` | uv、Node.js、Git/GitHub 的自然語言練習範例 |

## 課程環境規則在做什麼

讓 AI 知道電腦上已經安裝好哪些工具，並遵守以下規範：

- 已安裝 Git、uv、Node.js LTS（npm / npx）、GitHub CLI，不要重複安裝。
- Python 一律先用 `uv venv` 建立 `.venv`，用 `uv add` / `uv run`，不使用全域 `pip install`。
- GitHub 一律用 `gh auth login --web` 瀏覽器裝置驗證登入，不使用 Personal Access Token。
- 危險的 git 操作（`push --force`、`reset --hard`、刪除 repo）必須先經使用者同意。

## 使用方式

1. 建立自己的專案資料夾，例如 `C:\Users\<你的帳號>\Projects\snake-game`。
2. 把本 repo 的 `AGENTS.md` 與 `CLAUDE.md` 複製到該資料夾根目錄。
3. 用 Antigravity 開啟資料夾（或在該資料夾啟動 Claude）。
4. 照著 `範例練習_uv_nodejs_github.md` 的自然語言指令練習。

> 修改規則時，`AGENTS.md` 與 `CLAUDE.md` 請保持一致。

## 前置條件

1. 依 `windows_ai_vibe_coding_setup.md` 完成 Windows 10 1809+ / Windows 11 開發環境安裝。
2. 註冊 GitHub 帳號。
