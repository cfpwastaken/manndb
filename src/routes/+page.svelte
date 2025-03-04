<script lang="ts">
	import { browser } from "$app/environment";
	import Chip from "$lib/Chip.svelte";
	import PostPreview from "$lib/PostPreview.svelte";
	import { onMount } from "svelte";

	function authorize() {
		const session = localStorage.getItem("mdbsession");
		if(!session) return "";
		return session;
	}

	function bumpPinned(pinned: string[], documents: any[]) {
		const pinnedDocuments = documents.filter(doc => pinned.includes(doc.value.slug));
		const nonPinnedDocuments = documents.filter(doc => !pinned.includes(doc.value.slug));
		return pinnedDocuments.concat(nonPinnedDocuments);
	}

	function isPinned(document: any) {
		return pinned.includes(document.value.slug);
	}

	let pinned: string[] = [];

	onMount(async () => {
		await fetch("/api/pinned").then(res => res.json()).then(res => pinned = res);
	})
</script>

<svelte:head>
	<title>MannDB</title>
</svelte:head>

<h1 style="text-align: center;">MannDB</h1>

<h2 style="text-align: center;">Alle Tags</h2>
{#if browser}
	{#await fetch("/api/tags").then(res => res.json())}
		<span>Loading...</span>
	{:then results}
		<p style="text-align: center;">{results.length} Ergebnisse werden angezeigt</p>
		<div class="tags">
			{#each results as tag}
				<Chip>
					<a href="/tag/{tag.slug}">{tag.slug}</a>
				</Chip>
			{/each}
			<Chip>
				<a href="#" on:click={async () => {
					const slug = prompt("Slug");
					const name = prompt("Name");
					const description = prompt("Beschreibung");
					const keywordsText = prompt("Keywords (durch Komma getrennt, ohne Leerzeichen)");
					let keywords;
					if(keywordsText) keywords = keywordsText.split(",");
					if(!slug || !name || !description || !keywords) return alert("Bitte alle Felder ausfüllen");

					await fetch("/api/tags/" + slug, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							name,
							description,
							keywords
						})
					}).then(res => res.json()).then(console.log);
					location.reload();
				}}>Neuer Tag</a>
			</Chip>
		</div>
	{:catch error}
		<span>{error.message}</span>
	{/await}
{:else}
	<span>Loading...</span>
{/if}

<h2 style="text-align: center;">Alle Mans</h2>
{#if browser}
	{#await fetch("/api/search", { headers: { "Authorization": authorize() } }).then(res => res.json())}
		<span>Loading...</span>
	{:then results}
		<p style="text-align: center;">{results.total} Ergebnisse werden angezeigt</p>
		<div class="posts">
			{#each bumpPinned(pinned, results.documents) as man}
				<PostPreview post={man.value} pinned={isPinned(man)} />
			{/each}
		</div>
	{:catch error}
		<span>{error.message}</span>
	{/await}
{:else}
	<span>Loading....</span>
{/if}

<style>
	.posts {
		display: flex;
		margin: 15px;
		gap: 15px;
		flex-wrap: wrap;
		view-transition-name: posts;
	}

	.tags {
		display: flex;
		gap: 5px;
		view-transition-name: categories;
		margin: 15px;
		flex-wrap: wrap;
	}
</style>