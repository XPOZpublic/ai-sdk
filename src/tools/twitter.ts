import { tool } from "ai";
import { z } from "zod";
import { createLazyClient, type XpozToolOptions } from "../client.js";
import { TwitterPostSchema, TwitterUserSchema } from "../schemas/index.js";

const TWITTER_POST_FIELDS = "Available fields: id, text, authorId, authorUsername, conversationId, lang, source, deleted, suspended, possiblySensitive, isRetweet, status, likeCount, retweetCount, replyCount, quoteCount, impressionCount, bookmarkCount, quotedTweetId, retweetedTweetId, replyToTweetId, replyToUserId, replyToUsername, hashtags, mentions, mediaUrls, urls, country, region, city, createdAt, createdAtDate";

const TWITTER_USER_FIELDS = "Available fields: id, username, name, description, location, verified, verifiedType, protected, status, followersCount, followingCount, tweetCount, listedCount, likesCount, mediaCount, profileImageUrl, profileBannerUrl, pinnedTweetId, isVerified, accountBasedIn, locationAccurate, label, labelType, createdAt, modifiedAt";

export const xpozTwitterSearch = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Search Twitter/X posts by keywords, hashtags, or phrases. " +
      "Returns tweets with engagement metrics, author info, and timestamps. " +
      "Supports boolean operators (AND, OR, NOT) and quoted phrases.",
    inputSchema: z.object({
      query: z.string().describe("Search query — supports AND, OR, NOT operators and quoted phrases"),
      maxResults: z.number().optional().describe("Maximum number of results to return"),
      startDate: z.string().optional().describe("Filter posts after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Filter posts before this date (YYYY-MM-DD)"),
      language: z.string().optional().describe("Two-letter language code to filter by (e.g. 'en', 'es')"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TWITTER_POST_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(TwitterPostSchema), totalResults: z.number() }),
    execute: async ({ query, maxResults, startDate, endDate, language, fields }) => {
      const client = await getClient();
      const result = await client.twitter.searchPosts(query, {
        limit: maxResults,
        startDate,
        endDate,
        language,
        fields,
      });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozTwitterUser = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get a Twitter/X user profile by username or ID. " +
      "Returns profile info, follower counts, bio, verification status, and more.",
    inputSchema: z.object({
      identifier: z.string().describe("Twitter username (without @) or user ID"),
      identifierType: z.enum(["username", "id"]).optional().describe("Whether the identifier is a username or ID (default: username)"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TWITTER_USER_FIELDS}`),
    }),
    outputSchema: TwitterUserSchema,
    execute: async ({ identifier, identifierType, fields }) => {
      const client = await getClient();
      return await client.twitter.getUser(identifier, { identifierType, fields });
    },
  });
};

export const xpozTwitterUserPosts = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get tweets posted by a specific Twitter/X user. " +
      "Returns their recent posts with engagement metrics.",
    inputSchema: z.object({
      identifier: z.string().describe("Twitter username (without @) or user ID"),
      maxResults: z.number().optional().describe("Maximum number of results to return"),
      startDate: z.string().optional().describe("Filter posts after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Filter posts before this date (YYYY-MM-DD)"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TWITTER_POST_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(TwitterPostSchema), totalResults: z.number() }),
    execute: async ({ identifier, maxResults, startDate, endDate, fields }) => {
      const client = await getClient();
      const result = await client.twitter.getPostsByAuthor(identifier, {
        limit: maxResults,
        startDate,
        endDate,
        fields,
      });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozTwitterPostComments = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get replies/comments on a specific Twitter/X post. " +
      "Returns reply tweets with engagement metrics and author info.",
    inputSchema: z.object({
      postId: z.string().describe("The Twitter post/tweet ID to get comments for"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TWITTER_POST_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(TwitterPostSchema), totalResults: z.number() }),
    execute: async ({ postId, fields }) => {
      const client = await getClient();
      const result = await client.twitter.getComments(postId, { fields });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozTwitterSearchUsers = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Search for Twitter/X users by name. " +
      "Returns matching user profiles with follower counts and bios.",
    inputSchema: z.object({
      name: z.string().describe("Name or partial name to search for"),
      limit: z.number().optional().describe("Maximum number of users to return"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TWITTER_USER_FIELDS}`),
    }),
    outputSchema: z.array(TwitterUserSchema),
    execute: async ({ name, limit, fields }) => {
      const client = await getClient();
      return await client.twitter.searchUsers(name, { limit, fields });
    },
  });
};

