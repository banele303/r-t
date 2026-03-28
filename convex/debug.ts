import { query } from "./_generated/server";

export const checkEnv = query({
  args: {},
  handler: async (ctx) => {
    return {
      hasId: !!process.env.AUTH_GOOGLE_ID,
      idPrefix: process.env.AUTH_GOOGLE_ID ? process.env.AUTH_GOOGLE_ID.substring(0, 10) : "missing",
    };
  },
});
