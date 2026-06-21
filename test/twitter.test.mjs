import { describe, it } from "node:test";
import assert from "node:assert";
import { xpozTwitterUser, xpozTwitterSearchUsers, xpozTwitterUserPosts } from "../dist/index.js";

describe("Twitter", () => {
  it("should get a user by username", async () => {
    const tool = xpozTwitterUser();
    const result = await tool.execute({ identifier: "elonmusk" });
    assert.ok(result.username);
    assert.strictEqual(result.username.toLowerCase(), "elonmusk");
  });

  it("should search users by name", async () => {
    const tool = xpozTwitterSearchUsers();
    const result = await tool.execute({ name: "Elon Musk", limit: 3 });
    assert.ok(Array.isArray(result));
    assert.ok(result.length > 0);
    assert.ok(result[0].username);
  });

  it("should get posts by username", async () => {
    const tool = xpozTwitterUserPosts();
    const result = await tool.execute({ identifier: "elonmusk", maxResults: 5 });
    assert.ok(result.data);
    assert.ok(result.data.length > 0);
    const post = result.data[0];
    assert.ok(post.text);
    assert.ok(post.authorUsername);
  });

  it("should respect maxResults pagination", async () => {
    const tool = xpozTwitterUserPosts();
    const result3 = await tool.execute({ identifier: "elonmusk", maxResults: 3 });
    const result5 = await tool.execute({ identifier: "elonmusk", maxResults: 5 });
    assert.ok(result3.data.length <= 3);
    assert.ok(result5.data.length <= 5);
    assert.ok(result5.data.length >= result3.data.length);
  });
});
