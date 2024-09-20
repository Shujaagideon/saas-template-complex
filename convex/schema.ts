import { defineSchema } from "convex/server";
import { auth } from "./schemas/auth";
import { payments } from "./schemas/payments";
import { organisation } from "./schemas/organisation";
import { sysAdmin } from "./schemas/sysAdmin";

export default defineSchema({
  ...payments,
  ...auth,
  ...organisation,
  ...sysAdmin
});