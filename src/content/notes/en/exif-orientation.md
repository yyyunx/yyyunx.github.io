---
lang: 'en'
translationKey: 'exif-orientation'
visibility: 'public'
title: 'Why EXIF orientation is not enough'
description: 'Separating metadata normalization from the orientation of image content.'
category: 'Computer Vision'
order: 1
---

## What orientation metadata solves

Camera pixels are not always stored in the same orientation as the displayed image. EXIF Orientation tells a compatible viewer how to rotate or mirror them. Image libraries and upload pipelines differ: some transform pixels, some read only the tag, and some remove metadata during conversion.

## Normalize before inference

A vision model receives pixels, not the appearance in a photo gallery. Read the orientation, apply the required transform, then remove or reset the tag so downstream code has one unambiguous representation.

Validate dimensions, format, and decoding as well. For multiple image sources, a processing record helps explain where an orientation changed.

## Metadata and content are different checks

Even correctly normalized metadata cannot fix a subject that was photographed sideways. A content-orientation classifier addresses a separate question.

A practical pipeline can combine metadata normalization, content checks, and manual review. Screenshots, re-encoded files, and images without EXIF deserve separate test cases.
