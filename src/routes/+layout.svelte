<script>
	import { onNavigate } from "$app/navigation";
	import Footer from "./Footer.svelte";
	import Header from "./Header.svelte";
	// import app from "$lib/app.css";
	// import highlight from "$lib/highlight.css";
	import "$lib/app.css";
	import "$lib/highlight.css";
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();

	onNavigate((nav) => {
		if(!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await nav.complete;
			})
		})
	})
</script>

<!-- <svelte:head>
	<link rel="stylesheet" href="src/lib/app.css">
	<link rel="stylesheet" href="src/lib/highlight.css">
</svelte:head> -->
<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml">
</svelte:head>

<main>
	<Header />
	<div class="content">
		{@render children?.()}
	</div>
	<Footer />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.content {
		margin-bottom: 10px;
		min-height: 100%;
	}
</style>