import { describe, it } from "node:test";
import assert from "node:assert";
import { xpozTiktokUser, xpozTiktokSearchUsers, xpozTiktokUserPosts } from "../dist/index.js";

describe("TikTok", () => {
  it("should get a user by username", async () => {
    const tool = xpozTiktokUser();
    const result = await tool.execute({ identifier: "tiktok" });
    assert.ok(result.username);
  });

  it("should search users by name", async () => {
    const tool = xpozTiktokSearchUsers();
    const result = await tool.execute({ name: "nasa", limit: 3 });
    assert.ok(Array.isArray(result));
    assert.ok(result.length > 0);
    assert.ok(result[0].username);
  });

  it("should get posts by username", async () => {
    const tool = xpozTiktokUserPosts();
    const result = await tool.execute({ identifier: "charlidamelio", maxResults: 5 });
    assert.ok(result.data);
    assert.ok(result.data.length > 0);
    const post = result.data[0];
    assert.ok(post.username);
  });

  it("should respect maxResults pagination", async () => {
    const tool = xpozTiktokUserPosts();
    const result3 = await tool.execute({ identifier: "charlidamelio", maxResults: 3 });
    const result5 = await tool.execute({ identifier: "charlidamelio", maxResults: 5 });
    assert.ok(result3.data.length <= 3);
    assert.ok(result5.data.length <= 5);
    assert.ok(result5.data.length >= result3.data.length);
  });
});
