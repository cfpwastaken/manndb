<script>
	import { page } from "$app/stores";
	import { CLIENT_ID, TOKEN_URL } from "$lib/oauth";
	import { onMount } from "svelte";

	onMount(async () => {
		const state = localStorage.getItem("oidc_state");
		const codeVerifier = localStorage.getItem("codeVerifier");
		const thenURL = localStorage.getItem("thenURL") || "/";
		localStorage.removeItem("oidc_state");
		localStorage.removeItem("codeVerifier");
		localStorage.removeItem("thenURL");
		if(!state || !codeVerifier) {
			alert("OIDC login failed: state or codeVerifier missing");
			location.href = "/";
			return;
		}

		const code = $page.url.searchParams.get("code");
		const urlstate = $page.url.searchParams.get("state");

		if(urlstate !== state) {
			alert("OIDC login failed: state mismatch");
			location.href = "/";
			return;
		}

		if(!code) {
			alert("OIDC login failed: code missing");
			location.href = "/";
			return;
		}

		const result = await fetch("/api/login/oidc", {
			method: "POST",
			body: JSON.stringify({
				oidc_data: {
					code, codeVerifier
				}
			})
		}).then(res => res.json());
		if(result.error) {
			alert(result.error);
			location.href = "/";
		} else {
			localStorage.setItem("mdbsession", result.session);
			location.href = thenURL;
		}
	})
</script>

<span>Logging in, please wait...</span>