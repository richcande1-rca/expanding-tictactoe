# Expanding Tic-Tac-Toe

This repo contains:
- `index.html` — the playable game UI.
- `worker.js` / `schema.sql` / `wrangler.toml` — Cloudflare Worker + D1 backend for the online board wall.

## Why Codex/GitHub says **Update branch** when `main` is the default branch

`main` is the default/base branch, but your PR is created from a separate **head branch**.

When GitHub shows **Update branch**, it means:
- your PR head branch is behind `main`, or
- `main` got new commits after your PR branch was created.

So GitHub asks to merge `main` into the PR branch before final merge.

In short:
- `main` = destination branch
- PR branch = your working changes
- **Update branch** = sync PR branch with latest `main`

## Simple safe merge flow

1. In Codex UI, click **Update branch**.
2. Wait for it to complete.
3. Click **View PR**.
4. On GitHub, confirm no conflicts and merge.
5. Locally: `git checkout main && git pull`.

## If conflict appears in `index.html`

Keep the API base line with fallback:

```js
const API_BASE=(window.ETT_API_BASE||localStorage.getItem("ettApiBase")||"").replace(/\/$/,"");
```

Remove:
- conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
- duplicate full document tails (anything after the first final `</html>`)
