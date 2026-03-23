import { sqliteTable, text, integer, index, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(),
}, (table) => [
  index("idx_sessions_user_id").on(table.userId),
]);

export const userProfiles = sqliteTable("user_profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  beliefs: text("beliefs", { mode: "json" }),
  obstacles: text("obstacles", { mode: "json" }),
  focusGoals: text("focus_goals", { mode: "json" }),
  skills: text("skills", { mode: "json" }),
  workValues: text("work_values", { mode: "json" }),
  brandStatement: text("brand_statement"),
  brandDiscovery: text("brand_discovery", { mode: "json" }),
  powerStatement: text("power_statement"),
  masterApp: text("master_app", { mode: "json" }),
  references: text("references", { mode: "json" }),
  networkContacts: text("network_contacts", { mode: "json" }),
  socialAudit: text("social_audit", { mode: "json" }),
  selfEvaluation: text("self_evaluation", { mode: "json" }),
  jobSearchChecklist: text("job_search_checklist", { mode: "json" }),
  emailTemplate: text("email_template"),
  voicemailScript: text("voicemail_script"),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const applications = sqliteTable("applications", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  masterApplication: text("master_application", { mode: "json" }),
  assessmentNotes: text("assessment_notes", { mode: "json" }),
  portfolioChecklist: text("portfolio_checklist", { mode: "json" }),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const resumes = sqliteTable("resumes", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  template: text("template").notNull(),
  content: text("content", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
}, (table) => [
  index("idx_resumes_user_id").on(table.userId),
]);

export const coverLetters = sqliteTable("cover_letters", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  resumeId: text("resume_id").references(() => resumes.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  content: text("content", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
}, (table) => [
  index("idx_cover_letters_user_id").on(table.userId),
  index("idx_cover_letters_resume_id").on(table.resumeId),
]);

export const interviewPrep = sqliteTable("interview_prep", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  commonResponses: text("common_responses", { mode: "json" }),
  starStories: text("star_stories", { mode: "json" }),
  companyResearch: text("company_research", { mode: "json" }),
  thankYouNotes: text("thank_you_notes", { mode: "json" }),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const jobSearch = sqliteTable("job_search", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  networkContacts: text("network_contacts", { mode: "json" }),
  targetCompanies: text("target_companies", { mode: "json" }),
  searchChecklist: text("search_checklist", { mode: "json" }),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const socialMediaAudit = sqliteTable("social_media_audit", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  auditResults: text("audit_results", { mode: "json" }),
  platformProfiles: text("platform_profiles", { mode: "json" }),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const selfEvaluations = sqliteTable("self_evaluations", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  month: text("month").notNull(),
  ratings: text("ratings", { mode: "json" }),
  improvements: text("improvements", { mode: "json" }),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
}, (table) => [
  index("idx_self_evaluations_user_id").on(table.userId),
]);

export const employerContacts = sqliteTable("employer_contacts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyName: text("company_name").notNull(),
  position: text("position").notNull(),
  contactPerson: text("contact_person"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  website: text("website"),
  address: text("address"),
  dateApplied: text("date_applied"),
  status: text("status").notNull().default("applied"),
  followUpDate: text("follow_up_date"),
  notes: text("notes"),
  source: text("source"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
}, (table) => [
  index("idx_employer_contacts_user_id").on(table.userId),
  index("idx_employer_contacts_status").on(table.status),
  index("idx_employer_contacts_follow_up").on(table.followUpDate),
]);

export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").notNull(),
  date: text("date").notNull(),
  requests: integer("requests").notNull().default(0),
}, (table) => [
  primaryKey({ columns: [table.key, table.date] }),
  index("idx_rate_limits_date").on(table.date),
]);
