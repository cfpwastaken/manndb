import { INDEXES, redis, searchIndex } from "$lib/redis";
import { json } from "@sveltejs/kit";

export async function GET({ params }: { params: { slug: string } }) {
	const content = await redis.json.get("man:" + params.slug);
	return json(content);
}