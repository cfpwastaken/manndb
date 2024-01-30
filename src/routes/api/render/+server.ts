import { json } from "@sveltejs/kit";
import { compile } from "mdsvex";

export async function POST({ request }: { request: Request }) {
	let { md } = await request.json();
	let html = await compile(md);
	if(!html) return json({ error: "Could not compile markdown!" });
	html.code = html.code.replace(/>{@html `<code class="language-/g, '><code class="language-')
			.replace(/<\/code>`}<\/pre>/g, '</code></pre>');
	return json({ html: html?.code });
}