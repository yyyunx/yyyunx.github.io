---
lang: 'zh-tw'
translationKey: 'irent-ai-dashboard'
visibility: 'public'
category: 'AI & Computer Vision'
tier: 'featured'
status: 'Hackathon Prototype'
license: 'No license specified'
tags: ['React', 'TypeScript', 'Express', 'Python', 'VLM']
title: 'iRent AI：驗車與營運流程原型'
description: '黑客松團隊專案，串接照片品質檢查、車損模型介接、案件管理與 LINE 通知，保留人工覆核。'
repository: 'https://github.com/yyyunx/iRent-AI-Dashboard'
order: 3
reviewed: '2026-11-25'
diagram: 'inspection'
sources:
  [
    {
      'title': 'README.md',
      'url': 'https://github.com/yyyunx/iRent-AI-Dashboard/blob/b10d592d4dcd76a08fe48595dfbc4acd57afee49/README.md',
    },
    {
      'title': 'backend/src/services/InspectionModels.ts',
      'url': 'https://github.com/yyyunx/iRent-AI-Dashboard/blob/b10d592d4dcd76a08fe48595dfbc4acd57afee49/backend/src/services/InspectionModels.ts',
    },
    {
      'title': 'ai_service/qwen_contract.py',
      'url': 'https://github.com/yyyunx/iRent-AI-Dashboard/blob/b10d592d4dcd76a08fe48595dfbc4acd57afee49/ai_service/qwen_contract.py',
    },
    {
      'title': 'SECURITY-CAVEATS.md',
      'url': 'https://github.com/yyyunx/iRent-AI-Dashboard/blob/b10d592d4dcd76a08fe48595dfbc4acd57afee49/SECURITY-CAVEATS.md',
    },
  ]
---

## 背景與問題

租車驗車不只需要找出影像異常，還要讓問題成為有負責人、處理紀錄與結案狀態的案件。這個黑客松團隊原型串接拍照、分析、案件與派工，用來探索 AI 如何輔助營運流程。

以下介紹公開程式庫的系統實作，不將團隊成果或第三方模型全部歸為個人成果。

## 系統架構

React / TypeScript 前端提供取還車流程與營運介面。Express backend 驗證照片、保存 SQLite 資料、管理角色與案件。Python AI service 負責車輛 gate、模型介接與姿態相關分析。

KptNetV1 / DamageNetV1 模型套件與權重不在公開 repository 中。Qwen 使用預訓練模型，公開程式沒有自行訓練或微調 Qwen 的流程。

## 從照片到案件

前端先做模糊預檢，後端重新計算 Laplacian Variance，並呼叫 Python 的 vehicle gate。只有經後端驗證與保存的照片才可進入後續 Submission。

DamageNet 產生候選框，再由啟用的 Qwen VLM 做語意確認。有候選框但 Qwen 關閉、逾時或失敗時，結果保留 unavailable，不把候選框直接當成已確認損傷。分析尚在執行時，後端拒絕提前提交。

一次 Submission 最多建立一個 Incident；已確認的異常彙整到案件，再由營運端派工、留言、回報與人工結案。LINE 通知需要實際設定憑證及目的地，AI 草稿也須由管理員確認後才執行。

## 已完成與尚未接入

| 模組                             | 公開程式的狀態                              |
| -------------------------------- | ------------------------------------------- |
| 模糊檢查、vehicle gate、照片保存 | 已有實作，依賴 AI service 與模型環境        |
| 車損候選與 VLM 確認              | 介接已實作；完整流程需外部模型與啟用 Qwen   |
| 案件、派工與 LINE                | 已有程式；通知需外部服務設定                |
| 旋轉分類                         | 保留 API contract，端點回報 unavailable     |
| 髒污推論                         | 尚未接入；不能以預設 false 解讀為已驗證乾淨 |

## 驗證與實作取捨

公開 repository 有影像驗證、案件生命週期、角色權限、LINE 簽章、車損與延遲等測試。這些測試涵蓋特定應用行為，不能直接當成車損模型準確率或真實營運部署成果。

Unavailable 與「沒有損傷」分開保存，是這個流程的重要邊界。一次操作的重送、狀態版本衝突與人工覆核，也都需要在 backend 明確處理。

## 限制與技術觀察

原型尚未完成 production 驗證。SQLite、本機照片儲存與單 process 限速以單一 backend 為前提；姿態引導使用特定車型 landmarks 與近似相機內參，尚未驗證跨車型準確度。即時引導預覽的 photoId 介接仍有已記錄限制。

這個專案值得記錄的不只是模型呼叫，而是模型失敗後如何維持可理解的狀態，以及如何把 AI 訊號接到仍由人負責的操作流程。
