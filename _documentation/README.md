# Universal Documentation Protocol (UDP)

This directory implements a **3-Layer Documentation Architecture** designed to professionalize project history for elite-level UX and Digital Conception portfolios. Any agent (AI or human) interacting with this repository must adhere to the following standards.

---

## I. Architecture: The Three Tiers

### 1. The Expert Journal (`/journal/`)
*   **Purpose**: Internal technical source of truth.
*   **Perspective**: Systems Architect / Lead Developer.
*   **Tone**: Analytical, granular, decision-centric.
*   **Naming**: `YYYY-MM-DD-technical-topic-slug.md`
*   **Content**: Focus on "The How." Document exact architectural choices, technical hurdles, and logic definitions.
*   **Input**: Development logs, Git history, and technical walkthroughs.

### 2. The Dev-Blog (`/blog/`)
*   **Purpose**: Public-facing chronological narrative.
*   **Perspective**: Digital Concepter / Builder-in-Public.
*   **Tone**: Narrative, engaging, enthusiast-first.
*   **Naming**: `YYYY-MM-DD-narrative-title-slug.md`
*   **Content**: Focus on "The Story." Transform technical sessions into compelling updates that highlight progress and perceived quality.
*   **Input**: Derived from the corresponding `journal/` entry.

### 3. The Professional Portfolio (`/portfolio/`)
*   **Purpose**: High-level strategic case studies.
*   **Perspective**: Product Owner / UX Director.
*   **Tone**: Authoritative, strategic, expertise-driven.
*   **Naming**: `evergreen-strategic-topic-slug.md` (No dates).
*   **Content**: Focus on "The Why." Highlight strategic objectives, professional competencies, and business/UX outcomes.
*   **Input**: Synthesized from one or more `journal/` entries.

---

## II. Synthesis Workflow (Multi-Agent Protocol)

This section defines how information must be translated between tiers.

### From Journal to Blog (The "Narrative Lift")
1.  **Identify the Conflict**: Extract a technical hurdle from the journal and frame it as a narrative "challenge."
2.  **Focus on the User**: Shift the focus from *how the code works* to *how the feature feels* to the user.
3.  **Visual Language**: Highlight aesthetic and UX refinements over architectural details.

### From Journal to Portfolio (The "Strategic Consolidation")
1.  **Extract the "Why"**: Ignore implementation details; identify the high-level business or product goal.
2.  **Identify Competencies**: Map the work to professional skills (e.g., IA, Systems Design, IxD).
3.  **Evergreen Update**: If a portfolio entry already exists for a topic, update it with the new "Current Best State" from the journal.

---

## III. Naming & Metadata Standards

### Filenames
- Use lowercase and hyphens only.
- Logs (`journal`, `blog`) **must** be prefixed with `YYYY-MM-DD-`.
- Portfolio assets **must not** contain dates in the filename to maintain "evergreen" status.

### Frontmatter
Every file should begin with a standard YAML block:
```yaml
title: "Clear Descriptive Title"
category: "One of: Systems Design, UX Strategy, Product Design, Interaction Design"
tags: ["Skill-1", "Skill-2", "Technology-1"]
```

---

## IV. Content Principles (The UDP Code)

1.  **The "Agency" Rule**: Never say "I added a button." Say "I implemented a high-contrast interaction point to reduce cognitive load under direct sunlight."
2.  **Layered Detail**: 
    - *Journal* = Code/Logic. 
    - *Blog* = UX/Narrative. 
    - *Portfolio* = Strategy/Expertise.
3.  **Project Isolation**: Ensure project-specific aesthetics are never mixed. Always verify the current project's brand identity before generating content.
4.  **Evergreen Portfolio**: Portfolio entries should describe the system's *current* best state, not the historical process of getting there.

---

## V. Agent Instructions (System Prompt)

1.  **Research**: Audit the Git log and `_documentation/` files to identify the project's current maturity.
2.  **Synthesis**: When creating a Blog or Portfolio entry, **always use the corresponding Journal entry as the primary source of truth.**
3.  **Execute**: Generate content that adheres to the naming and structural standards above.
4.  **The "Agency" Rule**: Never say "I added a button." Say "I implemented a high-contrast interaction point to reduce cognitive load."
5.  **Audit**: Perform a cross-project terminology check to ensure no "leaked" concepts from other repositories.
