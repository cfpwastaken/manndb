// import tags from "$lib/tags";
import { addTag, getTag } from "$lib/redis";
import type { TagInfo } from "$lib/types";
import { json } from "@sveltejs/kit";

export async function POST({ request }: { request: Request }) {
	const params: TagInfo = await request.json();
	// return json(await getTag(params.slug));
	await addTag(params.slug, {
		slug: params.slug,
		name: params.name,
		description: params.description,
		keywords: params.keywords,
	});
	return json(await getTag(params.slug));
}