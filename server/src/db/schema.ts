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
  createdAt: timestamp("created_at", {
    precision: 6,
    withTimezone: true,
  }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
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
    createdAt: timestamp("created_at", {
      precision: 6,
      withTimezone: true,
    }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
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
    createdAt: timestamp("created_at", {
      precision: 6,
      withTimezone: true,
    }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
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
    createdAt: timestamp("created_at", {
      precision: 6,
      withTimezone: true,
    }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
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

export const client = pgTable(
  "client",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    address: text(),
    phoneNumber: text("phone_number").notNull(),
    lateCancelCount: integer("late_cancel_count").notNull().default(0),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "no action" }),
    clinicId: integer("clinic_id")
      .notNull()
      .references(() => clinic.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("client_id_idx").on(table.id),
    index("client_clinic_idx").on(table.clinicId),
  ],
);

export const clinic = pgTable(
  "clinic",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    slug: text().notNull().unique(),
    email: text().notNull().unique(),
    phoneNumber: text("phone_number").notNull(),
    address: text().notNull(),
    timezone: text().notNull(),
    minAdvanceHours: integer("min_advance_hours").notNull(),
    maxAdvanceDays: integer("max_advance_days").notNull(),
    cancellationHours: integer("cancellation_hours").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
    adminId: text("admin_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("clinic_slug_idx").on(table.slug),
    index("clinic_id_idx").on(table.id),
  ],
);

export const practitioner = pgTable(
  "practitioner",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    bio: text().notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
    clinicId: integer("clinic_id")
      .notNull()
      .references(() => clinic.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("practitioner_id_idx").on(table.id),
    index("practitioner_clinic_idx").on(table.clinicId),
  ],
);

export const treatment = pgTable(
  "treatment",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    description: text(),
    duration: integer().notNull(),
    buffer: integer().notNull(),
    priceCents: integer("price_cents").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
    clinicId: integer("clinic_id")
      .notNull()
      .references(() => clinic.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("treatment_id_idx").on(table.id),
    index("treatment_clinic_idx").on(table.clinicId),
  ],
);

export const practitionerTreatment = pgTable(
  "practitionerTreatment",
  {
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
    practitionerId: integer("practitioner_id")
      .notNull()
      .references(() => practitioner.id, { onDelete: "cascade" }),
    treatmentId: integer("treatment_id")
      .notNull()
      .references(() => treatment.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.practitionerId, table.treatmentId] }),
    index("treatment_practitioner_idx").on(table.practitionerId),
    index("practitioner_treatment_idx").on(table.treatmentId),
  ],
);

export const room = pgTable("room", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull()
    .defaultNow(),
  clinicId: integer("clinic_id")
    .notNull()
    .references(() => clinic.id, { onDelete: "cascade" }),
});

export const roomTreatment = pgTable(
  "roomTreatment",
  {
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
    roomId: integer("room_id")
      .notNull()
      .references(() => room.id, { onDelete: "cascade" }),
    treatmentId: integer("treatment_id")
      .notNull()
      .references(() => treatment.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.roomId, table.treatmentId] })],
);

export const dowEnum = pgEnum("day_of_week", [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
]);

export const availability = pgTable(
  "availability",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    dayOfWeek: dowEnum(),
    startTime: time("start_time", {
      precision: 6,
      withTimezone: true,
    }).notNull(),
    endTime: time("end_time", { precision: 6, withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
    practitionerId: integer("practitioner_id")
      .notNull()
      .references(() => practitioner.id, { onDelete: "cascade" }),
  },
  (table) => [index("availability_practitioner_idx").on(table.practitionerId)],
);

export const unavailability = pgTable(
  "unavailability",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    dayOfWeek: dowEnum(),
    startTime: time("start_time", {
      precision: 6,
      withTimezone: true,
    }).notNull(),
    endTime: time("end_time", { precision: 6, withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
    practitionerId: integer("practitioner_id")
      .notNull()
      .references(() => practitioner.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("unavailability_practitioner_idx").on(table.practitionerId),
  ],
);

export const statusEnum = pgEnum("status", [
  "confirmed",
  "cancelled",
  "no-show",
  "completed",
  "late-cancel",
]);

export const appointment = pgTable(
  "appointment",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    date: date().notNull(),
    startTime: time("start_time", {
      precision: 6,
      withTimezone: true,
    }).notNull(),
    endTime: time("end_time", { precision: 6, withTimezone: true }).notNull(),
    bufferEndTime: time("buffer_end_time", {
      precision: 6,
      withTimezone: true,
    }).notNull(),
    status: statusEnum(),
    notes: text(),
    priceCents: integer("price_cents").notNull(),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
    clinicId: integer("clinic_id")
      .notNull()
      .references(() => clinic.id, { onDelete: "no action" }),
    clientId: integer("client_id")
      .notNull()
      .references(() => client.id, { onDelete: "no action" }),
    practitionerId: integer("practitioner_id")
      .notNull()
      .references(() => practitioner.id, { onDelete: "no action" }),
    treatmentId: integer("treatment_id")
      .notNull()
      .references(() => treatment.id, { onDelete: "no action" }),
    roomId: integer("room_id")
      .notNull()
      .references(() => room.id, { onDelete: "no action" }),
  },
  (table) => [
    index("appointment_clinic_idx").on(table.clinicId),
    index("appointment_client_idx").on(table.clientId),
    index("appointment_practitioner_idx").on(table.practitionerId),
    index("appointment_room_idx").on(table.roomId),
  ],
);
