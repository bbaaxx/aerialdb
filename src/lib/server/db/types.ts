export type MoveWithCategoryRaw = {
	id: string;
	name: string;
	description: string | null;
	imageUrl: string | null;
	videoUrl: string | null;
	level: string | null;
	contributorName: string | null;
	categoryId: string;
	categoryName: string;
};

/**
 * Lean representation of a move for listing pages (Home, Search).
 * Optimized to exclude large text fields (description) and non-critical metadata.
 */
export type LeanMoveRaw = {
	id: string;
	name: string;
	imageUrl: string | null;
	level: string | null;
	categoryId: string;
};

export type LeanMove = {
	id: string;
	name: string;
	imageUrl: string | null;
	level: string | null;
	category: {
		id: string;
		name: string;
	};
};

export type MoveWithCategoryRawFull = MoveWithCategoryRaw & {
	createdAt: Date | null;
	updatedAt: Date | null;
};

export type SessionWithUser = {
	user: { id: string; username: string };
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
	};
};
