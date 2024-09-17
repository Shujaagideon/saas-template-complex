// convex/schema.ts

import { defineSchema } from "convex/server";
import { auth } from "./schemas/auth";
import { payments } from "./schemas/payments";
import { bizz } from "./schemas/business";
import { sysAdmin } from "./schemas/sysAdmin";

export default defineSchema({
  ...payments,
  ...auth,
  ...bizz,
  ...sysAdmin
});