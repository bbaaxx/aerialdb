<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages.js';
	import { Search, X, Upload, User, LogOut, BookOpen, Menu, ChevronRight } from 'lucide-svelte';

	interface Props {
		user?: { username: string } | null;
	}

	const { user = null }: Props = $props();

	// Nav links
	const navLinks = [
		{ href: '/', label: m.nav_library(), matchPrefix: false },
		{ href: '/tutorials', label: m.nav_tutorials(), matchPrefix: true },
		{ href: '/theory', label: m.nav_theory(), matchPrefix: true },
		{ href: '/community', label: m.nav_community(), matchPrefix: true }
	] as const;

	// Search state
	let searchOpen = $state(false);
	let searchQuery = $state('');
	let searchInput: HTMLInputElement | undefined = $state(undefined);
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;

	// Account dropdown state
	let accountOpen = $state(false);
	let accountButton: HTMLButtonElement | undefined = $state(undefined);
	let dropdownRef: HTMLDivElement | undefined = $state(undefined);

	// Mobile menu state
	let mobileMenuOpen = $state(false);

	function isActive(href: string, matchPrefix: boolean): boolean {
		const pathname = $page.url.pathname;
		if (!matchPrefix) return pathname === href;
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}

	function toggleSearch() {
		searchOpen = !searchOpen;
		if (searchOpen) {
			searchQuery = '';
			// Focus input after DOM update
			setTimeout(() => searchInput?.focus(), 50);
		}
	}

	function handleSearchInput(value: string) {
		searchQuery = value;
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => submitSearch(), 300);
	}

	function submitSearch() {
		const query = searchQuery.trim();
		if (!query) return;
		const pathname = $page.url.pathname;
		if (pathname === '/') {
			const params = new URLSearchParams($page.url.search);
			params.set('q', query);
			goto(`/?${params.toString()}`, { replaceState: true, noScroll: true });
		} else {
			goto(`/?q=${encodeURIComponent(query)}`);
		}
		searchOpen = false;
		searchQuery = '';
	}

	function handleSearchKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			searchOpen = false;
			searchQuery = '';
		} else if (e.key === 'Enter') {
			submitSearch();
		}
	}

	function toggleAccount() {
		accountOpen = !accountOpen;
	}

	function handleClickOutside(e: MouseEvent) {
		if (
			accountOpen &&
			dropdownRef &&
			!dropdownRef.contains(e.target as Node) &&
			accountButton &&
			!accountButton.contains(e.target as Node)
		) {
			accountOpen = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			if (searchOpen) {
				searchOpen = false;
				searchQuery = '';
			}
			if (accountOpen) {
				accountOpen = false;
				accountButton?.focus();
			}
			if (mobileMenuOpen) {
				mobileMenuOpen = false;
			}
		} else if (
			e.key === '/' &&
			!searchOpen &&
			!(e.target instanceof HTMLInputElement) &&
			!(e.target instanceof HTMLTextAreaElement)
		) {
			e.preventDefault();
			toggleSearch();
		}
	}
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<header class="sticky top-0 z-50 w-full px-4 pt-4">
	<div
		class="mx-auto max-w-7xl rounded-2xl px-4 py-3 lg:px-6"
		style="background: rgba(36,39,54,0.5); backdrop-filter: blur(16px);"
	>
		<div class="flex items-center justify-between gap-4">
			<!-- Logo -->
			<a href="/" class="shrink-0 font-serif text-xl text-white transition hover:opacity-90">
				AerialDB
			</a>

			<!-- Desktop nav links (hidden on mobile) -->
			<nav class="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
				{#each navLinks as link (link.href)}
					<a
						href={link.href}
						class="rounded-lg px-3 py-1.5 text-sm font-medium transition {isActive(
							link.href,
							link.matchPrefix
						)
							? 'bg-surface-container-high text-on-surface'
							: 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface'}"
						aria-current={isActive(link.href, link.matchPrefix) ? 'page' : undefined}
					>
						{link.label}
					</a>
				{/each}
			</nav>

			<!-- Right side actions -->
			<div class="flex items-center gap-2">
				<!-- Search toggle -->
				<button
					type="button"
					onclick={toggleSearch}
					class="group relative rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container-high/50 hover:text-on-surface"
					aria-label={m.nav_search_toggle_label()}
				>
					{#if searchOpen}
						<X size={20} />
					{:else}
						<Search size={20} />
						<!-- KBD hint (desktop only) -->
						<div
							class="pointer-events-none absolute top-full left-1/2 mt-2 hidden -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100 sm:block"
						>
							<kbd
								class="flex h-5 items-center rounded border border-outline-variant/30 bg-surface-container-highest px-1.5 font-sans text-[10px] font-medium text-on-surface-variant shadow-sm"
							>
								{m.nav_search_shortcut()}
							</kbd>
						</div>
					{/if}
				</button>

				<!-- Upload button (authenticated only) -->
				{#if user}
					<a
						href="/upload"
						class="hidden items-center gap-1.5 rounded-lg bg-primary/15 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/25 sm:flex"
					>
						<Upload size={16} />
						<span class="hidden md:inline">{m.nav_upload_move()}</span>
					</a>
				{/if}

				<!-- Account / Sign Up -->
				{#if user}
					<div class="relative">
						<button
							type="button"
							bind:this={accountButton}
							onclick={toggleAccount}
							class="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container-high/50 hover:text-on-surface"
							aria-haspopup="true"
							aria-expanded={accountOpen}
						>
							<User size={20} />
						</button>

						<!-- Account dropdown -->
						{#if accountOpen}
							<div
								bind:this={dropdownRef}
								class="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl py-1 shadow-lg"
								style="background: rgba(42,45,62,0.95); backdrop-filter: blur(16px);"
								role="menu"
							>
								<div class="border-b border-outline-variant/20 px-4 py-2">
									<p class="text-sm font-medium text-on-surface">{user.username}</p>
								</div>
								<a
									href="/account"
									class="flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant transition hover:bg-surface-container-high/50 hover:text-on-surface"
									role="menuitem"
									onclick={() => (accountOpen = false)}
								>
									<User size={14} />
									{m.menu_profile()}
								</a>
								<a
									href="/library"
									class="flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant transition hover:bg-surface-container-high/50 hover:text-on-surface"
									role="menuitem"
									onclick={() => (accountOpen = false)}
								>
									<BookOpen size={14} />
									{m.menu_my_library()}
								</a>
								<a
									href="/auth/logout"
									class="flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant transition hover:bg-surface-container-high/50 hover:text-on-surface"
									role="menuitem"
									onclick={() => (accountOpen = false)}
								>
									<LogOut size={14} />
									{m.menu_sign_out()}
								</a>
							</div>
						{/if}
					</div>
				{:else}
					<a
						href="/auth/signup"
						class="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-1.5 text-sm font-medium text-white shadow-[0_0_15px_rgba(138,99,248,0.5)] transition hover:shadow-[0_0_20px_rgba(138,99,248,0.6)]"
					>
						{m.nav_sign_up()}
					</a>
				{/if}

				<!-- Hamburger (mobile only) -->
				<button
					type="button"
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					class="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container-high/50 hover:text-on-surface lg:hidden"
					aria-label="Menu"
					aria-expanded={mobileMenuOpen}
				>
					<Menu size={20} />
				</button>
			</div>
		</div>

		<!-- Inline search bar (expandable) -->
		{#if searchOpen}
			<div class="mt-3">
				<div class="relative">
					<div
						class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant"
					>
						<Search size={16} />
					</div>
					<input
						type="text"
						bind:this={searchInput}
						value={searchQuery}
						placeholder={m.nav_search_placeholder()}
						oninput={(e: Event) => handleSearchInput((e.target as HTMLInputElement).value)}
						onkeydown={handleSearchKeydown}
						class="w-full rounded-lg border border-outline-variant/15 bg-surface-container py-2 pr-10 pl-10 text-sm text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					/>
					{#if searchQuery}
						<button
							type="button"
							onclick={() => {
								searchQuery = '';
								searchInput?.focus();
							}}
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant transition hover:text-on-surface"
							aria-label="Clear search"
						>
							<X size={16} />
						</button>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Mobile nav panel -->
		{#if mobileMenuOpen}
			<nav
				class="mt-3 border-t border-outline-variant/15 pt-3 lg:hidden"
				aria-label="Mobile navigation"
			>
				{#each navLinks as link (link.href)}
					<a
						href={link.href}
						class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition {isActive(
							link.href,
							link.matchPrefix
						)
							? 'bg-surface-container-high text-on-surface'
							: 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface'}"
						aria-current={isActive(link.href, link.matchPrefix) ? 'page' : undefined}
						onclick={() => (mobileMenuOpen = false)}
					>
						{link.label}
						<ChevronRight size={14} class="text-on-surface-variant" />
					</a>
				{/each}

				<!-- Upload in mobile menu (authenticated only) -->
				{#if user}
					<a
						href="/upload"
						class="mt-2 flex items-center gap-2 rounded-lg bg-primary/15 px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/25"
						onclick={() => (mobileMenuOpen = false)}
					>
						<Upload size={16} />
						{m.nav_upload_move()}
					</a>
				{/if}
			</nav>
		{/if}
	</div>
</header>
