import { autoTags, getTitle, titleToSlug } from "$lib/mdutils";
import { addMan } from "$lib/redis";
import { json } from "@sveltejs/kit";

export async function POST({ request }: { request: Request }) {
	let { text, author, keyword, tags } = await request.json();
	if(!author) {
		return json({ error: "Bitte gib einen Author an!" });
	} else if(!keyword) {
		return json({ error: "Bitte gib ein Keyword an!" });
	} else if(!tags || tags.length === 0) {
		return json({ error: "Bitte gib mindestens einen Tag an!" });
	}
	// Remove any frontmatter, if present
	text = text.replace(/---\n[\s\S]*?\n---\n\n/, "");
	// Add new frontmatter
	const title = getTitle(text);
	const date = new Date().toLocaleDateString("de-DE");
	// const tags = await autoTags(title);
	const frontmatter = `---
title: ${title}
date: ${date}
author: ${author}
tags:
${tags.map((tag: string) => `  - ${tag}`).join("\n")}
keyword: ${keyword}
---

`;
	text = frontmatter + text;
	const slug = titleToSlug(title);
	await addMan(slug, {
		title,
		date,
		author,
		content: text,
		tags,
		keyword
	})

	return json({ slug });
}