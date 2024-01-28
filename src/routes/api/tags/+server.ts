import tags from '$lib/tags.js';
import { json } from '@sveltejs/kit';

export async function GET({}) {
	return json(tags);
}