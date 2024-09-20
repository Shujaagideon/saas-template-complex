import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { transactionUpdate } from "./payment/paystack";
import { createInitialSysAdmin } from "./systemAdmin/sysAdmin";
import { checkOrganinsationSubdomain } from "./Organisation/organisations";

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

http.route({
  path: "/checkbizzsubdomain",
  method: "POST",
  handler: checkOrganinsationSubdomain,
});

export default http;