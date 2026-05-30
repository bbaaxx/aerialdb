import { readdirSync, readFileSync, existsSync, writeFileSync } from 'fs';
import { join, relative } from 'path';

const ROOT = process.cwd();

// ── Helpers ──────────────────────────────────────────────────────────

function readFileSafe(p: string): string | null {
	try {
		return readFileSync(p, 'utf-8');
	} catch {
		return null;
	}
}

function fileExists(p: string): boolean {
	try {
		return existsSync(p);
	} catch {
		return false;
	}
}

/** Walk directories under `dir` and return route paths relative to `baseDir` */
function walkRoutes(dir: string, baseDir: string): string[] {
	const results: string[] = [];
	let entries: string[];
	try {
		entries = readdirSync(dir, { withFileTypes: true });
	} catch {
		return results;
	}

	for (const entry of entries) {
		if (entry.isDirectory()) {
			results.push(...walkRoutes(join(dir, entry.name), baseDir));
		}
	}

	const routeFiles = ['+page.svelte', '+page.server.ts', '+server.ts', '+layout.server.ts'];
	if (routeFiles.some((f) => fileExists(join(dir, f)))) {
		const rel = relative(baseDir, dir);
		results.push(rel === '' ? '/' : '/' + rel);
	}

	return results;
}

/** Get the list of route files present in a route directory (in display order) */
function getRouteFiles(routePath: string): string[] {
	const dirPath = join(ROOT, 'src/routes', routePath === '/' ? '' : routePath);
	const order = ['+layout.server.ts', '+page.server.ts', '+server.ts', '+page.svelte'];
	return order.filter((f) => fileExists(join(dirPath, f)));
}

// ── Schema parsing ───────────────────────────────────────────────────

function parseSchema(filePath: string): {
	tables: Record<string, string[]>;
	indexes: string[];
} {
	const content = readFileSafe(filePath);
	if (!content) return { tables: {}, indexes: [] };

	const tables: Record<string, string[]> = {};

	// Match table definitions: sqliteTable('name', {  or  sqliteView('name', {
	const tableRegex = /export\s+const\s+\w+\s*=\s*sqliteTable\s*\(\s*'(\w+)'\s*,\s*\{/g;
	let tableMatch: RegExpExecArray | null;
	while ((tableMatch = tableRegex.exec(content)) !== null) {
		const tableName = tableMatch[1];
		const blockStart = tableMatch.index + tableMatch[0].length;

		// Find matching closing brace for columns object
		let depth = 1;
		let i = blockStart;
		while (i < content.length && depth > 0) {
			if (content[i] === '{') depth++;
			else if (content[i] === '}') depth--;
			i++;
		}
		const blockContent = content.slice(blockStart, i - 1);

		// Extract DB column names from text('name') or integer('name') calls
		const colRegex = /(?:text|integer)\s*\(\s*'([^']+)'/g;
		const columns: string[] = [];
		let colMatch: RegExpExecArray | null;
		while ((colMatch = colRegex.exec(blockContent)) !== null) {
			columns.push(colMatch[1]);
		}

		tables[tableName] = columns;
	}

	// Extract index names
	const indexRegex = /index\s*\(\s*'([^']+)'/g;
	const indexes: string[] = [];
	let idxMatch: RegExpExecArray | null;
	while ((idxMatch = indexRegex.exec(content)) !== null) {
		indexes.push(idxMatch[1]);
	}

	return { tables, indexes };
}

// ── Method detection ─────────────────────────────────────────────────

