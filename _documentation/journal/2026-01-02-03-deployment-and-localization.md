## Session: January 2, 2026 (Evening)
**Focus**: Vercel & SPA Deployment Strategy
**Role Perspective**: DevOps / Frontend Architect

---

### 1. Vercel Hosting Integration
To support the new cloud version, we moved from local hosting to **Vercel**.

#### Technical Implementation: SPA Routing
Vercel's default behavior doesn't always handle React Router (Single Page Application) paths correctly when a user refreshes the page on a sub-route.

#### Solution: `vercel.json` Rewrites
We implemented a rewrite rule to ensure all requests are funneled through `index.html`, allowing React to handle the routing logic.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

### 2. Localization (German-First)
**Concept**: "Trust through Familiarity"
Authentication is a high-friction area. If error messages from Supabase appear in English, it can break user trust.

#### Implementation: Error Mapping
We built an error mapping utility that intercepts Supabase Auth responses and translates them into clear, actionable German messages (e.g., "Diese E-Mail wird bereits verwendet" instead of "User already exists").
