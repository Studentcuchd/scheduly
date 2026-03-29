import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not set. Configure it in environment variables.");
}

if (process.env.NODE_ENV === "production" && /localhost|127\.0\.0\.1/.test(databaseUrl)) {
	throw new Error("Invalid production DATABASE_URL: localhost is not allowed in production.");
}

export const prisma = new PrismaClient({
	datasources: {
		db: {
			url: databaseUrl,
		},
	},
});
