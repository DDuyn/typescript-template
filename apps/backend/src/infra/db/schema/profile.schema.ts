import { users } from "@core/auth/auth.schema";
import { boolean, pgTable, uuid } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  user_id: uuid("user_id")
    .primaryKey()
    .references(() => users.id),
  isAdmin: boolean("is_admin").notNull().default(false),
});
