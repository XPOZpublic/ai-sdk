import { describe, it } from "node:test";
import assert from "node:assert";
import { xpozRedditUser, xpozRedditSearchSubreddits, xpozRedditSubreddit } from "../dist/index.js";

describe("Reddit", () => {
  it("should get a user by username", async () => {
    const tool = xpozRedditUser();
    const result = await tool.execute({ username: "spez" });
    assert.ok(result.username);
  });

  it("should search subreddits", async () => {
    const tool = xpozRedditSearchSubreddits();
    const result = await tool.execute({ query: "python", limit: 3 });
    assert.ok(Array.isArray(result));
    assert.ok(result.length > 0);
    assert.ok(result[0].displayName);
  });

  it("should get subreddit with posts", async () => {
    const tool = xpozRedditSubreddit();
    const result = await tool.execute({ subredditName: "python" });
    assert.ok(result.subreddit);
    assert.strictEqual(result.subreddit.displayName.toLowerCase(), "python");
    assert.ok(result.posts);
    assert.ok(result.posts.length > 0);
  });
});
