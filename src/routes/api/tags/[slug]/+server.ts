import { addTag, getTag, redis } from "$lib/redis";
import type { TagInfo } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { User } from "../../login/+server";

export async function GET({ params }: { params: { slug: string } }) {
	// return json(tags.find((tag) => tag.slug === params.slug));
	return json(await getTag(params.slug));
}

export async function PUT({ params, request }: { params: { slug: string }, request: Request }) {
	const data: TagInfo & {session: string} = await request.json();
	// return json(await getTag(params.slug));
	const dataSchema = ["name", "description", "keywords", "session"];
	if(!dataSchema.every((key) => Object.keys(data).includes(key))) {
		return json({ error: "Invalid data" });
	}
	if(!data.session) {
		return json({ error: "Keine Session angegeben!" });
	}
	const dbsession = await redis.get("session:" + data.session);
	if(!dbsession) {
		return json({ error: "Session ist nicht gültig!", action: "logout" });
	}
	const sessionUser = await redis.json.get("user:" + dbsession) as unknown as User;
	if(!sessionUser) {
		return json({ error: "Session ist nicht gültig!", action: "logout" });
	}

	await addTag(params.slug, {
		slug: params.slug,
		name: data.name,
		description: data.description,
		keywords: data.keywords,
	});
	return json(await getTag(params.slug));
}

export async function PATCH({ params, request }: { params: { slug: string }, request: Request }) {
	const data: TagInfo & {session: string} = await request.json();
	if(!data.session) {
		return json({ error: "Keine Session angegeben!" });
	}
	const dbsession = await redis.get("session:" + data.session);
	if(!dbsession) {
		return json({ error: "Session ist nicht gültig!", action: "logout" });
	}
	const sessionUser = await redis.json.get("user:" + dbsession) as unknown as User;
	if(!sessionUser) {
		return json({ error: "Session ist nicht gültig!", action: "logout" });
	}
	const tag = await getTag(params.slug);
	if(tag) {
		await addTag(params.slug, {
			slug: params.slug,
			name: data.name,
			description: data.description,
			keywords: data.keywords,
		});
		return json(await getTag(params.slug));
	} else {
		return json({ error: "Tag not found" });
	}
}