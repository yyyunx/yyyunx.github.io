# 網站驗收紀錄

本機驗收日期：2026-11-25（Asia/Taipei）。

## 2026-11-26 內容與呈現微調驗收

保留原設計、Astro 與依賴版本，新增雙語網頁 Resume，將已確認的學籍、2028 年 6 月預計畢業、六門正式課名、獲獎與評估成績集中管理。首頁姓名、OS 專案排序、參賽與獲獎界線，以及未開始的硬體規劃均有新增驗收。

- Type checking：0 errors、0 warnings、0 hints；Prettier 與 Astro build 通過。
- 38 個 HTML 頁面、754 個站內參照、37 個對外 URL 通過。
- 完整 Chrome suite：11 passed（64.8 秒），沒有 skipped、unexpected 或 flaky。
- 全頁面於 375、768、1024、1440px 檢查；深淺色各 38 頁的 axe 規則檢查無 violations。
- 實際瀏覽器另外開啟首頁、Projects、About、Research Interests 與 Resume，確認中英文導覽與排版。
- 已找到本地 LaTeX workspace 與編譯 PDF，但沒有提交、複製到 public 或提供下載；Resume 只有已核准資料的網頁版。
- source 與 dist 公開內容掃描通過。私人專案沒有新增 case study、連結或技術細節；n8n 僅列已授權的季軍經歷。

以下保留前一輪驗收條件與結果作為歷史紀錄；本次 browser-report.json 與截圖使用最新版本。

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
