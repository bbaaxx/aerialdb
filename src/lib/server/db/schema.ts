import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Auth tables
export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: text('role', { enum: ['user', 'admin'] })
		.notNull()
		.default('user')
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

// Categories table (database-driven, admin can add new categories)
export const categories = sqliteTable('categories', {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

// Moves table
export const moves = sqliteTable(
	'moves',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		categoryId: text('category_id')
			.notNull()
			.references(() => categories.id),
		description: text('description'),
		imageUrl: text('image_url'),
		videoUrl: text('video_url'),
		level: text('level'), // 'beginner' | 'intermediate' | 'advanced' | 'professional' | null
		contributorName: text('contributor_name'), // Original creator/popularizer of the move
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id), // User who added it to the platform
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
	},
	(table) => [
		// Performance: Optimize ORDER BY name (used in all listing queries)
		// Note: LIKE '%...%' patterns cannot use B-tree indexes; full-text search needs FTS5
		index('moves_name_idx').on(table.name),
		// Performance: Optimize JOIN with categories and WHERE category_id = ? filtering
		index('moves_category_id_idx').on(table.categoryId),
		// Performance: Optimize WHERE level = ? filtering (used in FilterChips)
		index('moves_level_idx').on(table.level),
		// Performance: Optimize ORDER BY created_at DESC for featured move query
		index('moves_created_at_idx').on(table.createdAt)
	]
);

// Type exports
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Move = typeof moves.$inferSelect;
