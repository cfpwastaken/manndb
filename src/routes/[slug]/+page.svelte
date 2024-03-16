<script>
    import { goto } from '$app/navigation';
	import Chip from '$lib/Chip.svelte';
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let man = {
		title: data.slug,
		date: new Date().toLocaleDateString("de-de"),
		author: "cfp",
		content: `# Loading`,
		html: `<h1>Loading...</h1>`,
		slug: data.slug,
		tags: []
	};

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
			<button on:click={() => {
				if(navigator.share) {
					navigator.share({
						title: man.title,
						url: location.href
					})
				} else {
					navigator.clipboard.writeText(location.href);
					alert("Your browser doesn't support sharing, so we put the link in your clipboard instead.");
				}
			}}>
				<svg width="40px" height="40px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.747 4h3.464a.75.75 0 0 1 .102 1.493l-.102.007H6.747a2.25 2.25 0 0 0-2.245 2.096l-.005.154v9.5a2.25 2.25 0 0 0 2.096 2.245l.154.005h9.5a2.25 2.25 0 0 0 2.245-2.096l.005-.154v-.498a.75.75 0 0 1 1.494-.101l.006.101v.498a3.75 3.75 0 0 1-3.55 3.745l-.2.005h-9.5a3.75 3.75 0 0 1-3.745-3.55l-.005-.2v-9.5a3.75 3.75 0 0 1 3.55-3.745l.2-.005h3.464-3.464ZM14.5 6.544V3.75a.75.75 0 0 1 1.187-.61l.082.069 5.994 5.75c.28.268.306.7.077.997l-.077.085-5.994 5.752a.75.75 0 0 1-1.262-.434l-.007-.107V12.45l-.321-.006c-2.658-.008-4.93 1.083-6.865 3.301-.496.568-1.425.132-1.306-.612.827-5.14 3.6-8.045 8.19-8.559l.302-.03V3.75v2.794Z" fill="#ffffff"/></svg>
			</button>
			<button on:click={
				() => {
					// Remove frontmatter from markdown
					const md = man.content.replace(/---\n[\s\S]*?\n---\n\n/, "");
					const blob = new Blob([md], { type: 'text/plain' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = man.slug + ".md";
					a.click();
				}
			}>
				<svg width="40px" height="40px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.25 20.5h13.498a.75.75 0 0 1 .101 1.493l-.101.007H5.25a.75.75 0 0 1-.102-1.494l.102-.006h13.498H5.25Zm6.633-18.498L12 1.995a1 1 0 0 1 .993.883l.007.117v12.59l3.294-3.293a1 1 0 0 1 1.32-.083l.094.084a1 1 0 0 1 .083 1.32l-.083.094-4.997 4.996a1 1 0 0 1-1.32.084l-.094-.083-5.004-4.997a1 1 0 0 1 1.32-1.498l.094.083L11 15.58V2.995a1 1 0 0 1 .883-.993L12 1.995l-.117.007Z" fill="#ffffff"/></svg>
			</button>
			<button on:click={
				async () => {
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
				}
			}>
				<svg width="40px" height="40px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" fill="#ffffff"/></svg>
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