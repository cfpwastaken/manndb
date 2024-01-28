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