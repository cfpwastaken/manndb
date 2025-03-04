<script>
    import { goto } from '$app/navigation';
	import Chip from '$lib/Chip.svelte';
    import { DownloadIcon, ShareIcon, Trash2Icon } from 'lucide-svelte';
	import { onMount } from 'svelte';

	
	/**
	 * @typedef {Object} Props
	 * @property {import('./$types').PageData} data
	 */

	/** @type {Props} */
	let { data } = $props();

	let man = $state({
		title: data.slug,
		date: new Date().toLocaleDateString("de-de"),
		author: "cfp",
		content: `# Loading`,
		html: `<h1>Loading...</h1>`,
		slug: data.slug,
		tags: []
	});

	function authorize() {
		const session = localStorage.getItem("mdbsession");
		if(!session) return "";
		return session;
	}

	onMount(async () => {
		const result = await fetch(`/api/man/${data.slug}`, {
			headers: {
				"Authorization": authorize()
			}
		}).then(res => res.json());
		if(!result) {
			man = {
				title: "404",
				date: new Date().toLocaleDateString("de-de"),
				author: "MannDB",
				content: ``,
				html: `<h1>404</h1><span>Diesen Man gibt es nicht.</span>`,
				slug: "404",
				tags: []
			}
			return;
		}
		man = { ...man, ...result };
		const html = await fetch(`/api/render`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				md: man.content
			})
		}).then(res => res.json());
		if(html.html) {
			man.html = html.html;
			man = man;
		} else {
			man.html = `<h1>Failed to render markdown</h1><br><pre>${man.content}</pre>`;
			man = man;
		}
	});
</script>

<!-- SEO -->
<svelte:head>
	<title>{man.title}</title>
	<!-- <meta property="og:type" content="article" /> -->
	<!-- <meta property="og:title" content={data.title} /> -->
	<!-- <meta property="og:published_time" content="{data.date}" /> -->
	<!-- <meta property="og:author" content="{data.author}" /> -->
</svelte:head>

<article>
	<div class="info">
		<h1>{man.title}</h1>
		<div class="categories">
			{#if man.tags}
				{#each man.tags as cat}
					<Chip>
						<a href="/tag/{cat}">{cat}</a>
					</Chip>
				{/each}
			{/if}
		</div>

		<p>
			{man.date}
			&middot;
			{man.author}
		</p>

		<div style="display: flex; gap: 10px;">
			<button onclick={() => {
				if(navigator.share) {
					navigator.share({
						title: man.title,
						url: location.href
					})
				} else {
					navigator.clipboard.writeText(location.href);
					alert("Your browser doesn't support sharing, so we put the link in your clipboard instead.");
				}
			}} aria-label="Share">
				<ShareIcon size="40px" />
			</button>
			<button onclick={() => {
					// Remove frontmatter from markdown
					const md = man.content.replace(/---\n[\s\S]*?\n---\n\n/, "");
					const blob = new Blob([md], { type: 'text/plain' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = man.slug + ".md";
					a.click();
				}} aria-label="Download">
				<DownloadIcon size="40px" />
			</button>
			<button onclick={async () => {
					if(authorize() === "") {
						goto("/login?then=" + encodeURI(location.pathname) + "&showThen=" + encodeURI(man.title));
						return;
					}
					// Confirm
					if(!confirm("Dies wird den Man permanent und unwiderruflich löschen. Bist du dir sicher?")) return;
					
					const res = await fetch("/api/delete", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": authorize()
						},
						body: JSON.stringify({slug: man.slug})
					}).then(res => res.json());
					if(res.error) {
						alert("Fehler: " + res.error);
						return;
					}
					alert("*poof*");
					location.href = "/";
				}} aria-label="Delete">
				<Trash2Icon size="40px" />
			</button>
		</div>
	</div>

	<div class="content container">
		<!-- <svelte:component this={data.content} /> -->
		{@html man.html}
	</div>
</article>

<style>
	.categories {
		display: flex;
		gap: 5px;
		view-transition-name: categories;
	}

	.info {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.info h1 {
		font-size: 3rem;
		margin: 5px;
		view-transition-name: title;
		text-align: center;
	}

	.info .desc {
		font-size: 1.5rem;
		margin: 5px;
		view-transition-name: description;
		text-align: center;
	}

	.content {
		/* margin: 15px; */
		font-size: 1.4rem;
	}
</style>