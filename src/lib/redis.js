import { building } from "$app/environment";
import { env } from "$env/dynamic/private";
import { SchemaFieldTypes, createClient } from "redis";

export const redis = createClient({
	url: env.REDIS_URL
});
// @ts-ignore
redis.on("error", (err) => console.log);
if(!building) redis.connect();

/**
 * @param {string} slug
 * @param {any} content
 */
export async function addMan(slug, content) {
	await redis.json.set(`man:${slug}`, "$", {
		slug,
		...content,
	});
}

/**
 * @param {any} slug
 */
export async function deleteMan(slug) {
	await redis.del(`man:${slug}`);
}

/**
 * @param {string} slug
 * @param {import("./types").TagInfo} tag
 */
export async function addTag(slug, tag) {
	await redis.json.set(`tags:${slug}`, "$", tag);
}

/**
 * @param {string} slug 
 */
export async function deleteTag(slug) {
	await redis.del(`tags:${slug}`);
}

export async function getTags() {
	const tags = await redis.keys("tags:*");
	const tagObjects = [];
	for(const tag of tags) {
		tagObjects.push(await redis.json.get(tag));
	}
	return tagObjects;
}

/**
 * @param {string} slug
 */
export async function getTag(slug) {
	return await redis.json.get(`tags:${slug}`);
}

async function createIndex() {
	try {
		console.log(await redis.ft.create("idx:mans", {
			"$.title": {
				type: SchemaFieldTypes.TEXT,
				SORTABLE: true
			},
			"$.content": {
				type: SchemaFieldTypes.TEXT,
				SORTABLE: "UNF"
			},
			"$.slug": {
				type: SchemaFieldTypes.TAG
			},
			"$.author": {
				type: SchemaFieldTypes.TAG
			},
			"$.tags.*": {
				type: SchemaFieldTypes.TAG,
				AS: "tags"
			},
			"$.keyword": {
				type: SchemaFieldTypes.TAG,
				AS: "keyword"
			}
		}, {
			ON: "JSON",
			PREFIX: "man:"
		}))
	} catch (error) {
		// @ts-ignore
		if(error.message === "Index already exists") return;
		console.log(error)
	}
}

export const INDEXES = {
	MANS: "idx:mans"
}

/**
 * @param {string} index
 * @param {string} query
 */
export async function searchIndex(index, query) {
	// console.log(index, query);
	const results = await redis.ft.search(index, query)
	return results;
}

if(!building) await createIndex();