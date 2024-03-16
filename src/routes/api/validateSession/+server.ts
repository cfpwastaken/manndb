import { redis } from "$lib/redis";
import { json } from "@sveltejs/kit";

export async function GET({ request }: { request: Request }) {
	const session = request.headers.get("Authorization") || "";
	if(session) {
		const dbsession = await redis.get(`session:${session}`);
		if(dbsession) {
			return json({ valid: true });
		}
	}
	return json({ valid: false });
}