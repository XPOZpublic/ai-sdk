export type { XpozToolOptions } from "./client.js";
export { createLazyClient } from "./client.js";

export type {
  TwitterPost,
  TwitterUser,
  InstagramPost,
  InstagramUser,
  InstagramComment,
  RedditPost,
  RedditUser,
  RedditComment,
  RedditSubreddit,
  RedditPostWithComments,
  SubredditWithPosts,
  TiktokPost,
  TiktokUser,
  TiktokComment,
  TrackedItem,
  AddTrackedItemsResult,
  RemoveTrackedItemsResult,
  AccountDetails,
  AccountBilling,
  AccountUsage,
  PlanFeatures,
  PaginationInfo,
} from "@xpoz/xpoz";

export {
  xpozTwitterSearch,
  xpozTwitterUser,
  xpozTwitterUserPosts,
  xpozTwitterPostComments,
  xpozTwitterSearchUsers,
  xpozTwitterUserConnections,
  xpozTwitterUsersByKeywords,
  xpozTwitterCountPosts,
  xpozTwitterPostsByIds,
  xpozTwitterPostRetweets,
  xpozTwitterPostQuotes,
  xpozTwitterPostInteractingUsers,
  xpozTwitterUsers,
} from "./tools/twitter.js";

export {
  xpozInstagramSearch,
  xpozInstagramUser,
  xpozInstagramUserPosts,
  xpozInstagramPostComments,
  xpozInstagramSearchUsers,
  xpozInstagramUsersByKeywords,
  xpozInstagramPostsByIds,
  xpozInstagramUserConnections,
  xpozInstagramPostInteractingUsers,
} from "./tools/instagram.js";

export {
  xpozRedditSearch,
  xpozRedditUser,
  xpozRedditPostWithComments,
  xpozRedditSearchComments,
  xpozRedditSearchSubreddits,
  xpozRedditSubreddit,
  xpozRedditUsersByKeywords,
  xpozRedditSearchUsers,
  xpozRedditSubredditsByKeywords,
} from "./tools/reddit.js";

export {
  xpozTiktokSearch,
  xpozTiktokUser,
  xpozTiktokUserPosts,
  xpozTiktokPostComments,
  xpozTiktokSearchUsers,
  xpozTiktokPostsByHashtags,
  xpozTiktokUsersByKeywords,
  xpozTiktokPostsByIds,
  xpozTiktokUsersByHashtags,
} from "./tools/tiktok.js";

export {
  xpozGetTrackedItems,
  xpozAddTrackedItems,
  xpozRemoveTrackedItems,
} from "./tools/tracking.js";

export { xpozAccountDetails } from "./tools/account.js";

import type { XpozToolOptions } from "./client.js";
import { createLazyClient } from "./client.js";
import { xpozTwitterSearch, xpozTwitterUser, xpozTwitterUserPosts, xpozTwitterPostComments, xpozTwitterSearchUsers, xpozTwitterUserConnections, xpozTwitterUsersByKeywords, xpozTwitterCountPosts, xpozTwitterPostsByIds, xpozTwitterPostRetweets, xpozTwitterPostQuotes, xpozTwitterPostInteractingUsers, xpozTwitterUsers } from "./tools/twitter.js";
import { xpozInstagramSearch, xpozInstagramUser, xpozInstagramUserPosts, xpozInstagramPostComments, xpozInstagramSearchUsers, xpozInstagramUsersByKeywords, xpozInstagramPostsByIds, xpozInstagramUserConnections, xpozInstagramPostInteractingUsers } from "./tools/instagram.js";
import { xpozRedditSearch, xpozRedditUser, xpozRedditPostWithComments, xpozRedditSearchComments, xpozRedditSearchSubreddits, xpozRedditSubreddit, xpozRedditUsersByKeywords, xpozRedditSearchUsers, xpozRedditSubredditsByKeywords } from "./tools/reddit.js";
import { xpozTiktokSearch, xpozTiktokUser, xpozTiktokUserPosts, xpozTiktokPostComments, xpozTiktokSearchUsers, xpozTiktokPostsByHashtags, xpozTiktokUsersByKeywords, xpozTiktokPostsByIds, xpozTiktokUsersByHashtags } from "./tools/tiktok.js";
import { xpozGetTrackedItems, xpozAddTrackedItems, xpozRemoveTrackedItems } from "./tools/tracking.js";
import { xpozAccountDetails } from "./tools/account.js";

