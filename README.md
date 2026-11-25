# YunHsi Lee — Personal Portfolio

Astro 個人網站，記錄資訊工程學生的公開專案、技術筆記與學習方向。正式網站：[yyyunx.github.io](https://yyyunx.github.io/)；英文版：[English](https://yyyunx.github.io/en/)。

保留原有 Astro 與 Git history，沿用已確認的姓名、學校、學程及聯絡信箱。沒有可確認的履歷或研究成果時，不提供不存在的 CV，也不建立虛構研究或文章。

## 網站架構

| 路徑                        | 內容                                   |
| --------------------------- | -------------------------------------- |
| /、/en/                     | 個人介紹、四個精選專案、既有筆記       |
| /projects/、/en/projects/   | 精選、其他專案與課程紀錄；依分類篩選   |
| /projects/{translationKey}/ | 專案實作、取捨、來源與限制；英文加 /en |
| /notes/、/en/notes/         | 技術筆記與尚未完成的學習方向           |
| /notes/{translationKey}/    | Markdown / MDX 技術筆記；英文加 /en    |
| /research/、/en/research/   | 已確認的研究興趣                       |
| /about/、/en/about/         | 學習背景、作品相關技術與聯絡方式       |
| /404.html、/en/404/         | 找不到頁面                             |
| /sitemap.xml、/robots.txt   | 公開內容索引與搜尋引擎設定             |

主要結構：

```text
src/
  content.config.ts       # 內容 schema 與明確公開政策
  content/projects/       # zh-tw / en 專案 Markdown
  content/notes/          # 既有中文與 en 筆記
  data/portfolio.ts       # 已確認的個人資訊與學習方向
  lib/                    # 語系、公開內容篩選與 URL
  components/             # 導覽、專案、筆記、架構圖與頁尾
  views/                  # 首頁、索引、文章與 404
  layouts/BaseLayout.astro
  pages/                  # 靜態頁面入口與內容路由
  styles/global.css       # 色彩、字體、間距與 responsive 規則
public/                   # 自有圖示、分享圖片及靜態檔
docs/                     # 維護說明、來源、測試及 Profile 建議
scripts/                  # 公開內容、連結與測試預覽工具
tests/                    # 可重跑的瀏覽器驗收
.local/                   # 本地待補充與私人 draft；Git ignored
```

## 本機開發

需要 Node.js 22.12 以上與 pnpm 11.10.0。依 pnpm-lock.yaml 安裝：

```sh
pnpm install --frozen-lockfile
pnpm astro dev --background
pnpm astro dev status
pnpm astro dev logs
pnpm astro dev stop
```

開發伺服器依 AGENTS.md 以背景模式啟動。預設位址為 localhost:4321；若連接埠已使用，以命令實際輸出的 URL 為準。

## 建置與驗收

```sh
pnpm format
pnpm verify
pnpm check:external
pnpm test:browser
```

pnpm verify 依序進行 type checking、格式檢查、公開內容審查、靜態建置與站內連結檢查。建置結果只在 dist，私人及未授權內容不從這個目錄以外打包。

瀏覽器測試使用正式 dist，本機用已安裝的 Chrome。沒有 Chrome 或在 CI 時，先安裝 Playwright Chromium：

```sh
pnpm exec playwright install chromium
```

CI 會設定 CI 環境變數以使用下載的 Chromium。本機也可用 CI=1 的環境設定執行同一流程。測試與截圖保存在 ignored 的 test-results；不會清除一般瀏覽器使用者資料。正式站可透過 BASE_URL 環境變數重跑驗收。

預覽正式建置：

```sh
pnpm preview --background
pnpm astro preview status
pnpm astro preview logs
pnpm astro preview stop
```

## 新增專案、筆記與翻譯

複製 docs/templates 的範例到對應內容資料夾，更新 metadata 與 Markdown 即可，不需要修改 HTML。專案先加入 docs/public-sources.json 的已查核公開來源；用相同 translationKey 配對中文與英文。

詳細步驟、公式、圖片、MDX 與架構圖用法見 [內容維護指南](docs/CONTENT-GUIDE.md)。所有分類由內容決定，沒有作品的分類不產生空白篩選器。

## 公開與私人內容政策

只有 visibility: public 且 draft: false 的內容產生頁面。缺少 visibility 時預設 draft。

**Git repository 本身也是公開的。** Content Collection 裡的 draft 只適用於已獲准進入公開 Git 的草稿。未取得授權的 private repository 名稱、README、圖片、資料、權重、內部網址與未知個人貢獻，必須留在被 Git ignore 的 .local、private 或 drafts，排除來源提交與 build。

不產生全量 repository 清單、私人 metadata 的 JSON 或搜尋索引。建置前後掃描來源、staged paths、靜態資產、前端 bundle 與 sitemap；推送前仍人工審查 staged diff。數據以版本固定的公開文件為來源，合成實驗與真實測試明確區分。

## 部署

GitHub Pages 使用 GitHub Actions，來源為 main。Workflow 安裝鎖定的依賴，執行檢查、建置、站內與對外連結驗證及瀏覽器驗收，成功後才進入 deploy job。保留 Pages 原有權限設定，不需要 API key 或後端。

這是使用者首頁 repository，Astro site 設為 https://yyyunx.github.io，沒有專案子路徑 base。assets 與導覽使用根路徑，和其他 GitHub Pages 子專案共存。

## 設計與維護原則

系統字型、無外部字型請求、靜態 HTML、少量主題及篩選程式。深淺色與系統偏好、鍵盤焦點、skip link、減少動態效果與無 JavaScript 閱讀都維持可用。公式在建置時產生，KaTeX 資產由本站提供。

實際驗收範圍與限制見 [測試報告](docs/TESTING.md)；專案選擇、公開狀態與版本見 [公開來源紀錄](docs/public-sources.json)；[GitHub Profile 建議](docs/GITHUB-PROFILE.md) 提供五個適合 Pin 的專案，不會自動修改其他 repositories。
