---
title: Getting Started with AgentPages
last_updated: 2026-03-12
sources:
  - url: https://github.com/idorozin/AgentPages
    title: AgentPages GitHub Repository — Quick Start
  - url: https://github.github.com/gh-aw/reference/engines/
    title: gh-aw Engine Reference
---

# Getting Started with AgentPages

This guide walks through setting up your own AgentPages instance — from forking the repo to your first AI-generated research site.

## Prerequisites

- A GitHub account with GitHub Pages enabled
- Node.js (for local Astro builds, optional)
- An AI API key (Anthropic Claude, OpenAI Codex, Google Gemini, or GitHub Copilot)
- A Tavily API key (free tier: 1,000 searches/month)

## Step-by-Step Setup

### 1. Fork the Repository

Click **Fork** on [idorozin/AgentPages](https://github.com/idorozin/AgentPages) to create your own copy. Keep the default branch as `main`.

### 2. Install the gh-aw CLI

```bash
gh extension install github/gh-aw
```

This installs the GitHub Agentic Workflows CLI extension, which compiles and runs agentic workflow markdown files.

### 3. Set Up API Secrets

```bash
# Required: Tavily for web search (get key at https://tavily.com)
gh aw secrets set TAVILY_API_KEY --value "tvly-..."

# Required: your chosen AI engine API key
gh aw secrets set ANTHROPIC_API_KEY --value "sk-ant-..."
# OR: gh aw secrets set OPENAI_API_KEY --value "sk-..."
# OR: gh aw secrets set GEMINI_API_KEY --value "..."
```

Tavily is used for web search during research. The AI engine key powers the agent's reasoning.

### 4. Choose Your AI Engine

Open `.github/workflows/research.md` and update the `engine` block:

```yaml
engine:
  id: claude          # claude | codex | gemini | copilot
  model: claude-sonnet-4-6
```

After editing, recompile:

```bash
gh aw compile .github/workflows/research.md
```

### 5. Define Your Research Focus

Edit `user/profile.md` — this is the most important file. Describe what you want researched:

```markdown
## What to Research
I'm tracking developments in renewable energy, particularly solar panel
efficiency improvements and grid-scale storage solutions.

## Focus Areas
- Perovskite solar cell breakthroughs
- Grid-scale battery storage (lithium, flow batteries, etc.)
- Policy changes affecting solar adoption
- Cost curves and levelized cost of energy (LCOE)

## Personality
- Technical depth for engineers
- Include cost/performance numbers where available
- Cite primary sources
```

Also edit `user/website.md` to set your site title, tagline, and style preferences.

### 6. Configure GitHub Pages

Edit `website/astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://YOUR_USERNAME.github.io',
  base: '/YOUR_REPO_NAME',
});
```

Then go to your repo **Settings → Pages → Source: Deploy from a branch → Branch: `main`, Folder: `/docs` → Save**.

### 7. Compile and Push

```bash
gh aw compile .github/workflows/research.md
git add .
git commit -m "Configure my AgentPages instance"
git push
```

### 8. Run the Agent

Wait for the 12-hour cron schedule, or trigger manually:

```bash
gh aw run research
```

The agent will create a PR with its first research batch. The `auto-merge.yml` workflow will automatically merge it.

## Tips and Gotchas

### Be Specific in `profile.md`
Vague research areas produce vague results. The more specific your focus areas, the more useful the output. Include example questions you want answered.

### Use `user/requests/` for One-Off Topics
Don't clutter `profile.md` with temporary interests. Create a request file with `status: new`:

```markdown
---
status: new
priority: high
created: 2026-03-12
---
# Research Request: Q1 2026 Solar Panel Efficiency Records

What are the latest efficiency records for solar panels in Q1 2026?
Which manufacturers are leading?
```

Mark it `status: completed` once addressed, or the agent will keep picking it up.

### Auto-Merge Requires Actions Permissions
The `auto-merge.yml` workflow needs permissions to merge PRs. Ensure **Settings → Actions → General → Workflow permissions** is set to "Read and write permissions" and "Allow GitHub Actions to create and approve pull requests" is checked.

### Tavily Free Tier Limits
The free Tavily tier gives 1,000 searches/month. With 5 searches per run and 2 runs/day, that's ~300 searches/month — well within the free tier.

### Website Not Updating?
If the site isn't reflecting changes, check:
1. GitHub Pages is configured to serve from `docs/` on `main`
2. The PR was auto-merged (check the Actions tab)
3. The `astro build` step didn't fail (check PR diff for `docs/` changes)

## Giving Feedback

After reviewing the agent's output:
- **Edit `user/feedback.md`** for ongoing guidance
- **Create `user/requests/` files** for specific topics
- **Edit `user/profile.md`** to shift focus permanently

The agent reads all user files at the start of every run.
