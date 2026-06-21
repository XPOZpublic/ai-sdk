import { tool } from "ai";
import { z } from "zod";
import { createLazyClient, type XpozToolOptions } from "../client.js";
import { AccountDetailsSchema } from "../schemas/index.js";

export const xpozAccountDetails = (options: XpozToolOptions = {}) => {
  const getClient = createLazyClient(options);

  return tool({
    description:
      "Get Xpoz account details including current plan, credit usage, billing info, and tracked item limits.",
    inputSchema: z.object({}),
    execute: async () => {
      const client = await getClient();
      return await client.account.getAccountDetails();
    },
  });
};
