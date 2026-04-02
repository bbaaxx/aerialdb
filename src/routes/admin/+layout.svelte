<script lang="ts">
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<div class="min-h-screen bg-[#1A1C29]">
	<!-- Admin Header with glassmorphism -->
	<header
		class="sticky top-0 z-50 border-b border-white/5"
		style="background: linear-gradient(180deg, rgba(26,28,41,0.95) 0%, rgba(26,28,41,0.80) 100%); backdrop-filter: blur(12px);"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center gap-8">
					<a href="/" class="font-serif text-xl text-white transition hover:opacity-90">
						AerialDB
					</a>
					<nav class="hidden space-x-4 sm:flex">
						<a
							href="/admin"
							class="rounded-lg px-3 py-2 text-sm font-medium text-[#A0A5C0] transition hover:bg-white/5 hover:text-white"
						>
							Dashboard
						</a>
						<a
							href="/admin/moves/new"
							class="rounded-lg px-3 py-2 text-sm font-medium text-[#A0A5C0] transition hover:bg-white/5 hover:text-white"
						>
							Add Move
						</a>
					</nav>
				</div>
				<div class="flex items-center gap-4">
					<span class="text-sm text-[#A0A5C0]">
						{data.user.username}
					</span>
					<form method="POST" action="/auth/logout">
						<button
							type="submit"
							class="rounded-lg border border-gray-700 px-3 py-1.5 text-sm font-medium text-[#A0A5C0] transition hover:bg-white/5 hover:text-white"
						>
							Logout
						</button>
					</form>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main>
		{@render children()}
	</main>
</div>
