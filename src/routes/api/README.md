# API Endpoints

This directory contains JSON endpoints used by the SvelteKit app. Internal errors should be logged server-side and not exposed to clients.

## `GET /api/search`

Public search endpoint for move autocomplete/list results.

| Query Param | Required | Notes                                                  |
| ----------- | -------- | ------------------------------------------------------ |
| `q`         | Yes      | Trimmed to 100 chars; returns no results below 3 chars |
| `category`  | No       | Category id, trimmed to 100 chars                      |

Response `200`:

```json
{
	"moves": [
		{
			"id": "move-id",
			"name": "Move Name",
			"imageUrl": null,
			"level": "beginner",
			"category": { "id": "category-id", "name": "Silks" }
		}
	]
}
```

Search escapes SQLite LIKE wildcards and limits results to 50.

## `POST /api/upload`

Admin-only image upload endpoint backed by Cloudflare R2.

Request: `multipart/form-data` with field `image`.

Validation:

- authenticated admin user required, otherwise `403`
- file required, otherwise `400`
- max file size is 5 MB
- allowed MIME types are `image/jpeg`, `image/png`, and `image/webp`
- production requires `platform.env.IMAGES` and `PUBLIC_R2_URL`

Success response `200`:

```json
{ "url": "https://bucket.example/generated-file.jpg" }
```

Error response:

```json
{ "error": "Invalid file type (JPEG, PNG, WebP only)" }
```

## `GET /api/test-db`

Admin-only database connectivity check.

Success response `200`:

```json
{
	"success": true,
	"message": "Database connection working",
	"hasUsers": true,
	"platform": "Cloudflare"
}
```

Failures return `403` for non-admin users or `500` with a generic error message if the connection check fails.

## `POST /auth/logout`

Form endpoint, not JSON. If a session exists, it invalidates the session, clears the cookie, and redirects to `/` with status `302`.
