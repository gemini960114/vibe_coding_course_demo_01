# 範例練習：uv × Node.js × GitHub（自然語言版）

> 前提：
> - 已完成 [`windows_ai_vibe_coding_setup.md`](windows_ai_vibe_coding_setup.md)（Windows AI / Vibe Coding 開發環境安裝指南）的所有安裝。
> - 專案根目錄已放入本 repo 的 `AGENTS.md`（Antigravity）與 `CLAUDE.md`（Claude）課程環境規則，AI 會自動遵守「Python 一律用 uv + .venv」等規範。
> - 以下 `text` 區塊都是**直接貼到 Antigravity Agent 對話框**的自然語言指令。

---

## Part 1. uv：Python 環境

### 1-1. 認識 uv（老師示範，學生跟打）

| 指令 | 用途 |
|---|---|
| `uv python list` | 查看可用 / 已安裝的 Python 版本 |
| `uv python install 3.12` | 安裝 Python 3.12 |
| `uv init hello-uv --python 3.12 --no-package` | 建立新專案（含 `pyproject.toml`、`main.py`） |
| `uv venv` | 在沒有 `pyproject.toml` 的資料夾建立 `.venv`（已存在會報錯） |
| `uv sync` | 依 `pyproject.toml` / `uv.lock` 還原 `.venv`（clone 別人的專案時用） |
| `uv add requests` | 安裝套件並記錄到 `pyproject.toml` |
| `uv remove requests` | 移除套件 |
| `uv run python main.py` | 用專案的 .venv 執行程式 |
| `uv pip list` | 列出 .venv 已安裝的套件 |
| `.\.venv\Scripts\Activate.ps1` | 啟用虛擬環境（之後可直接打 `python`；需已完成安裝指南第 2 節的執行原則設定） |
| `deactivate` | 離開虛擬環境 |

練習流程：

```powershell
uv init hello-uv --python 3.12 --no-package
cd hello-uv
uv add rich
uv run python -c "from rich import print; print('[bold green]Hello uv![/]')"
uv pip list
```

觀察重點：`pyproject.toml` 多了 `rich`、資料夾多了 `.venv` 與 `uv.lock`（`uv add` 會自動建立 `.venv`，不必先 `uv venv`）。

> `uv init` 一定要加 `--no-package`：新版 uv 預設會建立 `src/` 套件結構，沒有 `main.py`，`uv run python main.py` 會找不到檔案。

### 1-2. 用自然語言做專案（擇一或依序）

**範例 A：終端機猜數字遊戲（入門，無套件）**

```text
在目前資料夾建立一個 Python 專案 guess-number，用 uv 建立 .venv。
做一個終端機猜數字遊戲：電腦隨機選 1~100，玩家輸入數字後提示「太大 / 太小」，
猜中顯示猜了幾次，並可選擇再玩一次。完成後告訴我執行指令，我自己來玩。
```

**範例 B：pygame 貪食蛇（遊戲，學會加套件）**

```text
建立 Python 專案 snake-game，用 uv 建立 .venv 並安裝 pygame。
做一個貪食蛇遊戲：方向鍵控制、吃到食物變長並加分、撞牆或撞自己結束，
畫面右上角顯示分數，結束後按 R 重新開始。完成後告訴我怎麼執行。
```

延伸：「加上最高分紀錄，存在 highscore.txt」「速度隨分數變快」。

**範例 C：Streamlit 個人記帳網頁（資料 + 網頁介面）**

```text
建立 Python 專案 money-tracker，用 uv 建立 .venv，安裝 streamlit 與 pandas。
做一個記帳網頁：可輸入日期、類別（餐飲/交通/娛樂/其他）、金額、備註，
資料存在 data.csv；頁面顯示本月總支出、各類別圓餅圖、明細表格。
在背景用 uv run streamlit run app.py --server.headless true 啟動，並告訴我網址。
```

**範例 D：CSV 資料分析與圖表（科學運算入門）**

```text
建立 Python 專案 weather-analysis，用 uv 建立 .venv，安裝 pandas 與 matplotlib。
先產生一份模擬資料 weather.csv（台北 2025 年每日氣溫與降雨量），
再分析每月平均氣溫與總雨量，畫成折線圖與長條圖存成 PNG，
圖表標題用中文並確保中文字不會變成方塊。
```

> 教學提醒：學生常見錯誤是 AI 直接用 `pip install`。若發生，請學生說「請改用 uv」，順便說明 project rule 的作用。

---

## Part 2. Node.js：React 與 Next.js

### 建議安排

