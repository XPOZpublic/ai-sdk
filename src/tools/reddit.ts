import { tool } from "ai";
import { z } from "zod";
import { createLazyClient, type XpozToolOptions } from "../client.js";

export const xpozRedditSearch = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Search Reddit posts by keywords or phrases. " +
      "Returns posts with titles, content, engagement metrics, and subreddit info. " +
      "Can filter by subreddit, sort order, and time range.",
    inputSchema: z.object({
      query: z.string().describe("Search query — supports AND, OR, NOT operators and quoted phrases"),
      maxResults: z.number().optional().describe("Maximum number of results to return"),
      subreddit: z.string().optional().describe("Filter results to a specific subreddit name"),
      sort: z.enum(["relevance", "new", "hot", "top", "comments"]).optional().describe("Sort order for results"),
      startDate: z.string().optional().describe("Filter posts after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Filter posts before this date (YYYY-MM-DD)"),
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
    execute: async ({ query, maxResults, subreddit, sort, startDate, endDate, fields }) => {
      const client = await getClient();
      const result = await client.reddit.searchPosts(query, {
        limit: maxResults,
        subreddit,
        sort,
        startDate,
        endDate,
        fields,
      });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozRedditUser = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get a Reddit user profile by username. " +
      "Returns profile info, karma scores, account age, and verification status.",
    inputSchema: z.object({
      username: z.string().describe("Reddit username"),
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
    execute: async ({ username, fields }) => {
      const client = await getClient();
      return await client.reddit.getUser(username, { fields });
    },
  });
};

export const xpozRedditPostWithComments = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get a specific Reddit post along with its comments. " +
      "Returns the full post content and a thread of comments with scores and author info.",
    inputSchema: z.object({
      postId: z.string().describe("The Reddit post ID"),
      postFields: z.array(z.string()).optional().describe("Fields to include for the post"),
      commentFields: z.array(z.string()).optional().describe("Fields to include for comments"),
    }),
    execute: async ({ postId, postFields, commentFields }) => {
      const client = await getClient();
      return await client.reddit.getPostWithComments(postId, { postFields, commentFields });
    },
  });
};

export const xpozRedditSearchComments = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Search Reddit comments by keywords or phrases. " +
      "Returns matching comments with text, scores, and context.",
    inputSchema: z.object({
      query: z.string().describe("Search query for comment content"),
      subreddit: z.string().optional().describe("Filter to a specific subreddit"),
      startDate: z.string().optional().describe("Filter comments after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Filter comments before this date (YYYY-MM-DD)"),
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
    execute: async ({ query, subreddit, startDate, endDate, fields }) => {
      const client = await getClient();
      const result = await client.reddit.searchComments(query, {
        subreddit,
        startDate,
        endDate,
        fields,
      });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};

export const xpozRedditSearchSubreddits = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Search for subreddits by name or topic. " +
      "Returns matching subreddits with descriptions, subscriber counts, and activity levels.",
    inputSchema: z.object({
      query: z.string().describe("Search query for subreddit name or topic"),
      limit: z.number().optional().describe("Maximum number of subreddits to return"),
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
    execute: async ({ query, limit, fields }) => {
      const client = await getClient();
      return await client.reddit.searchSubreddits(query, { limit, fields });
    },
  });
};

export const xpozRedditSubreddit = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get a subreddit's info and its recent posts. " +
      "Returns subreddit description, subscriber count, and a list of top posts.",
    inputSchema: z.object({
      subredditName: z.string().describe("Name of the subreddit (without r/)"),
      subredditFields: z.array(z.string()).optional().describe("Fields to include for the subreddit"),
      postFields: z.array(z.string()).optional().describe("Fields to include for posts"),
    }),
    execute: async ({ subredditName, subredditFields, postFields }) => {
      const client = await getClient();
      return await client.reddit.getSubredditWithPosts(subredditName, { subredditFields, postFields });
    },
  });
};

export const xpozRedditUsersByKeywords = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Find Reddit users who posted about specific keywords or topics. " +
      "Returns user profiles ranked by relevance to the query.",
    inputSchema: z.object({
      query: z.string().describe("Keywords to find users who posted about them"),
      subreddit: z.string().optional().describe("Filter to a specific subreddit"),
      startDate: z.string().optional().describe("Filter by posts after this date (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("Filter by posts before this date (YYYY-MM-DD)"),
      fields: z.array(z.string()).optional().describe("Fields to include in the response. Uses camelCase (e.g. 'followersCount', 'description'). Omit for default fields."),
    }),
    execute: async ({ query, subreddit, startDate, endDate, fields }) => {
      const client = await getClient();
      const result = await client.reddit.getUsersByKeywords(query, {
        subreddit,
        startDate,
        endDate,
        fields,
      });
      return { data: result.data, totalResults: result.pagination.totalRows };
    },
  });
};
