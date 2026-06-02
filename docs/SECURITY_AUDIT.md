# Security audit summary

Prepared for the public release package.

## Scope

Audited files included in this package:

- `src/emptyclassroom.js`
- `scripts/build-bookmarklet.mjs`
- repository documentation and metadata

Generated `dist/bookmarklet.txt` is intentionally not included in the release package.

## Findings

No hard-coded personal account, password, Cookie, Token, Bearer token, API key, or secret was found in source code.

The runtime source does not reference:

- `document.cookie`
- `localStorage`
- `sessionStorage`
- `Authorization`
- `Bearer`
- `Set-Cookie`
- `Cookie:`

Network-related behavior is limited to reading the current page's existing `/todayClassrooms` response through `XMLHttpRequest` / `fetch` hooks. The script does not create an outbound upload request.

`src/emptyclassroom.js` displays source information with `safeSource(url)`, which removes query parameters and only keeps origin plus path.

## Notes

Documentation intentionally mentions sensitive words such as Cookie, Token, and `chBKhbg9` to warn users not to disclose them. Those mentions are not secrets.
