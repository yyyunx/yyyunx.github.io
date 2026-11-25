---
lang: 'en'
translationKey: 'irent-ai-dashboard'
visibility: 'public'
category: 'AI & Computer Vision'
tier: 'featured'
status: 'Hackathon Prototype'
license: 'No license specified'
tags: ['React', 'TypeScript', 'Express', 'Python', 'VLM']
title: 'iRent AI: inspection & operations prototype'
description: 'A team hackathon prototype connecting photo quality checks, damage-model integration, incident management, and LINE notifications with human review.'
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

## Context and problem

Vehicle inspection needs more than an anomaly prediction. A finding must become an incident with an owner, a history, and a resolution state. This team hackathon prototype connects photo submission, analysis, incident handling, and dispatch to explore AI-assisted operations.

This note describes the public system implementation without presenting team work or third-party models as sole personal contributions.

## System architecture

A React / TypeScript frontend supports customer and operations flows. The Express backend validates photos, persists SQLite records, and manages roles and incidents. A Python AI service handles the vehicle gate, model integration, and pose-related analysis.

KptNetV1 and DamageNetV1 packages and weights are not included in the public repository. Qwen is a pretrained model; the public code does not include a Qwen training or fine-tuning pipeline.

## From photos to incidents

The frontend performs an initial blur check. The backend recalculates Laplacian variance and calls the Python vehicle gate. Subsequent submissions use validated, persisted photo records.

DamageNet generates candidates, then an enabled Qwen VLM verifies them. When candidates exist but Qwen is disabled, times out, or fails, analysis remains unavailable rather than converting candidates directly into confirmed damage. The backend rejects submissions while analysis is pending.

A submission creates at most one incident, aggregating its confirmed findings. Operations users assign work, comment, report completion, and close cases manually. LINE delivery requires actual credentials and a destination; AI-generated action drafts require administrator confirmation.

## Implemented and unintegrated modules

| Module                                       | Public implementation status                                                 |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| Blur checks, vehicle gate, photo persistence | Implemented; dependent on AI service and model setup                         |
| Damage candidates and VLM verification       | Integration implemented; full flow requires external models and enabled Qwen |
| Incidents, dispatch, LINE                    | Code implemented; notifications require external configuration               |
| Orientation classification                   | Contract reserved; endpoint reports unavailable                              |
| Dirt inference                               | Not integrated; a default false value is not evidence of cleanliness         |

## Validation and decisions

The repository includes tests for image validation, incident lifecycle, access control, LINE signatures, damage handling, and latency. Those tests establish specific application behaviors, not model accuracy or successful real-world operations.

Keeping unavailable analysis separate from a no-damage result is an important boundary. Retries, state-version conflicts, and human review also need explicit backend behavior.

## Limitations and observations

The prototype has not completed production validation. SQLite, local photo storage, and process-local rate limiting assume one backend instance. Pose guidance uses vehicle-specific landmarks and approximate camera intrinsics, without established cross-vehicle accuracy. The live-preview photoId integration has a documented limitation.

The engineering question extends beyond calling a model: how should a system preserve understandable state when analysis fails, and connect uncertain signals to actions that remain a person's responsibility?
