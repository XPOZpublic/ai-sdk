import { describe, it, after } from "node:test";
import assert from "node:assert";
import {
  createLazyClient,
  xpozTwitterUser, xpozTwitterSearch,
  xpozInstagramUser, xpozInstagramSearch,
  xpozRedditUser, xpozRedditSearch, xpozRedditSearchSubreddits,
  xpozTiktokUser, xpozTiktokSearch,
} from "../dist/index.js";

const getClient = createLazyClient({});
const opts = { _getClient: getClient };

after(async () => {
  const client = await getClient();
  await client.close();
});

describe("Fields — Twitter", () => {
  it("user fields: followersCount, description", async () => {
    const tool = xpozTwitterUser(opts);
    const result = await tool.execute({ identifier: "elonmusk", fields: ["username", "followersCount", "description"] });
    assert.ok("followersCount" in result);
    assert.ok("description" in result);
    assert.ok(!("name" in result));
  });

  it("post fields: text, likeCount", async () => {
    const tool = xpozTwitterSearch(opts);
    const result = await tool.execute({ query: "AI", maxResults: 1, fields: ["text", "likeCount"] });
    assert.ok(result.data.length > 0);
    assert.ok("text" in result.data[0]);
    assert.ok("likeCount" in result.data[0]);
  });
});

describe("Fields — Instagram", () => {
  it("user fields: followerCount, biography", async () => {
    const tool = xpozInstagramUser(opts);
    const result = await tool.execute({ identifier: "instagram", fields: ["username", "followerCount", "biography"] });
    assert.ok("followerCount" in result);
    assert.ok("biography" in result);
    assert.ok(!("fullName" in result));
  });

  it("post fields: caption, likeCount", async () => {
    const tool = xpozInstagramSearch(opts);
    const result = await tool.execute({ query: "nature", maxResults: 1, fields: ["caption", "likeCount"] });
    assert.ok(result.data.length > 0);
    assert.ok("caption" in result.data[0]);
    assert.ok("likeCount" in result.data[0]);
  });
});

describe("Fields — Reddit", () => {
  it("user fields: commentKarma, profileDescription", async () => {
    const tool = xpozRedditUser(opts);
    const result = await tool.execute({ username: "spez", fields: ["username", "commentKarma", "profileDescription"] });
    assert.ok("commentKarma" in result);
    assert.ok("profileDescription" in result);
  });

  it("post fields: title, score", async () => {
    const tool = xpozRedditSearch(opts);
    const result = await tool.execute({ query: "python", maxResults: 1, fields: ["title", "score"] });
    assert.ok(result.data.length > 0);
    assert.ok("title" in result.data[0]);
    assert.ok("score" in result.data[0]);
  });

  it("subreddit fields: subscribersCount, publicDescription", async () => {
    const tool = xpozRedditSearchSubreddits(opts);
    const result = await tool.execute({ query: "python", limit: 1, fields: ["displayName", "subscribersCount", "publicDescription"] });
    assert.ok(Array.isArray(result));
    assert.ok(result.length > 0);
    assert.ok("subscribersCount" in result[0]);
    assert.ok("publicDescription" in result[0]);
  });
});

describe("Fields — TikTok", () => {
  it("user fields: followerCount, nickname", async () => {
    const tool = xpozTiktokUser(opts);
    const result = await tool.execute({ identifier: "tiktok", fields: ["username", "followerCount", "nickname"] });
    assert.ok("followerCount" in result);
    assert.ok("nickname" in result);
    assert.ok(!("signature" in result));
  });

  it("post fields: description, playCount", async () => {
    const tool = xpozTiktokSearch(opts);
    const result = await tool.execute({ query: "dance", maxResults: 1, fields: ["description", "playCount"] });
    assert.ok(result.data.length > 0);
    assert.ok("description" in result.data[0]);
    assert.ok("playCount" in result.data[0]);
  });
});
