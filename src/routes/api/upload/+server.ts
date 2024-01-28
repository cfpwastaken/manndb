import { getTitle } from "$lib/mdutils";
import { addMan } from "$lib/redis";
import { json } from "@sveltejs/kit";

function titleToSlug(title: string) {
	// OpenWRT Bridge ohne RelayD mit WDS
	// => openwrt-bridge-ohne-relayd-mit-wds
	return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export async function POST({ request }: { request: Request }) {
	let { text, author } = await request.json();
	// Remove any frontmatter, if present
	text = text.replace(/---\n[\s\S]*?\n---\n\n/, "");
	// Add new frontmatter
	const title = getTitle(text);
	const date = new Date().toLocaleDateString("de-DE");
	const frontmatter = `---
title: ${title}
date: ${date}
author: ${author}
---

`;
	text = frontmatter + text;
	const slug = titleToSlug(title);
	await addMan(slug, {
		title,
		date,
		author,
		content: text
	})

	return json({ slug });
}