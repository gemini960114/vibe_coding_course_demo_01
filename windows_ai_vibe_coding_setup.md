# Windows 10+ AI / Vibe Coding 開發環境安裝指南

本教材採用「一個模組一段指令」的方式。  
請依照順序，將每一段 PowerShell 指令複製到 **Windows PowerShell** 執行。

> 建議使用 Windows 10 1809 以上或 Windows 11。
>
> **請以一般使用者身分開啟 PowerShell，不需要「以系統管理員身分執行」。**  
> 執行指令前也請確認目前不在 `C:\Windows\System32`；後續建立專案時，應先切換到自己的專案資料夾。
>
> Git、Node.js 與 GitHub CLI 的安裝程式可能會跳出 Windows 的「使用者帳戶控制（UAC）」確認視窗。這是安裝到整台電腦時的正常現象；確認畫面顯示的是剛才執行的安裝程式後，請按「是」繼續。不需要因此改用系統管理員身分開啟 PowerShell。

---

# 0. 本課程要安裝的工具

## 系統檢查

- Windows 10 1809+
- PowerShell
- WinGet

## 正式安裝

- Git
- uv
- Node.js LTS
- GitHub CLI (`gh`)
- ChatGPT Desktop
- Antigravity IDE
- Notepad++

安裝完成後應可使用：

```powershell
git --version
uv --version
node --version
npm --version
npx --version
gh --version
```

---

# 1. 檢查 Windows 版本

```powershell
$os = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion"
$build = [int]$os.CurrentBuild
$windowsName = if ($build -ge 22000) { "Windows 11" } else { "Windows 10" }
$ver = if ($os.DisplayVersion) { $os.DisplayVersion } else { $os.ReleaseId }
"$windowsName $ver Build $build"
```

建議：

```text
Windows 10 Version 1809 / Build 17763 以上
或
Windows 11
```

請以 **Build 號碼** 為主要判斷依據：

- Windows 10 1809：Build 17763
- Windows 11：Build 22000 以上

> 某些 Windows 11 電腦的系統欄位仍可能顯示 `Windows 10`，因此不要只看產品名稱。

也可使用：

```powershell
winver
```

---

# 2. 檢查 PowerShell

```powershell
$PSVersionTable
```

Windows 10 / 11 內建的 **Windows PowerShell 5.1** 即可使用。

Node.js 會同時安裝 `npm.ps1`、`npx.ps1` 與對應的 `.cmd` 檔。若 PowerShell 的有效執行原則是 `Restricted`，直接執行 `npm` 或 `npx` 時可能因為選到 `.ps1` 檔而被阻擋。

先查看目前設定：

```powershell
Get-ExecutionPolicy -List
```

本教材後續會直接使用 `npm` 與 `npx`，因此建議將目前使用者設為 `RemoteSigned`：

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

出現確認問題時，輸入 `Y` 後按 Enter。這項設定：

- 只影響目前登入的使用者。
- 不需要系統管理員權限。
- 允許本機指令碼執行；從網路下載且帶有網際網路標記的指令碼仍須具有可信任簽章或先解除封鎖。

若學校或公司的群組原則不允許變更，後續可改用 `npm.cmd` 與 `npx.cmd`，例如：

```powershell
npm.cmd --version
npx.cmd --version
```

> 第 5 節的 uv 備援指令會只在該次 PowerShell 子程序使用 `Bypass`，不會永久修改目前使用者的執行原則。

---

# 3. 檢查 WinGet

```powershell
winget --version
```

若有顯示版本號，例如：

```text
v1.x.x
```

即可進入下一步。

## 如果找不到 winget

先嘗試重新註冊 App Installer：

```powershell
Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe
```

關閉 PowerShell，再重新開啟後測試：

```powershell
winget --version
```

如果仍找不到，可開啟 Microsoft 官方安裝入口：

```powershell
Start-Process "https://aka.ms/getwinget"
```

> 較舊的 Windows 10 可能不支援 `Add-AppxPackage -RegisterByFamilyName`。如果出現「找不到符合參數名稱」之類的錯誤，不必繼續排查該指令，直接使用上面的官方安裝入口。

官方說明：

https://learn.microsoft.com/windows/package-manager/winget/

---

# 4. 安裝 Git

```powershell
winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
```

