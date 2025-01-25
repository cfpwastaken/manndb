<script>
	import { page } from "$app/stores";
	import { getAuthURL } from "$lib/oauth";
	import { env } from "$env/dynamic/public";
	let username = "";
	let password = "";

	const OIDC_ENABLED = env.PUBLIC_OIDC_ENABLED == "true";
	const PASS_ENABLED = env.PUBLIC_PASS_ENABLED == "true";

	function thenURL() {
		const then = $page.url.searchParams.get("then");
		if(then) return then;
		return "/";
	}
</script>

<!-- SEO -->
<svelte:head>
	<title>MannDB</title>
</svelte:head>

<article>
	<div class="info">
		<h1>Anmelden</h1>
		{#if $page.url.searchParams.has("showThen")}
			<span>und weiter zu {$page.url.searchParams.get("showThen")}</span>
		{/if}
		{#if PASS_ENABLED}
		<input type="text" placeholder="Nutzername" bind:value={username}>
		<input type="password" placeholder="Passwort" bind:value={password}>
		<button on:click={async () => {
			const result = await fetch("/api/login", {
				method: "POST",
				body: JSON.stringify({
					username, password
				})
			}).then(res => res.json());
			if(result.error) alert(result.error);
			else {
				localStorage.setItem("mdbsession", result.session);
				location.href = thenURL();
			}
		}}>Anmelden</button>
		{/if}

		{#if OIDC_ENABLED}
		<button on:click={async () => {
			const auth = await getAuthURL();
			localStorage.setItem("codeVerifier", auth.codeVerifier);
			localStorage.setItem("oidc_state", auth.state);
			localStorage.setItem("thenURL", thenURL());
			location.href = auth.url;
		}}>
			Anmelden mit OIDC
		</button>
		{/if}
		<span>Noch kein Konto oder Passwort vergessen? Fragen Sie den Besitzer dieser Instanz.</span>
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