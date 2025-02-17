import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const EventTable = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    durationInMinutes: integer("durationInMinutes").notNull(),
    clerkUserId: text("clerkUserId").notNull(),
    isActive: boolean("isActive").notNull().default(true),
    createdAt,
    updatedAt,
  },
  (table) => ({
    clerkUserIdIndex: index("clerkUserIdIndex").on(table.clerkUserId), //dodajemy indeks, żeby szybciej wyświetlało eventy danego użytkownika
  })
);

export const ScheduleTable = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  timezone: text("timezone").notNull(),
  clerkUserId: text("clerkUserId").notNull().unique(), //dla jednego clerkUserId może istnieć tylko jeden wiersz w tabeli
  createdAt,
  updatedAt,
});

export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER);

export const ScheduleAvailabilityTable = pgTable(
  "scheduleAvailabilities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("scheduleId")
      .notNull()
      .references(() => ScheduleTable.id, { onDelete: "cascade" }),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(),
  },
  (table) => ({
    scheduleIdIndex: index("scheduleIdIndex").on(table.scheduleId),
  })
);

// Dla tworzenia konkretnej dostępności dla konkretnej daty
// export const ScheduleAvailabilityTable = pgTable("scheduleAvailabilities", {
//     id: uuid("id").primaryKey().defaultRandom(),
//     scheduleId: uuid("scheduleId")
//       .notNull()
//       .references(() => ScheduleTable.id, { onDelete: "cascade" }),
//     date: date("date").notNull(), // <-- zamiast dayOfWeek ewentualnie date: timestamp("date", { mode: "date" }).notNull()
//     startTime: text("startTime").notNull(), ewentualnie  startTime: timestamp("startTime", { withTimezone: true }).notNull(),
//     endTime: text("endTime").notNull(), ewentualnie endTime: timestamp("endTime", { withTimezone: true }).notNull(),
//     // dayOfWeek usuwamy, bo zastępujemy go date
//   });

// RELATINONS to easily do left join or other joins

export const ScheduleRealtions = relations(ScheduleTable, ({ many }) => ({
  availabilities: many(ScheduleAvailabilityTable),
}));

export const ScheduleAvailabilityTableRelations = relations(
  ScheduleAvailabilityTable,
  ({ one }) => ({
    schedule: one(ScheduleTable, {
      fields: [ScheduleAvailabilityTable.scheduleId],
      references: [ScheduleTable.id],
    }),
  })
);
