---
lang: 'en'
translationKey: 'laplacian-blur-detector'
visibility: 'public'
category: 'AI & Computer Vision'
tier: 'featured'
status: 'Experimental'
license: 'MIT'
tags: ['Python', 'OpenCV', 'NumPy', 'FastAPI']
title: 'Laplacian Blur Detector'
description: 'An experimental image-sharpness toolkit with Laplacian and Tenengrad metrics, local heatmaps, a CLI, and an optional HTTP interface.'
repository: 'https://github.com/yyyunx/laplacian-blur-detector'
order: 3
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

## Problem and scope

Image upload workflows need understandable quality signals, but a high sharpness score does not establish that a photo is useful for a task. This experimental toolkit separates measurement, visualization, and acceptance policy, sharing a core across Python, CLI, and a local web interface.

The public v0.3.0a1 is a prerelease for trusted local images, not a production service.

## Measurement core

Laplacian variance measures the variance of a grayscale second-derivative response. Tenengrad averages the sum of squared horizontal and vertical Sobel gradients. Both are established image-processing techniques; this project packages them into reusable interfaces.

$$
S_L = \operatorname{Var}(\nabla^2 I), \qquad
S_T = \operatorname{mean}(G_x^2 + G_y^2)
$$

Scores are neither percentages nor confidence values. The two metrics require independent thresholds. Resolution, intensity scale, contrast, noise, and image content affect their outputs.

## Local heatmaps and interfaces

Local sharpness analysis computes derivatives over the entire image before collecting grid statistics, avoiding artificial reflection gradients at cell boundaries. Colors indicate relative measurements within one image. Low-texture cells are marked separately rather than automatically classified as blurry.

The Python library and CLI share a NumPy / OpenCV core. An optional FastAPI service provides batch measurements, relative heatmaps, and quality diagnostics. The web demo runs locally; this portfolio does not host an image-upload endpoint.

## Experiment and results

The following results come from the repository's recorded synthetic stress experiment on 2026-11-22. Generator seed 2026 produced four independent capture groups per split, each with six variants: 24 calibration and 24 held-out 384 × 256 grayscale images. The 24 variants are not 24 independent scenes.

Environment: Windows AMD64, Python 3.12.14, OpenCV 5.0.0, NumPy 2.5.3, with 20 configured OpenCV threads. Labels are generation rules, not human judgments of real photographs. Each metric selected its threshold independently using calibration data only.

| Held-out measurement | Laplacian variance | Tenengrad |
| -------------------- | -----------------: | --------: |
| Balanced accuracy    |             0.4375 |    0.5000 |
| Retake recall        |             0.7500 |    1.0000 |
| False reject rate    |             0.8750 |    1.0000 |

Tenengrad predicted retake for every test image in this run. Its recall therefore does not establish a useful acceptance policy. See the linked experiment record for the complete conditions and case-level outcomes.

## Failure cases and limitations

Gaussian blur, motion blur, partial blur, flat content, and blur with noise challenge different assumptions. Noise can increase edge responses; low texture does not establish blur; calibration on a small synthetic set may reject crisp test captures.

These observations support careful calibration and independent evaluation. They do not establish real-photo accuracy, trained-model performance, or a universal winner. Unresolved container dependency advisories also remain; unvalidated public anonymous HTTP hosting is not recommended.

## Technical observations

A measurement implementation can be shared, while its decision policy still needs domain-specific calibration. Visualization helps explain a score but cannot replace representative human-labeled data and an independent test set.

The [prerelease and installation assets](https://github.com/yyyunx/laplacian-blur-detector/releases/tag/v0.3.0a1) establish the published status. Historical candidate wording in repository documents should be read alongside that release.
