<script>
	/**
	 * @typedef {Object} Props
	 * @property {boolean} [inline]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { inline = false, children } = $props();
</script>

<div class={`chip ${inline ? "inline" : ""}`}>
	{@render children?.()}
</div>

<style>
	.chip {
		background-color: #2e2e2e;
		padding-top: 5px;
		padding-bottom: 5px;
		padding-left: 10px;
		padding-right: 10px;
		border-radius: 15px;
		font-size: 1rem;
	}

	:global(.chip a) {
		text-decoration: none;
		color: white;
	}

	.inline {
		display: inline-block;
		padding-bottom: 0;
		padding-top: 0;
	}
</style>