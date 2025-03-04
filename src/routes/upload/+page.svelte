<script lang="ts">
	import { browser } from "$app/environment";
	import Chip from "$lib/Chip.svelte";
	import Dialog from "$lib/Dialog.svelte";
    import { XIcon } from "lucide-svelte";
	import { onMount } from "svelte";

	let files: FileList | null = $state(null);
	let tags: string[] = $state([]);
	
	// $effect(() => {
	// 	if(files) {
	// 		for(const file of files) {
	// 			console.log(file);
	// 		}
	// 	}
	// });
	$inspect(files);

	async function ensureMarkdown(file: File) {
		let text = await file.text();
		if(file.type == "text/markdown") return text;
		// make sure the file starts with the file name
		text = `# ${file.name.split(".")[0]}\n\n` + text;
		// make sure line breaks are preserved, markdown doesnt line break if there is only one line break
		text = text.replace(/\n/g, "\n\n");

		return text;
	}

	async function compileFile(file: File) {
		let text = await ensureMarkdown(file);
		return await fetch("/api/render", {
			method: "POST",
			body: JSON.stringify({
				md: text
			})
		}).then(res => res.json());
	}

	async function getPreviewData(file: File) {
		const text = await ensureMarkdown(file);
		const preview = await fetch("/api/preview", {
			method: "POST",
			body: JSON.stringify({
				md: text
			})
		}).then(res => res.json());
		tags = preview.tags;
		return preview;
	}

	let keyword = $state("");
	let showTagDialog = $state(false);
	let privatePost = $state(false);

	onMount(() => {
		if(!localStorage.getItem("mdbsession")) {
			location.href = "/login?then=/upload&showThen=Upload";
		}
	})
</script>

<!-- SEO -->
<svelte:head>
	<title>MannDB</title>
</svelte:head>

<Dialog bind:showDialog={showTagDialog}>
	<h1 style="margin: 0; text-align: center;">Tag hinzufügen</h1>
	{#if browser}
		{#await fetch("/api/tags").then(res => res.json())}
			<span>Loading...</span>
		{:then results}
			<p style="text-align: center;">{results.length} Ergebnisse werden angezeigt</p>
			<div class="tags">
				{#each results as tag}
					<Chip>
						<a href="#" onclick={() => {
							tags.push(tag.slug);
							tags = tags;
							showTagDialog = false;
						}}>{tag.slug}</a>
					</Chip>
				{/each}
			</div>
		{:catch error}
			<span>{error.message}</span>
		{/await}
	{:else}
		<span>Loading...</span>
	{/if}
	<div class="buttons">
		<button onclick={() => {
			showTagDialog = false;
		}}>Abbrechen</button>
	</div>
</Dialog>

<article>
	<div class="info">
		<h1>Hochladen</h1>
		<!-- <span>Bitte immer den gleichen Author angeben!</span> -->
		<!-- <input type="text" placeholder="Author" bind:value={author}> -->
		<input type="text" placeholder="Schlagwort" bind:value={keyword}>
		<div>
			<input type="checkbox" bind:checked={privatePost}>
			<span>Privater Post</span>
		</div>
		<input type="file" bind:files>
		{#if files && files.length > 0}
			<button onclick={async () => {
				const result = await fetch("/api/upload", {
					method: "POST",
					body: JSON.stringify({
						text: await ensureMarkdown(files![0]),
						session: localStorage.getItem("mdbsession"),
						keyword,
						tags,
						private: privatePost
					})
				}).then(res => res.json());
				if(result.error) {
					alert(result.error);
					if(result.action && result.action == "logout") {
						localStorage.removeItem("mdbsession");
						location.href = "/login";
					}
				} else location.href = "/" + result.slug;
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
										<a href="#" onclick={() => {
											tags = tags.filter(t => t !== cat);
										}} aria-label="Remove">
											<XIcon size="12px" />
										</a>
									</Chip>
								{/each}
								<Chip>
									<a href="#" onclick={() => {
										showTagDialog = true;
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

	.tags {
		display: flex;
		gap: 5px;
		view-transition-name: categories;
		margin: 15px;
		flex-wrap: wrap;
	}

	.buttons {
		display: flex;
		gap: 5px;
		justify-content: center;
	}
</style>