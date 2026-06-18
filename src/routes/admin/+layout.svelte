<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';

	let { data, children }: { data: LayoutData; children: any } = $props();

	function isActive(href: string): boolean {
		return $page.url.pathname === href;
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
						class="rounded-lg font-serif text-xl text-white transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low focus-visible:outline-none"
					>
						AerialDB
					</a>
					<nav class="hidden space-x-2 sm:flex" aria-label="Admin navigation">
						<a
							href="/admin"
							class="rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low focus-visible:outline-none active:scale-95 {isActive(
								'/admin'
							)
								? 'bg-surface-container text-on-surface'
								: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}"
							aria-current={isActive('/admin') ? 'page' : undefined}
						>
							Dashboard
						</a>
						<a
							href="/admin/categories"
							class="rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low focus-visible:outline-none active:scale-95 {isActive(
								'/admin/categories'
							)
								? 'bg-surface-container text-on-surface'
								: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}"
							aria-current={isActive('/admin/categories') ? 'page' : undefined}
						>
							Categories
						</a>
						<a
							href="/admin/moves/new"
							class="rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low focus-visible:outline-none active:scale-95 {isActive(
								'/admin/moves/new'
							)
								? 'bg-surface-container text-on-surface'
								: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}"
							aria-current={isActive('/admin/moves/new') ? 'page' : undefined}
						>
							Add Move
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
							class="rounded-lg border border-outline-variant/15 px-3 py-1.5 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low focus-visible:outline-none active:scale-95"
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
