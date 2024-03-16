import { redis } from "$lib/redis";
import { json } from "@sveltejs/kit";
import { verify } from "argon2";
import { randomBytes } from "crypto";

export interface User {
	username: string;
	password: string;
	name: string;
}

export async function POST({ request }: { request: Request }) {
	let { username, password } = await request.json();
	if(!username || !password) return json({ error: "Invalid username or password" });

	// get the user
	const user = await redis.json.get(`user:${username}`) as unknown as User;

	if(!user) return json({ error: "Invalid username or password" });

	// check if the password is correct
	const valid = await verify(user.password, password);

	if(!valid) return json({ error: "Invalid username or password" });

	// create a session
	const session = randomBytes(16).toString("hex");

	// save the session
	await redis.set(`session:${session}`, username);
	
	// expire the session in 1 hour
	await redis.expire(`session:${session}`, 3600);

	// return the session
	return json({ session });
}