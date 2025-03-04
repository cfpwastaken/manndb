<script>
	/**
	 * @typedef {Object} Props
	 * @property {boolean} [showDialog]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { showDialog = $bindable(false), children } = $props();

	/**
	 * @type {HTMLDialogElement}
	 */
	let dialog = $state();

	$effect(() => {
		if(dialog && showDialog) {
			dialog.showModal();
		} else if(dialog) {
			dialog.close();
		}
	});
</script>

<dialog
	bind:this={dialog}
	onclose={() => (showDialog = false)}>
	{@render children?.()}
</dialog>

<style>
	dialog {
		background-color: rgba(29, 29, 29, 0.5);
		backdrop-filter: blur(15px);
		padding: 10px;
		border: 2px solid rgba(46, 46, 46, 0.8);
		border-radius: 10px;
		color: white;
		animation: popIn 0.3s cubic-bezier(1,0,0,1);
	}

	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
	}

	@keyframes popIn {
		0% {
			transform: scale(0.3);
		}
		100% {
			transform: scale(1);
		}
	}
</style>