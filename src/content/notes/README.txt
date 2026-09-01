如何新增一篇筆記

1. 複製 _template.md。
2. 將檔名改成網址想使用的英文名稱，例如 my-new-note.md。
3. 修改最上方 --- 之間的標題、摘要、分類等資料。
4. 將 draft 改成 false。
5. 在第二個 --- 下方直接使用 Markdown 撰寫文章。
6. 執行 pnpm build 檢查，然後 commit + push；網站會自動部署。

檔名會成為網址：
my-new-note.md -> /notes/my-new-note/

visual 可使用：exif、runnable、terrain
order 數字越小，文章排列越前面。
