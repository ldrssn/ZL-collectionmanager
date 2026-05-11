## Session: January 2, 2026 (Morning)
**Focus**: The Cloud Pivot: Supabase Infrastructure
**Role Perspective**: Systems Architect

---

### 1. Moving Beyond LocalStorage
The project transitioned from a local-only utility to a cloud-synced platform. The primary goal was cross-device availability without sacrificing the simplicity of the existing data model.

#### Key Decisions: Why Supabase?
We evaluated Firebase but chose **Supabase (PostgreSQL)** because it offered a free tier in the **Frankfurt (Germany)** region, ensuring data residency in compliance with the user's requirements.

#### Technical Implementation: RLS
We established **Row-Level Security (RLS)** as a non-negotiable architectural layer. Every table (items, combinations) was locked so that `auth.uid() = user_id`.

```sql
-- The Security Guard
CREATE POLICY "Individual User Access" 
ON items FOR ALL 
USING (auth.uid() = user_id);
```

---

### 2. Cloud Image Storage
**Concept**: "Ditching Base64"
Previously, images were likely stored as bulky Base64 strings in `localStorage`, which is prone to crashing the browser.

#### Solution: Supabase Storage
We created the `collection-images` bucket. The challenge was handling the **1GB limit**.
- **Decision**: Implemented client-side compression (targeting ~100KB per image) to ensure the collection could scale to thousands of items within the free tier.
