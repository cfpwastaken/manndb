import { CLIENT_ID, TOKEN_URL } from "$lib/oauth";
import { redis } from "$lib/redis";
import { json } from "@sveltejs/kit";
import { randomBytes } from "crypto";

export interface User {
	username: string;
	password: string;
	name: string;
}

export async function POST({ request }: { request: Request }) {
	let { oidc_data } = await request.json();
	if(!oidc_data.code || !oidc_data.codeVerifier) return json({ error: "Invalid data" });

	const username = await getOIDCUser(oidc_data.code, oidc_data.codeVerifier, request.headers.get("Host")!);

	// get the user
	const user = await redis.json.get(`user:${username}`) as unknown as User;

	if(!user) return json({ error: "This user does not have a MannDB account!" });

	// create a session
	const session = randomBytes(16).toString("hex");

	// save the session
	await redis.set(`session:${session}`, username);
	
	// expire the session in 1 hour
	await redis.expire(`session:${session}`, 3600);

	// return the session
	return json({ session });
}

async function getOIDCUser(code: string, codeVerifier: string, origin: string) {
	const params = new URLSearchParams();
	params.append("grant_type", "authorization_code");
	params.append("code", code);
	params.append("client_id", CLIENT_ID);
	params.append("code_verifier", codeVerifier);
	params.append("redirect_uri", `${origin}/login/callback`);

	const res = await fetch(TOKEN_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: params
	}).then(res => res.json());

	const id_token = res.id_token; // This is a JWT which contains the user's identity
	const payload = JSON.parse(atob(id_token.split(".")[1]));
	return payload.preferred_username;
}
