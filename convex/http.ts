import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { transactionUpdate } from "./payment/paystack";
import { createInitialSysAdmin } from "./systemAdmin/sysAdmin";

const http = httpRouter();
auth.addHttpRoutes(http);

http.route({
  path: "/transactionUpdate",
  method: "POST",
  handler: transactionUpdate,
});

http.route({
  path: "/createInitialSysAdmin",
  method: "POST",
  handler: createInitialSysAdmin,
});

export default http;