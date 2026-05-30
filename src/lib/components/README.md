# Component Registry

Shared Svelte components use Svelte 5 runes and local `Props` interfaces. Keep user-visible strings in Paraglide messages when adding new UI text.

| Component              | Props                                                                                | Responsibility                                                           |
| ---------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `Header.svelte`        | `user?: { username: string } \| null`                                                | Sticky navigation, global search overlay, mobile menu, account menu      |
| `HeroBanner.svelte`    | `move: { id, name, imageUrl, level, category } \| null`                              | Landing-page featured move banner with placeholder state                 |
| `MoveCard.svelte`      | `move`, `isFavorited?`, `onToggleFavorite?`                                          | Clickable move card with image, category, level, and favorite affordance |
| `SearchBar.svelte`     | `value`, `placeholder?`, `oninput?`, `onclear?`                                      | Controlled search input with clear button                                |
| `FilterChips.svelte`   | `categories`, `activeApparatus`, `activeLevel`, `onSelectApparatus`, `onSelectLevel` | Home-page category and level filter chip groups                          |
| `YouTubeFacade.svelte` | `videoId`, `title`                                                                   | Lazy YouTube embed facade that loads iframe only after user interaction  |

## Relationships

| Page          | Components                                           |
| ------------- | ---------------------------------------------------- |
| `/`           | `HeroBanner`, `SearchBar`, `FilterChips`, `MoveCard` |
| root layout   | `Header`                                             |
| `/moves/[id]` | `YouTubeFacade` when a move has a YouTube video      |

## Testing

Component specs live next to components as `*.svelte.spec.ts`. Browser component tests use the Vitest `client` project configured in `vite.config.ts`.
