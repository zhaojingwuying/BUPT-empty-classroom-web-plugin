# Security Policy

## Sensitive information

Do not report or publish any value that may identify a user session, including:

- Cookie headers or browser cookies
- Tokens or authorization headers
- Complete official-system URLs containing query parameters
- `chBKhbg9` or similar query parameter values
- Screenshots of logged-in pages that include account details

## Design goals

This bookmarklet is intended to run locally in the browser. It should not read cookies, store credentials, or upload user data.

## Reporting

If you find a security problem, report it privately to the repository owner first. Do not open a public issue containing secrets, screenshots of logged-in sessions, or full request/response logs.
