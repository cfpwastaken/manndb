// import tags from '$lib/tags.js';
import { getTags } from '$lib/redis.js';
import { json } from '@sveltejs/kit';

export async function GET({}) {
	// return json(tags);
	return json(await getTags());
}