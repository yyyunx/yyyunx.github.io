# GitHub Profile 整理建議

查核日期：2026-11-25。只提出建議，沒有修改其他 repository 的名稱、可見性、Description、Topics 或 License。

## 建議 Pin 的五個公開專案

| 專案                      | 建議原因                                                            | 優先改善                                                                                    |
| ------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| groupctl-ai-collaboration | 可安裝的協作工具，有 Release、MIT、CLI 與測試；能說明流程與證據設計 | 加入 git、cli、python、agent-skills 等 Topics；保持 Release 與安裝文件同步                  |
| laplacian-blur-detector   | 有量測核心、介面與坦白的實驗失敗分析                                | README 的候選版描述應與已發布的 v0.3.0a1 預發行版區分；加入 opencv、image-processing Topics |
| OS-presentation           | 可展示 mutex、epoll、thread pool 與實際 Linux 觀測                  | 保留 Course Project 定位；整理最新測試入口，分開歷史結果與未驗證項目                        |
| iRent-AI-Dashboard        | 能呈現團隊原型中的跨層整合與人工覆核流程                            | 補上可確認的分工；確認程式、模型與素材各自授權；維持未接入功能清單                          |
| web-programming-homeworks | 有可直接瀏覽的課程作品與正式 Demo                                   | 補上 GitHub About 的 Demo URL 與 web-development、coursework Topics                         |

資料結構、機率模擬與 AI 導論保留在課程區，無須全部 Pin。AI 導論的公開副檔名與實際 C++ 語法不完全一致，可在 README 說明編譯器與指令。

## Profile README

可以用一小段自然的中英文介紹：目前就讀資訊工程、已做過哪些類型的實作、正在學習架構與數位硬體。放個人網站連結與三到五個最有代表性的作品入口即可。

避免技能百分比、無來源數字、全部工具 Logo 牆、對能力的資深化包裝，以及把合成 Demo 當成真實使用者紀錄。

## 每個 repository 的共同檢查

- Description 用一句話交代問題與定位，不只列技術。
- README 首段說清楚完成度、如何執行、依賴哪些外部模型或服務。
- Demo URL 只填實際可用且適合公開的入口；本機服務不放成正式線上 Demo。
- License 需先確認自己的權利、團隊同意與第三方素材範圍。沒有標示不等於已有開源授權。
- Topics 選實際使用的技術，避免尚未實作的硬體或模型能力。
- 測試紀錄附環境、日期與範圍；有 workflow 檔案不等於 CI 已通過。

此網站只以自己的文字整理無 License 專案的公開資訊，連回原始來源；沒有複製其照片、模型、課程文件或程式碼作為作品素材。
