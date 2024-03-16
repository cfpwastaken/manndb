import { INDEXES, redis, searchIndex } from "$lib/redis";
import { json } from "@sveltejs/kit";

export async function GET({ request, params }: { request: Request, params: { query: string } }) {
	if(!params.query) {
		params.query = "*";
	}
	const session = request.headers.get("Authorization") || "";
	let showPrivate = false;
	
	if(session) {
		const dbsession = await redis.get(`session:${session}`);
		if(dbsession) {
			showPrivate = true;
		}
	}

	try {
		const results = await searchIndex(INDEXES.MANS, params.query);
		if(!showPrivate) {
			results.documents = results.documents.filter((doc: any) => !doc.value.private);
		}
		return json(results);
	} catch(e) {
		return json({total: 0, documents: []})
	}
}