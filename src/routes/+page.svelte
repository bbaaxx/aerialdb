<script lang="ts">
	import { onMount } from 'svelte';

	let scrolled = $state(false);

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<svelte:head>
	<title>Tasking - Multi-Agent Scalability & Intelligence</title>
	<meta name="description" content="Tasking: The next generation of multi-agent scalability and intelligence." />
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-orange-500/30 selection:text-orange-200">
	<!-- Navbar -->
	<nav
		class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b {scrolled ? 'bg-zinc-950/80 backdrop-blur-md border-zinc-800 py-3' : 'bg-transparent border-transparent py-5'}"
	>
		<div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-zinc-950 text-xl">T</div>
				<span class="text-xl font-bold tracking-tight">Tasking</span>
			</div>

			<div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
				<a href="#" class="hover:text-white transition-colors">Home</a>
				<a href="#features" class="hover:text-white transition-colors">Feature</a>
				<a href="#" class="hover:text-white transition-colors">Support</a>
				<a href="#contact" class="hover:text-white transition-colors">Contact</a>
			</div>

			<button class="bg-orange-500 hover:bg-orange-600 text-zinc-950 px-5 py-2 rounded-full text-sm font-bold transition-all active:scale-95">
				Try it out
			</button>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
		<!-- Background glow -->
		<div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

		<div class="max-w-7xl mx-auto px-6 text-center">
			<div class="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs font-medium text-orange-400 mb-8">
				<span class="relative flex h-2 w-2">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
				</span>
				New: Multi-Agent v2.0 is live
			</div>

			<h1 class="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
				TASKING
			</h1>

			<p class="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl mb-12 leading-relaxed">
				Empower your workflow with the next generation of multi-agent scalability and intelligence. Seamlessly coordinate complex tasks across distributed systems.
			</p>

			<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
				<button class="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-zinc-950 px-8 py-4 rounded-full font-bold text-lg transition-all active:scale-95">
					Try it out
				</button>
				<button class="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-8 py-4 rounded-full font-bold text-lg transition-all active:scale-95">
					Learn More
				</button>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="py-24 bg-zinc-900/30">
		<div class="max-w-7xl mx-auto px-6">
			<div class="mb-16 text-center">
				<h2 class="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Built for modern scale</h2>
				<p class="text-zinc-400 max-w-xl mx-auto">Everything you need to orchestrate complex agentic workflows in one unified platform.</p>
			</div>

			<div class="grid md:grid-cols-3 gap-8">
				<!-- Multi-Agent -->
				<div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-orange-500/50 transition-colors group">
					<div class="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
						<svg class="w-6 h-6 text-orange-500 group-hover:text-zinc-950 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
						</svg>
					</div>
					<h3 class="text-xl font-bold mb-3">Multi-Agent</h3>
					<p class="text-zinc-400 text-sm leading-relaxed">
						Advanced coordination protocols allowing dozens of specialized agents to collaborate on complex objectives with minimal overhead.
					</p>
				</div>

				<!-- Scalability -->
				<div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-orange-500/50 transition-colors group">
					<div class="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
						<svg class="w-6 h-6 text-orange-500 group-hover:text-zinc-950 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
						</svg>
					</div>
					<h3 class="text-xl font-bold mb-3">Scalability</h3>
					<p class="text-zinc-400 text-sm leading-relaxed">
						Horizontal scaling designed to handle millions of operations per second without compromising on latency or data consistency.
					</p>
				</div>

				<!-- Intelligent -->
				<div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-orange-500/50 transition-colors group">
					<div class="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
						<svg class="w-6 h-6 text-orange-500 group-hover:text-zinc-950 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
						</svg>
					</div>
					<h3 class="text-xl font-bold mb-3">Intelligent</h3>
					<p class="text-zinc-400 text-sm leading-relaxed">
						Self-optimizing routines that learn from previous execution paths to increase efficiency and accuracy over time.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Contact Section -->
	<section id="contact" class="py-24">
		<div class="max-w-7xl mx-auto px-6">
			<div class="bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-800 flex flex-col lg:flex-row">
				<div class="p-12 lg:w-1/2 flex flex-col justify-center">
					<h2 class="text-4xl font-bold mb-6 tracking-tight">Ready to transform your productivity?</h2>
					<p class="text-zinc-400 mb-10 text-lg">Contact our sales team or start your free trial today. We're here to help you scale your agentic operations.</p>

					<div class="space-y-6 mb-10">
						<div class="flex items-center gap-4">
							<div class="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-orange-500">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
								</svg>
							</div>
							<span class="text-zinc-300">hello@tasking.ai</span>
						</div>
						<div class="flex items-center gap-4">
							<div class="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-orange-500">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
								</svg>
							</div>
							<span class="text-zinc-300">San Francisco, CA</span>
						</div>
					</div>

					<button class="w-fit bg-orange-500 hover:bg-orange-600 text-zinc-950 px-8 py-4 rounded-full font-bold transition-all active:scale-95">
						Contact Us
					</button>
				</div>

				<div class="lg:w-1/2 bg-zinc-800 relative min-h-[400px]">
					<!-- Abstract decorative shapes instead of image -->
					<div class="absolute inset-0 flex items-center justify-center overflow-hidden">
						<div class="w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
						<div class="absolute w-48 h-48 border border-zinc-700 rounded-full -rotate-12 translate-x-20"></div>
						<div class="absolute w-72 h-72 border border-zinc-700 rounded-full rotate-45 -translate-y-20"></div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-zinc-950 border-t border-zinc-900 pt-20 pb-10">
		<div class="max-w-7xl mx-auto px-6">
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-20">
				<div class="col-span-2">
					<div class="flex items-center gap-2 mb-6">
						<div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-zinc-950 text-xl">T</div>
						<span class="text-xl font-bold tracking-tight">Tasking</span>
					</div>
					<p class="text-zinc-500 text-sm max-w-xs leading-relaxed">
						The next generation of multi-agent scalability and intelligence. Build, scale, and optimize your agentic workflows with ease.
					</p>
				</div>

				<div>
					<h4 class="font-bold text-zinc-100 mb-6">Product</h4>
					<ul class="space-y-4 text-sm text-zinc-500">
						<li><a href="#" class="hover:text-orange-500 transition-colors">Features</a></li>
						<li><a href="#" class="hover:text-orange-500 transition-colors">Pricing</a></li>
						<li><a href="#" class="hover:text-orange-500 transition-colors">Changelog</a></li>
						<li><a href="#" class="hover:text-orange-500 transition-colors">Integrations</a></li>
					</ul>
				</div>

				<div>
					<h4 class="font-bold text-zinc-100 mb-6">Company</h4>
					<ul class="space-y-4 text-sm text-zinc-500">
						<li><a href="#" class="hover:text-orange-500 transition-colors">About Us</a></li>
						<li><a href="#" class="hover:text-orange-500 transition-colors">Careers</a></li>
						<li><a href="#" class="hover:text-orange-500 transition-colors">Blog</a></li>
						<li><a href="#" class="hover:text-orange-500 transition-colors">Media Kit</a></li>
					</ul>
				</div>

				<div>
					<h4 class="font-bold text-zinc-100 mb-6">Resources</h4>
					<ul class="space-y-4 text-sm text-zinc-500">
						<li><a href="#" class="hover:text-orange-500 transition-colors">Documentation</a></li>
						<li><a href="#" class="hover:text-orange-500 transition-colors">Community</a></li>
						<li><a href="#" class="hover:text-orange-500 transition-colors">Help Center</a></li>
						<li><a href="#" class="hover:text-orange-500 transition-colors">API Status</a></li>
					</ul>
				</div>

				<div>
					<h4 class="font-bold text-zinc-100 mb-6">Social</h4>
					<ul class="space-y-4 text-sm text-zinc-500">
						<li><a href="#" class="hover:text-orange-500 transition-colors">Twitter</a></li>
						<li><a href="#" class="hover:text-orange-500 transition-colors">LinkedIn</a></li>
						<li><a href="#" class="hover:text-orange-500 transition-colors">GitHub</a></li>
						<li><a href="#" class="hover:text-orange-500 transition-colors">Discord</a></li>
					</ul>
				</div>
			</div>

			<div class="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-zinc-900 text-xs text-zinc-600">
				<p>© 2024 Tasking AI Inc. All rights reserved.</p>
				<div class="flex items-center gap-8">
					<a href="#" class="hover:text-zinc-400 transition-colors">Privacy Policy</a>
					<a href="#" class="hover:text-zinc-400 transition-colors">Terms of Service</a>
					<a href="#" class="hover:text-zinc-400 transition-colors">Cookie Policy</a>
				</div>
			</div>
		</div>
	</footer>
</div>