export function xpozTools(options: XpozToolOptions = {}) {
  const sharedOptions = { ...options, _getClient: createLazyClient(options) };

  return {
    xpozTwitterSearch: xpozTwitterSearch(sharedOptions),
    xpozTwitterUser: xpozTwitterUser(sharedOptions),
    xpozTwitterUserPosts: xpozTwitterUserPosts(sharedOptions),
    xpozTwitterPostComments: xpozTwitterPostComments(sharedOptions),
    xpozTwitterSearchUsers: xpozTwitterSearchUsers(sharedOptions),
    xpozTwitterUserConnections: xpozTwitterUserConnections(sharedOptions),
    xpozTwitterUsersByKeywords: xpozTwitterUsersByKeywords(sharedOptions),
    xpozTwitterCountPosts: xpozTwitterCountPosts(sharedOptions),
    xpozTwitterPostsByIds: xpozTwitterPostsByIds(sharedOptions),
    xpozTwitterPostRetweets: xpozTwitterPostRetweets(sharedOptions),
    xpozTwitterPostQuotes: xpozTwitterPostQuotes(sharedOptions),
    xpozTwitterPostInteractingUsers: xpozTwitterPostInteractingUsers(sharedOptions),
    xpozTwitterUsers: xpozTwitterUsers(sharedOptions),
    xpozInstagramSearch: xpozInstagramSearch(sharedOptions),
    xpozInstagramUser: xpozInstagramUser(sharedOptions),
    xpozInstagramUserPosts: xpozInstagramUserPosts(sharedOptions),
    xpozInstagramPostComments: xpozInstagramPostComments(sharedOptions),
    xpozInstagramSearchUsers: xpozInstagramSearchUsers(sharedOptions),
    xpozInstagramUsersByKeywords: xpozInstagramUsersByKeywords(sharedOptions),
    xpozInstagramPostsByIds: xpozInstagramPostsByIds(sharedOptions),
    xpozInstagramUserConnections: xpozInstagramUserConnections(sharedOptions),
    xpozInstagramPostInteractingUsers: xpozInstagramPostInteractingUsers(sharedOptions),
    xpozRedditSearch: xpozRedditSearch(sharedOptions),
    xpozRedditUser: xpozRedditUser(sharedOptions),
    xpozRedditPostWithComments: xpozRedditPostWithComments(sharedOptions),
    xpozRedditSearchComments: xpozRedditSearchComments(sharedOptions),
    xpozRedditSearchSubreddits: xpozRedditSearchSubreddits(sharedOptions),
    xpozRedditSubreddit: xpozRedditSubreddit(sharedOptions),
    xpozRedditUsersByKeywords: xpozRedditUsersByKeywords(sharedOptions),
    xpozRedditSearchUsers: xpozRedditSearchUsers(sharedOptions),
    xpozRedditSubredditsByKeywords: xpozRedditSubredditsByKeywords(sharedOptions),
    xpozTiktokSearch: xpozTiktokSearch(sharedOptions),
    xpozTiktokUser: xpozTiktokUser(sharedOptions),
    xpozTiktokUserPosts: xpozTiktokUserPosts(sharedOptions),
    xpozTiktokPostComments: xpozTiktokPostComments(sharedOptions),
    xpozTiktokSearchUsers: xpozTiktokSearchUsers(sharedOptions),
    xpozTiktokPostsByHashtags: xpozTiktokPostsByHashtags(sharedOptions),
    xpozTiktokUsersByKeywords: xpozTiktokUsersByKeywords(sharedOptions),
    xpozTiktokPostsByIds: xpozTiktokPostsByIds(sharedOptions),
    xpozTiktokUsersByHashtags: xpozTiktokUsersByHashtags(sharedOptions),
    xpozGetTrackedItems: xpozGetTrackedItems(sharedOptions),
    xpozAddTrackedItems: xpozAddTrackedItems(sharedOptions),
    xpozRemoveTrackedItems: xpozRemoveTrackedItems(sharedOptions),
    xpozAccountDetails: xpozAccountDetails(sharedOptions),
  };
}
