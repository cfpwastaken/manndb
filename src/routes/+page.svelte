<script>
    import { browser } from "$app/environment";
    import Chip from "$lib/Chip.svelte";
    import PostPreview from "$lib/PostPreview.svelte";

</script>
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
		</div>
	{:catch error}
		<span>{error.message}</span>
	{/await}
{:else}
	<span>Loading...</span>
{/if}

<h2 style="text-align: center;">Alle Mans</h2>
{#if browser}
	{#await fetch("/api/search/").then(res => res.json())}
		<span>Loading...</span>
	{:then results}
		<p style="text-align: center;">{results.total} Ergebnisse werden angezeigt</p>
		<div class="posts">
			{#each results.documents as man}
				<PostPreview post={man.value} />
			{/each}
		</div>
	{:catch error}
		<span>{error.message}</span>
	{/await}
{:else}
	<span>Loading...</span>
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
	}
</style>