安裝完成後，關閉並重新開啟 PowerShell。

測試：

```powershell
git --version
where.exe git
```

---

# 5. 安裝 uv

`uv` 用來管理 Python、Python 套件與虛擬環境。

優先使用 WinGet 安裝：

```powershell
winget install --id astral-sh.uv -e --source winget --accept-package-agreements --accept-source-agreements
```

安裝完成後，關閉並重新開啟 PowerShell，再測試：

```powershell
uv --version
where.exe uv
```

## 如果 WinGet 無法安裝 uv

可改用 Astral 官方安裝腳本：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "irm https://astral.sh/uv/install.ps1 | iex"
```

此處的 `Bypass` 只套用於這次新開的 PowerShell 子程序；關閉後即失效，不會永久變更使用者設定。

腳本執行完成後，同樣關閉並重新開啟 PowerShell，再測試：

```powershell
uv --version
where.exe uv
```

---

# 6. 安裝 Node.js LTS

Node.js 安裝後會包含：

- `node`
- `npm`
- `npx`

安裝：

```powershell
winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements
```

完成後關閉並重新開啟 PowerShell。

測試：

```powershell
node --version
npm --version
npx --version
```

查看實際使用位置：

```powershell
where.exe node
where.exe npm
where.exe npx
```

---

# 7. 安裝 GitHub CLI

安裝：

```powershell
winget install --id GitHub.cli -e --source winget --accept-package-agreements --accept-source-agreements
```

完成後重新開 PowerShell。

測試：

```powershell
gh --version
where.exe gh
```

需要登入 GitHub 時（使用瀏覽器裝置驗證，不需要 Personal Access Token）：

```powershell
gh auth login --web --git-protocol https
```

畫面會顯示一組一次性代碼，按 Enter 開啟瀏覽器後輸入該代碼並授權即可。完成後用 `gh auth status` 確認。

---

# 8. 安裝 ChatGPT Desktop

為避免誤裝第三方同名套件或在產品轉換期間使用到錯誤的 Microsoft Store ID，本教材使用 OpenAI 官方下載頁：

```powershell
Start-Process "https://chatgpt.com/zh-Hant/download/"
```

下載並完成 Windows 版 ChatGPT Desktop 安裝。

官方下載頁：

https://chatgpt.com/zh-Hant/download/

---

# 9. 安裝 Antigravity IDE

本課程使用 **Antigravity IDE**，其 WinGet ID 是 `Google.AntigravityIDE`：

```powershell
winget install --id Google.AntigravityIDE -e --source winget --accept-package-agreements --accept-source-agreements
```

> WinGet 上還有其他名稱相近的 Antigravity 套件，請照上面的 ID 安裝，不要因為搜尋結果的版本號較大而改裝其他套件。

如果 WinGet 找不到套件，可改開官方下載頁：

```powershell
Start-Process "https://antigravity.google/download"
```

官方下載頁：

https://antigravity.google/download

---

# 10. 安裝 Notepad++

Notepad++ 是輕量的文字編輯器，適合快速查看或修改設定檔、記錄檔等純文字檔。

開啟官方下載頁：

```powershell
Start-Process "https://notepad-plus-plus.org/downloads/"
```

進入最新版本頁面後，下載 Windows x64 的 Installer 並完成安裝。

官方下載頁：

https://notepad-plus-plus.org/downloads/

---

# 11. 最後檢查

完成後：

1. 關閉所有 PowerShell
2. 關閉已開啟的 IDE
3. 重新開啟 PowerShell

執行：

```powershell
git --version
uv --version
node --version
npm --version
npx --version
gh --version
```

---

# 12. 檢查工具實際位置

```powershell
where.exe git
where.exe uv
where.exe node
where.exe npm
where.exe npx
where.exe gh
```

這一步可以確認 Windows 現在實際使用的是哪一份工具。

---

# 13. 如果「剛安裝可以，下次登入卻找不到」

先不要重裝。

查看永久 User PATH：

```powershell
[Environment]::GetEnvironmentVariable(
    "Path",
    [EnvironmentVariableTarget]::User
)
```

## uv 診斷

```powershell
winget list --id astral-sh.uv -e
where.exe uv
```

如果 `winget list` 顯示已安裝，但 `where.exe uv` 找不到，先完全關閉 PowerShell 與 IDE 再開。若是用官方腳本安裝，則可再次執行安裝腳本，並留意它顯示的安裝位置與 PATH 提示。

## Node.js / npm 診斷

```powershell
where.exe node
where.exe npm
where.exe npx
```

如果 `node` 存在，但 `npm` / `npx` 找不到，先完全關閉 PowerShell 與 IDE 再開。

如果錯誤訊息是「因為這個系統上已停用指令碼執行，所以無法載入 `npm.ps1`」，這不是 PATH 問題，而是執行原則阻擋，請回到第 2 節設定 `RemoteSigned`，或改用 `npm.cmd` / `npx.cmd`。

---

# 14. 一次檢查全部環境

```powershell
Write-Host "=== Windows ==="
$os = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion"
$build = [int]$os.CurrentBuild
$windowsName = if ($build -ge 22000) { "Windows 11" } else { "Windows 10" }
$ver = if ($os.DisplayVersion) { $os.DisplayVersion } else { $os.ReleaseId }
"$windowsName $ver Build $build"

