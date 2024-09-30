import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';


export const userSystemEnum = pgEnum('role',['user','system'])

export const chatTable = pgTable('chat_table', {
  id: serial('id').primaryKey(),
  pdfName: text('pdf_name').notNull(),
  pdfUrl:text('pdf_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userID: varchar('user_id',{length:256}).notNull(),
  fileKey: text('file_key').notNull()
});

export const messages = pgTable('message_table', {
  id: serial('id').primaryKey(),
  chatID: integer('chat_id')
  .notNull()
  .references(() => chatTable.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  role: userSystemEnum('role').notNull()
});

// export type InsertUser = typeof usersTable.$inferInsert;
// export type SelectUser = typeof usersTable.$inferSelect;

// export type InsertPost = typeof postsTable.$inferInsert;
// export type SelectPost = typeof postsTable.$inferSelect;