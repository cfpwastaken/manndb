<script>
	let hashcode = $state("");
	let password = $state("");
	let passhash = $state("");
</script>

<!-- SEO -->
<svelte:head>
	<title>MannDB</title>
</svelte:head>

<article>
	<div class="info">
		<h1>Passworthash generieren</h1>
		<span>mit dem sicherem Argon2id-Algorithmus</span>
		<input type="password" placeholder="Hashcode" bind:value={hashcode}>
		<input type="password" placeholder="Passwort" bind:value={password}>
		<button onclick={async () => {
			const res = await fetch("/api/hash", {
				method: "POST",
				body: JSON.stringify({
					hashcode,
					password
				})
			}).then(res => res.json());
			if(res.error) alert(res.error);
			else passhash = res.hash;
		}}>Hashen</button>
		<span>Der Hash kann nicht in ein Passwort zurück konvertiert werden. Weder vom Besitzer dieser Instanz, noch von Angreifern.</span>

		{#if passhash}
			<span style="text-align: center; margin-top: 15px;">Passworthash: <pre>{passhash}</pre></span>
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