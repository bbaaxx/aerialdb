<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	function isActive(href: string): boolean {
		const pathname = $page.url.pathname;
		if (href === '/admin') return pathname === '/admin';
		return pathname.startsWith(href);
	}
</script>

<div class="min-h-screen bg-surface-container-low">
	<!-- Admin Header with glassmorphism -->
	<header
		class="sticky top-0 z-50 border-b border-outline-variant/10"
		style="background: linear-gradient(180deg, rgba(26,28,41,0.95) 0%, rgba(26,28,41,0.80) 100%); backdrop-filter: blur(12px);"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center gap-8">
					<a
						href="/"
						class="rounded-lg font-serif text-xl text-white transition-all hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95"
					>
						AerialDB
					</a>
					<nav class="hidden items-center space-x-1 sm:flex" aria-label="Admin navigation">
						<a
							href="/admin"
							class="rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95 {isActive(
								'/admin'
							)
								? 'bg-surface-container text-on-surface'
								: 'text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface'}"
							aria-current={isActive('/admin') ? 'page' : undefined}
						>
							Dashboard
						</a>
						<a
							href="/admin/categories"
							class="rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95 {isActive(
								'/admin/categories'
							)
								? 'bg-surface-container text-on-surface'
								: 'text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface'}"
							aria-current={isActive('/admin/categories') ? 'page' : undefined}
						>
							Categories
						</a>
						<a
							href="/admin/moves/new"
							class="rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95 {isActive(
								'/admin/moves/new'
							)
								? 'bg-surface-container text-on-surface'
								: 'text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface'}"
							aria-current={isActive('/admin/moves/new') ? 'page' : undefined}
						>
							Add Move
						</a>
					</nav>
				</div>
				<div class="flex items-center gap-4">
					<span class="hidden text-sm text-on-surface-variant md:inline">
						{data.user.username}
					</span>
					<form method="POST" action="/auth/logout">
						<button
							type="submit"
							class="rounded-lg border border-outline-variant/15 px-4 py-1.5 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95"
						>
							Logout
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
