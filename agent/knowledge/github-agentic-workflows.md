---
title: GitHub Agentic Workflows (gh-aw)
last_updated: 2026-03-12
sources:
  - url: https://github.com/github/gh-aw
    title: gh-aw GitHub Repository
  - url: https://github.github.com/gh-aw/introduction/how-they-work/
    title: GitHub Agentic Workflows — How They Work
  - url: https://github.github.com/gh-aw/reference/engines/
    title: gh-aw Engine Reference
---

# GitHub Agentic Workflows (gh-aw)

GitHub Agentic Workflows (`gh-aw`) is the underlying platform that powers AgentPages. It's a GitHub CLI extension that lets you write agentic workflows in **natural language markdown** and run them inside GitHub Actions.

## What Makes It "Agentic"

Traditional GitHub Actions workflows execute pre-programmed steps with fixed if/then logic. Agentic workflows are different:

| | Traditional Workflows | Agentic Workflows |
|---|---|---|
| Logic | Pre-programmed, deterministic | AI-driven, context-aware |
| Instructions | YAML steps | Natural language markdown |
| Adaptability | Same behavior every run | Adapts to each situation |
| Decision-making | None | Full AI reasoning |

An agentic workflow understands context, makes decisions, and generates content — combining deterministic GitHub Actions infrastructure with flexible AI decision-making.

## Workflow Structure

Every `gh-aw` workflow is a markdown file with YAML frontmatter:

```markdown
---
on:
  schedule:
    - cron: '0 */12 * * *'
permissions:
  contents: write
tools:
  - tavily
engine:
  id: claude
  model: claude-sonnet-4-6
---

# Natural Language Instructions

Research the latest news about quantum computing.
Update the knowledge base in agent/knowledge/.
...
```

The frontmatter defines **when** it runs (triggers), **what** it can access (permissions), and **which tools** and **AI engine** to use. The markdown body is plain English instructions the AI interprets and acts on.

## Supported AI Engines

| Engine | `engine.id` | Required Secret |
|--------|-------------|-----------------|
| GitHub Copilot CLI (default) | `copilot` | `COPILOT_GITHUB_TOKEN` |
| Claude by Anthropic | `claude` | `ANTHROPIC_API_KEY` |
| OpenAI Codex | `codex` | `OPENAI_API_KEY` |
| Google Gemini CLI | `gemini` | `GEMINI_API_KEY` |

Copilot is the default — you can omit `engine:` entirely to use it. Switching engines requires recompiling the workflow with `gh aw compile`.

## Tools and MCP

Workflows access capabilities through the **Model Context Protocol (MCP)** — a standardized protocol for connecting AI agents to external tools and services. Available tool categories include:

- **GitHub operations** — read/write issues, PRs, files, comments
- **Web search** — Tavily API for real-time research
- **File operations** — read and write files in the repo
- **Custom MCP scripts** — inline tool definitions in the frontmatter

## Security Architecture

Security is foundational to `gh-aw`. The system uses defense-in-depth:

- **Read-only by default** — workflows have no write permissions unless explicitly granted
- **Safe outputs** — write operations go through a sanitization layer before being applied
- **Sandboxed execution** — AI runs in an isolated container with a network firewall
- **Tool allowlisting** — AI can only use tools explicitly listed in the frontmatter
- **Prompt injection defense** — inputs from issues, PRs, and external sources are treated as untrusted data
- **SHA-pinned dependencies** — supply chain security via locked action versions
- **Human approval gates** — critical operations can require human confirmation

## Compile → Lock File

The workflow `.md` file is the editable source of truth. Running `gh aw compile` generates a `.lock.yml` — the compiled GitHub Actions workflow with all security hardening baked in. Both files must be committed.

```bash
# Install the extension
gh extension install github/gh-aw

# Compile a workflow
gh aw compile .github/workflows/research.md

# Trigger a run manually
gh aw run research

# View logs and costs
gh aw logs
```

## Companion Projects

| Project | Purpose |
|---------|---------|
| [gh-aw-firewall (AWF)](https://github.com/github/gh-aw-firewall) | Network egress control — domain-based allowlists for AI agents |
| [MCP Gateway](https://github.com/github/gh-aw-mcpg) | Routes MCP server calls through a unified HTTP gateway |
| [gh-aw-actions](https://github.com/github/gh-aw-actions) | Shared library of custom Actions used by compiled workflows |

## Continuous AI

`gh-aw` enables what GitHub Next calls **Continuous AI** — systematic, automated application of AI to software collaboration. Common patterns include:

- Keeping documentation current automatically
- Incrementally improving code quality
- Intelligently triaging issues and PRs
- Automating code review
- Maintaining research knowledge bases (AgentPages)