| 項目 | 定位 | 建議 |
|---|---|---|
| React（Vite） | 純前端：畫面、互動、狀態 | **主要練習**，概念單純、啟動快 |
| Next.js | 前端 + 後端 API 在同一個專案 | **一個示範即可**，讓學生看到「前後端」差異 |

兩者都做不會太多，但建議 React 讓學生動手、Next.js 以老師示範為主，學有餘力再跟做。

### 2-1. 認識 npm / npx（老師示範）

| 指令 | 用途 |
|---|---|
| `npm create --yes vite@latest my-app -- --template react --no-interactive --no-immediate` | 建立 React 專案（不詢問問題） |
| `npx --yes create-next-app@latest my-next --yes --ts --app --tailwind --eslint --no-src-dir --use-npm` | 建立 Next.js 專案（不詢問問題） |
| `npm install` | 依 `package.json` 安裝套件（產生 `node_modules`） |
| `npm install <套件>` | 加裝套件 |
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | 打包正式版 |

> 教學提醒：
> - 腳手架指令若沒加 `--no-interactive` / `--yes`，會跳出選單問問題，AI 會卡住。project rule 已要求 AI 使用不詢問的寫法。
> - `npm run dev` 不會自己結束，AI 應該在背景啟動並回報網址。
> - Next.js 第一次建立要下載數百個套件，可能需要數分鐘；建議課前先在教室電腦建立一次，暖好 npm 快取。
> - create-next-app 會自動 `git init`，並在專案裡產生它自己的 `AGENTS.md` / `CLAUDE.md`，屬正常現象。

### 2-2. React 範例（擇一）

**範例 E：番茄鐘（狀態與計時器）**

```text
用 Vite 建立 React 專案 pomodoro。做一個番茄鐘網頁：
25 分鐘工作 / 5 分鐘休息自動切換，有開始、暫停、重設按鈕，
時間到播放提示音並在標題列顯示剩餘時間，畫面要簡潔好看、手機也能用。
完成後執行 npm run dev 並告訴我網址。
```

**範例 F：記憶翻牌遊戲（遊戲）**

```text
用 Vite 建立 React 專案 memory-game。做一個 4x4 記憶翻牌遊戲：
8 組 emoji 隨機洗牌，一次翻兩張，相同就保留、不同就蓋回，
顯示步數與計時，全部配對完成後顯示「過關」與成績，可重新開始。
```

**範例 G：待辦清單（localStorage）**

```text
用 Vite 建立 React 專案 todo-app。做一個待辦清單：
新增、勾選完成、刪除、篩選（全部/未完成/已完成），
資料存在瀏覽器 localStorage，重新整理不會消失。
```

### 2-3. Next.js 範例（前端 + 後端 API）

**範例 H：班級留言板**

```text
用 create-next-app 建立 Next.js 專案 message-board（TypeScript、App Router、Tailwind）。
做一個留言板：
- 後端：app/api/messages/route.ts 提供 GET（取得全部留言）與 POST（新增留言），
  資料先存在專案內的 data/messages.json。
- 前端：首頁顯示留言列表（最新在上），下方有暱稱與內容的表單，送出後立即更新。
完成後啟動 npm run dev，並說明哪些檔案是前端、哪些是後端。
```

教學重點：讓學生打開瀏覽器直接看 `http://localhost:3000/api/messages`，理解「API 回傳的是 JSON 資料」。

**範例 I（延伸）：AI 名言產生器頁面**

```text
在 message-board 專案新增 /quote 頁面，按按鈕時呼叫後端 /api/quote，
後端從 20 句內建的勵志名言中隨機回傳一句，前端以卡片動畫顯示。
```

### 2-4. 進階範例：React + MuJoCo 四連桿運動學模擬器

完成品：[`examples/fourbar-mujoco/`](examples/fourbar-mujoco/)（可直接 `npm install` → `npm run dev` 執行）。

![四連桿模擬器](examples/fourbar-mujoco/docs/screenshot.png)

**範例 J：用自然語言從零做出來**

```text
用 Vite 建立 React 專案 fourbar-mujoco，安裝官方 MuJoCo WebAssembly 套件 @mujoco/mujoco。
做一個「四連桿機構運動學模擬器」網頁：
1. 右側面板可用滑桿調整固定桿 a、曲柄 b、連桿 c、搖桿 d 的長度，以及連桿上描點 P 的位置。
2. 依桿長產生 MuJoCo MJCF 模型：曲柄與連桿串接成鉸鏈鏈條，搖桿另外鉸接在地面，
   用 equality connect（site1/site2）把連桿末端與搖桿末端接成封閉迴路；重力設 0，
   曲柄用 position 致動器驅動。初始關節角用解析解算好，讓迴路一開始就閉合。
3. 用 Canvas 2D 畫出機構與描點 P 的軌跡，並用虛線畫出解析解的理論軌跡做比對。
4. 顯示 Grashof 判別結果與機構類型、曲柄角 θ2、搖桿角 θ4、傳動角 μ（小於 40° 要警示）。
5. 曲柄不能整圈轉動時，改成在可行範圍內來回擺動。
注意：vite.config.js 要設定 optimizeDeps.exclude: ['@mujoco/mujoco']，否則找不到 mujoco.wasm。
完成後執行 npm run dev 並告訴我網址。
```

