---
lang: 'zh-tw'
translationKey: 'os-presentation'
visibility: 'public'
category: 'Systems & Computer Architecture'
tier: 'featured'
status: 'Course Project'
license: 'No license specified'
tags:
  [
    'Linux',
    'C++',
    'Concurrency',
    'Mutex',
    'epoll',
    'Thread Pool',
    'Backpressure',
  ]
title: 'Linux 並行與資源管理實驗'
description: '以 Linux 課程實驗對照 concurrency、mutex、epoll、thread pool 與 backpressure，記錄資源使用及實驗結果。'
repository: 'https://github.com/yyyunx/OS-presentation'
order: 1
reviewed: '2026-11-25'
diagram: 'systems'
sources:
  [
    {
      'title': 'README.md',
      'url': 'https://github.com/yyyunx/OS-presentation/blob/87c564a5b6f9a0708fb45554f20c6e177f4eb4a4/README.md',
    },
    {
      'title': 'TEST_RESULTS.md',
      'url': 'https://github.com/yyyunx/OS-presentation/blob/87c564a5b6f9a0708fb45554f20c6e177f4eb4a4/TEST_RESULTS.md',
    },
    {
      'title': 'docs/DASHBOARD_TEST_RESULTS.md',
      'url': 'https://github.com/yyyunx/OS-presentation/blob/87c564a5b6f9a0708fb45554f20c6e177f4eb4a4/docs/DASHBOARD_TEST_RESULTS.md',
    },
    {
      'title': 'resource-management/request_simulator.h',
      'url': 'https://github.com/yyyunx/OS-presentation/blob/87c564a5b6f9a0708fb45554f20c6e177f4eb4a4/resource-management/request_simulator.h',
    },
  ]
---

## 課程背景

這個 Systems Programming 課程專案用售票情境，把作業系統中的共享狀態、排程、連線與資源管理變成可以觀察的實驗。Dashboard 是輔助說明的介面，核心仍是 Linux 與 C++ 程式的行為。

## Race condition 與 mutex

Race demo 刻意讓多個 thread 先看到同一張剩餘票，再各自扣票。庫存使用 atomic 以避免 C++ data race 的未定義行為，但讀取、判斷、更新仍有邏輯競爭。

Mutex 版本用同一個 critical section 保護檢查與扣票。這個對照說明：單次操作的 atomic，不等於整個業務步驟的 atomic。為教學而安排的等待時序，不是正式服務的建議寫法。

## Thread-per-connection 與 epoll

Blocking server 為每條連線建立 worker；epoll 版本用事件迴圈追蹤 readiness，socket I/O 設成 non-blocking。兩者都需要每條連線的 file descriptor，epoll 不會消除 FD 上限。

實驗應比較相同 client 行為下的 FD 與 thread 數，而不是把 terminal log 的速度當成 throughput。Readiness 也不保證一次讀到完整訊息，因此仍需處理 partial I/O、EAGAIN、斷線與清理。

## Thread pool 與 backpressure

獨立的本機 request simulator 使用固定 workers，對照無佇列上限與有限佇列。有限版本在 queue 滿時短暫等待，仍沒有容量就拒絕新工作，將 timed backpressure 與 load shedding 分開觀察。

這個模擬器不是網路 server 的後續 pipeline，也沒有宣稱真的把 VM 記憶體耗盡。

## Linux 實驗紀錄

原專案記錄使用者於 2026-10-29 在 VMware Ubuntu 重跑 make test。以下為該次紀錄的單次觀測，不是本網站重新測得的結果。

工作負載為本機模擬的 1000 requests、4 workers，每筆工作模擬 10 ms。Protected pending queue 容量為 20，滿時最多等待 1 ms。

| 策略         | Processed | Rejected | 最大 pending queue |
| ------------ | --------: | -------: | -----------------: |
| Uncontrolled |      1000 |        0 |                997 |
| Protected    |       378 |      622 |                 20 |

完成後兩者 pending 都為 0。接受與拒絕數受 OS 排程及 timer 影響，重跑不應期待完全相同。這組數字描述 queue policy，不是 production throughput 或真實使用者容量。

## 驗證與限制

Linux smoke checks 包含協定分段、重複指令、idle connections 的 FD / thread 觀察、斷線清理、SIGINT 與資源統計。公開紀錄也分開標示 Windows portable 驗證、Ubuntu VM 結果與尚未完成的手動情境。

Blocking baseline 的 finished-thread bookkeeping，以及 EMFILE 恢復策略仍有教學範圍的限制。CPU scheduling 是演算法模擬，不是修改 Linux 真實排程政策。

## 技術觀察

並行、非阻塞 I/O 與回壓解決的是不同問題。先固定工作負載與觀測條件，再比較資源使用，才比較容易把畫面上的變化連回 OS 原理。
