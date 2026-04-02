<!-- Context: development/infrastructure/lookup/cloudflare-limits | Priority: low | Version: 1.0 | Updated: 2026-03-28 -->

# Cloudflare Free Tier Limits

**Purpose**: Quick reference for Cloudflare free tier limits relevant to AerialDB.

## Service Limits

| Service             | Limit     | AerialDB Usage |
| ------------------- | --------- | -------------- |
| **D1 Storage**      | 5 GB      | ~1 MB          |
| **D1 Reads**        | 5M/day    | ~1K/day        |
| **D1 Writes**       | 100K/day  | ~10/day        |
| **R2 Storage**      | 10 GB     | ~100 MB        |
| **R2 Reads**        | Unlimited | —              |
| **R2 Writes**       | 1M/month  | ~100/month     |
| **Pages Bandwidth** | Unlimited | ~1K req/day    |
| **Pages Builds**    | 500/month | ~10/month      |

## Cost

| Service          | Free Tier           | Monthly Cost |
| ---------------- | ------------------- | ------------ |
| Cloudflare Pages | Unlimited bandwidth | **$0**       |
| D1 Database      | 5GB, 5M reads       | **$0**       |
| R2 Storage       | 10GB, 1M writes     | **$0**       |
| **Total**        |                     | **$0**       |

## Backup

```bash
npx wrangler d1 export aerialdb-production --output=backup.sql
```

## Related

- `../guides/cloudflare-deployment.md` — Deployment guide
- `../lookup/cloudflare-commands.md` — CLI commands
