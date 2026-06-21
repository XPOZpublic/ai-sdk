import { describe, it, after } from "node:test";
import assert from "node:assert";
import { createLazyClient, xpozRedditUser, xpozRedditSearchSubreddits, xpozRedditSubreddit } from "../dist/index.js";

const getClient = createLazyClient({});
const opts = { _getClient: getClient };

after(async () => {
  const client = await getClient();
  await client.close();
});

describe("Reddit", () => {
  it("should get a user by username", async () => {
    const tool = xpozRedditUser(opts);
    const result = await tool.execute({ username: "spez" });
    assert.ok(result.username);
  });

  it("should search subreddits", async () => {
    const tool = xpozRedditSearchSubreddits(opts);
    const result = await tool.execute({ query: "python", limit: 3 });
    assert.ok(Array.isArray(result));
    assert.ok(result.length > 0);
    assert.ok(result[0].displayName);
  });

  it("should get subreddit with posts", async () => {
    const tool = xpozRedditSubreddit(opts);
    const result = await tool.execute({ subredditName: "python" });
    assert.ok(result.subreddit);
    assert.strictEqual(result.subreddit.displayName.toLowerCase(), "python");
    assert.ok(result.posts);
    assert.ok(result.posts.length > 0);
  });

  it("should filter response with fields parameter", async () => {
    const tool = xpozRedditUser(opts);
    const result = await tool.execute({ username: "spez", fields: ["username", "commentKarma"] });
    assert.ok(result.username);
    assert.ok("commentKarma" in result);
  });
});
