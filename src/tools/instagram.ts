import { tool } from "ai";
import { z } from "zod";
import { createLazyClient, type XpozToolOptions } from "../client.js";

export const xpozInstagramSearch = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Search Instagram posts by keywords or phrases. " +
      "Returns posts with captions, engagement metrics, media URLs, and author info.",
    inputSchema: z.object({
      query: z.string().describe("Search query — supports AND, OR, NOT operators and quoted phrases"),
      maxResults: z.number().optional().describe("Maximum number of results to return"),
      startDate: z.string().optional().describe("Filter posts after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Filter posts before this date (YYYY-MM-DD)"),
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
    execute: async ({ query, maxResults, startDate, endDate, fields }) => {
      const client = await getClient();
      const result = await client.instagram.searchPosts(query, {
        limit: maxResults,
        startDate,
        endDate,
        fields,
      });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozInstagramUser = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get an Instagram user profile by username or ID. " +
      "Returns profile info, follower/following counts, bio, verification status, and profile picture.",
    inputSchema: z.object({
      identifier: z.string().describe("Instagram username or user ID"),
      identifierType: z.enum(["username", "id"]).optional().describe("Whether the identifier is a username or ID (default: username)"),
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
    execute: async ({ identifier, identifierType, fields }) => {
      const client = await getClient();
      return await client.instagram.getUser(identifier, { identifierType, fields });
    },
  });
};

export const xpozInstagramUserPosts = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get posts by a specific Instagram user. " +
      "Returns their posts with captions, engagement metrics, and media URLs.",
    inputSchema: z.object({
      identifier: z.string().describe("Instagram username or user ID"),
      identifierType: z.enum(["username", "id"]).optional().describe("Whether the identifier is a username or ID (default: username)"),
      maxResults: z.number().optional().describe("Maximum number of results to return"),
      startDate: z.string().optional().describe("Filter posts after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Filter posts before this date (YYYY-MM-DD)"),
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
    execute: async ({ identifier, identifierType, maxResults, startDate, endDate, fields }) => {
      const client = await getClient();
      const result = await client.instagram.getPostsByUser(identifier, {
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

export const xpozInstagramPostComments = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get comments on a specific Instagram post. " +
      "Returns comments with text, author info, and like counts.",
    inputSchema: z.object({
      postId: z.string().describe("The Instagram post ID to get comments for"),
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
    execute: async ({ postId, fields }) => {
      const client = await getClient();
      const result = await client.instagram.getComments(postId, { fields });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozInstagramSearchUsers = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Search for Instagram users by name. " +
      "Returns matching user profiles with follower counts, bios, and verification status.",
    inputSchema: z.object({
      name: z.string().describe("Name or partial name to search for"),
      limit: z.number().optional().describe("Maximum number of users to return"),
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
    execute: async ({ name, limit, fields }) => {
      const client = await getClient();
      return await client.instagram.searchUsers(name, { limit, fields });
    },
  });
};

export const xpozInstagramUsersByKeywords = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Find Instagram users who posted about specific keywords or topics. " +
      "Returns user profiles ranked by relevance to the query.",
    inputSchema: z.object({
      query: z.string().describe("Keywords to find users who posted about them"),
      maxResults: z.number().optional().describe("Maximum number of results to return"),
      startDate: z.string().optional().describe("Filter by posts after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Filter by posts before this date (YYYY-MM-DD)"),
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
    execute: async ({ query, maxResults, startDate, endDate, fields }) => {
      const client = await getClient();
      const result = await client.instagram.getUsersByKeywords(query, {
        limit: maxResults,
        startDate,
        endDate,
        fields,
      });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};
