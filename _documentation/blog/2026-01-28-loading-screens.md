---
title: "The Art of the Wait: Loading Screens"
date: "2026-01-28"
tags: ["UX", "Performance", "States"]
---

# The Art of the Wait: Loading Screens

There’s nothing worse in a cloud app than a "ghost" empty state—that split second where the app says "You have no items" before the data finishes loading. Today, I fixed that.

### Visual Gating
I’ve implemented a dedicated **Loading Screen** that gates the entire UI. The app now waits for both the authentication and the data fetch to be 100% complete before showing the collection. 

### Brand Continuity
To make the wait pleasant, I designed a custom SVG animation with pulsing pink dots. It’s a small touch of brand continuity that makes the app feel stable and intentional, even when it’s working behind the scenes.
