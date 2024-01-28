<script>
    import { browser } from "$app/environment";
    import PostPreview from "$lib/PostPreview.svelte";

</script>
<h1 style="text-align: center;">MannDB - Alle Mans</h1>

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
</style>