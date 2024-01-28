import { SchemaFieldTypes, createClient } from "redis";

export const redis = createClient();
// @ts-ignore
redis.on("error", (err) => console.log);
redis.connect();

/**
 * @param {string} slug
 * @param {any} content
 */
export async function addMan(slug, content) {
	await redis.json.set(`man:${slug}`, "$", {
		slug,
		...content
	});
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
			}

			// AI: the difference between TAG and TEXT is that TAG is case-sensitive
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
	console.log(index, query);
	const results = await redis.ft.search(index, query)
	return results;
}

await createIndex();