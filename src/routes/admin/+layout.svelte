<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { m } from '$lib/paraglide/messages.js';

	let { data, children }: { data: LayoutData; children: any } = $props();

	function isActive(href: string) {
		const pathname = $page.url.pathname;
		if (href === '/admin') return pathname === '/admin';
		return pathname === href || pathname.startsWith(href + '/');
	}
</script>

<div class="min-h-screen bg-surface-container-low">
	<!-- Admin Header with glassmorphism -->
	<header
		class="sticky top-0 z-50"
		style="background: linear-gradient(180deg, rgba(26,28,41,0.95) 0%, rgba(26,28,41,0.80) 100%); backdrop-filter: blur(12px);"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center gap-8">
					<a
						href="/"
						class="font-serif text-xl text-white transition hover:opacity-90 active:scale-95"
					>
						AerialDB
					</a>
					<nav class="hidden space-x-1 sm:flex" aria-label="Admin navigation">
						<a
							href="/admin"
							class="rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low focus-visible:outline-none active:scale-95 {isActive(
								'/admin'
							)
								? 'bg-surface-container text-on-surface'
								: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}"
							aria-current={isActive('/admin') ? 'page' : undefined}
						>
							{m.admin_nav_dashboard()}
						</a>
						<a
							href="/admin/categories"
							class="rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low focus-visible:outline-none active:scale-95 {isActive(
								'/admin/categories'
							)
								? 'bg-surface-container text-on-surface'
								: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}"
							aria-current={isActive('/admin/categories') ? 'page' : undefined}
						>
							{m.admin_nav_categories()}
						</a>
						<a
							href="/admin/moves/new"
							class="rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low focus-visible:outline-none active:scale-95 {isActive(
								'/admin/moves/new'
							)
								? 'bg-surface-container text-on-surface'
								: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}"
							aria-current={isActive('/admin/moves/new') ? 'page' : undefined}
						>
							{m.admin_nav_add_move()}
						</a>
					</nav>
				</div>
				<div class="flex items-center gap-4">
					<span class="text-sm text-on-surface-variant">
						{data.user.username}
					</span>
					<form method="POST" action="/auth/logout">
						<button
							type="submit"
							class="rounded-lg border border-outline-variant/15 px-3 py-1.5 text-sm font-medium text-on-surface-variant transition hover:bg-surface-container hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low focus-visible:outline-none active:scale-95"
						>
							{m.menu_sign_out()}
						</button>
					</form>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main id="main-content" tabindex="-1" class="outline-none">
		{@render children()}
	</main>
</div>
