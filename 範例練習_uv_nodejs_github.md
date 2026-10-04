# 範例練習：uv × Node.js × GitHub（自然語言版）

> 前提：
> - 已完成《Windows AI / Vibe Coding 開發環境安裝指南》的所有安裝。
> - 專案根目錄已放入本 repo 的 `AGENTS.md`（Antigravity）與 `CLAUDE.md`（Claude）課程環境規則，AI 會自動遵守「Python 一律用 uv + .venv」等規範。
> - 以下 `text` 區塊都是**直接貼到 Antigravity Agent 對話框**的自然語言指令。

---

## Part 1. uv：Python 環境

### 1-1. 認識 uv（老師示範，學生跟打）

| 指令 | 用途 |
|---|---|
| `uv python list` | 查看可用 / 已安裝的 Python 版本 |
| `uv python install 3.12` | 安裝 Python 3.12 |
| `uv init hello-uv --python 3.12` | 建立新專案（含 `pyproject.toml`） |
| `uv venv` | 在目前資料夾建立 `.venv` |
| `uv add requests` | 安裝套件並記錄到 `pyproject.toml` |
| `uv remove requests` | 移除套件 |
| `uv run python main.py` | 用專案的 .venv 執行程式 |
| `uv pip list` | 列出 .venv 已安裝的套件 |
| `.venv\Scripts\activate` | 啟用虛擬環境（之後可直接打 `python`） |
| `deactivate` | 離開虛擬環境 |

練習流程：

```powershell
uv init hello-uv --python 3.12
cd hello-uv
uv venv
uv add rich
uv run python -c "from rich import print; print('[bold green]Hello uv![/]')"
uv pip list
```

觀察重點：`pyproject.toml` 多了 `rich`、資料夾多了 `.venv` 與 `uv.lock`。

### 1-2. 用自然語言做專案（擇一或依序）

**範例 A：終端機猜數字遊戲（入門，無套件）**

```text
在目前資料夾建立一個 Python 專案 guess-number，用 uv 建立 .venv。
做一個終端機猜數字遊戲：電腦隨機選 1~100，玩家輸入數字後提示「太大 / 太小」，
猜中顯示猜了幾次，並可選擇再玩一次。用 uv run 執行給我看。
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
用 uv run streamlit run app.py 啟動，並告訴我網址。
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
| `npm create vite@latest my-app -- --template react` | 建立 React 專案 |
| `npx create-next-app@latest my-next` | 建立 Next.js 專案 |
| `npm install` | 依 `package.json` 安裝套件（產生 `node_modules`） |
| `npm install <套件>` | 加裝套件 |
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | 打包正式版 |

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
