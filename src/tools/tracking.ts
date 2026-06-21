import { tool } from "ai";
import { z } from "zod";
import type { TrackedItem } from "@xpoz/xpoz";
import { createLazyClient, type XpozToolOptions } from "../client.js";
import { TrackedItemSchema, AddTrackedItemsResultSchema, RemoveTrackedItemsResultSchema } from "../schemas/index.js";

export const xpozGetTrackedItems = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "List all currently tracked items (keywords, users, subreddits, hashtags) " +
      "across Twitter/X, Instagram, Reddit, and TikTok.",
    inputSchema: z.object({}),
    execute: async () => {
      const client = await getClient();
      return await client.tracking.getTrackedItems();
    },
  });
};

export const xpozAddTrackedItems = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Add items to track across social media platforms. " +
      "Tracked items are continuously monitored for new activity. " +
      "Types: keyword (mentions), user (posts by user), subreddit, hashtag.",
    inputSchema: z.object({
      items: z.array(z.object({
        phrase: z.string().describe("The keyword, username, subreddit name, or hashtag to track"),
        type: z.enum(["keyword", "user", "subreddit", "hashtag"]).describe("Type of item to track"),
        platform: z.enum(["twitter", "instagram", "reddit", "tiktok"]).describe("Platform to track on"),
      })).describe("List of items to start tracking"),
    }),
    outputSchema: AddTrackedItemsResultSchema,
    execute: async ({ items }) => {
      const client = await getClient();
      return await client.tracking.addTrackedItems(items as TrackedItem[]);
    },
  });
};

export const xpozRemoveTrackedItems = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Remove items from tracking. Stops monitoring the specified keywords, users, subreddits, or hashtags.",
    inputSchema: z.object({
      items: z.array(z.object({
        phrase: z.string().describe("The keyword, username, subreddit name, or hashtag to stop tracking"),
        type: z.enum(["keyword", "user", "subreddit", "hashtag"]).describe("Type of tracked item"),
        platform: z.enum(["twitter", "instagram", "reddit", "tiktok"]).describe("Platform the item is tracked on"),
      })).describe("List of items to stop tracking"),
    }),
    outputSchema: RemoveTrackedItemsResultSchema,
    execute: async ({ items }) => {
      const client = await getClient();
      return await client.tracking.removeTrackedItems(items as TrackedItem[]);
    },
  });
};