**可以分段請 AI 加功能（比一次全做更穩）**：

1. 「先只用解析解和 Canvas 畫出會轉動的四連桿。」
2. 「改成由 MuJoCo 模擬，並顯示 MuJoCo 與解析解的誤差。」
3. 「加上 Grashof 判別、傳動角與四種範例組合按鈕。」

**課堂討論**：

- 為什麼「三搖桿」的曲柄不能整圈轉？對照 Grashof 不等式 s + l ≤ p + q。
- 傳動角 μ 什麼時候最小？這時候機構會發生什麼事？
- 「迴路閉合誤差」為什麼不是 0？（MuJoCo 的約束是軟約束，以數值方法求解。）

---

## Part 3. Git / GitHub：用自然語言版本控制

> 不教 git 指令本身，讓學生觀察 AI 執行了什麼。

### 3-1. 第一次登入 GitHub

```text
幫我用瀏覽器裝置驗證方式登入 GitHub CLI（gh auth login --web），
不要用 personal access token。請在背景執行登入流程，
把跳出來的一次性代碼和驗證網址直接貼給我，我會自己去瀏覽器輸入代碼；
我跟你說完成之後，你再用 gh auth status 確認登入成功。
```

### 3-2. 常用自然語言指令

| 情境 | 對 AI 說 |
|---|---|
| 開始版本控制 | 「把這個專案初始化成 git repo，建立適合的 .gitignore（排除 .venv、node_modules），做第一次 commit」 |
| 上傳到 GitHub | 「在我的 GitHub 建立一個公開 repo，名稱跟資料夾一樣，把專案 push 上去，給我 repo 網址」 |
| 修改後提交 | 「幫我看這次改了什麼，寫一段繁體中文的 commit 訊息，commit 並 push」 |
| 只提交部分檔案 | 「只 commit app.py 的修改，其他檔案先不要」 |
| 查看歷史 | 「列出最近 5 次 commit，用一句話說明每次改了什麼」 |
| 比較差異 | 「我上一次 commit 之後改了哪些地方？」 |
| 復原（未 commit） | 「把 main.py 恢復成上一次 commit 的樣子」（AI 應先確認再執行） |
| 開分支試新功能 | 「開一個新分支 feature-highscore 來做最高分功能」 |
| 合併回主線 | 「最高分功能完成了，合併回 main 並 push」 |
| 加 README | 「幫這個專案寫 README，包含功能介紹、安裝與執行方式，commit 並 push」 |

> `uv init` 與 create-next-app 建立專案時已自動 `git init`。對 AI 說「初始化成 git repo」時，若 AI 回報「已經是 git repo」屬正常，直接繼續 commit 即可。

### 3-3. 建議練習流程

1. 拿 Part 1 或 Part 2 做好的專案。
2. 「初始化 git + 第一次 commit」。
3. 「建立 GitHub repo 並 push」→ 到瀏覽器確認 repo 出現。
4. 叫 AI 加一個小功能 → 「commit 並 push」→ 在 GitHub 上看 commit 紀錄。
5. 觀察 `.gitignore` 是否成功排除 `.venv` / `node_modules`。

> 安全提醒：遇到 AI 想執行 `git push --force`、`git reset --hard`、刪除 repo 時，一定要先停下來確認。這也寫在 project rule 裡。

---

## Part 4. 每日工作回報（早安晨之會）

使用 repo：<https://github.com/gemini960114/daily_report_demo_01>（私有 repo，需由老師邀請加入；詳細步驟見該 repo 的 README）。

1. 老師把學生加入 repo（Write 權限），學生接受邀請。
2. 學生用自然語言 clone repo，用 Antigravity 開啟。
3. 每天對 AI 說「今天我要做…」，AI 會：
   - 帶入昨日內容、整理三段報告並預覽；
   - 寫入 `reports/<帳號>/YYYY-MM 工作月報.md`，commit + push；
   - 留言到當日 `YYYY/MM/DD早安晨之會` Issue。

---

## Part 5. 用 Skill 把教材做成投影片（baoyu-slide-deck）

