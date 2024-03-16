<script>
    import { browser } from '$app/environment';
    import { page } from '$app/stores';
	import PostPreview from '$lib//PostPreview.svelte';
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	let searchQuery = $page.url.searchParams.get("query") || "";
	/**
	 * @type {any}
	 */
	let searchResults = {documents: []};

	onMount(() => {
		document.querySelector("input")?.focus();
	});

	function authorize() {
		const session = localStorage.getItem("mdbsession");
		if(!session) return "";
		return session;
	}

	$: {
		if(browser) {
			(async () => {
				searchResults = await fetch(`/api/search/${searchQuery}`, { headers: { "Authorization": authorize() } }).then(res => res.json());
			})();
		}
	}
</script>

<!-- SEO -->
<svelte:head>
	<title>Search</title>
</svelte:head>

<article>
	<div class="info">
		<h1>Search</h1>
		<pre>Suchfilter: Tags: @tags:&lbrace;openwrt&rbrace; | Schlagwörter: @keyword:&lbrace;bridge&rbrace; | In -PGP endend: *PGP</pre>
		<input type="text" placeholder="Type something..." bind:value={searchQuery} style="width: 30%;">
	</div>

	<!-- <pre>{JSON.stringify(searchResults)}</pre> -->

	<!-- <div class={`posts ${data.posts.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).length == 1 ? "center" : ""}`}>
		{#each data.posts as post}
			{#if post.title.toLowerCase().includes(searchQuery.toLowerCase())}
				<div transition:scale={{ duration: 200 }}>
					<PostPreview post={post} />
				</div>
			{/if}
		{/each}
	</div> -->
	<p style="text-align: center;">{searchResults.total} Ergebnisse werden angezeigt</p>
	<div class="posts center">
		{#each searchResults.documents as man}
			<PostPreview post={man.value} />
		{/each}
	</div>
</article>

<style>
	.info {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.info h1 {
		font-size: 3rem;
		margin: 5px;
		text-align: center;
	}

	.posts {
		display: flex;
		margin: 15px;
		gap: 15px;
		flex-wrap: wrap;
		view-transition-name: posts;
	}
	
	.posts.center {
		justify-content: center;
	}
</style>