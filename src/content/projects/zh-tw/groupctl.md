---
lang: 'zh-tw'
translationKey: 'groupctl'
visibility: 'public'
category: 'Developer Tools'
tier: 'featured'
status: 'Maintained'
license: 'MIT'
tags: ['Python', 'Git', 'CLI', 'Agent Skills']
title: 'groupctl：人與 AI 的 Git 協作'
description: '透過 CLI、不可變事件與 Agent Skills，讓發布、審查、整合和測試有清楚的 Git 紀錄。'
repository: 'https://github.com/yyyunx/groupctl-ai-collaboration'
order: 1
reviewed: '2026-11-25'
diagram: 'groupctl'
sources:
  [
    {
      'title': 'README.md',
      'url': 'https://github.com/yyyunx/groupctl-ai-collaboration/blob/e927a211a58626817aaa29b75471d21d602649e2/README.md',
    },
    {
      'title': 'docs/PROTOCOL_OVERVIEW.md',
      'url': 'https://github.com/yyyunx/groupctl-ai-collaboration/blob/e927a211a58626817aaa29b75471d21d602649e2/docs/PROTOCOL_OVERVIEW.md',
    },
    {
      'title': 'docs/LICENSING_REVIEW.md',
      'url': 'https://github.com/yyyunx/groupctl-ai-collaboration/blob/e927a211a58626817aaa29b75471d21d602649e2/docs/LICENSING_REVIEW.md',
    },
    {
      'title': 'groupctl/validation.py',
      'url': 'https://github.com/yyyunx/groupctl-ai-collaboration/blob/e927a211a58626817aaa29b75471d21d602649e2/groupctl/validation.py',
    },
  ]
---

## 問題與動機

每位組員在自己的電腦上與 AI 一起開發時，聊天紀錄不會自動成為共同的專案狀態。誰發布了哪一份修改、審查的是哪個 commit、整合後有沒有實際測試，都需要能跨電腦追蹤。

groupctl 把機械性的 Git 操作與協作紀錄放進 CLI，讓 AI 提供判斷，再由工具檢查前置條件、執行操作並保存證據。它不會自行啟動多個 AI，也不需要 AI API key。

## 協定與實作

成員各自在個人分支工作，canonical branch 才代表小組共同狀態。發布提案、審查與整合是不同事件；REV 通過不會自動把程式合併。公開事件以新增方式保存，更正時用新事件關聯舊事件。

Agent Skills 把同一套操作規則帶入 Codex、Claude 或 Gemini。Context、Inbox 與 Trace 從 Git 和事件重建進度，避免把舊對話當成目前的真實狀態。

## 技術選擇

Git 讓來源 commit、分支與合併關係可以精確追溯。測試則在隔離的 worktree 執行；檢查命令使用 argv 陣列而不經 shell。

驗證結果區分通過、失敗、證據不完整與沒有可用測試。零個測試或全部 skipped 都不能直接算成成功。不過，工具仍無法保證任意測試真的涵蓋需求。

## 安裝與使用

需要 Git 與 Python 3.10 以上。公開版本 v0.3.3 以 GitHub Release 提供 wheel、sdist、SHA256SUMS 與來源紀錄，沒有發布至 PyPI。核心沒有第三方 runtime dependency。

建議先閱讀 [v0.3.3 安裝與授權說明](https://github.com/yyyunx/groupctl-ai-collaboration/releases/tag/v0.3.3)，使用 pipx 安裝該 Release 的 wheel。安裝後可以先執行以下只讀檢查：

```text
groupctl --version
groupctl doctor
groupctl context --format markdown
```

在新的目標專案中，doctor 尚未找到小組設定是預期的診斷狀態。Agent 設定可先用 agent-setup 的 dry-run 預覽；實際初始化、發布與整合請依 README 操作。

## 驗證與觀察

公開程式庫包含 CLI、事件契約、封裝與恢復流程的測試，以及建立三個獨立 clone 的流程 Demo。Demo 確實執行 Git 操作與衝突，但其中的成員、審查決定與確認都是 simulation，不代表真實使用者案例。

這個設計凸顯一件事：能重現操作紀錄，不等於能證明語意正確。審查、測試與人類確認需要各自留下範圍清楚的證據。

## 限制與授權

Protocol 0.1 的成員身分是 attestation，沒有驗證自然人的安全認證。AI 的判斷品質與測試充分性也不在工具保證範圍內。Worktree 隔離檔案修改，並不是執行不可信程式的安全沙箱。

v0.3.3 的程式、Agent Skills 與自行撰寫文件採 MIT。權利未確認的歷史課程規格不在正式散布範圍，不能把 MIT 延伸到那些材料。
