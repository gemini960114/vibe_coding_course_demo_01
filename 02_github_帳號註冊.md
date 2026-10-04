# GitHub 帳號註冊

本課程用 GitHub 存放程式、上傳作品，以及每日工作回報。請在上課前完成註冊。

> 已經有 GitHub 帳號的同學可以跳過註冊，直接看「[四、註冊完成後](#四註冊完成後)」。

---

## 一、帳號名稱（Username）怎麼取

帳號名稱會出現在很多地方，**註冊前先想好**：

- 你的作品網址：`https://github.com/<帳號>/<專案名稱>`
- 每日回報的月報資料夾：`reports/<帳號>/2026-10 工作月報.md`

建議：

| 建議 | 原因 |
|---|---|
| ✅ 只用**英文小寫、數字、連字號 `-`**，例如 `alice-chen`、`wang2026` | GitHub 只接受英數與 `-`；全小寫最不容易打錯 |
| ✅ 簡短、好記、看得出是你 | 老師與同學會用它邀請你、辨識你 |
| ❌ 不要用中文、空白或底線 `_` | GitHub 不接受 |
| ❌ 不要放生日、學號、身分證字號等個資 | 帳號名稱是公開的 |

> 帳號名稱之後可以改，但改了之後舊網址、作品連結與晨會留言紀錄都會對不上，**盡量一次決定**。

---

## 二、註冊步驟

1. 開啟註冊頁：

   ```powershell
   Start-Process "https://github.com/signup"
   ```

2. 依序輸入：
   - **Email**：請用自己常收信、之後也會繼續使用的信箱。
   - **Password**：至少 15 個字元，或至少 8 個字元且包含數字與小寫字母。
   - **Username**：依第一節的建議填寫，右側出現綠色勾勾表示可以使用。
   - **Email preferences**：是否接收產品資訊，可不勾。
3. 完成真人驗證（拼圖或選圖）。
4. 到信箱收 GitHub 寄來的**驗證碼**，填回註冊頁。
5. 後續的問卷（團隊人數、興趣）可以直接略過；方案選 **Free** 即可。

---

## 三、驗證 Email

如果註冊時沒有完成驗證，或之後更換信箱：

1. 登入 GitHub → 右上角頭像 → **Settings** → **Emails**。
2. 信箱旁若顯示 **Unverified**，按 **Resend verification email**。
3. 到信箱點驗證連結。

> 沒有驗證 Email 的帳號，無法接受老師的邀請，也可能無法建立 repo。

---

## 四、註冊完成後

1. **把帳號名稱告訴老師**，老師會邀請你，讓你可以在每日回報 repo [daily_report_demo_01](https://github.com/nchc-class/daily_report_demo_01) 的晨會 Issue 留言。
2. **接受邀請**：老師會邀請你加入課程的 GitHub Organization **nchc-class**（讀取權限，可在晨會 Issue 留言）。收到 Email 或 GitHub 右上角通知後按 **Join**，或直接開啟 <https://github.com/orgs/nchc-class/invitation>。
3. **開啟兩步驟驗證（2FA）**：GitHub 會要求有提交程式的帳號啟用 2FA，建議一開始就設定。
   - Settings → **Password and authentication** → **Enable two-factor authentication**。
   - 用手機的驗證器 App（Google Authenticator、Microsoft Authenticator 等）掃描 QR Code。
   - **務必下載並保存 Recovery codes**，手機遺失時靠它登入。
4. **在電腦上登入 GitHub CLI**：照 [Antigravity 入門](03_antigravity_入門.md) 第五節，用自然語言請 AI 完成瀏覽器裝置驗證登入，不需要建立 Personal Access Token。

---

## 常見問題

| 問題 | 處理方式 |
|---|---|
| 帳號名稱一直顯示已被使用 | 加上數字或連字號，例如 `alice-chen-tw` |
| 收不到驗證信 | 檢查垃圾郵件匣；學校信箱可能擋信，可改用個人信箱 |
| 看不到老師的邀請 | 先確認 Email 已驗證；直接開啟 `https://github.com/settings/organizations` 查看待接受的邀請 |
| 忘記密碼 | 登入頁按 **Forgot password?**，用註冊信箱重設 |
