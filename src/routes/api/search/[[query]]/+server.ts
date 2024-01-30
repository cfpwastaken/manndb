import { INDEXES, searchIndex } from "$lib/redis";
import { json } from "@sveltejs/kit";

export async function GET({ params }: { params: { query: string } }) {
	if(!params.query) {
		params.query = "*";
	}
	try {
		const results = await searchIndex(INDEXES.MANS, params.query);
		return json(results);
	} catch(e) {
		return json({total: 0, documents: []})
	}
}