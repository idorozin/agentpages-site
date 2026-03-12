---
title: How AgentPages Works
last_updated: 2026-03-12
sources:
  - url: https://github.com/idorozin/AgentPages
    title: AgentPages GitHub Repository
  - url: https://github.github.com/gh-aw/introduction/how-they-work/
    title: GitHub Agentic Workflows — How They Work
---

# How AgentPages Works

AgentPages is an open-source GitHub repository template that turns any repo into an **AI-maintained research website**. Once configured, an AI agent automatically researches topics, updates a knowledge base, builds a static site, and publishes it via GitHub Pages — all without manual intervention.

## The Core Loop

The system runs on a 12-hour cron schedule (or manual trigger) via a GitHub Agentic Workflow:

```
user/          →  You define what to research
    ↓
agent/         →  AI maintains knowledge & memory
    ↓
website/src/   →  AI updates the Astro source files
    ↓
docs/          →  Astro builds the website (served by GitHub Pages)
```

Each run, the agent:
1. Reads instructions from `user/` (profile, feedback, requests)
2. Researches topics using Tavily web search
3. Updates its knowledge base in `agent/knowledge/`
4. Edits Astro source files in `website/src/`
5. Builds the site into `docs/` with `npx astro build`
6. Creates a PR — auto-merged by a companion `auto-merge.yml` workflow

## Separation of Concerns

The project cleanly separates responsibilities:

| Directory | Owned By | Purpose |
|-----------|----------|---------|
| `user/` | **You** | Research focus, style prefs, feedback, requests |
| `agent/` | **Agent** | Knowledge files, memory, action log, plan |
| `website/src/` | **Agent** | Astro source pages and data |
| `docs/` | **Build** | Compiled static site output — never edit directly |

## Key Components

### `user/profile.md`
Defines what to research, the agent's personality, tone, and goals. This is the primary control interface.

### `user/requests/`
A folder of markdown files for specific one-off research requests. Each request has a `status` field (`new` → `in-progress` → `completed`).

### `agent/knowledge/`
One markdown file per research topic, with YAML frontmatter tracking `last_updated` and `sources`. The agent refreshes topics older than 7 days.

### `agent/memory/`
Three files that give the agent continuity between runs:
- `log.md` — append-only record of what was done each run
- `plan.md` — current priorities and backlog
- `state.json` — counters and timestamps (run count, last run, topics count)

### `website/src/data/site.json`
The central data file. Contains the site title, tagline, and the full `topics` array. Topic pages read from this to render cards on the homepage.

### Astro Static Site
The website is built with [Astro](https://astro.build), a modern static site generator. Source files in `website/src/` are compiled by `npx astro build` into `docs/`. GitHub Pages serves `docs/` directly from the `main` branch.

## Auto-Merge Workflow

Agent PRs are automatically merged via `auto-merge.yml`. This enables a fully hands-off update cycle: the agent researches, builds, creates a PR, and the PR is auto-merged — the live site updates within minutes.

## How the Agent Decides What to Research

Priority order each run:
1. **Explicit requests** in `user/requests/` with `status: new`
2. **Stale topics** not updated in over 7 days
3. **New angles** on existing topics
4. **New related topics** discovered within the user's focus areas

The agent limits itself to 2–3 topics per run to stay focused and within API rate limits.
