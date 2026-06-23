# @xpoz/ai-sdk

Vercel AI SDK integration for Xpoz social media intelligence. Wraps `@xpoz/xpoz` (the TypeScript SDK) as AI SDK tools with typed inputs, outputs, and field selection.

## Build & Test

```bash
npm run build          # tsup → dist/index.js + dist/index.d.ts (ESM only)
npm test               # build + node --test test/*.test.mjs (live API, needs XPOZ_API_KEY)
```

Tests hit the live Xpoz API. Each test file shares a single MCP client via `createLazyClient({})` and closes it in `after()`.

## Architecture

```
src/
├── client.ts           # createLazyClient — lazy singleton MCP connection
├── index.ts            # re-exports tools, types, xpozTools() bundle
├── schemas/            # Zod output schemas per platform (used as outputSchema)
│   ├── twitter.ts      # TwitterPostSchema, TwitterUserSchema
│   ├── instagram.ts    # InstagramPostSchema, InstagramUserSchema, InstagramCommentSchema
│   ├── reddit.ts       # RedditPostSchema, RedditUserSchema, RedditCommentSchema, RedditSubredditSchema
│   ├── tiktok.ts       # TiktokPostSchema, TiktokUserSchema, TiktokCommentSchema
│   ├── common.ts       # TrackedItemSchema, AccountDetailsSchema, PaginationInfoSchema
│   └── index.ts
└── tools/              # AI SDK tool() definitions per platform
    ├── twitter.ts      # 8 tools (search, user, userPosts, postComments, searchUsers, userConnections, usersByKeywords, countPosts)
    ├── instagram.ts    # 6 tools
    ├── reddit.ts       # 7 tools
    ├── tiktok.ts       # 7 tools
    ├── tracking.ts     # 3 tools (getTrackedItems, addTrackedItems, removeTrackedItems)
    └── account.ts      # 1 tool (accountDetails)
```

## Key Patterns

- **Tool factory functions**: each export (e.g. `xpozTwitterSearch`) is a factory `(options?) => Tool` — call it to get an AI SDK tool instance
- **`xpozTools(options)`**: convenience function returning all 32 tools with a shared MCP connection
- **`createLazyClient(options)`**: returns `() => Promise<XpozClient>` — defers connection until first tool call, reuses it after
- **`_getClient`**: internal option to share a client across tools (used by `xpozTools()` and tests)
- **`outputSchema`**: every social media tool defines a Zod output schema for typed results. All entity fields are `.nullish()` because the `fields` parameter controls which fields are returned
- **`.passthrough()`**: all schemas use passthrough so extra fields from the API don't cause validation errors
- **Field descriptions**: each tool's `fields` parameter lists all valid field names in its `.describe()` string

## Type Exports

Response types are re-exported from `@xpoz/xpoz`: `TwitterUser`, `TwitterPost`, `InstagramUser`, `InstagramPost`, `RedditUser`, `RedditPost`, `TiktokUser`, `TiktokPost`, etc.

## Field Names Per Platform

Field names differ across platforms. Key differences:

| Field | Twitter | Instagram | TikTok | Reddit |
|-------|---------|-----------|--------|--------|
| Followers | `followersCount` | `followerCount` | `followerCount` | N/A (uses `commentKarma`, `linkKarma`) |
| Bio | `description` | `biography` | `signature` | `profileDescription` |
| Display name | `name` | `fullName` | `nickname` | `profileTitle` |

Refer to `xpoz-ts-sdk/src/types/` for the authoritative field definitions per entity type.

## SDK ↔ MCP Sync

When `xpoz-mcp` or `xpoz-ts-sdk` adds/changes fields:

1. Update the Zod schema in `src/schemas/<platform>.ts`
2. Update the field list string in `src/tools/<platform>.ts`
3. Run tests to verify

## Publishing

Published as `@xpoz/ai-sdk` on npm. The release workflow (`.github/workflows/release.yml`) uses npm Trusted Publishing. Manual publish requires a granular access token with 2FA bypass.

## Conventions

- No comments in code
- ES modules with `.js` extension on relative imports
- Constants (field list strings) defined at the top of each tool file
- All TypeScript functions must have explicit return types (inherited from monorepo conventions, but tool factories rely on AI SDK inference)
