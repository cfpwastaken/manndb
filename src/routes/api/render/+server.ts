import { json } from "@sveltejs/kit";
import { compile } from "mdsvex";

export async function POST({ request }: { request: Request }) {
	let { md } = await request.json();
	let html = await compile(md);
	return json({ html: html?.code });
}