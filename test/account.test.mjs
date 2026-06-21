import { describe, it } from "node:test";
import assert from "node:assert";
import { xpozAccountDetails } from "../dist/index.js";

describe("Account", () => {
  it("should call getAccountDetails without error", async () => {
    const tool = xpozAccountDetails();
    const result = await tool.execute({});
    assert.ok(result === undefined || typeof result === "object");
  });
});
