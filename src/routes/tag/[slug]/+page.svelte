<script>
	import Chip from '$lib/Chip.svelte';
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
		<!-- <svelte:component this={data.content} /> -->
		<!-- {@html tag.html} -->
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