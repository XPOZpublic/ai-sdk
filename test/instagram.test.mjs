import { describe, it, after } from "node:test";
import assert from "node:assert";
import { createLazyClient, xpozInstagramUser, xpozInstagramSearchUsers, xpozInstagramUserPosts } from "../dist/index.js";

const getClient = createLazyClient({});
const opts = { _getClient: getClient };

after(async () => {
  const client = await getClient();
  await client.close();
});

describe("Instagram", () => {
  it("should get a user by username", async () => {
    const tool = xpozInstagramUser(opts);
    const result = await tool.execute({ identifier: "instagram" });
    assert.ok(result.username);
    assert.strictEqual(result.username.toLowerCase(), "instagram");
  });

  it("should search users by name", async () => {
    const tool = xpozInstagramSearchUsers(opts);
    const result = await tool.execute({ name: "nasa", limit: 3 });
    assert.ok(Array.isArray(result));
    assert.ok(result.length > 0);
    assert.ok(result[0].username);
  });

  it("should get posts by username", async () => {
    const tool = xpozInstagramUserPosts(opts);
    const result = await tool.execute({ identifier: "nasa", maxResults: 5 });
    assert.ok(result.data);
    assert.ok(result.data.length > 0);
    const post = result.data[0];
    assert.ok(post.username);
  });

  it("should respect maxResults pagination", async () => {
    const tool = xpozInstagramUserPosts(opts);
    const result3 = await tool.execute({ identifier: "nasa", maxResults: 3 });
    const result5 = await tool.execute({ identifier: "nasa", maxResults: 5 });
    assert.ok(result3.data.length <= 3);
    assert.ok(result5.data.length <= 5);
    assert.ok(result5.data.length >= result3.data.length);
  });

  it("should filter response with fields parameter", async () => {
    const tool = xpozInstagramUser(opts);
    const result = await tool.execute({ identifier: "instagram", fields: ["username", "followerCount"] });
    assert.ok(result.username);
    assert.ok("followerCount" in result);
    assert.ok(!("fullName" in result), "fullName should be excluded when not in fields");
  });
});
