import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  integer,
  primaryKey,
  pgEnum,
  time,
  date,
} from "drizzle-orm/pg-core";

// AUTH SCHEMA

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  role: text("role", { enum: ["user", "admin"] })
    .default("user")
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// APP SCHEMA

export const clinic = pgTable("clinic", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  email: text().notNull().unique(),
  phoneNumber: text().notNull(),
  address: text().notNull(),
  timezone: text().notNull(),
  minAdvanceHours: integer().notNull(),
  maxAdvanceDays: integer().notNull(),
  cancellationHours: integer().notNull(),
  isActive: boolean().notNull().default(true),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
  adminId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const practitioner = pgTable("practitioner", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  bio: text().notNull(),
  isActive: boolean().notNull().default(true),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
  clinicId: integer()
    .notNull()
    .references(() => clinic.id, { onDelete: "cascade" }),
});

export const treatment = pgTable("treatment", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  description: text(),
  duration: integer().notNull(),
  buffer: integer().notNull(),
  priceCents: integer().notNull(),
  isActive: boolean().notNull().default(true),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
  clinicId: integer()
    .notNull()
    .references(() => clinic.id, { onDelete: "cascade" }),
});

export const practitionerTreatment = pgTable(
  "practitionerTreatment",
  {
    createdAt: timestamp().notNull(),
    updatedAt: timestamp()
      .$onUpdate(() => new Date())
      .notNull(),
    practitionerId: integer()
      .notNull()
      .references(() => practitioner.id, { onDelete: "cascade" }),
    treatmentId: integer()
      .notNull()
      .references(() => treatment.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.practitionerId, table.treatmentId] }),
  ],
);

export const room = pgTable("room", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  isActive: boolean().notNull().default(true),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
  clinicId: integer()
    .notNull()
    .references(() => clinic.id, { onDelete: "cascade" }),
});

export const roomTreatment = pgTable(
  "roomTreatment",
  {
    createdAt: timestamp().notNull(),
    updatedAt: timestamp()
      .$onUpdate(() => new Date())
      .notNull(),
    roomId: integer()
      .notNull()
      .references(() => room.id, { onDelete: "cascade" }),
    treatmentId: integer()
      .notNull()
      .references(() => treatment.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.roomId, table.treatmentId] })],
);

export const dowEnum = pgEnum("dayOfWeek", ["1", "2", "3", "4", "5", "6", "7"]);

export const availability = pgTable("availability", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  dayOfWeek: dowEnum(),
  startTime: time({ withTimezone: true }).notNull(),
  endTime: time({ withTimezone: true }).notNull(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
  practitionerId: integer()
    .notNull()
    .references(() => practitioner.id, { onDelete: "cascade" }),
});

export const unavailability = pgTable("unavailability", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  dayOfWeek: dowEnum(),
  startTime: time({ withTimezone: true }).notNull(),
  endTime: time({ withTimezone: true }).notNull(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
  practitionerId: integer()
    .notNull()
    .references(() => practitioner.id, { onDelete: "cascade" }),
});

export const statusEnum = pgEnum("status", [
  "confirmed",
  "cancelled",
  "no-show",
  "completed",
  "late-cancel",
]);

export const appointment = pgTable("appointment", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  date: date().notNull(),
  startTime: time({ withTimezone: true }).notNull(),
  endTime: time({ withTimezone: true }).notNull(),
  bufferEndTime: time({ withTimezone: true }).notNull(),
  status: statusEnum(),
  notes: text(),
  priceCents: integer().notNull(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
  clinicId: integer()
    .notNull()
    .references(() => clinic.id, { onDelete: "no action" }),
  clientId: text()
    .notNull()
    .references(() => user.id, { onDelete: "no action" }),
  practitionerId: integer()
    .notNull()
    .references(() => practitioner.id, { onDelete: "no action" }),
  treatmentId: integer()
    .notNull()
    .references(() => treatment.id, { onDelete: "no action" }),
  roomId: integer()
    .notNull()
    .references(() => room.id, { onDelete: "no action" }),
});
