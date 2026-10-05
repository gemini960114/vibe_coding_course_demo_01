# Vibe Coding 課程範例（demo_01）

Windows 10/11 上用 **Antigravity** 或 **Claude**，以自然語言完成 Python（uv）、Node.js（React / Next.js）與 GitHub 練習的課程範例。

## 上課順序

講義檔名前的編號就是閱讀順序，依 01 → 08 進行即可。

| # | 單元 | 講義 | 完成時你會… |
|---|---|---|---|
| 01 | 安裝開發環境 | [01_windows_環境安裝.md](01_windows_環境安裝.md) | 裝好 Git、uv、Node.js、GitHub CLI、Antigravity 等工具 |
| 02 | 註冊 GitHub 帳號 | [02_github_帳號註冊.md](02_github_帳號註冊.md) | 有一個英文帳號、Email 已驗證、接受老師的 nchc-class 邀請 |
| 03 | Antigravity 入門 | [03_antigravity_入門.md](03_antigravity_入門.md) | 會開專案、放課程規則、用自然語言下指令，並登入 GitHub CLI |
| 04 | uv 與 Python | [04_uv_python.md](04_uv_python.md) | 用 uv 建立 Python 專案，請 AI 做出小遊戲或小工具 |
| 05 | React 與 Next.js | [05_nodejs_react_nextjs.md](05_nodejs_react_nextjs.md) | 做出 React 網頁、看懂 Next.js 前後端；進階：[四連桿模擬器](examples/fourbar-mujoco/)（[線上版](https://gemini960114.github.io/vibe_coding_course_demo_01/fourbar-mujoco/)） |
| 06 | Git / GitHub | [06_git_github.md](06_git_github.md) | 用自然語言 commit、push，把作品放上自己的 GitHub |
| 07 | 每日工作回報 | [07_每日回報.md](07_每日回報.md)、[daily_report_demo_01](https://github.com/nchc-class/daily_report_demo_01) | 每天說「今天我要做…」，自動寫本地月報、留言到晨會 Issue |
| 08 | 投影片與資訊圖表 | [08_投影片與資訊圖表.md](08_投影片與資訊圖表.md) | 用 Skill 把 Markdown 做成投影片與資訊圖表 |

## 其他檔案

| 檔案 | 給誰看 | 說明 |
|---|---|---|
| `slides/` | 學生 | 課程投影片：PDF 放在 repo，PowerPoint 原始檔放在 [Release](https://github.com/gemini960114/vibe_coding_course_demo_01/releases/tag/slides-2026-10)（不隨 clone 下載），見 [slides/README.md](slides/README.md) |
| `examples/fourbar-mujoco/` | 學生 | 05 的進階範例完成品：React + MuJoCo（WebAssembly）四連桿運動學模擬器 |
| `AGENTS.md` / `CLAUDE.md` | AI | 課程環境規則（Antigravity 讀 `AGENTS.md`、Claude 讀 `CLAUDE.md`，內容相同） |
| `.agents/skills/`、`.claude/skills/` | AI | 08 使用的 Skill：`baoyu-slide-deck`、`baoyu-infographic`、`baoyu-image-gen`、`baoyu-url-to-markdown`（來源 [jimliu/baoyu-skills](https://github.com/jimliu/baoyu-skills)，MIT 授權；兩份內容相同） |

## 相關 repo

| Repo | 用途 |
|---|---|
| 本 repo（公開） | 講義 01–08、課程規則、範例完成品、投影片與資訊圖表 Skill |
| [daily_report_demo_01](https://github.com/nchc-class/daily_report_demo_01)（私有，需老師邀請） | 07 每日工作回報：學生用自然語言寫晨會報告，自動寫入本地月報並留言到老師建立的當日 Issue |

## 課程環境規則在做什麼

讓 AI 知道電腦上已經安裝好哪些工具，並遵守以下規範：

- 已安裝 Git、uv、Node.js LTS（npm / npx）、GitHub CLI，不要重複安裝。
- Python 一律用 uv：`uv init --no-package` 建專案、`uv add` 裝套件、`uv run` 執行，不使用全域 `pip install`。
- 建立 React / Next.js 專案使用不會詢問問題的指令，伺服器在背景執行。
- GitHub 一律用 `gh auth login --web` 瀏覽器裝置驗證登入，不使用 Personal Access Token。
- 危險的 git 操作（`push --force`、`reset --hard`、刪除 repo）必須先經使用者同意。

## 在自己的專案使用規則

1. 建立自己的專案資料夾，例如 `C:\Users\<你的帳號>\Projects\my-practice`。
2. 把本 repo 的 `AGENTS.md` 與 `CLAUDE.md` 複製到該資料夾根目錄。
3. 用 Antigravity 開啟資料夾（或在該資料夾啟動 Claude）。
4. 從 [04 uv 與 Python](04_uv_python.md) 開始練習。

> 修改規則時，`AGENTS.md` 與 `CLAUDE.md` 請保持一致。
