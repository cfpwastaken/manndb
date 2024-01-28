<script>
	import Chip from "$lib/Chip.svelte";
	import logo from "$lib/images/logo.png";
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
			<svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.55 2.533a2.25 2.25 0 0 1 2.9 0l6.75 5.695c.508.427.8 1.056.8 1.72v9.802a1.75 1.75 0 0 1-1.75 1.75h-3a1.75 1.75 0 0 1-1.75-1.75v-5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0-.75.75v5a1.75 1.75 0 0 1-1.75 1.75h-3A1.75 1.75 0 0 1 3 19.75V9.947c0-.663.292-1.292.8-1.72l6.75-5.694Z" fill="#ffffff"/></svg>
			<span>Home</span>
		</a></li>
		<li><a href="/search">
			<svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="#ffffff"/></svg>
			<span>Suche</span>
		</a></li>
		<li><a href="/upload">
			<svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.25 3.495h13.498a.75.75 0 0 0 .101-1.493l-.101-.007H5.25a.75.75 0 0 0-.102 1.493l.102.007Zm6.633 18.498L12 22a1 1 0 0 0 .993-.884L13 21V8.41l3.294 3.292a1 1 0 0 0 1.32.083l.094-.083a1 1 0 0 0 .083-1.32l-.083-.094-4.997-4.997a1 1 0 0 0-1.32-.083l-.094.083-5.004 4.996a1 1 0 0 0 1.32 1.499l.094-.083L11 8.415V21a1 1 0 0 0 .883.993Z" fill="#ffffff"/></svg>
			<span>Upload</span>
		</a></li>
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