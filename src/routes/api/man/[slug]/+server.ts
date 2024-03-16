import { INDEXES, redis, searchIndex } from "$lib/redis";
import type { Post } from "$lib/types";
import { json } from "@sveltejs/kit";

export async function GET({ request, params }: { request: Request, params: { slug: string } }) {
	const content = await redis.json.get("man:" + params.slug) as unknown as Post;
	if(content && content.private) {
		const session = request.headers.get("Authorization") || "";
		if(session) {
			const dbsession = await redis.get(`session:${session}`);
			if(dbsession) {
				return json(content);
			}
		}
		return json(null);
	}
	return json(content);
}