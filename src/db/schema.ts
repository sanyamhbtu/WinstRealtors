import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Properties table
export const properties = sqliteTable('properties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  location: text('location').notNull(),
  price: text('price').notNull(),
  image: text('image').notNull(),
  images: text('images', { mode: 'json' }).$type<string[]>().default([]),
  bedrooms: integer('bedrooms').notNull().default(0),
  bathrooms: integer('bathrooms').notNull().default(0),
  area: text('area').notNull(),
  type: text('type').notNull(),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  category: text('category').notNull(),
  description: text('description'),
  status: text('status').notNull().default('Active'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Blog posts table
export const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  image: text('image').notNull(),
  author: text('author').notNull(),
  date: text('date').notNull(),
  readTime: text('read_time').notNull(),
  category: text('category').notNull(),
  published: integer('published', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Testimonials table
export const testimonials = sqliteTable('testimonials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  role: text('role').notNull(),
  image: text('image').notNull(),
  content: text('content').notNull(),
  rating: integer('rating').default(5),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Partners table
export const partners = sqliteTable('partners', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  logo: text('logo').notNull(),
  website: text('website'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Bookings table
export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  propertyType: text('property_type'),
  budget: text('budget'),
  location: text('location'),
  message: text('message'),
  status: text('status').notNull().default('Pending'),
  notes: text('notes'),
  googleCalendarEventId: text('google_calendar_event_id'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Contacts table
export const contacts = sqliteTable('contacts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('Unread'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// FAQs table
export const faqs = sqliteTable('faqs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category').notNull(),
  orderIndex: integer('order_index').default(0),
  published: integer('published', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Gallery items table
export const galleryItems = sqliteTable('gallery_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  image: text('image').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  orderIndex: integer('order_index').default(0),
  published: integer('published', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Homepage stats table
export const homepageStats = sqliteTable('homepage_stats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  label: text('label').notNull(),
  value: text('value').notNull(),
  icon: text('icon').notNull(), // Icon name to map in frontend
  orderIndex: integer('order_index').default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Admin emails table
export const adminEmails = sqliteTable('admin_emails', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  addedBy: text('added_by').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});


// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});