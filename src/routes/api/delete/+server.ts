import { deleteMan, redis } from "$lib/redis";
import { json } from "@sveltejs/kit";
import type { User } from "../login/+server";
import type { Post } from "$lib/types";

export async function POST({ request }: { request: Request }) {
	let { slug } = await request.json();
	const session = request.headers.get("Authorization");
	if(!session) {
		return json({ error: "Keine Session" });
	}
	const dbsession = await redis.get("session:" + session);
	if(!dbsession) {
		return json({ error: "Session ist nicht gültig!", action: "logout" });
	}
	const sessionUser = await redis.json.get("user:" + dbsession) as unknown as User;
	if(!sessionUser) {
		return json({ error: "Session ist nicht gültig!", action: "logout" });
	}
	const author = sessionUser.name;

	const man = await redis.json.get(`man:${slug}`) as unknown as Post;

	if(man.author !== author) {
		return json({ error: "Du bist nicht der Autor dieses Posts!" });
	}

	await deleteMan(slug);
	return json({ slug });
}