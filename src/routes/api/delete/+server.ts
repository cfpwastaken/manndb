import { deleteMan } from "$lib/redis";
import { json } from "@sveltejs/kit";

export async function POST({ request }: { request: Request }) {
	let { slug } = await request.json();
	await deleteMan(slug);
	return json({ slug });
}