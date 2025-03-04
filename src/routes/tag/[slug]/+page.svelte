<script>
	import { browser } from '$app/environment';
	import Chip from '$lib/Chip.svelte';
	import PostPreview from '$lib/PostPreview.svelte';
    import { PencilIcon, SaveIcon, SearchIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';

	
	/**
	 * @typedef {Object} Props
	 * @property {import('./$types').PageData} data
	 */

	/** @type {Props} */
	let { data } = $props();

	/**
	 * @type {import('$lib/types').TagInfo}
	 */
	let tag = $state({
		name: data.slug,
		slug: data.slug,
		description: "Loading...",
		keywords: []
	});
	let edit = $state(false);

	onMount(async () => {
		const result = await fetch(`/api/tags/${data.slug}`).then(res => res.json());
		if(!result) {
			tag = {
				name: "404",
				slug: "404",
				description: "Diesen Tag gibt es nicht.",
				keywords: ["404"]
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

	function authorize() {
		const session = localStorage.getItem("mdbsession");
		if(!session) return "";
		return session;
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
		<h1 contenteditable={edit} id="tagname" style="text-align: center;">{tag.name}</h1>

		<span contenteditable={edit} id="tagdesc" style="text-align: center;">{tag.description}</span>

		<span style="text-align: center;">Schlagwörter: 
			<span contenteditable={edit} id="tagkeywords">{tag.keywords.join(", ")}</span>
			{#if edit}
				<pre>Wichtig: keywords mit ", " (ohne ") seperieren (leerzeichen ist wichtig).</pre>
			{/if}
		</span>
	</div>

	<div class="content container">
		{#if browser}
			{#await fetch(`/api/search/@tags:{${tag.slug}}`, { headers: { "Authorization": authorize() } }).then(res => res.json())}
				<span>Loading...</span>
			{:then results}
				<p style="text-align: center;">{results.total} Ergebnisse werden angezeigt</p>
				<div style="display: flex; gap: 10px; justify-content: center;">
					<button onclick={() => {
						location.href = `/search/?query=${encodeURI(`@tags:{${tag.slug}}`)}`;
					}} aria-label="Search">
						<SearchIcon size="40px" />
					</button>
					{#if localStorage.getItem("mdbsession") != undefined}
						<button onclick={() => {
							if(edit) {
								const name = document.getElementById("tagname")?.innerText;
								const desc = document.getElementById("tagdesc")?.innerText;
								const keywordsText = document.getElementById("tagkeywords")?.innerText;
								if(!name || !desc || !keywordsText) return;
								const keywords = keywordsText.split(", ");
								fetch(`/api/tags/${tag.slug}`, {
									method: "PATCH",
									headers: {
										"Content-Type": "application/json"
									},
									body: JSON.stringify({
										name,
										description: desc,
										keywords,
										session: localStorage.getItem("mdbsession")
									})
								});
							}
							edit = !edit;
						}} aria-label="Edit">
							{#if edit}
								<SaveIcon size="40px" />								
							{:else}
								<PencilIcon size="40px" />
							{/if}
						</button>
					{/if}
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

	[contenteditable="true"] {
		border: 1px solid white;
		padding: 5px;
		border-radius: 5px;
		background-color: #1d1d1d;
	}
</style>