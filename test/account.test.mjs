import { describe, it, after } from "node:test";
import assert from "node:assert";
import { createLazyClient, xpozAccountDetails } from "../dist/index.js";

const getClient = createLazyClient({});
const opts = { _getClient: getClient };

after(async () => {
  const client = await getClient();
  await client.close();
});

describe("Account", () => {
  it("should call getAccountDetails without error", async () => {
    const tool = xpozAccountDetails(opts);
    const result = await tool.execute({});
    assert.ok(result === undefined || typeof result === "object");
  });
});
