# @xpoz/ai-sdk

Social media intelligence tools for the [Vercel AI SDK](https://sdk.vercel.ai). Access Twitter/X, Instagram, Reddit, and TikTok data directly from your AI agents — no social media API keys required.

Powered by [Xpoz](https://xpoz.ai), the social media intelligence platform.

## Installation

```bash
npm install @xpoz/ai-sdk ai zod
```

## Quick Start

Get a free access key at [xpoz.ai/get-token](https://xpoz.ai/get-token), then:

```typescript
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { xpozTwitterSearch, xpozInstagramUser } from "@xpoz/ai-sdk";

const result = await generateText({
  model: anthropic("claude-sonnet-4-6"),
  tools: {
    twitterSearch: xpozTwitterSearch({ apiKey: "your-xpoz-key" }),
    instagramUser: xpozInstagramUser({ apiKey: "your-xpoz-key" }),
  },
  prompt: "What are people saying about AI agents on Twitter this week?",
});
```

Or use `xpozTools()` to get all tools with a shared connection:

```typescript
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { xpozTools } from "@xpoz/ai-sdk";

const result = await generateText({
  model: anthropic("claude-sonnet-4-6"),
  tools: xpozTools({ apiKey: "your-xpoz-key" }),
  prompt:
    "Compare the social media presence of @openai across Twitter, Instagram, and TikTok",
});
```

You can also set the `XPOZ_API_KEY` environment variable instead of passing `apiKey`.

## Available Tools

### Twitter/X

| Tool                         | Description                                    |
| ---------------------------- | ---------------------------------------------- |
| `xpozTwitterSearch`          | Search posts by keywords, hashtags, or phrases |
| `xpozTwitterUser`            | Get a user profile by username or ID           |
| `xpozTwitterUserPosts`       | Get posts by a specific user                   |
| `xpozTwitterPostComments`    | Get replies to a specific tweet                |
| `xpozTwitterSearchUsers`     | Search users by name                           |
| `xpozTwitterUserConnections` | Get a user's followers or following            |
| `xpozTwitterUsersByKeywords` | Find users who posted about specific topics    |
| `xpozTwitterCountPosts`      | Count posts matching a phrase                  |

### Instagram

| Tool                           | Description                                 |
| ------------------------------ | ------------------------------------------- |
| `xpozInstagramSearch`          | Search posts by keywords                    |
| `xpozInstagramUser`            | Get a user profile by username or ID        |
| `xpozInstagramUserPosts`       | Get posts by a specific user                |
| `xpozInstagramPostComments`    | Get comments on a post                      |
| `xpozInstagramSearchUsers`     | Search users by name                        |
| `xpozInstagramUsersByKeywords` | Find users who posted about specific topics |

### Reddit

| Tool                         | Description                                   |
| ---------------------------- | --------------------------------------------- |
| `xpozRedditSearch`           | Search posts by keywords, filter by subreddit |
| `xpozRedditUser`             | Get a user profile                            |
| `xpozRedditPostWithComments` | Get a post with its comment thread            |
| `xpozRedditSearchComments`   | Search comments by keywords                   |
| `xpozRedditSearchSubreddits` | Search subreddits by name or topic            |
| `xpozRedditSubreddit`        | Get subreddit info with recent posts          |
| `xpozRedditUsersByKeywords`  | Find users who posted about specific topics   |

### TikTok

| Tool                        | Description                                    |
| --------------------------- | ---------------------------------------------- |
| `xpozTiktokSearch`          | Search videos by keywords                      |
| `xpozTiktokUser`            | Get a creator profile                          |
| `xpozTiktokUserPosts`       | Get videos by a specific creator               |
| `xpozTiktokPostComments`    | Get comments on a video                        |
| `xpozTiktokSearchUsers`     | Search creators by name                        |
| `xpozTiktokPostsByHashtags` | Search videos by hashtags                      |
| `xpozTiktokUsersByKeywords` | Find creators who posted about specific topics |

### Tracking & Account

| Tool                     | Description                                |
| ------------------------ | ------------------------------------------ |
| `xpozGetTrackedItems`    | List all tracked keywords, users, hashtags |
| `xpozAddTrackedItems`    | Start tracking new items across platforms  |
| `xpozRemoveTrackedItems` | Stop tracking items                        |
| `xpozAccountDetails`     | Get account plan, usage, and billing info  |

## Configuration

All tool factory functions accept these options:

```typescript
interface XpozToolOptions {
  apiKey?: string; // Xpoz access key (or set XPOZ_API_KEY env var)
  serverUrl?: string; // Custom server URL (default: https://mcp.xpoz.ai/mcp)
  timeoutMs?: number; // Request timeout in ms (default: 300000)
}
```

## Use Cases

- **Brand Monitoring** — track what people say about your brand across all platforms
- **Competitive Intelligence** — analyze competitors' social media presence and engagement
- **Influencer Discovery** — find relevant creators and opinion leaders by topic
- **Market Research** — understand public sentiment and trends from social conversations
- **OSINT** — gather open-source intelligence from public social media data

## License

MIT
