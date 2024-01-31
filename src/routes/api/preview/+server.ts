import { autoTags, getTitle, titleToSlug } from "$lib/mdutils";
import { json } from "@sveltejs/kit";

export async function POST({ request }: { request: Request }) {
	let { md } = await request.json();
	const title = getTitle(md);

	const tags = await autoTags(title);
	const slug = titleToSlug(title);
	return json({ tags, slug });
}