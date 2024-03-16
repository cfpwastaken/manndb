<script>
	import { browser } from '$app/environment';
	import Chip from '$lib/Chip.svelte';
	import PostPreview from '$lib/PostPreview.svelte';
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	/**
	 * @type {import('$lib/types').TagInfo}
	 */
	let tag = {
		name: data.slug,
		slug: data.slug,
		description: "Loading...",
		keywords: []
	};
	let edit = false;

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
					<button on:click={() => {
						location.href = `/search/?query=${encodeURI(`@tags:{${tag.slug}}`)}`;
					}}>
						<svg width="40px" height="40px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="#ffffff"/></svg>
					</button>
					<button on:click={() => {
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
									keywords
								})
							});
						}
						edit = !edit;
					}}>
						{#if edit}
							<svg width="40px" height="40px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.75 3h-1A2.75 2.75 0 0 0 3 5.75v12.5A2.75 2.75 0 0 0 5.75 21H6v-6a2.25 2.25 0 0 1 2.25-2.25h7.353l1.788-1.788A3.28 3.28 0 0 1 19.713 10h.002c.437 0 .875.087 1.285.261V8.287a3.25 3.25 0 0 0-.952-2.299l-2.035-2.035A3.25 3.25 0 0 0 15.75 3v4.5a2.25 2.25 0 0 1-2.25 2.25H9A2.25 2.25 0 0 1 6.75 7.5V3Z" fill="#ffffff"/><path d="m14.103 14.25-2.615 2.615a3.685 3.685 0 0 0-.969 1.712l-.458 1.83c-.05.202-.07.4-.062.593H7.5v-6a.75.75 0 0 1 .75-.75h5.853ZM14.25 3v4.5a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75V3h6Z" fill="#ffffff"/><path d="M19.715 11h-.002c-.585 0-1.17.223-1.615.67l-5.902 5.902a2.684 2.684 0 0 0-.707 1.247l-.458 1.831a1.087 1.087 0 0 0 1.319 1.318l1.83-.457a2.684 2.684 0 0 0 1.248-.707l5.902-5.902A2.285 2.285 0 0 0 19.715 11Z" fill="#ffffff"/></svg>
						{:else}
							<svg width="40px" height="40px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z" fill="#ffffff"/></svg>
						{/if}
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

	[contenteditable="true"] {
		border: 1px solid white;
		padding: 5px;
		border-radius: 5px;
		background-color: #1d1d1d;
	}
</style>