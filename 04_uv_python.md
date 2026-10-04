# 04 uv 與 Python

> 前提：已完成 [01 安裝](01_windows_環境安裝.md)、[02 GitHub 帳號註冊](02_github_帳號註冊.md)、[03 Antigravity 入門](03_antigravity_入門.md)，且專案根目錄已放入本 repo 的 `AGENTS.md`（Antigravity）或 `CLAUDE.md`（Claude）。
> 以下 `text` 區塊都是**直接貼到 Agent 對話框**的自然語言指令。

---

## 1. 認識 uv（老師示範，學生跟打）

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

## 2. 用自然語言做專案（擇一或依序）

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

下一步：[05 React 與 Next.js](05_nodejs_react_nextjs.md)
