---
title: AI Engine Comparison
last_updated: 2026-03-12
sources:
  - url: https://github.github.com/gh-aw/reference/engines/
    title: AI Engines Reference — GitHub Agentic Workflows
  - url: https://github.github.com/gh-aw/llms-full.txt
    title: gh-aw Full Documentation (llms-full.txt)
  - url: https://github.com/github/gh-aw
    title: gh-aw GitHub Repository
---

# AI Engine Comparison: Claude vs Copilot vs Codex vs Gemini

GitHub Agentic Workflows supports four AI engines (called "coding agents") for running your agentic workflows. Each has different strengths, pricing models, and configuration options. For AgentPages users, choosing the right engine directly affects research quality, cost, and reliability.

## The Four Engines

| Engine | `engine.id` | Provider | Required Secret | Default Model |
|--------|-------------|----------|-----------------|---------------|
| GitHub Copilot CLI | `copilot` *(default)* | GitHub/Microsoft | `COPILOT_GITHUB_TOKEN` | `gpt-5` |
| Claude Code | `claude` | Anthropic | `ANTHROPIC_API_KEY` | `claude-sonnet-4-6` |
| OpenAI Codex | `codex` | OpenAI | `OPENAI_API_KEY` | varies |
| Google Gemini CLI | `gemini` | Google | `GEMINI_API_KEY` | varies |

**Copilot is the default.** If you omit the `engine:` block entirely, gh-aw uses Copilot CLI.

## GitHub Copilot CLI

Copilot CLI (`copilot`) is the default engine and the easiest to set up if you're already a GitHub Copilot subscriber.

**Pros:**
- No extra API key — uses your existing GitHub token
- Tight integration with GitHub's ecosystem
- Supports custom agent files in `.github/agents/`
- Free tier available (Copilot subscription included)
- Billing through GitHub rather than a separate API provider

**Cons:**
- Requires an active GitHub Copilot subscription
- Less granular model control compared to direct API access

**Configuration:**

```yaml
engine:
  id: copilot
  model: gpt-5           # or gpt-5-mini, gpt-4.1, gpt-4.1-mini
  agent: research-agent  # optional: references .github/agents/research-agent.agent.md
```

**Custom agent files** are a unique Copilot feature — you can define a specialized system prompt in `.github/agents/` that's applied whenever the engine runs.

## Claude (Claude Code)

Claude by Anthropic is one of the most popular engines for AgentPages, and is the default engine in the official AgentPages template.

**Pros:**
- Excellent long-context reasoning — handles large knowledge bases well
- Strong instruction-following for complex research prompts
- Wide range of models from frontier (Claude Opus) to budget (Claude Haiku)
- Well-suited for nuanced writing and synthesis tasks

**Cons:**
- Requires an Anthropic API key and direct billing to Anthropic
- Claude Code CLI adds overhead vs. direct API

**Configuration:**

```yaml
engine:
  id: claude
  model: claude-sonnet-4-6   # recommended for research
  # model: claude-opus-4-6   # highest quality, higher cost
  # model: claude-haiku-4-5  # fastest, lowest cost — good for simple tasks
```

**Choosing a Claude model:**
- `claude-opus-4-6` — best for complex, multi-step research synthesis
- `claude-sonnet-4-6` — best balance of quality and cost (AgentPages default)
- `claude-haiku-4-5` — triage, labeling, structured outputs, quick summaries

## OpenAI Codex

OpenAI's Codex engine gives access to OpenAI's latest models including the GPT-5 series.

**Pros:**
- Access to GPT-5, GPT-4.1, and o-series reasoning models
- Strong at code-heavy tasks and structured data extraction
- Familiar for developers already using the OpenAI API
- o-series models excel at multi-step planning tasks

**Cons:**
- Requires a separate OpenAI API account
- Pricing can be higher for frontier models

**Configuration:**

```yaml
engine:
  id: codex
  model: gpt-5          # frontier model
  # model: gpt-4.1      # balanced quality/cost
  # model: gpt-4.1-mini # budget option
```

## Google Gemini CLI

Google's Gemini engine is the newest addition to gh-aw.

**Pros:**
- Access to Gemini 2.5 Pro and Flash models
- Very large context windows — Gemini 1.5 Pro supports 1M tokens
- Competitive pricing, especially for Flash tier
- Strong multimodal capabilities

**Cons:**
- Newest engine — less battle-tested in production gh-aw use
- Requires Google API key setup

**Configuration:**

```yaml
engine:
  id: gemini
  model: gemini-3-pro-preview  # or gemini-2.5-flash for budget
```

## Choosing an Engine for AgentPages

For a research agent like AgentPages, here's how to think about the choice:

| Use Case | Recommended Engine | Why |
|---|---|---|
| Getting started quickly | Copilot | No extra API key needed |
| Best research quality | Claude (Sonnet/Opus) | Strong synthesis and writing |
| Budget-conscious operation | Claude Haiku or GPT-4.1 mini | Much lower cost per run |
| Code-heavy research | Codex (GPT-5) | Strong at extracting technical content |
| Large knowledge bases | Gemini (Flash/Pro) | 1M token context window |

## Cost Optimization

All engines support lighter model variants for simpler tasks. The gh-aw docs recommend using frontier models sparingly:

```yaml
# For complex research synthesis — use a premium model
engine:
  id: claude
  model: claude-sonnet-4-6

# For simple triage or labeling — use a smaller model
engine:
  id: claude
  model: claude-haiku-4-5
```

**Estimated costs per research run:**
- A typical AgentPages research run (2–3 topics, ~5 searches) uses moderate context
- Claude Haiku: roughly 3–5× cheaper than Sonnet for equivalent tasks
- GPT-4.1 mini: similarly budget-friendly for structured tasks

Use `gh aw logs` to inspect token usage and cost per run, and `gh aw audit <run-id>` for deep-dive analysis.

## Version Pinning

For reproducible builds, pin engine CLI versions:

```yaml
engine:
  id: claude
  version: "2.1.70"    # pin to a specific Claude Code CLI release
  model: claude-sonnet-4-6
```

This prevents unexpected behavior if a new CLI release changes behavior. Remember to update the pinned version periodically to get bug fixes.

## Switching Engines

After changing `engine:` in your workflow `.md` file, you **must recompile**:

```bash
gh aw compile .github/workflows/research.md
git add .github/workflows/research.md .github/workflows/research.md.lock.yml
git commit -m "Switch to Claude engine"
git push
```

The lock file embeds engine-specific configuration and must be regenerated on every engine change.
