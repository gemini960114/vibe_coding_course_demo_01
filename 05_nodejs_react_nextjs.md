# 05 Node.js：React 與 Next.js

> 前提：已完成 [01 安裝](01_windows_環境安裝.md)、[02 GitHub 帳號註冊](02_github_帳號註冊.md)、[03 Antigravity 入門](03_antigravity_入門.md)，且專案根目錄已放入本 repo 的 `AGENTS.md`（Antigravity）或 `CLAUDE.md`（Claude）。
> 以下 `text` 區塊都是**直接貼到 Agent 對話框**的自然語言指令。

---

## 建議安排

| 項目 | 定位 | 建議 |
|---|---|---|
| React（Vite） | 純前端：畫面、互動、狀態 | **主要練習**，概念單純、啟動快 |
| Next.js | 前端 + 後端 API 在同一個專案 | **一個示範即可**，讓學生看到「前後端」差異 |

兩者都做不會太多，但建議 React 讓學生動手、Next.js 以老師示範為主，學有餘力再跟做。

## 1. 認識 npm / npx（老師示範）

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

## 2. React 範例（擇一）

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

## 3. Next.js 範例（前端 + 後端 API）

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

## 4. 進階範例：React + MuJoCo 四連桿運動學模擬器

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

下一步：[06 Git / GitHub](06_git_github.md)
