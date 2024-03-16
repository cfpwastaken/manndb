import { deleteMan, redis } from "$lib/redis";
import { json } from "@sveltejs/kit";
import { hash } from "argon2";

export async function POST({ request }: { request: Request }) {
	let { hashcode, password } = await request.json();
	if(!hashcode || !password) return json({ error: "Invalid request." }, { status: 400 });
	let validCode = await redis.exists(`hashcode:${hashcode}`);
	if(!validCode) return json({ error: "Falscher hashcode." }, { status: 400 });

	const passhash = await hash(password);

	return json({ hash: passhash });
}