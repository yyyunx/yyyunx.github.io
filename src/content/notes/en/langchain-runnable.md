---
lang: 'en'
translationKey: 'langchain-runnable'
visibility: 'public'
title: 'Understanding LangChain Runnable'
description: 'Thinking about AI application flows as composable, testable steps.'
category: 'AI Systems'
order: 2
---

## Composable steps

Runnable gives prompts, models, data transformations, and parsers a common input/output interface. Steps can be composed or replaced without hiding the complete flow inside one function.

This also creates useful test boundaries: prompt inputs and parser failure handling can be checked independently.

## Sequence and parallel work

A sequence fits dependencies such as retrieval, prompt construction, model invocation, and structured parsing. Parallel composition fits independent work, such as producing multiple analyses of the same input.

Define each boundary's data shape first. Concise composition syntax does not remove ambiguity in the underlying data.

## Reliability needs explicit behavior

Timeouts, retries, error classification, and traces remain application responsibilities. Logging summarized inputs, duration, and output state helps locate failures.

Unpredictable model output needs a schema, a parsing-failure path, and an intentional fallback. Runnable supplies a composition interface; it does not guarantee reliable components.
