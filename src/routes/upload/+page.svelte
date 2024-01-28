<script>
	/**
	 * @type {FileList}
	 */
	let files;
	
	$: if(files) {
		for(const file of files) {
			console.log(file);
		}
	}

	/**
	 * @param {File} file
	 */
	async function compileFile(file) {
		const text = await file.text();
		return await fetch("/api/render", {
			method: "POST",
			body: JSON.stringify({
				md: text
			})
		}).then(res => res.json());
	}

	let author = "";
</script>

<!-- SEO -->
<svelte:head>
	<title>MannDB</title>
</svelte:head>

<article>
	<div class="info">
		<h1>Hochladen</h1>
		<span>!! ACHTUNG !! Bereits existierende slugs werden überschrieben (geupdated), die alte Version wird dabei gelöscht!!</span>
		<span>!! ACHTUNG !! Das Feld "Author" muss immer mit dem gleichen Namen bestückt werden, e.g. dann nur "Jannik", und die auf "Jannik Eckhardt". Wenn es überhaupt nicht ausgefüllt ist gibts es eine Fehlermeldung!!</span>
		<input type="text" placeholder="Author" bind:value={author}>
		<input type="file" bind:files>
		{#if files && files.length > 0}
			<button on:click={async () => {
				const result = await fetch("/api/upload", {
					method: "POST",
					body: JSON.stringify({
						text: await files[0].text(),
						author
					})
				}).then(res => res.json());
				location.href = "/" + result.slug;
			}}>Hochladen</button>
		{/if}
	</div>
	<div class="content container">
		{#if files}
			{#each files as file}
				<div class="content">
					{#await compileFile(file)}
						<p>Compiling...</p>
					{:then html}
						{@html html.html}
					{:catch error}
						<p>Failed to compile: {error.message}</p>
					{/await}
				</div>
			{/each}
		{/if}
	</div>
</article>

<style>
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

	.content {
		/* margin: 15px; */
		font-size: 1.4rem;
	}
</style>