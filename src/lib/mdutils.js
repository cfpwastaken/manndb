import { getTags } from "./redis";

/**
 * @param {string} text
 */
export function getTitle(text) {
	let title = text.split("\n")[0].replace("#", "").trim();
	return title;
}

/**
 * @param {string} text
 */
export function removeFrontmatter(text) {
	const lines = text.split("\n");
	let i = 0;
	for (const line of lines) {
		if (line.startsWith("---")) {
			break;
		}
		i++;
	}
	return lines.slice(i).join("\n");
}

/**
 * @param {string} text
 */
export function getFrontmatterAsJSONObject(text) {
	const frontmatter = text.split("---")[1].trim();
	const lines = frontmatter.split("\n");
	/**
	 * @type {Record<string, string>}
	 */
	const json = {};
	for(const line of lines) {
		const [key, value] = line.split(":").map((str) => str.trim());
		json[key] = value;
	}
	return json;
}

/**
 * @param {string} title 
 * @returns Array of tags
 */
export async function autoTags(title) {
	// Loop through all tags and look if one of the keywords is in the title, add them to the tags array
	const autoTags = [];
	const tags = await getTags();
	for(const tag of tags) {
		// @ts-ignore
		for(const keyword of tag.keywords) {
			if(title.toLowerCase().includes(keyword)) {
				// @ts-ignore
				autoTags.push(tag.slug);
			}
		}
	}
	return [...new Map(autoTags)]; // Remove duplicates
}

/**
 * @param {string} title 
 * @returns A slug
 */
export function titleToSlug(title) {
	// OpenWRT Bridge ohne RelayD mit WDS
	// => openwrt-bridge-ohne-relayd-mit-wds
	return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}