function getActionsType(content: string): 'action' | 'actions' | null {
	// Find the actions declaration: export const actions[: Type] [satisfies Type] = {
	const actionMatch = content.match(
		/export\s+const\s+actions(?:\s*:\s*\w+)?(?:\s+satisfies\s+\w+)?\s*=\s*\{/
	);
	if (!actionMatch) return null;

	// Get the body after the opening brace
	const braceIdx = actionMatch.index! + actionMatch[0].length;
	const body = content.slice(braceIdx);

	// Split by lines and track brace depth.
	// At depth 0 (top level of actions object), look for key: patterns.
	// This avoids false matches from nested objects/function bodies.
	let depth = 0;
	const topLevelKeys: string[] = [];

	for (const rawLine of body.split('\n')) {
		// Check for key: pattern at depth 0
		if (depth === 0) {
			const keyMatch = rawLine.match(/^\s*(\w+)\s*:/);
			if (keyMatch) {
				topLevelKeys.push(keyMatch[1]);
			}
		}

		// Update depth based on braces in this line
		const opens = (rawLine.match(/\{/g) || []).length;
		const closes = (rawLine.match(/\}/g) || []).length;
		depth += opens - closes;
		if (depth < 0) depth = 0;
	}

	if (topLevelKeys.length === 0) return null;
	if (topLevelKeys.length === 1 && topLevelKeys[0] === 'default') return 'action';
	return 'actions';
}

function detectMethods(
	pageContent: string | null,
	serverContent: string | null,
	hasPageSvelte: boolean
): string[] {
	const methods: string[] = [];

	if (pageContent) {
		if (pageContent.includes('export const load')) {
			methods.push('GET');
		}
		if (pageContent.includes('export const actions')) {
			const at = getActionsType(pageContent);
			if (at === 'action') methods.push('POST action');
			else if (at === 'actions') methods.push('POST actions');
		}
	}

	if (serverContent) {
		const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
		for (const m of httpMethods) {
			if (serverContent.includes(`export const ${m}`) && !methods.includes(m)) {
				methods.push(m);
			}
		}
	}

	// If there's a +page.svelte but no server methods detected, assume GET
	if (methods.length === 0 && hasPageSvelte) {
		methods.push('GET');
	}

	return methods;
}

// ── Auth detection ───────────────────────────────────────────────────

function detectAuth(
	pageContent: string | null,
	serverContent: string | null,
	layoutContent: string | null,
	routePath: string
): string {
	// Route-specific special cases
	if (routePath === '/auth/login' || routePath === '/auth/signup') {
		return 'anonymous redirects home';
	}
	if (routePath === '/auth/logout') {
		return 'optional session';
	}
	if (routePath === '/upload') {
		return 'user via UI link';
	}

	const allContent = [pageContent, serverContent, layoutContent].filter(Boolean).join('\n');

	// Admin role check (strongest signal)
	if (
		allContent.includes("role !== 'admin'") ||
		allContent.includes('role!==') ||
		allContent.includes('locals.user?.role') ||
		allContent.includes('locals.user.role')
	) {
		return 'admin required';
	}

	// Auth guard in layout
	if (layoutContent && /!event\.locals\.user/.test(layoutContent)) {
		return 'user required by layout';
	}

	// Auth guard in page.server.ts with actions
	if (pageContent && /!event\.locals\.user/.test(pageContent)) {
		if (pageContent.includes('export const actions')) {
			const at = getActionsType(pageContent);
			if (at === 'action') return 'user required; action re-check';
			return 'user required; actions re-check';
		}
		return 'user required';
	}

	// Auth guard in +server.ts
	if (serverContent && /!event\.locals\.user/.test(serverContent)) {
		return 'user required';
	}

	return 'public';
}

// ── Purpose heuristics ───────────────────────────────────────────────

const PURPOSE_MAP: Record<string, string> = {
	'/': 'Move library with search and filters',
	'/moves/[id]': 'Move detail page',
	'/tutorials': 'Coming-soon tutorials page',
	'/theory': 'Coming-soon theory page',
	'/community': 'Coming-soon community page',
	'/auth/login': 'Login and session creation',
	'/auth/signup': 'Registration and session creation',
	'/auth/logout': 'Session invalidation',
	'/upload': 'Upload/create move UI',
	'/admin': 'Admin move dashboard',
	'/admin/categories': 'Category management',
	'/admin/moves/new': 'Create move',
	'/admin/moves/[id]/edit': 'Edit or delete move',
	'/api/search': 'JSON move search',
	'/api/upload': 'R2 image upload',
	'/api/test-db': 'Database connectivity check'
};

function detectPurpose(routePath: string): string {
	return PURPOSE_MAP[routePath] || 'Unknown';
}

// ── Build commands object ────────────────────────────────────────────

function buildCommands(pkg: { scripts?: Record<string, string> }) {
	const s = pkg.scripts || {};
	return {
		development: {
			dev: 'npm run dev',
			build: 'npm run build',
			preview: 'npm run preview'
		},
		quality: {
			check: 'npm run check',
			lint: 'npm run lint',
			format: 'npm run format'
		},
		testing: {
			unitWatch: 'npm run test:unit',
			unitOnce: 'npm run test:unit -- --run',
			e2e: 'npm run test:e2e',
			all: 'npm test'
		},
		database: {
			push: 'npm run db:push',
			generate: 'npm run db:generate',
			migrate: 'npm run db:migrate',
			studio: 'npm run db:studio',
			seed: 'npm run db:seed',
			init: 'npm run db:init'
		}
	};
}

// ── Route table format helpers ───────────────────────────────────────

function formatRouteFiles(routePath: string, files: string[]): string {
	if (files.length === 0) return '';
	const routeDir = routePath === '/' ? 'src/routes' : `src/routes${routePath}`;
	return files.map((f, i) => (i === 0 ? `\`${routeDir}/${f}\`` : `\`${f}\``)).join(', ');
}

/** Build a markdown table row with padded columns */
function mdTableRow(cells: string[], widths: number[]): string {
	return (
		'| ' +
		cells
			.map((c, i) => {
				const pad = widths[i] || 0;
				return c.padEnd(pad);
			})
			.join(' | ') +
		' |'
	);
}

/** Compute display widths for table columns from data */
function computeWidths(rows: string[][], headers: string[]): number[] {
	return headers.map((h, i) => Math.max(h.length, ...rows.map((r) => (r[i] ? r[i].length : 0))));
}

// ── Markdown generation ──────────────────────────────────────────────

function generateMarkdown(data: {
	project: { name: string; version: string; updated: string };
	commands: Record<string, Record<string, string>>;
	routes: { path: string; methods: string[]; auth: string; files: string[] }[];
	database: { tables: Record<string, string[]>; indexes: string[] };
	components: string[];
	docs: Record<string, string>;
}): string {
	const lines: string[] = [];

	// Header
	lines.push(`# Project Index: ${data.project.name}`);
	lines.push('');
	lines.push(`**Updated:** ${data.project.updated}  `);
	lines.push(`**Version:** ${data.project.version}  `);
	lines.push(`**Package manager:** npm  `);
	lines.push('**Runtime:** Node.js >=18.0.0');
	lines.push('');

	// Overview
	lines.push('## Overview');
	lines.push('');
	lines.push(
		'AerialDB is a SvelteKit 2 + Svelte 5 app for cataloging aerial acrobatics moves. It runs locally against SQLite/libsql and deploys to Cloudflare Pages with D1 and R2 bindings.'
	);
	lines.push('');

	// Entry Points
	lines.push('## Entry Points');
	lines.push('');
	const cmdRows: string[][] = [];
	const cmdHeaders = ['Area', 'Commands'];
	for (const [area, cmds] of Object.entries(data.commands)) {
		const areaLabel = area.charAt(0).toUpperCase() + area.slice(1);
		cmdRows.push([areaLabel, Object.values(cmds).join(', ')]);
	}
	const cmdWidths = computeWidths(cmdRows, cmdHeaders);
	lines.push(mdTableRow(cmdHeaders, cmdWidths));
	lines.push(
		mdTableRow(
			cmdHeaders.map((_, i) => '-'.repeat(cmdWidths[i])),
			cmdWidths
		)
	);
	for (const row of cmdRows) {
		lines.push(mdTableRow(row, cmdWidths));
	}
	lines.push('');

	// Source Map
	lines.push('## Source Map');
	lines.push('');
	const srcRows = [
		['src/routes/', 'SvelteKit pages, layouts, form actions, and API endpoints'],
		['src/lib/components/', 'Shared Svelte UI components'],
		['src/lib/server/auth.ts', 'Session token generation, validation, cookies, invalidation'],
		['src/lib/server/password.ts', 'Scrypt password hashing and verification'],
		[
			'src/lib/server/db/index.ts',
			'`getDb(event)` dual-mode DB factory and local script `db` export'
		],
		[
			'src/lib/server/db/schema.ts',
			'Drizzle schema for `user`, `session`, `categories`, and `moves`'
		],
		['src/lib/server/db/seed.ts', 'Catalog seed utility'],
		['src/lib/utils/toon-parser.ts', 'Parser for custom TOON import format'],
		['messages/', 'Source i18n message JSON'],
		['wrangler.toml', 'Cloudflare Pages, D1, and R2 binding config']
	];
	const srcHeaders = ['Path', 'Purpose'];
	const srcWidths = computeWidths(srcRows, srcHeaders);
	lines.push(
		mdTableRow(
			srcHeaders.map((h, i) => `\`${h}\``),
			srcWidths
		)
	);
	// For header we don't use backticks in divider
	lines.push(
		mdTableRow(
			srcHeaders.map((_, i) => '-'.repeat(srcWidths[i])),
			srcWidths
		)
	);
	for (const [path, purpose] of srcRows) {
		lines.push(mdTableRow([`\`${path}\``, purpose], srcWidths));
	}
	lines.push('');

	// Routes
	lines.push('## Routes');
	lines.push('');
	const routeHeaders = ['Route', 'Methods', 'Auth', 'Files'];
	const routeRows: string[][] = data.routes.map((r) => [
		r.path,
		r.methods.join(', '),
		r.auth,
		formatRouteFiles(r.path, r.files)
	]);
	const routeWidths = computeWidths(routeRows, routeHeaders);
	lines.push(mdTableRow(routeHeaders, routeWidths));
	lines.push(
		mdTableRow(
			routeHeaders.map((_, i) => '-'.repeat(routeWidths[i])),
			routeWidths
		)
	);
	for (const row of routeRows) {
		lines.push(mdTableRow(row, routeWidths));
	}
	lines.push('');

	// Database Schema
	lines.push('## Database Schema');
	lines.push('');
	const dbHeaders = ['Table', 'Purpose', 'Important Columns'];
	const tablePurpose: Record<string, string> = {
		user: 'Auth users and roles',
		session: 'Session storage',
		categories: 'Base techniques/categories',
		moves: 'Catalog entries'
	};
	const dbRows: string[][] = Object.entries(data.database.tables).map(([name, cols]) => [
		`\`${name}\``,
		tablePurpose[name] || '',
		cols.map((c) => `\`${c}\``).join(', ')
	]);
	const dbWidths = computeWidths(dbRows, dbHeaders);
	lines.push(mdTableRow(dbHeaders, dbWidths));
	lines.push(
		mdTableRow(
			dbHeaders.map((_, i) => '-'.repeat(dbWidths[i])),
			dbWidths
		)
	);
	for (const row of dbRows) {
		lines.push(mdTableRow(row, dbWidths));
	}
	lines.push('');

	if (data.database.indexes.length > 0) {
		lines.push(
			'Indexes on `moves` optimize name ordering, category filters, level filters, and featured-move selection by `created_at`.'
		);
		lines.push('');
	}

	// Shared Components
	lines.push('## Shared Components');
	lines.push('');
	const componentPurpose: Record<string, string> = {
		'Header.svelte': 'Navigation, search overlay, mobile menu, account menu',
		'HeroBanner.svelte': 'Featured move banner',
		'MoveCard.svelte': 'Move-card display and favorite affordance',
		'SearchBar.svelte': 'Controlled search input',
		'FilterChips.svelte': 'Category and level filters',
		'YouTubeFacade.svelte': 'Lazy YouTube iframe facade'
	};
	const compHeaders = ['Component', 'Purpose'];
	const compRows: string[][] = data.components.map((c) => [`\`${c}\``, componentPurpose[c] || '']);
	const compWidths = computeWidths(compRows, compHeaders);
	lines.push(mdTableRow(compHeaders, compWidths));
	lines.push(
		mdTableRow(
			compHeaders.map((_, i) => '-'.repeat(compWidths[i])),
			compWidths
		)
	);
	for (const row of compRows) {
		lines.push(mdTableRow(row, compWidths));
	}
	lines.push('');
	lines.push('Component prop details are in `src/lib/components/README.md`.');
	lines.push('');

	// Key Docs
	lines.push('## Key Docs');
	lines.push('');
	const docLabels: Record<string, string> = {
		agentGuidelines: 'Authoritative coding-agent guidance',
		securityLessons: 'Security and reliability lessons learned',
		apiContracts: 'API contracts',
		componentRegistry: 'Component registry',
		toonFormat: 'TOON import format',
		cloudflareDeployment: 'Cloudflare deployment'
	};
	const docFileLabels: Record<string, string> = {
		agentGuidelines: 'AGENTS.md',
		securityLessons: '.Jules/sentinel.md',
		apiContracts: 'src/routes/api/README.md',
		componentRegistry: 'src/lib/components/README.md',
		toonFormat: 'mdocs/TOON_FORMAT.md',
		cloudflareDeployment: 'mdocs/CLOUDFLARE_DEPLOYMENT.md'
	};
	const docHeaders = ['File', 'Use'];
	const docRows: string[][] = [];
	for (const [key, path] of Object.entries(data.docs)) {
		if (path) {
			docRows.push([`\`${path}\``, docLabels[key] || '']);
		}
	}
	const docWidths = computeWidths(docRows, docHeaders);
	lines.push(mdTableRow(docHeaders, docWidths));
	lines.push(
		mdTableRow(
			docHeaders.map((_, i) => '-'.repeat(docWidths[i])),
			docWidths
		)
	);
	for (const row of docRows) {
		lines.push(mdTableRow(row, docWidths));
	}
	lines.push('');

	return lines.join('\n');
}

// ── Main ─────────────────────────────────────────────────────────────

function main() {
	// 1. Package.json
	const pkgRaw = readFileSafe(join(ROOT, 'package.json'));
	if (!pkgRaw) {
		console.error('ERROR: Cannot read package.json');
		process.exit(1);
	}
	let pkg: any;
	try {
		pkg = JSON.parse(pkgRaw);
	} catch {
		console.error('ERROR: Invalid package.json');
		process.exit(1);
	}

	// 2. Walk routes
	const srcRoutesDir = join(ROOT, 'src/routes');
	const routePaths = walkRoutes(srcRoutesDir, srcRoutesDir).sort();

	const routes: {
		path: string;
		methods: string[];
		auth: string;
		purpose: string;
		files: string[];
	}[] = [];

	for (const rp of routePaths) {
		const routeRelDir = rp === '/' ? '' : rp;
		const routeDir = join(ROOT, 'src/routes', routeRelDir);

		const pageServerContent = readFileSafe(join(routeDir, '+page.server.ts'));
		const serverContent = readFileSafe(join(routeDir, '+server.ts'));
		const layoutContent = readFileSafe(join(routeDir, '+layout.server.ts'));

		const files = getRouteFiles(rp);
		const methods = detectMethods(pageServerContent, serverContent, files.includes('+page.svelte'));
		const auth = detectAuth(pageServerContent, serverContent, layoutContent, rp);
		const purpose = detectPurpose(rp);

		routes.push({
			path: rp,
			methods,
			auth,
			purpose,
			files
		});
	}

	// 3. Parse schema
	const { tables, indexes } = parseSchema(join(ROOT, 'src/lib/server/db/schema.ts'));

	// 4. List components
	const componentsDir = join(ROOT, 'src/lib/components');
	let components: string[] = [];
	try {
		const compEntries = readdirSync(componentsDir, { withFileTypes: true });
		components = compEntries
			.filter((e) => e.isFile() && e.name.endsWith('.svelte'))
			.map((e) => e.name)
			.sort();
	} catch {
		console.error('WARNING: Could not read components directory');
	}

	// 5. Check docs
	const docs: Record<string, string> = {
		agentGuidelines: fileExists(join(ROOT, 'AGENTS.md')) ? 'AGENTS.md' : '',
		apiContracts: fileExists(join(ROOT, 'src/routes/api/README.md'))
			? 'src/routes/api/README.md'
			: '',
		componentRegistry: fileExists(join(ROOT, 'src/lib/components/README.md'))
			? 'src/lib/components/README.md'
			: '',
		toonFormat: fileExists(join(ROOT, 'mdocs/TOON_FORMAT.md')) ? 'mdocs/TOON_FORMAT.md' : '',
		securityLessons: fileExists(join(ROOT, '.Jules/sentinel.md')) ? '.Jules/sentinel.md' : '',
		cloudflareDeployment: fileExists(join(ROOT, 'mdocs/CLOUDFLARE_DEPLOYMENT.md'))
			? 'mdocs/CLOUDFLARE_DEPLOYMENT.md'
			: ''
	};

	// 6. Build JSON data
	const updated = new Date().toISOString().slice(0, 10);

	const jsonData = {
		project: {
			name: pkg.name || 'aerialdb',
			version: pkg.version || '0.0.1',
			type: pkg.type || 'module',
			updated,
			packageManager: 'npm',
			engines: pkg.engines || { node: '>=18.0.0' },
			stack: [
				'SvelteKit 2',
				'Svelte 5 runes',
				'TailwindCSS v4',
				'Drizzle ORM',
				'SQLite/libsql local',
				'Cloudflare Pages',
				'Cloudflare D1',
				'Cloudflare R2',
				'Paraglide JS',
				'Vitest',
				'Playwright'
			]
		},
		commands: buildCommands(pkg),
		source: {
			routes: 'src/routes',
			components: 'src/lib/components',
			server: 'src/lib/server',
			schema: 'src/lib/server/db/schema.ts',
			dbFactory: 'src/lib/server/db/index.ts',
			toonParser: 'src/lib/utils/toon-parser.ts',
			messages: 'messages',
			cloudflare: 'wrangler.toml'
		},
		database: {
			accessPattern: 'Use getDb(event) in route files; use db export only for local scripts.',
			tables,
			indexes
		},
		routes: routes.map((r) => ({
			path: r.path,
			methods: r.methods,
			auth: r.auth,
			purpose: r.purpose
		})),
		components,
		docs
	};

	// 7. Write JSON
	const jsonPath = join(ROOT, 'mdocs/PROJECT_INDEX.json');
	writeFileSync(jsonPath, JSON.stringify(jsonData, null, '\t') + '\n');
	console.log(`✓ Wrote ${jsonPath}`);

	// 8. Generate and write Markdown
	const mdContent = generateMarkdown({
		project: jsonData.project as { name: string; version: string; updated: string },
		commands: jsonData.commands as Record<string, Record<string, string>>,
		routes: jsonData.routes.map((r) => ({
			...r,
			files: routes.find((rr) => rr.path === r.path)?.files || []
		})),
		database: jsonData.database,
		components: jsonData.components,
		docs: jsonData.docs
	});
	const mdPath = join(ROOT, 'mdocs/PROJECT_INDEX.md');
	writeFileSync(mdPath, mdContent + '\n');
	console.log(`✓ Wrote ${mdPath}`);
}

main();
