# 06 Git / GitHub：用自然語言版本控制

> 前提：已完成 [01 安裝](01_windows_環境安裝.md)、[02 GitHub 帳號註冊](02_github_帳號註冊.md)、[03 Antigravity 入門](03_antigravity_入門.md)，且專案根目錄已放入本 repo 的 `AGENTS.md`（Antigravity）或 `CLAUDE.md`（Claude）。
> 以下 `text` 區塊都是**直接貼到 Agent 對話框**的自然語言指令。

---

> 不教 git 指令本身，讓學生觀察 AI 執行了什麼。

## 1. 第一次登入 GitHub

```text
幫我用瀏覽器裝置驗證方式登入 GitHub CLI（gh auth login --web），
不要用 personal access token。請在背景執行登入流程，
把跳出來的一次性代碼和驗證網址直接貼給我，我會自己去瀏覽器輸入代碼；
我跟你說完成之後，你再用 gh auth status 確認登入成功。
```

## 2. 常用自然語言指令

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

## 3. 建議練習流程

1. 拿 04（uv）或 05（React / Next.js）做好的專案。
2. 「初始化 git + 第一次 commit」。
3. 「建立 GitHub repo 並 push」→ 到瀏覽器確認 repo 出現。
4. 叫 AI 加一個小功能 → 「commit 並 push」→ 在 GitHub 上看 commit 紀錄。
5. 觀察 `.gitignore` 是否成功排除 `.venv` / `node_modules`。

> 安全提醒：遇到 AI 想執行 `git push --force`、`git reset --hard`、刪除 repo 時，一定要先停下來確認。這也寫在 project rule 裡。

---

下一步：[07 每日工作回報](07_每日回報.md)
