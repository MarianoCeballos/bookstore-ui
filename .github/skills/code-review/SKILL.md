---
name: code-review
description: Review changes in the Bookstore UI for correctness, regressions, and maintainability. Use when reviewing a pull request, diff, or proposed code change.
---

# Code Review

Review the proposed changes for concrete defects, not personal style preferences. Do not modify the code while reviewing.

## Review process

1. Read the complete diff and identify the behavior each change is intended to affect.
2. Inspect the relevant surrounding code, callers, and tests to verify assumptions and trace user-visible behavior.
3. Check for correctness issues, regressions, unsafe handling of user or API data, and missing error or loading states.
4. Consider whether tests cover changed behavior and important edge cases. Run focused checks when useful and feasible.
5. Report only actionable findings introduced by the change. Do not report speculative concerns or issues that already existed.

## Project context

- This is a React and TypeScript application built with Vite.
- Domain features live under `src/modules`; shared UI lives under `src/components`. Routes, providers, interfaces, translations, and utilities have dedicated folders.
- The Bookstore API owns user accounts and sessions. Catalog browsing and book details work without signing in; account, cart, favorites, checkout, and administration use the username/password account flow.
- API path types are generated from the OpenAPI specification; avoid hand-editing generated output.
- Available checks include `yarn typecheck`, `yarn lint`, `yarn test`, and `yarn build`. Prefer focused checks relevant to the change.

## Findings

For each finding, include:

- Severity: **Critical**, **High**, **Medium**, or **Low**.
- A precise file and line range in the diff.
- The concrete scenario that triggers the problem and its user or system impact.
- A concise suggested fix, when it is clear.

Order findings from highest to lowest severity. If there are no actionable findings, say so explicitly and mention any important validation that could not be performed.
