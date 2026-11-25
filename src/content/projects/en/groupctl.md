---
lang: 'en'
translationKey: 'groupctl'
visibility: 'public'
category: 'Developer Tools'
tier: 'featured'
status: 'Maintained'
license: 'MIT'
tags: ['Python', 'Git', 'CLI', 'Agent Skills']
title: 'groupctl: Git collaboration for people & AI'
description: 'A CLI and Agent Skills for publishing, reviewing, integrating, and testing work with a traceable Git-based protocol.'
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

## Problem and motivation

When teammates develop with their own AI agents on separate computers, chat history does not automatically become shared project state. A team still needs to know which revision was proposed, what a reviewer inspected, and whether the integrated result was tested.

groupctl puts mechanical Git operations and collaboration records behind a CLI. The agent supplies a judgment; the tool checks preconditions, executes operations, and records evidence. It does not launch multiple AI agents or require AI API keys.

## Protocol and implementation

Members work on personal branches, while a canonical branch represents the shared result. Publishing, reviewing, and integrating are separate events. An accepted review does not automatically merge a change. Public events are append-only; corrections reference earlier events.

Agent Skills provide the same workflow to Codex, Claude, and Gemini. Context, Inbox, and Trace reconstruct progress from Git and recorded events rather than relying on an old conversation.

## Technical decisions

Git provides exact source revisions, branch relationships, and merge ancestry. Checks run in isolated worktrees, with commands represented as argument arrays rather than shell strings.

Validation distinguishes passing checks, failures, partial evidence, and unavailable tests. Zero collected tests and an entirely skipped suite do not silently become a pass. The tool still cannot establish whether an arbitrary check covers the actual requirement.

## Installation and use

The tool requires Git and Python 3.10 or newer. Version v0.3.3 is distributed through GitHub Releases as a wheel and source distribution, with checksums and source provenance. It is not published to PyPI, and the core has no third-party runtime dependencies.

Follow the [v0.3.3 installation and licensing notes](https://github.com/yyyunx/groupctl-ai-collaboration/releases/tag/v0.3.3) and install the release wheel with pipx. Initial read-only checks include:

```text
groupctl --version
groupctl doctor
groupctl context --format markdown
```

An unconfigured target project is an expected diagnostic state for doctor. Preview Agent setup with dry-run before installing instructions; follow the README for initialization and publishing operations.

## Validation and observations

The public repository includes tests for CLI behavior, event contracts, packaging, and recovery, as well as a demo with three independent clones. The demo executes real Git operations and conflicts, but its members, review decisions, and confirmations are explicitly simulated. It is not a real-user case study.

Reproducible operation records and semantic correctness answer different questions. Review, tests, and human confirmation each need evidence with a clearly defined scope.

## Limitations and licensing

Protocol 0.1 identities are attestations, not secure proof of a person's identity. Agent judgment and test adequacy remain outside the tool's guarantees. Worktrees isolate file changes; they do not sandbox untrusted code.

The v0.3.3 code, Agent Skills, and independently written documentation use MIT. Historical course specifications with unconfirmed rights are excluded from distribution and are not covered by that license.
