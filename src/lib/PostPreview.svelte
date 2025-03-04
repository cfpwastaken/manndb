<script>
	import Chip from "./Chip.svelte";

	/**
	 * @type {import("$lib/types").Post}
	 */
	export let post;
	export let large = false;
	export let pinned = false;

	let clicked = false;
</script>

<div class={"post " + (clicked ? "transition " : "") + (large ? "large" : "")}>
	<a style="display: flex; align-items: center; gap: 5px;" href="/{post.slug}" on:click={() => {
		clicked = true;
	}}>
		{#if pinned}
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>
		{/if}
		<h2>{post.title}</h2>
	</a>
	<div class="categories">
		{#if post.tags}
			{#each post.tags as cat}
				<Chip>
					<a href="/tag/{cat}">{cat}</a>
				</Chip>
			{/each}
		{/if}
	</div>
	<span class="info">
		{post.date}
		<!-- todo reading time -->
		&middot;
		{post.author}
		&middot;
		{post.keyword}
	</span>
</div>

<style>
	.post {
		background-color: #1d1d1d;
		display: flex;
		padding: 20px;
		flex-direction: column;
		gap: 5px;
		border-radius: 15px;
	}

	h2 {
		margin: 0;
	}

	a {
		color: white;
	}

	.info {
		color: #acacac;
		font-size: 1rem;
	}

	.categories {
		display: flex;
		gap: 5px;
	}

	.transition h2 {
		view-transition-name: title;
	}

	.transition .desc {
		view-transition-name: description;
	}

	.transition .categories {
		view-transition-name: categories;
	}

	.post:not(.large) {
		max-width: 400px;
	}

	.post.large {
		width: fit-content;
	}
</style>