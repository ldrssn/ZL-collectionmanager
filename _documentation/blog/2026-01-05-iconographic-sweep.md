---
title: "Day 4: The Iconographic Sweep"
date: "2026-01-05"
tags: ["Design", "Branding", "Refactoring"]
---

# Day 4: The Iconographic Sweep

Today was all about visual consistency. A professional app needs a unified language, and we were falling short with a mix of different SVG styles and hardcoded icons.

### Unified MaterialIcons
I’ve introduced a centralized `MaterialIcon` component. It’s a small change with a huge impact. By replacing every raw SVG across the app with this component, I can now control the weight and style of every icon from one place. The entire UI suddenly feels much more cohesive.

### Making it Personal
I also added a feature that lets users name their collection (e.g., "Leonhard's ZoéLu Archive"). It’s a small touch of personalization that makes the tool feel like a bespoke digital home for your collection.
