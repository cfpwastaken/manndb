// import tags from "$lib/tags";
import { getTag } from "$lib/redis";
import { json } from "@sveltejs/kit";

export async function GET({ params }: { params: { slug: string } }) {
	// return json(tags.find((tag) => tag.slug === params.slug));
	return json(await getTag(params.slug));
}