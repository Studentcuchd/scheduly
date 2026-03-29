import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;
const isRenderRuntime = process.env.RENDER === "true" || Boolean(process.env.RENDER_EXTERNAL_URL);

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not set. Configure it in environment variables.");
}

if ((process.env.NODE_ENV === "production" || isRenderRuntime) && /localhost|127\.0\.0\.1/.test(databaseUrl)) {
	throw new Error("Invalid deployment DATABASE_URL: localhost is not allowed on Render/production.");
}

export const prisma = new PrismaClient({
	datasources: {
		db: {
			url: databaseUrl,
		},
	},
});
