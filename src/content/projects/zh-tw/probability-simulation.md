---
lang: 'zh-tw'
translationKey: 'probability-simulation'
visibility: 'public'
category: 'Coursework'
tier: 'coursework'
status: 'Course Project'
license: 'No license specified'
tags: ['Python', 'NumPy', 'Monte Carlo']
title: '機率模擬與理論對照'
description: '以 NumPy 實作 Monte Carlo 模擬，比較等待時間、次序統計與機率分布的理論結果。'
repository: 'https://github.com/yyyunx/Probability-Simulation'
order: 7
reviewed: '2026-11-25'
sources:
  [
    {
      'title': 'README.md',
      'url': 'https://github.com/yyyunx/Probability-Simulation/blob/551aa39ecda6b8acd15b6aa50f19484e10109ea0/README.md',
    },
    {
      'title': 'Q1/q1.py',
      'url': 'https://github.com/yyyunx/Probability-Simulation/blob/551aa39ecda6b8acd15b6aa50f19484e10109ea0/Q1/q1.py',
    },
  ]
---

## 課程紀錄

以 Python / NumPy 模擬等待時間、次序統計、共變異數、Poisson splitting 與 multinomial distributions，將模擬結果與理論值並列。

## 實作與限制

題目各自保存在獨立資料夾。公開程式可檢查隨機種子、樣本生成與統計方式；這裡不將 README 的實驗設定直接當成已重新執行的測試成果。

Monte Carlo 的近似結果受樣本量與亂數影響，接近理論值不是數學證明，也不代表適用於未測試的分布。
