import { INDEXES, redis, searchIndex } from "$lib/redis";
import { json } from "@sveltejs/kit";

export async function GET({ request }: { request: Request }) {
	try {
		const results = await redis.exists("pinned") ? JSON.parse((await redis.get("pinned"))!) : [];
		return json(results);
	} catch(e) {
		return json([]);
	}
}