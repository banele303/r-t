import { query } from "./_generated/server";
import { auth } from "./auth";

export const getStatus = query({
  args: {},
  handler: async (ctx) => {
    let userId = null;
    let authError = null;
    try {
      userId = await auth.getUserId(ctx);
    } catch (e: any) {
      authError = e.message;
    }

    return {
      userId,
      authError,
      env: {
        hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
        hasGoogleSecret: !!process.env.AUTH_GOOGLE_SECRET,
        hasJwtKey: !!process.env.JWT_PRIVATE_KEY,
        hasJwks: !!process.env.JWKS,
        nodeEnv: process.env.NODE_ENV,
        convexDeployment: process.env.CONVEX_DEPLOYMENT,
      },
      time: new Date().toISOString(),
    };
  },
});
