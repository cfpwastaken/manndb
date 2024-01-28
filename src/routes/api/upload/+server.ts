import { autoTags, getTitle, titleToSlug } from "$lib/mdutils";
import { addMan } from "$lib/redis";
import tags from "$lib/tags";
import { json } from "@sveltejs/kit";

export async function POST({ request }: { request: Request }) {
	let { text, author } = await request.json();
	// Remove any frontmatter, if present
	text = text.replace(/---\n[\s\S]*?\n---\n\n/, "");
	// Add new frontmatter
	const title = getTitle(text);
	const date = new Date().toLocaleDateString("de-DE");
	const tags = autoTags(title);
	const frontmatter = `---
title: ${title}
date: ${date}
author: ${author}
tags:
${tags.map(tag => `  - ${tag}`).join("\n")}
---

`;
	text = frontmatter + text;
	const slug = titleToSlug(title);
	await addMan(slug, {
		title,
		date,
		author,
		content: text,
		tags
	})

	return json({ slug });
}