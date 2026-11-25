# 網站驗收紀錄

本機驗收日期：2026-11-25（Asia/Taipei）。

## 環境與範圍

- Windows、Node.js 22.23.1、pnpm 11.10.0、Astro 7.2.10、TypeScript 6.0.3。
- Playwright 1.65.1，使用本機 Google Chrome 158.0.8127.37 的 headless 模式。
- 正式 dist 由 Astro programmatic preview 供應於本機 loopback，沒有修改一般 Chrome 使用者資料。
- 另以 Codex 內建實際瀏覽器人工檢查手機與桌面畫面、語言切換、主題選擇、篩選與專案導覽。
- 寬度 375、768、1024、1440px。這是瀏覽器 viewport 模擬，不代表實體手機、Safari 或螢幕閱讀器實機驗收。

## 已執行的檢查

| 檢查          | 範圍                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------- |
| 依賴安裝      | pnpm install --frozen-lockfile；peer dependencies 無問題                                     |
| Type checking | Astro / TypeScript：0 errors、0 warnings、0 hints                                            |
| 格式          | Prettier 與 Astro plugin，完整來源格式檢查                                                   |
| Build         | 36 個靜態 HTML 頁面，34 個可索引網址與兩個 404                                               |
| 站內連結      | 全站路徑、資產、錨點、canonical、每頁單一 H1                                                 |
| 對外連結      | 37 個獨立 GitHub、來源文件、Release 與 Demo URL 的實際 HTTPS GET                             |
| 響應式        | 所有頁面於四種寬度檢查 document overflow、圖片與 JavaScript page errors                      |
| 主題          | 系統偏好、手動選擇、reload 保留與系統偏好即時變更                                            |
| 雙語          | 首頁、索引與專案詳細頁，切換至對應內容                                                       |
| 導覽          | 分類篩選、專案開啟與筆記路由                                                                 |
| 鍵盤與無 JS   | skip link、焦點、按鈕 Enter、reduced-motion；無 JavaScript 仍可閱讀專案                      |
| 無障礙        | axe-core 的 WCAG 2 A / AA、WCAG 2.1 AA 規則，深淺色頁面檢查                                  |
| 公式與內容    | 實際 KaTeX 輸出、表格與架構圖；另以臨時 MDX 範例檢查元件、數學、圖片與表格                   |
| 公開內容隔離  | Synthetic draft 與 ignored 本地 canary 未出現在 HTML、JS、JSON、CSS、SVG、sitemap 或文字資產 |

最終本機 Chrome 執行的 10 項驗收全數通過（58.6 秒），無跳過或 flaky，包含兩個 404 的 axe 覆蓋與 viewport 截圖。深淺色各 36 頁的 axe 規則檢查沒有 violations；684 個站內參照及 37 個對外 URL 通過。原始結果保存在 test-results/browser-report.json 與連結報告，CI 另以 GitHub Actions 對應 commit 為準。

## 結果檔案與截圖

測試輸出保存在 Git ignored 的 test-results：

- browser-report.json：Playwright 實際執行結果。
- accessibility-light.json、accessibility-dark.json：axe violations，成功時為空陣列。
- internal-links.json、external-links.json：檢查時間、URL、HTTP 狀態與錯誤。
- screenshots/：中英文、深淺色、375 與 1440px 的完整首頁截圖、viewport 截圖與專案頁截圖。
- playwright/：失敗時的 trace 與測試暫存。

本地內容隔離與 MDX 測試使用無敏感資料的臨時 fixture，完成後移除並重新產生正式 dist；沒有把測試文章當成公開筆記。

## CI 與部署

deploy.yml 在部署前執行 verify、外部連結與瀏覽器驗收，失敗時不執行 deploy job。使用者原有 GitHub Pages main 分支與 workflow 部署方式保留。

每次發布應對照 Actions 的 head SHA 與正式網站實際內容。成功 build 或存在 workflow 檔案，本身不能作為成功部署證據。

## 驗收限制

axe 是自動化規則檢查，沒有宣稱完整 WCAG 認證；尚未進行螢幕閱讀器或真實觸控硬體的完整測試。沒有執行 Lighthouse，因此不提供任何效能分數。

網站只呈現原專案有來源的實驗結果，沒有重新訓練模型、重新執行其 Linux 實驗、驗證真實營運部署，或推測個人分工。外部 repository 未標示 License 時，不複製其圖片、資料、權重或課程規格。

來源與 build 掃描不能取代人工判斷；發布前需閱讀 staged diff 與允許公開的來源清單。既有 Git history 依要求保留，沒有 force push 或改寫過去的提交。
