import { describe, it } from "node:test";
import assert from "node:assert";
import { xpozInstagramUser, xpozInstagramSearchUsers, xpozInstagramUserPosts } from "../dist/index.js";

describe("Instagram", () => {
  it("should get a user by username", async () => {
    const tool = xpozInstagramUser();
    const result = await tool.execute({ identifier: "instagram" });
    assert.ok(result.username);
    assert.strictEqual(result.username.toLowerCase(), "instagram");
  });

  it("should search users by name", async () => {
    const tool = xpozInstagramSearchUsers();
    const result = await tool.execute({ name: "nasa", limit: 3 });
    assert.ok(Array.isArray(result));
    assert.ok(result.length > 0);
    assert.ok(result[0].username);
  });

  it("should get posts by username", async () => {
    const tool = xpozInstagramUserPosts();
    const result = await tool.execute({ identifier: "nasa", maxResults: 5 });
    assert.ok(result.data);
    assert.ok(result.data.length > 0);
    const post = result.data[0];
    assert.ok(post.username);
  });

  it("should respect maxResults pagination", async () => {
    const tool = xpozInstagramUserPosts();
    const result3 = await tool.execute({ identifier: "nasa", maxResults: 3 });
    const result5 = await tool.execute({ identifier: "nasa", maxResults: 5 });
    assert.ok(result3.data.length <= 3);
    assert.ok(result5.data.length <= 5);
    assert.ok(result5.data.length >= result3.data.length);
  });
});
