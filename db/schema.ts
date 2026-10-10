// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import {sqliteTable,integer,text,index} from 'drizzle-orm/sqlite-core';
export const analysisReservations=sqliteTable('analysis_reservations',{id:integer('id').primaryKey({autoIncrement:true}),visitorHash:text('visitor_hash').notNull(),day:text('day').notNull(),hour:text('hour').notNull(),createdAt:integer('created_at').notNull()},table=>[index('usage_day').on(table.day),index('usage_visitor_hour').on(table.visitorHash,table.hour),index('usage_expiry').on(table.createdAt)]);