Write-Host ""
Write-Host "=== PowerShell ==="
$PSVersionTable.PSVersion

Write-Host ""
Write-Host "=== WinGet ==="
winget --version

Write-Host ""
Write-Host "=== Git ==="
git --version

Write-Host ""
Write-Host "=== uv ==="
uv --version

Write-Host ""
Write-Host "=== Node.js ==="
node --version

Write-Host ""
Write-Host "=== npm ==="
npm --version

Write-Host ""
Write-Host "=== npx ==="
npx --version

Write-Host ""
Write-Host "=== GitHub CLI ==="
gh --version
```

---

# 15. Skills 安裝測試

先切換到要安裝 Skill 的專案資料夾。以下路徑只是範例，請換成自己的實際路徑：

```powershell
Set-Location "C:\Users\你的帳號\Projects\你的專案"
Get-Location
npx --yes skills add vercel-labs/skills --skill find-skills -y
```

- `npx --yes`：略過 npx 第一次下載 `skills` 套件時的確認。
- 最後的 `-y`：略過 Skills CLI 自己的安裝確認。
- 未加 `-g` 時會安裝到專案層級，因此執行前務必確認 `Get-Location` 顯示的是正確專案資料夾。

若想安裝成所有專案共用的使用者層級 Skill，可改用：

```powershell
npx --yes skills add vercel-labs/skills --skill find-skills -g -y
```

Skills 搜尋：

https://skills.sh/

---

# 16. 完成後的環境

```text
Windows 10 1809+ / Windows 11
│
├─ PowerShell
├─ WinGet
├─ Git
├─ uv
│   └─ Python 環境管理
├─ Node.js LTS
│   ├─ node
│   ├─ npm
│   └─ npx
├─ GitHub CLI
│   └─ gh
├─ ChatGPT Desktop
├─ Antigravity IDE
└─ Notepad++
```

可作為後續：

- Vibe Coding
- AI Agent
- Skills
- Python
- Node.js
- Git / GitHub
- MuJoCo
- 科學運算實作

的共同基礎環境。

---

# 17. 最重要的注意事項

如果出現：

```text
'xxx' is not recognized
找不到指定的命令
```

**第一件事不是重新安裝。**

先：

1. 完全關閉 PowerShell
2. 完全關閉 Antigravity IDE
3. 重新開啟 PowerShell
4. 執行：

```powershell
where.exe uv
where.exe npm
```

課堂上若不想重開 PowerShell，可在目前視窗重新載入 Machine PATH 與 User PATH：

```powershell
$env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
    [Environment]::GetEnvironmentVariable("Path", "User")
```

這只會更新目前的 PowerShell 視窗。載入後再執行 `where.exe uv`、`where.exe npm` 等指令確認。

如果安裝檔案存在，但 `where.exe` 找不到，通常是 **PATH 沒有正確載入**，不是套件沒有安裝。

另一種常見錯誤是：

```text
因為這個系統上已停用指令碼執行，所以無法載入 C:\Program Files\nodejs\npm.ps1
```

這不是 PATH 問題，也不需要重裝，請回到 **第 2 節** 設定執行原則，或改用 `npm.cmd` / `npx.cmd`。
