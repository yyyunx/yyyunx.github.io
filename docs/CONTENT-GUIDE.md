# 新增與更新內容

網站以 Astro Content Collections 管理專案與筆記。內容 schema 在 src/content.config.ts；路由與列表共用公開篩選條件，只有 visibility 為 public 且 draft 不為 true 的資料會產生頁面。

## 新增專案

1. 先檢查 repository 的公開狀態、README、代表性程式、測試、Release 與素材授權。
2. 在 docs/public-sources.json 增加該公開 repository 的來源與查核版本。這是建置時的公開來源允許清單。
3. 複製 docs/templates/project.md 到 src/content/projects/zh-tw/your-project.md。
4. 填寫中繼資料與實際內容。tier 可用 featured、other、coursework；首頁最多顯示前四個 featured。
5. 補上 src/content/projects/en/your-project.md，使用相同 translationKey、lang 設為 en。
6. 執行 pnpm format、pnpm verify 與瀏覽器驗收，檢查 git diff 後再提交。

狀態應符合實際進度。Experimental、Hackathon Prototype、Course Project 與 Maintained 具有不同意義，不應統一寫成已可正式營運。公開 README 沒有 License 時，標為 No license specified；不要自動替第三方或團隊資料授權。

Case study 可整理背景、實作、技術選擇、驗證與限制。個人責任與學習反思由作者依實際經驗補充，不從 repository owner 推測作者做了全部工作。數據必須附來源、日期、環境、資料量、分割方式與限制。

## 新增筆記

複製 docs/templates/note.md 到 src/content/notes/your-note.md。檔名不決定公開網址，translationKey 才是穩定路由名稱。不要在內容搬移時任意修改既有 translationKey。

筆記不必有日期。不知道實際發表時間就省略 pubDate，不以修改網站的日期冒充文章日期。首頁優先顯示有日期的最近筆記，再依 order 顯示未標日期的筆記。

Markdown 原生支援段落、表格、圖片與程式碼。程式碼區塊指定語言後使用 Shiki 著色；行內數學用單個美元符號、區塊數學用兩個美元符號，交由 remark-math 與 KaTeX 在建置時處理。

## MDX、圖片與架構圖

可把副檔名改成 .mdx，使用 Astro MDX 引入元件。現有 ArchitectureDiagram.astro 用來描述已查核的四種專案流程；新增流程時，請依實際原始碼更新，不將未實作模組畫成已串接。

自有的 SVG / PNG 架構圖也可放在 public/images，使用 Markdown 圖片語法，補上有意義的替代文字。大型圖片請壓縮並設定尺寸；MDX 可用 Astro Image 處理本地素材，或明確設定 img 的 width、height 與 loading。

沒有導入 Mermaid 的瀏覽器執行環境。文字流程圖可用 text code fence；需要圖像時使用自己的 SVG 或 MDX 元件，以避免額外的 client-side bundle。

## 翻譯流程

每筆內容用 lang 與 translationKey 配對。兩種語言應保留相同數據、限制、狀態與來源，但用自然語句表達。英文既有地圖筆記目前是精簡整理版。

若尚無對應語言，語言按鈕回到該語言的內容索引；不要以隱藏的另一語言 metadata 或自動生成的內容補空白。

## 公開與本地內容的界線

visibility: draft 只適合「已允許放進公開 Git repository，但尚不想產生頁面」的草稿。

私人、公司、研究或尚未確認授權的內容必須放在 .local、private 或 drafts 這些被 Git ignore 的根目錄；它們不屬於 Content Collection。不要只標 draft 後就把未授權資料 commit。不要從 src 引入本地私人內容，也不要移進 public、搜尋索引或前端 JSON。

目前沒有搜尋索引或全量 repository metadata 的 API。公開來源檔只含已展示的公開專案，未知個人分工與排除原因留在本地待補充檔。

## 驗證與發布

- pnpm check：Astro / TypeScript 檢查。
- pnpm format:check：格式檢查。
- pnpm build：來源公開審查、Astro build、dist 公開審查。
- pnpm check:links：所有 HTML 的站內路徑、資產、錨點與單一 H1。
- pnpm check:external：對外 URL 的實際 HTTPS 回應。
- pnpm test:browser：正式 dist 的 Chromium 響應式、主題、雙語、鍵盤、數學與 axe 檢查。

本機用已安裝的 Chrome；CI 安裝 Playwright Chromium。BASE_URL 可切換到正式網站重跑同一套驗收。

例行提交前仍需人工閱讀 git diff 與 git diff --cached。自動掃描只識別已知格式與本機指定詞，不能證明所有敏感文字都不存在。新增 repository 或素材時需重新查核其公開狀態。
