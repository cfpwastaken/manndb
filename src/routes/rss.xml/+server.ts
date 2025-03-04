import type { Post } from "$lib/types"

function removeFrontmatter(content: string) {
	const lines = content.split("\n")
	if (lines[0].startsWith("---")) {
		let i = 1
		while (!lines[i].startsWith("---")) {
			i++
		}
		return lines.slice(i + 1).join("\n")
	}
	return content
}

function toUTCDateString(dateStr: string) {
	const [day, month, year] = dateStr.split('.').map(Number);
	const date = new Date(Date.UTC(year, month - 1, day));
	return date.toISOString();
}

export async function GET({ fetch }) {
	const response = await fetch("api/search")
	const posts: { documents: { id: string, value: Post }[] } = await response.json()

	const headers = { "Content-Type": "application/xml" }

	const xml = `
		<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
			<channel>
				<title>MannDB</title>
				<description>MannDB</description>
				<link>https://manndb.picoscratch.de</link>
				<atom:link href="https://manndb.picoscratch.de/rss.xml" rel="self" type="application/rss+xml"/>
				${posts.documents
					.map(
						(post) => `
						<item>
							<title>${post.value.title}</title>
							<description><![CDATA[${removeFrontmatter(post.value.content || "")}]]></description>
							<link>https://manndb.picoscratch.de/${post.value.slug}</link>
							<guid isPermaLink="true">https://manndb.picoscratch.de/${post.value.slug}</guid>
							<pubDate>${toUTCDateString(post.value.date)}</pubDate>
						</item>
					`
					)
					.join("")}
			</channel>
		</rss>
	`.trim()

	return new Response(xml, { headers })
}
