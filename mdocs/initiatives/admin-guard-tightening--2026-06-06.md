---
id: "admin-guard-tightening"
title: "Admin Guard Path Tightening + Unique #135 Headers"
status: "active"
created: "2026-06-06"
updated: "2026-06-06"
owner: "system"
tags: []
related_wiki: []
---

## Objective
Port the unique value from closed PRs #135 and #141 to dev: (1) tighten the admin guard path check to prevent `/administration` accidental matches, (2) add `X-Permitted-Cross-Domain-Policies: none`, (3) expand `Permissions-Policy` with `usb=(), interest-cohort=(), screen-wake-lock=()`. Plus update the corresponding test expectations.

## Plan


## Progress Log
- [2026-06-06T01:23:17.324Z] Created initiative via mdocs command

## Artifacts