export const xpozTwitterUserConnections = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get a Twitter/X user's followers or accounts they follow. " +
      "Returns user profiles of connected accounts.",
    inputSchema: z.object({
      username: z.string().describe("Twitter username (without @)"),
      connectionType: z.enum(["followers", "following"]).describe("Type of connection to retrieve"),
      maxResults: z.number().optional().describe("Maximum number of results to return"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TWITTER_USER_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(TwitterUserSchema), totalResults: z.number() }),
    execute: async ({ username, connectionType, maxResults, fields }) => {
      const client = await getClient();
      const result = await client.twitter.getUserConnections(username, connectionType, {
        limit: maxResults,
        fields,
      });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozTwitterUsersByKeywords = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Find Twitter/X users who posted about specific keywords or topics. " +
      "Returns user profiles ranked by relevance to the query.",
    inputSchema: z.object({
      query: z.string().describe("Keywords to find users who posted about them"),
      maxResults: z.number().optional().describe("Maximum number of results to return"),
      startDate: z.string().optional().describe("Filter by posts after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Filter by posts before this date (YYYY-MM-DD)"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TWITTER_USER_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(TwitterUserSchema), totalResults: z.number() }),
    execute: async ({ query, maxResults, startDate, endDate, fields }) => {
      const client = await getClient();
      const result = await client.twitter.getUsersByKeywords(query, {
        limit: maxResults,
        startDate,
        endDate,
        fields,
      });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozTwitterCountPosts = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Count the number of Twitter/X posts matching a phrase. " +
      "Useful for measuring mention volume or brand awareness.",
    inputSchema: z.object({
      phrase: z.string().describe("Phrase to count mentions of"),
      startDate: z.string().optional().describe("Count posts after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Count posts before this date (YYYY-MM-DD)"),
    }),
    outputSchema: z.object({ phrase: z.string(), count: z.number() }),
    execute: async ({ phrase, startDate, endDate }) => {
      const client = await getClient();
      return { phrase, count: await client.twitter.countPosts(phrase, { startDate, endDate }) };
    },
  });
};

export const xpozTwitterPostsByIds = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get specific Twitter/X posts by their IDs. " +
      "Returns full post data for the given tweet IDs.",
    inputSchema: z.object({
      postIds: z.array(z.string()).describe("Array of Twitter post/tweet IDs to retrieve"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TWITTER_POST_FIELDS}`),
    }),
    outputSchema: z.array(TwitterPostSchema),
    execute: async ({ postIds, fields }) => {
      const client = await getClient();
      return await client.twitter.getPostsByIds(postIds, { fields });
    },
  });
};

export const xpozTwitterPostRetweets = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get retweets of a specific Twitter/X post. " +
      "Returns the retweeted versions with engagement metrics.",
    inputSchema: z.object({
      postId: z.string().describe("The Twitter post/tweet ID to get retweets for"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TWITTER_POST_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(TwitterPostSchema), totalResults: z.number() }),
    execute: async ({ postId, fields }) => {
      const client = await getClient();
      const result = await client.twitter.getRetweets(postId, { fields });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozTwitterPostQuotes = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get quote tweets of a specific Twitter/X post. " +
      "Returns posts that quoted the given tweet.",
    inputSchema: z.object({
      postId: z.string().describe("The Twitter post/tweet ID to get quotes for"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TWITTER_POST_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(TwitterPostSchema), totalResults: z.number() }),
    execute: async ({ postId, fields }) => {
      const client = await getClient();
      const result = await client.twitter.getQuotes(postId, { fields });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozTwitterPostInteractingUsers = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get users who interacted with a specific Twitter/X post. " +
      "Returns user profiles who liked, retweeted, or quoted the tweet.",
    inputSchema: z.object({
      postId: z.string().describe("The Twitter post/tweet ID"),
      interactionType: z.enum(["likers", "retweeters", "quoters"]).describe("Type of interaction"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TWITTER_USER_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(TwitterUserSchema), totalResults: z.number() }),
    execute: async ({ postId, interactionType, fields }) => {
      const client = await getClient();
      const result = await client.twitter.getPostInteractingUsers(postId, interactionType, { fields });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozTwitterUsers = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get multiple Twitter/X user profiles by usernames or IDs. " +
      "Returns profile data for all specified users in a single request.",
    inputSchema: z.object({
      identifiers: z.array(z.string()).describe("Array of Twitter usernames (without @) or user IDs"),
      identifierType: z.enum(["username", "id"]).optional().describe("Whether identifiers are usernames or IDs (default: username)"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TWITTER_USER_FIELDS}`),
    }),
    outputSchema: z.array(TwitterUserSchema),
    execute: async ({ identifiers, identifierType, fields }) => {
      const client = await getClient();
      return await client.twitter.getUsers(identifiers, { identifierType, fields });
    },
  });
};
