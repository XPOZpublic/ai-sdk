import { tool } from "ai";
import { z } from "zod";
import { createLazyClient, type XpozToolOptions } from "../client.js";
import { TiktokPostSchema, TiktokUserSchema, TiktokCommentSchema } from "../schemas/index.js";

const TIKTOK_POST_FIELDS = "Available fields: id, postType, isPrivate, videoThumbnail, description, descriptionLanguage, userId, username, nickname, collectCount, commentCount, likeCount, downloadCount, forwardCount, playCount, hashtags, duration, videoUrl, createdAt, createdAtDate";

const TIKTOK_USER_FIELDS = "Available fields: id, username, nickname, signature, secUid, avatar, isPrivate, isVerified, followerCount, followingCount, likeCount, postCount, language, region, createdAt, usernameModifyTime";

const TIKTOK_COMMENT_FIELDS = "Available fields: id, postId, userId, username, text, likeCount, createdAt, createdAtDate";

export const xpozTiktokSearch = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Search TikTok posts by keywords or phrases. " +
      "Returns videos with descriptions, engagement metrics (likes, views, comments), and creator info.",
    inputSchema: z.object({
      query: z.string().describe("Search query — supports AND, OR, NOT operators and quoted phrases"),
      maxResults: z.number().optional().describe("Maximum number of results to return"),
      startDate: z.string().optional().describe("Filter posts after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Filter posts before this date (YYYY-MM-DD)"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TIKTOK_POST_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(TiktokPostSchema), totalResults: z.number() }),
    execute: async ({ query, maxResults, startDate, endDate, fields }) => {
      const client = await getClient();
      const result = await client.tiktok.searchPosts(query, {
        limit: maxResults,
        startDate,
        endDate,
        fields,
      });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozTiktokUser = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get a TikTok user profile by username or ID. " +
      "Returns profile info, follower/following counts, total likes, bio, and verification status.",
    inputSchema: z.object({
      identifier: z.string().describe("TikTok username or user ID"),
      identifierType: z.enum(["username", "id"]).optional().describe("Whether the identifier is a username or ID (default: username)"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TIKTOK_USER_FIELDS}`),
    }),
    outputSchema: TiktokUserSchema,
    execute: async ({ identifier, identifierType, fields }) => {
      const client = await getClient();
      return await client.tiktok.getUser(identifier, { identifierType, fields });
    },
  });
};

export const xpozTiktokUserPosts = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get videos posted by a specific TikTok user. " +
      "Returns their posts with descriptions, engagement metrics, and hashtags.",
    inputSchema: z.object({
      identifier: z.string().describe("TikTok username or user ID"),
      identifierType: z.enum(["username", "id"]).optional().describe("Whether the identifier is a username or ID (default: username)"),
      maxResults: z.number().optional().describe("Maximum number of results to return"),
      startDate: z.string().optional().describe("Filter posts after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Filter posts before this date (YYYY-MM-DD)"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TIKTOK_POST_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(TiktokPostSchema), totalResults: z.number() }),
    execute: async ({ identifier, identifierType, maxResults, startDate, endDate, fields }) => {
      const client = await getClient();
      const result = await client.tiktok.getPostsByUser(identifier, {
        identifierType,
        limit: maxResults,
        startDate,
        endDate,
        fields,
      });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozTiktokPostComments = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get comments on a specific TikTok video. " +
      "Returns comments with text, author info, and like counts.",
    inputSchema: z.object({
      postId: z.string().describe("The TikTok video/post ID to get comments for"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TIKTOK_COMMENT_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(TiktokCommentSchema), totalResults: z.number() }),
    execute: async ({ postId, fields }) => {
      const client = await getClient();
      const result = await client.tiktok.getComments(postId, { fields });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozTiktokSearchUsers = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Search for TikTok users by name. " +
      "Returns matching creator profiles with follower counts and bios.",
    inputSchema: z.object({
      name: z.string().describe("Name or partial name to search for"),
      limit: z.number().optional().describe("Maximum number of users to return"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TIKTOK_USER_FIELDS}`),
    }),
    outputSchema: z.array(TiktokUserSchema),
    execute: async ({ name, limit, fields }) => {
      const client = await getClient();
      return await client.tiktok.searchUsers(name, { limit, fields });
    },
  });
};

export const xpozTiktokPostsByHashtags = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Search TikTok posts by one or more hashtags. " +
      "Returns videos tagged with the specified hashtags, with engagement metrics.",
    inputSchema: z.object({
      hashtags: z.array(z.string()).describe("List of hashtags to search for (without # prefix)"),
      maxResults: z.number().optional().describe("Maximum number of results to return"),
      startDate: z.string().optional().describe("Filter posts after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Filter posts before this date (YYYY-MM-DD)"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TIKTOK_POST_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(TiktokPostSchema), totalResults: z.number() }),
    execute: async ({ hashtags, maxResults, startDate, endDate, fields }) => {
      const client = await getClient();
      const result = await client.tiktok.getPostsByHashtags(hashtags, {
        limit: maxResults,
        startDate,
        endDate,
        fields,
      });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozTiktokUsersByKeywords = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Find TikTok creators who posted about specific keywords or topics. " +
      "Returns creator profiles ranked by relevance to the query.",
    inputSchema: z.object({
      query: z.string().describe("Keywords to find creators who posted about them"),
      maxResults: z.number().optional().describe("Maximum number of results to return"),
      startDate: z.string().optional().describe("Filter by posts after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Filter by posts before this date (YYYY-MM-DD)"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TIKTOK_USER_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(TiktokUserSchema), totalResults: z.number() }),
    execute: async ({ query, maxResults, startDate, endDate, fields }) => {
      const client = await getClient();
      const result = await client.tiktok.getUsersByKeywords(query, {
        limit: maxResults,
        startDate,
        endDate,
        fields,
      });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozTiktokPostsByIds = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get specific TikTok videos by their IDs. " +
      "Returns full post data for the given video IDs.",
    inputSchema: z.object({
      postIds: z.array(z.string()).describe("Array of TikTok video/post IDs to retrieve"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TIKTOK_POST_FIELDS}`),
    }),
    outputSchema: z.array(TiktokPostSchema),
    execute: async ({ postIds, fields }) => {
      const client = await getClient();
      return await client.tiktok.getPostsByIds(postIds, { fields });
    },
  });
};

export const xpozTiktokUsersByHashtags = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Find TikTok creators who posted with specific hashtags. " +
      "Returns creator profiles ranked by relevance.",
    inputSchema: z.object({
      hashtags: z.array(z.string()).describe("List of hashtags to search for (without # prefix)"),
      maxResults: z.number().optional().describe("Maximum number of results to return"),
      startDate: z.string().optional().describe("Filter by posts after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Filter by posts before this date (YYYY-MM-DD)"),
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${TIKTOK_USER_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(TiktokUserSchema), totalResults: z.number() }),
    execute: async ({ hashtags, maxResults, startDate, endDate, fields }) => {
      const client = await getClient();
      const result = await client.tiktok.getUsersByHashtags(hashtags, {
        limit: maxResults,
        startDate,
        endDate,
        fields,
      });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};
