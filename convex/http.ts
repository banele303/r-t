import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/payfast-itn",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const formData = await request.formData();
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Handle PayFast ITN notification
    await ctx.runMutation(api.payfastItn.handleITN, {
      m_payment_id: data.m_payment_id,
      pf_payment_id: data.pf_payment_id,
      payment_status: data.payment_status,
    });

    return new Response(null, { status: 200 });
  }),
});

export default http;
