<script>
    import Chip from "$lib/Chip.svelte";

	/**
	 * @type {FileList}
	 */
	let files;
	/**
	 * @type {string[]}
	 */
	let tags = [];
	
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

	/**
	 * @param {File} file
	 */
	async function getPreviewData(file) {
		const text = await file.text();
		const preview = await fetch("/api/preview", {
			method: "POST",
			body: JSON.stringify({
				md: text
			})
		}).then(res => res.json());
		tags = preview.tags;
		return preview;
	}

	let author = "";
	let keyword = "";
</script>

<!-- SEO -->
<svelte:head>
	<title>MannDB</title>
</svelte:head>

<article>
	<div class="info">
		<h1>Hochladen</h1>
		<!-- <span>!! ACHTUNG !! Bereits existierende slugs werden überschrieben (geupdated), die alte Version wird dabei gelöscht!!</span>
		<span>!! ACHTUNG !! Das Feld "Author" muss immer mit dem gleichen Namen bestückt werden, e.g. dann nur "Jannik", und die auf "Jannik Eckhardt". Wenn es überhaupt nicht ausgefüllt ist gibts es eine Fehlermeldung!!</span>
		<span>!! ACHTUNG !! Wenn das Schlagwort Feld nicht ausgefüllt ist, schneidet dir der Server deine Eier ab!</span> -->
		<input type="text" placeholder="Author" bind:value={author}>
		<input type="text" placeholder="Schlagwort" bind:value={keyword}>
		<input type="file" bind:files>
		{#if files && files.length > 0}
			<button on:click={async () => {
				const result = await fetch("/api/upload", {
					method: "POST",
					body: JSON.stringify({
						text: await files[0].text(),
						author,
						keyword,
						tags
					})
				}).then(res => res.json());
				if(result.error) alert(result.error);
				else location.href = "/" + result.slug;
			}}>Hochladen</button>
		{/if}
	</div>
	<div class="content container">
		{#if files}
			{#each files as file}
				<div class="content">
					{#await getPreviewData(file)}
						<p>Previewing...</p>
					{:then info}
						<span>Slug: {info.slug}</span>
						<div class="categories">
							{#if tags}
								{#each tags as cat}
									<Chip>
										{cat}
										<a href="#" on:click={() => {
											tags = tags.filter(t => t !== cat);
										}}>
											<svg width="12" height="12" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z" fill="#ffffff"/></svg>
										</a>
									</Chip>
								{/each}
								<Chip>
									<a href="#" on:click={() => {
										const tag = prompt("Slug eines Tags eingeben:");
										if(tag) {
											tags.push(tag);
											tags = tags;
										}
									}}>
										Tag hinzufügen
									</a>
								</Chip>
							{/if}
						</div>
					{:catch error}
						<p>Failed to preview: {error.message}</p>
					{/await}
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

	.categories {
		display: flex;
		gap: 5px;
	}
</style>