# Open-source review notes

This repository is prepared as a clean public release.

## Included

- `src/emptyclassroom.js`: local bookmarklet source.
- `scripts/build-bookmarklet.mjs`: build script for generating a bookmarklet locally.
- `README.md`, `SECURITY.md`, `.gitignore`, `LICENSE`.

## Excluded

- HAR files, screenshots, exported browser logs, Cookie files, `.env` files, and generated bookmarklet output.
- Any real `chBKhbg9` value or complete logged-in official-system URL.
- Any Git history from private experiments.

## Upstream comparison summary

The referenced upstream project is a Go backend plus React/Antd frontend. This repository is a single-file browser bookmarklet. It does not include upstream backend code, frontend components, assets, configuration files, or account-login logic.

Similarities are limited to product idea and generic UI concepts such as campus/building/class-time filters and classroom result tables.
