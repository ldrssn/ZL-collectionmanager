---
title: "Day 1 (Eve): Going Live on Vercel"
date: "2026-01-02"
tags: ["Deployment", "Vercel", "SPA"]
---

# Day 1 (Eve): Going Live on Vercel

To wrap up a massive first day of cloud development, we are now officially live on Vercel.

### The SPA Routing Challenge
One thing about React apps (Single Page Applications) is that they can be finicky when hosted. If you refresh the page on a sub-route, you often get a 404 error. I solved this today with a custom `vercel.json` configuration that funnels all traffic through the main index file.

### German-First Auth
I also took some time this evening to localize the authentication error messages. There’s nothing more off-putting than a technical English error message when you’re trying to log in. Now, every response from Supabase is mapped to a clear, professional German equivalent.

A long day, but the Collection Manager is now a truly global, cloud-hosted application.
