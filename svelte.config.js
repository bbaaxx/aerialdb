import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		// Cloudflare Pages adapter for deployment
		// Supports Cloudflare D1 (SQLite) and R2 (object storage)
		adapter: adapter(),
		csp: {
			mode: 'nonce',
			directives: {
				'default-src': ['none'],
				'script-src': ['self'],
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'font-src': ['self', 'https://fonts.gstatic.com'],
				'img-src': ['self', 'data:', 'https://i.ytimg.com', '*.r2.dev'],
				'frame-src': ['https://www.youtube.com'],
				'connect-src': ['self'],
				'base-uri': ['none'],
				'form-action': ['self'],
				'frame-ancestors': ['none'],
				'upgrade-insecure-requests': true
			}
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
