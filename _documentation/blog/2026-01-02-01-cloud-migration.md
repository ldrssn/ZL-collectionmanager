---
title: "Day 1 (AM): The Great Cloud Migration"
date: "2026-01-02"
tags: ["Supabase", "Cloud", "Backend"]
---

# Day 1 (AM): The Great Cloud Migration

Today marks a major turning point for the Collection Manager. We’re moving beyond the limitations of local browser storage and into a professional cloud environment.

### Why the move?
As the collection grows, relying on `localStorage` becomes risky. Data can be lost if a browser cache is cleared, and there’s no easy way to access the collection from another device. 

### The Solution: Supabase
I’ve chosen Supabase for our backend. It gives us a real PostgreSQL database with the flexibility we need. Most importantly, I’ve set it up in the **Frankfurt region** to ensure data residency and speed. The core of this morning was spent setting up the tables and establishing **Row-Level Security (RLS)**. It’s a great feeling knowing that even at this early stage, the data is mathematically isolated and secure.

Onward to the migration logic this afternoon!
