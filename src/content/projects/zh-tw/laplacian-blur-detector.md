---
lang: 'zh-tw'
translationKey: 'laplacian-blur-detector'
visibility: 'public'
category: 'AI & Computer Vision'
tier: 'featured'
status: 'Experimental'
license: 'MIT'
tags: ['Python', 'OpenCV', 'NumPy', 'FastAPI']
title: 'Laplacian Blur Detector'
description: '比較 Laplacian 與 Tenengrad 清晰度量測，提供局部熱圖、CLI、API 與合成資料實驗紀錄。'
repository: 'https://github.com/yyyunx/laplacian-blur-detector'
order: 2
reviewed: '2026-11-25'
diagram: 'sharpness'
sources:
  [
    {
      'title': 'README.md',
      'url': 'https://github.com/yyyunx/laplacian-blur-detector/blob/5419d810e31395d5a36d659a8bfec3176e7ffccd/README.md',
    },
    {
      'title': 'docs/EXPERIMENTS.md',
      'url': 'https://github.com/yyyunx/laplacian-blur-detector/blob/5419d810e31395d5a36d659a8bfec3176e7ffccd/docs/EXPERIMENTS.md',
    },
    {
      'title': 'laplacian_blur_detector/sharpness.py',
      'url': 'https://github.com/yyyunx/laplacian-blur-detector/blob/5419d810e31395d5a36d659a8bfec3176e7ffccd/laplacian_blur_detector/sharpness.py',
    },
    {
      'title': 'docs/RELEASE_READINESS.md',
      'url': 'https://github.com/yyyunx/laplacian-blur-detector/blob/5419d810e31395d5a36d659a8bfec3176e7ffccd/docs/RELEASE_READINESS.md',
    },
  ]
---

## 問題與定位

影像上傳流程需要可解釋的品質訊號，但「清晰度分數高」不等於「照片符合任務需求」。這個實驗性工具把量測、視覺化與接受政策分開，讓相同核心能從 Python、CLI 或本機 Web 介面使用。

目前公開的 v0.3.0a1 是預發行版，適合可信任的本機影像，不是正式 production service。

## 量測核心

Laplacian Variance 計算灰階影像二階微分回應的變異數；Tenengrad 使用 Sobel 水平與垂直梯度的平方和，再取平均。兩者都是既有的影像處理方法，本專案將它們整理為可重用的量測介面。

$$
S_L = \operatorname{Var}(\nabla^2 I), \qquad
S_T = \operatorname{mean}(G_x^2 + G_y^2)
$$

分數不是百分比或 confidence，兩種 metric 也不能共用相同閾值。解析度、強度範圍、對比、噪聲與內容都可能改變量測結果。

## 局部熱圖與介面

Local Sharpness 先對整張影像計算微分，再以網格整理局部統計，避免在格子邊界引入額外反射梯度。熱圖顏色只比較同張影像內的相對量測；低紋理區域另外標示，不直接當成模糊。

Python library 與 CLI 共用 NumPy / OpenCV 核心；選用 FastAPI service 提供批次量測、相對熱圖及品質診斷介面。Web demo 需在自己的本機啟動，這個作品集沒有對外開放圖片上傳服務。

## 實驗與結果

以下摘自原專案 2026-11-22 的合成壓力實驗。生成器 seed 為 2026；校正與測試各有四個獨立 capture groups，每組六種變體，因此各有 24 張 384 × 256 灰階影像。24 個變體不是 24 個獨立場景。

環境：Windows AMD64、Python 3.12.14、OpenCV 5.0.0、NumPy 2.5.3，設定 20 個 OpenCV threads。標籤來自生成規則，並非人工對真實照片的判讀。每個 metric 分別只用校正資料選閾值。

| 測試量測          | Laplacian Variance | Tenengrad |
| ----------------- | -----------------: | --------: |
| Balanced accuracy |             0.4375 |    0.5000 |
| Retake recall     |             0.7500 |    1.0000 |
| False reject rate |             0.8750 |    1.0000 |

Tenengrad 在這次實驗把所有測試影像都判為需要重拍，因此 recall 高並不代表接受政策有效。完整條件與逐情境結果見頁尾的 EXPERIMENTS 紀錄。

## 失敗情境與限制

Gaussian blur、motion blur、局部模糊、平坦內容與模糊加噪聲，分別考驗不同假設。噪聲會拉高邊緣回應；低紋理不代表模糊；小型合成校正集也可能錯誤拒絕清晰的測試影像。

這些結果說明了校正與獨立測試的重要性，不足以宣稱真實照片準確率、模型訓練成果或全面優於另一個 metric。容器相依套件仍有未解決事項，不建議以未驗證的方式公開匿名 HTTP 服務。

## 技術觀察

量測函式可以共用，但決策必須依使用情境校正。局部視覺化有助於解釋分數，卻不能取代具代表性的人工標註資料與獨立測試集。

[預發行版與安裝檔](https://github.com/yyyunx/laplacian-blur-detector/releases/tag/v0.3.0a1) 提供實際發布狀態；程式與文件中的歷史候選版本敘述應連同 Release 閱讀。
