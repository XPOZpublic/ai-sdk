import { tool } from "ai";
import { z } from "zod";
import { createLazyClient, type XpozToolOptions } from "../client.js";

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
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
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
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
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
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
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
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
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
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
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
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
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
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
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
    execute: async ({ phrase, startDate, endDate }) => {
      const client = await getClient();
      return { phrase, count: await client.twitter.countPosts(phrase, { startDate, endDate }) };
    },
  });
};
