# MannDB

MannDB is a svelte-based web-app and backend for managing a redis database of manuals.

## Features

- Redis database
- Svelte(Kit) frontend
- Markdown support
- Search with RediSearch
- Upload UI
- API
- Dark design
- \[SOON\] User accounts

## Why the name?

In Linux, the mandb package is used to show manual pages for commands.
This project is also a database of manuals, but for other tech-related things (ex. how to create a wifi bridge with openwrt).
Since the project is German, the name is a play on words with the German word for man (Mann) and the mandb package, creating MannDB.

## Developing

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `bun install`), start a development server:

```bash
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of the app:

```bash
bun run build
```

You can preview the production build with `bun run preview`.
