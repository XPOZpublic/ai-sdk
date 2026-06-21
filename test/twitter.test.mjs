import { describe, it, after } from "node:test";
import assert from "node:assert";
import { createLazyClient, xpozTwitterUser, xpozTwitterSearchUsers, xpozTwitterUserPosts } from "../dist/index.js";

const getClient = createLazyClient({});
const opts = { _getClient: getClient };

after(async () => {
  const client = await getClient();
  await client.close();
});

describe("Twitter", () => {
  it("should get a user by username", async () => {
    const tool = xpozTwitterUser(opts);
    const result = await tool.execute({ identifier: "elonmusk" });
    assert.ok(result.username);
    assert.strictEqual(result.username.toLowerCase(), "elonmusk");
  });

  it("should search users by name", async () => {
    const tool = xpozTwitterSearchUsers(opts);
    const result = await tool.execute({ name: "Elon Musk", limit: 3 });
    assert.ok(Array.isArray(result));
    assert.ok(result.length > 0);
    assert.ok(result[0].username);
  });

  it("should get posts by username", async () => {
    const tool = xpozTwitterUserPosts(opts);
    const result = await tool.execute({ identifier: "elonmusk", maxResults: 5 });
    assert.ok(result.data);
    assert.ok(result.data.length > 0);
    const post = result.data[0];
    assert.ok(post.text);
    assert.ok(post.authorUsername);
  });

  it("should respect maxResults pagination", async () => {
    const tool = xpozTwitterUserPosts(opts);
    const result3 = await tool.execute({ identifier: "elonmusk", maxResults: 3 });
    const result5 = await tool.execute({ identifier: "elonmusk", maxResults: 5 });
    assert.ok(result3.data.length <= 3);
    assert.ok(result5.data.length <= 5);
    assert.ok(result5.data.length >= result3.data.length);
  });

  it("should filter response with fields parameter", async () => {
    const tool = xpozTwitterUser(opts);
    const result = await tool.execute({ identifier: "elonmusk", fields: ["username", "followersCount"] });
    assert.ok(result.username);
    assert.ok("followersCount" in result);
    assert.ok(!("name" in result), "name should be excluded when not in fields");
  });
});
