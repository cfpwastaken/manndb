<script>
	import { browser } from '$app/environment';
	import Chip from '$lib/Chip.svelte';
	import PostPreview from '$lib/PostPreview.svelte';
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let tag = {
		name: data.slug,
		slug: data.slug,
		description: "Loading..."
	};

	onMount(async () => {
		const result = await fetch(`/api/tags/${data.slug}`).then(res => res.json());
		if(!result) {
			tag = {
				name: "404",
				slug: "404",
				description: "Diesen Tag gibt es nicht."
			}
			return;
		}
		tag = { ...tag, ...result };
	});

	/**
     * @param {{ value: { keyword: string; } }} a
     * @param {{ value: {keyword: string; } }} b
     */
	function sortByFirstLetterInKeywordField(a, b) {
		if(a.value.keyword[0] < b.value.keyword[0]) return -1;
		if(a.value.keyword[0] > b.value.keyword[0]) return 1;
		return 0;
	}

	/**
     * @param {{ value: { keyword: string; } }[]} mans
     */
	function getAllKeywordLetters(mans) {
		/**
		 * @type {string[]}
		 */
		let letters = [];
		for(const man of mans) {
			if(!man.value.keyword) continue;
			const letter = man.value.keyword[0];
			if(!letters.includes(letter)) letters.push(letter);
		}
		return letters.sort();
	}
</script>

<!-- SEO -->
<svelte:head>
	<title>{tag.name}</title>
	<!-- <meta property="og:type" content="article" /> -->
	<!-- <meta property="og:title" content={data.title} /> -->
	<!-- <meta property="og:published_time" content="{data.date}" /> -->
	<!-- <meta property="og:author" content="{data.author}" /> -->
</svelte:head>

<article>
	<div class="info">
		<h1>{tag.name}</h1>

		<span>{tag.description}</span>
	</div>

	<div class="content container">
		{#if browser}
			{#await fetch(`/api/search/@tags:{${tag.slug}}`).then(res => res.json())}
				<span>Loading...</span>
			{:then results}
				<p style="text-align: center;">{results.total} Ergebnisse werden angezeigt</p>
				<div style="display: flex; gap: 10px; justify-content: center;">
					<button on:click={() => {
						location.href = `/search/?query=${encodeURI(`@tags:{${tag.slug}}`)}`;
					}}>
						<svg width="40px" height="40px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="#ffffff"/></svg>
					</button>
				</div>
				<!-- have each letter have its own heading, but only show the ones that actually have posts -->
				{#each getAllKeywordLetters(results.documents) as letter}
					<h2 style="text-align: center; margin: 0;">{letter}</h2>
					<div class="posts center">
						{#each results.documents.sort(sortByFirstLetterInKeywordField).filter((/** @type {{ value: { keyword: string[]; }; }} */ m) => m.value.keyword[0] == letter) as man}
							<PostPreview post={man.value} />
						{/each}
					</div>
				{/each}
			{:catch error}
				<span>{error.message}</span>
			{/await}
		{:else}
			<span>Loading...</span>
		{/if}
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