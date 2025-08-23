import { boolean, pgTable, uuid } from "drizzle-orm/pg-core";
import { users } from "features/auth/infra/schemas/supabase-auth.schema";

export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id),
  isAdmin: boolean("is_admin").notNull().default(false),
});
