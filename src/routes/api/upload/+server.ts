import { autoTags, getTitle, titleToSlug } from "$lib/mdutils";
import { addMan, redis } from "$lib/redis";
import { json } from "@sveltejs/kit";
import type { User } from "../login/+server";

export async function POST({ request }: { request: Request }) {
	let { text, session, keyword, tags, private: privatePost } = await request.json();
	if(!session) {
		return json({ error: "Keine Session angegeben!" });
	} else if(!keyword) {
		return json({ error: "Bitte gib ein Keyword an!" });
	} else if(!tags || tags.length === 0) {
		return json({ error: "Bitte gib mindestens einen Tag an!" });
	}

	const dbsession = await redis.get("session:" + session);
	if(!dbsession) {
		return json({ error: "Session ist nicht gültig!", action: "logout" });
	}
	const sessionUser = await redis.json.get("user:" + dbsession) as unknown as User;
	if(!sessionUser) {
		return json({ error: "Session ist nicht gültig!", action: "logout" });
	}
	const author = sessionUser.name;

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
private: ${privatePost}
---

`;
	text = frontmatter + text;
	const slug = titleToSlug(title);
	if(await redis.exists("man:" + slug)) {
		return json({ error: "Slug ist bereits vergeben!" });
	}
	await addMan(slug, {
		title,
		date,
		author,
		content: text,
		tags,
		keyword,
		private: privatePost
	})

	return json({ slug });
}