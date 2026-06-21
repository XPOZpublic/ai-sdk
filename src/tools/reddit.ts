import { tool } from "ai";
import { z } from "zod";
import { createLazyClient, type XpozToolOptions } from "../client.js";
import { RedditPostSchema, RedditUserSchema, RedditCommentSchema, RedditSubredditSchema, PaginationInfoSchema } from "../schemas/index.js";

const REDDIT_POST_FIELDS = "Available fields: id, title, selftext, url, permalink, postUrl, thumbnail, authorId, authorUsername, subredditName, subredditId, score, upvotes, downvotes, upvoteRatio, commentsCount, crosspostsCount, isSelf, isVideo, isOriginalContent, over18, spoiler, locked, stickied, archived, linkFlairText, domain, createdAt, createdAtDate";

const REDDIT_USER_FIELDS = "Available fields: id, username, profileUrl, profilePicUrl, linkKarma, commentKarma, totalKarma, awardeeKarma, awarderKarma, isGold, isMod, isEmployee, hasVerifiedEmail, isSuspended, verified, profileDescription, profileBannerUrl, profileTitle, createdAt, createdAtDate";

const REDDIT_COMMENT_FIELDS = "Available fields: id, body, parentPostId, parentId, authorId, authorUsername, postSubredditName, score, upvotes, downvotes, controversiality, depth, isSubmitter, stickied, collapsed, edited, distinguished, createdAt, createdAtDate";

const REDDIT_SUBREDDIT_FIELDS = "Available fields: id, displayName, title, publicDescription, description, subscribersCount, activeUserCount, subredditType, over18, lang, url, subredditUrl, iconImg, bannerImg, communityIcon, createdAt, createdAtDate";

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
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${REDDIT_POST_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(RedditPostSchema), totalResults: z.number() }),
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
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${REDDIT_USER_FIELDS}`),
    }),
    outputSchema: RedditUserSchema,
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
      postFields: z.array(z.string()).optional().describe(`Fields to include for the post. ${REDDIT_POST_FIELDS}`),
      commentFields: z.array(z.string()).optional().describe(`Fields to include for comments. ${REDDIT_COMMENT_FIELDS}`),
    }),
    outputSchema: z.object({
      post: RedditPostSchema.nullish(),
      comments: z.array(RedditCommentSchema).nullish(),
      commentsPagination: PaginationInfoSchema.nullish(),
    }).passthrough(),
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
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${REDDIT_COMMENT_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(RedditCommentSchema), totalResults: z.number() }),
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
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${REDDIT_SUBREDDIT_FIELDS}`),
    }),
    outputSchema: z.array(RedditSubredditSchema),
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
      subredditFields: z.array(z.string()).optional().describe(`Fields to include for the subreddit. ${REDDIT_SUBREDDIT_FIELDS}`),
      postFields: z.array(z.string()).optional().describe(`Fields to include for posts. ${REDDIT_POST_FIELDS}`),
    }),
    outputSchema: z.object({
      subreddit: RedditSubredditSchema.nullish(),
      posts: z.array(RedditPostSchema).nullish(),
      postsPagination: PaginationInfoSchema.nullish(),
    }).passthrough(),
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
      fields: z.array(z.string()).optional().describe(`Fields to include in the response. Omit for default fields. ${REDDIT_USER_FIELDS}`),
    }),
    outputSchema: z.object({ data: z.array(RedditUserSchema), totalResults: z.number() }),
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