本 repo 已內建以下 Skill（`.agents/skills/` 給 Antigravity、`.claude/skills/` 給 Claude，內容相同），來源為 [jimliu/baoyu-skills](https://github.com/jimliu/baoyu-skills)（MIT 授權）：

| Skill | 角色 | 是否必要 |
|---|---|---|
| `baoyu-slide-deck` | 讀 Markdown → 產生大綱、每頁提示詞、投影片圖片，最後合併成 PPTX / PDF | **必要**（主角） |
| `baoyu-image-gen` | 呼叫圖片生成 API 產生每一頁圖片 | **必要**（執行環境沒有內建產圖工具時，slide-deck 會改用它） |
| `baoyu-url-to-markdown` | 把網頁文章轉成 Markdown，當作投影片素材 | 選用 |

### 5-1. 事前準備

- **不需要另外安裝 Bun**：Skill 內的腳本會自動用 `npx -y bun` 執行（Node.js 已安裝）。
- **產圖需要 API Key**（只做大綱或提示詞則不需要）。以 Google Gemini 為例，設定一次即可：
  ```powershell
  [Environment]::SetEnvironmentVariable("GOOGLE_API_KEY", "<你的金鑰>", "User")
  ```
  設定後重開 Antigravity / 終端機。也支援 `OPENAI_API_KEY`、`OPENROUTER_API_KEY` 等。
- 執行環境若有內建產圖工具，slide-deck 會優先使用內建工具。
- 產出位置：`slide-deck/<主題>/`，內含 `outline.md`、`prompts/`、每頁 PNG、`.pptx`、`.pdf`。

> 課堂建議：先用 `--outline-only` 或 `--prompts-only` 練習（不花 API 費用、速度快），確認大綱滿意後再產圖。

### 5-2. 指令格式

Claude 可直接用斜線指令；Antigravity 用自然語言描述即可（AI 會依 Skill 說明自動套用）。

| 參數 | 說明 |
|---|---|
| `--style <名稱>` | 風格：`blueprint`（預設）、`chalkboard`、`corporate`、`minimal`、`notion`、`scientific`、`sketch-notes`、`pixel-art`… |
| `--audience <對象>` | `beginners`、`intermediate`、`experts`、`executives`、`general` |
| `--lang zh` | 投影片語言 |
| `--slides <頁數>` | 建議 8–25 頁 |
| `--outline-only` / `--prompts-only` | 只產大綱 / 只產大綱與提示詞，不產圖 |
| `--regenerate 3` 或 `2,5,8` | 只重新產生指定頁 |

### 5-3. 範例

**範例 K：把本課程教材做成入門投影片（先只做大綱）**

```text
/baoyu-slide-deck 範例練習_uv_nodejs_github.md --style chalkboard --audience beginners --lang zh --slides 10 --outline-only
```

Antigravity 說法：

```text
用 baoyu-slide-deck 把 範例練習_uv_nodejs_github.md 做成 10 頁、黑板（chalkboard）風格、給初學者的繁體中文投影片，先只產生大綱給我看。
```

**範例 L：四連桿模擬器的技術簡報**

```text
/baoyu-slide-deck examples/fourbar-mujoco/README.md --style scientific --audience intermediate --lang zh --slides 8
```

延伸：「第 3 頁的 Grashof 說明太擠，改成表格版面後只重新產生第 3 頁」（對應 `--regenerate 3`）。

**範例 M：把一個月的晨會紀錄做成主管簡報**

在 `daily_report_demo_01` 專案中（需先把本 repo 的 `.agents/skills` 或 `.claude/skills` 裡的 baoyu-* 三個資料夾複製過去）：

```text
/baoyu-slide-deck "reports/<我的帳號>/2026-10 工作月報.md" --style corporate --audience executives --lang zh --slides 8
```

**範例 N：網路文章 → Markdown → 投影片**

```text
用 baoyu-url-to-markdown 把 https://mujoco.readthedocs.io/en/stable/overview.html 轉成 Markdown 存到 notes/mujoco-overview.md，
再用 baoyu-slide-deck 做成 12 頁 notion 風格的繁體中文投影片，對象是 intermediate。
```

**範例 O：自己寫一篇短文再做成投影片（最推薦的練習）**

```text
幫我寫一篇 800 字的 Markdown 短文「我用 AI 做的第一個遊戲」，內容根據我這個專案的 README 與 git 紀錄，
存成 my-story.md，然後用 baoyu-slide-deck 做成 8 頁 sketch-notes 風格的中文投影片。
```

> 注意：產生的投影片是**圖片**，文字錯字要修改提示詞後重新產生該頁（`--regenerate`），不要用程式在圖片上覆蓋文字（Skill 本身也禁止這麼做）。
