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
