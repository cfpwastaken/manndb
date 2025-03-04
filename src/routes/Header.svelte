<script>
	import { page } from "$app/stores";
	import Chip from "$lib/Chip.svelte";
	import logo from "$lib/images/logo.png";
    import { HomeIcon, LogInIcon, LogOutIcon, SearchIcon, UploadIcon } from "lucide-svelte";

	function authorize() {
		const session = localStorage.getItem("mdbsession");
		if(!session) return "";
		return session;
	}

	async function isLoggedIn() {
		const session = localStorage.getItem("mdbsession");
		if(!session) return false;
		const result = await fetch("/api/validateSession", {
			headers: {
				"Authorization": session
			}
		}).then(res => res.json());
		if(!result.valid) {
			localStorage.removeItem("mdbsession");
			location.reload()
			return false;
		}
		return true;
	}
</script>

<nav>
	<h2>
		<a href="/" style="display: flex; gap: 10px;">
			<img src={logo} alt=MannDB width="150px">
			<Chip>
				<span style="font-size: 2rem;">
					BETA
				</span>
			</Chip>
			<!-- {title} -->
		</a>
	</h2>
	<ul>
		<li><a href="/">
			<HomeIcon />
			<span>Home</span>
		</a></li>
		<li><a href="/search">
			<SearchIcon />
			<span>Suche</span>
		</a></li>
		<li><a href="/upload">
			<UploadIcon />
			<span>Upload</span>
		</a></li>
		{#await isLoggedIn()}
		<!-- loading... -->
		{:then loggedIn}
		{#if loggedIn}
		<li><a href="#" onclick={() => {
			localStorage.removeItem("mdbsession");
			location.reload()
		}}>
			<LogOutIcon />
			<span>Logout</span>
		</a></li>
		{:else}
		<li><a href={"/login?then=" + encodeURI($page.url.pathname)}>
			<LogInIcon />
			<span>Login</span>
		</a></li>
		{/if}
		{/await}
	</ul>
</nav>

<style>
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
		padding-top: 5px;
		padding-bottom: 5px;
		background-color: #1d1d1d;
		view-transition-name: header;
	}

	ul {
		display: flex;
		list-style: none;
	}

	li {
		margin-left: 20px;
		font-size: 1.4rem;
	}

	li a {
		color: #fff;
		/* text-decoration: none; */
		display: flex;
		gap: 5px;
		align-items: center;
	}

	h2 {
		margin: 0;
	}

	h2 a {
		color: white;
		text-decoration: none;
	}

	@media (max-width: 580px) {
		li a span {
			display: none;
		}
		li a svg {
			width: 30px;
			height: 30px;
		}
	}
</style>