# TrustHire Growth Features

Implemented as part of the Phase 7 growth sprint.

## 1. Embeddable Risk Widget

**Endpoint:** `GET /api/widget?url=<target>&theme=light|dark`

Anyone can embed a live risk badge on their site:

```html
<!-- Add this div where you want the widget -->
<div data-trusthire-url="https://github.com/owner/repo"
     data-trusthire-theme="dark"></div>

<!-- Load the widget script (async, no-blocking) -->
<script src="https://trusthire.vercel.app/widget.js" async></script>
```

Returns cached results (1h via Vercel Edge). CORS open for cross-origin embeds.

---

## 2. Dynamic SVG Badge for GitHub READMEs

**Endpoint:** `GET /api/badge/[owner]/[repo]`

Add to any README.md:

```markdown
![TrustHire](https://trusthire.vercel.app/api/badge/owner/repo-name)
```

The badge auto-updates (24h cache) and shows current risk level.

**Badge states:**
- 🟢 `✓ Safe (12)` — score < 40
- 🟡 `⚠ Risk: 55` — score 40–74
- 🔴 `✗ High Risk: 82` — score ≥ 75

---

## 3. Public Scam Database (SEO Engine)

**Pages:**
- `/scams` — paginated list of confirmed reports
- `/scams/[slug]` — individual report with structured data (schema.org/Report)
- `/report` — community submission form

**API:**
- `POST /api/reports` — submit new report
- `GET /api/reports` — list confirmed reports (paginated)
- `POST /api/reports/vote` — upvote/downvote a report

**Auto-promotion:** Reports with ≥ 3 upvotes auto-promoted from `pending` → `confirmed`.

### Prisma Schema Addition

Add to `prisma/schema.prisma`:

```prisma
model ScamReport {
  id            String   @id @default(cuid())
  slug          String   @unique
  recruiterName String
  recruiterUrl  String?
  platform      String   @default("unknown")
  description   String
  evidence      String?
  upvotes       Int      @default(0)
  status        String   @default("pending") // pending | confirmed | rejected
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([status])
  @@index([upvotes])
}
```

Run migration:
```bash
npx prisma migrate dev --name add_scam_reports
npx prisma generate
```

---

## Next Steps (Phase 8)

- [ ] Telegram Bot `@TrustHireBot`
- [ ] Public API with rate-limited free tier + Stripe
- [ ] GitHub Action for CI/CD security checks
