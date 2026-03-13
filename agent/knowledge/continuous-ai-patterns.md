---
title: Continuous AI Patterns
last_updated: 2026-03-12
sources:
  - url: https://githubnext.com/projects/continuous-ai
    title: Continuous AI — GitHub Next
  - url: https://github.github.com/gh-aw/blog/2026-01-12-welcome-to-pelis-agent-factory/
    title: Peli's Agent Factory — GitHub Agentic Workflows Blog
  - url: https://github.github.com/gh-aw/_llms-txt/agentic-workflows.txt
    title: Agentic Workflows Blog Series — gh-aw Documentation
  - url: https://github.github.com/gh-aw/llms-full.txt
    title: gh-aw Full Documentation (llms-full.txt)
---

# Continuous AI Patterns

**Continuous AI** is a concept developed by GitHub Next: the systematic, automated application of AI to software collaboration. Just as Continuous Integration (CI) made automated testing routine, Continuous AI makes AI-enriched automation routine — running on schedules, triggers, and events, improving repositories incrementally over time.

GitHub Agentic Workflows is the primary platform implementing Continuous AI patterns. AgentPages itself is a Continuous AI system: an agent that continuously researches, writes, and publishes — improving its knowledge base incrementally with every run.

## The Core Insight: Incremental > Heroic

The key insight behind Continuous AI is that **small, continuous improvements compound**. Rather than running a massive AI refactor once a quarter, you run small focused agents daily. Each agent never takes a day off, never gets tired, and never lets issues accumulate.

> *"Code quality is not a destination, it's a continuous practice."* — Peli's Agent Factory

This mirrors how successful CI/CD works: small, frequent, automated changes beat big infrequent manual ones.

## Peli's Agent Factory: Real-World Patterns

GitHub Next built and operated a real "agent factory" on the `github/gh-aw` repository — a collection of 19 categories of real production workflows. These aren't demos. They measured actual merge rates, tracked causal chains, and published the results.

Key lesson: **AI agents are most powerful when specialized, well-coordinated, and designed for their specific context.**

### 1. Issue Triage

The "hello world" of Continuous AI. When a new issue opens, the agent reads its content, researches the codebase, labels the issue, and leaves an explanatory comment.

**Why it matters:** Maintainers can focus on solving problems instead of sorting them.

```yaml
engine:
  id: copilot
tools:
  github:
    toolsets: [issues, labels]
safe-outputs:
  add-labels:
    allowed: [bug, feature, enhancement, documentation, question]
  add-comment: {}
```

### 2. Continuous Simplicity

Agents like **Automatic Code Simplifier** and **Duplicate Code Detector** run daily, hunting for complexity in the codebase and proposing simpler alternatives.

**Real metrics from the factory:**
- Duplicate Code Detector: **76 merged PRs out of 96 proposed (79% merge rate)**
- Simplifier agents continuously patrol for over-nested code, repeated patterns, and unnecessary complexity

The principle: while developers race ahead building features, cleanup agents trail behind sweeping up. Fast AI-assisted development generates more code — and more technical debt — than humans can manually clean up. Continuous simplicity agents fill this gap.

### 3. Continuous Documentation

Keeping docs accurate as code evolves is one of the hardest problems in software. Continuous documentation agents solve it incrementally.

**Real metrics from the factory:**
- **Daily Documentation Updater**: 57 merged PRs out of 59 proposed — **96% merge rate**
- **Documentation Unbloat**: 88 merged PRs out of 103 proposed (85% merge rate)
- **Documentation Noob Tester**: Tests docs as a new user would, catching confusing steps

The surprising finding: AI agents can maintain documentation better than humans at scale, but they work best when specialized — one agent updates content, another simplifies verbosity, a third tests usability.

### 4. Security & Compliance Patterns

Continuous security agents monitor for vulnerabilities, validate configurations, and detect credential exposure — running continuously rather than in periodic audits.

Pattern: **security agents create issues, then coding agents (like Copilot coding assistant) fix them**. This two-agent pattern separates detection from remediation.

### 5. Interactive & ChatOps Patterns

Not all agents run on schedules — some respond to human commands. The **slash command** pattern lets developers invoke agents on demand:

```markdown
---
on:
  issue_comment:
    types: [created]
---

If the comment starts with `/plan`, break down this issue into
sub-tasks that coding agents can tackle...
```

**Real metric:** The `/plan` command agent contributed **514 merged PRs out of 761 proposed (67% merge rate)** — the highest-volume workflow in the entire factory.

### 6. Multi-Agent Project Coordination

The most sophisticated pattern: multiple specialized agents working toward a shared goal, each handling a specific role in a larger pipeline.

Example pipeline:
1. **Discussion Task Miner** scans discussions → creates issues
2. **Plan Command** breaks issues → sub-tasks
3. **Copilot Coding Assistant** resolves sub-tasks → PRs
4. **Workflow Health Monitor** tracks progress → status reports

**Real causal chain from the factory:**
```
Discussion #13934 → Issue #14084 → PR #14129
```

### 7. Analytics & Self-Improvement

Meta-agents that analyze the behavior of other agents. ML-based clustering, sentiment analysis, and pattern recognition applied to the agent factory itself.

- **Prompt Clustering Analysis**: 27 analysis discussions revealing that "40% of our prompts are about error handling"
- **Copilot Agent Analysis**: 48 daily analysis discussions providing deep behavioral insights

The insight: **AI can analyze AI**. Meta-analysis reveals patterns that direct observation misses.

## Continuous AI for Research (AgentPages Pattern)

AgentPages implements its own Continuous AI pattern:

```
Schedule trigger (every 12 hours)
    ↓
Research agent reads user instructions
    ↓
Tavily web search → knowledge files updated
    ↓
Astro website rebuilt
    ↓
PR created → auto-merged
    ↓
Live site updated
```

Key properties of this pattern:
- **Incremental**: 2–3 topics per run, not a full rebuild each time
- **Persistent memory**: `agent/memory/` gives the agent continuity between runs
- **Prioritized**: explicit requests first, then stale topics, then new discoveries
- **Auditable**: every run is logged in `agent/memory/log.md`

## Design Principles for Continuous AI

From GitHub Next's experience running the agent factory:

1. **Specialize, don't generalize** — one agent, one job. A focused agent with a narrow context outperforms a general-purpose agent trying to do everything.

2. **Measure everything** — track merge rates, causal chains, and cost per run. You can't improve what you can't measure.

3. **Start with schedule triggers** — predictable cadences make budgets manageable. `schedule: daily` = five runs per week = known cost.

4. **Use the two-agent pattern for risky changes** — agent A detects and creates issues, agent B fixes them. This adds a human review step between detection and action.

5. **Increment, don't replace** — update and extend knowledge; don't delete unless content is provably outdated. Same principle applies to code and documentation.

6. **Human approval gates for critical operations** — agents should propose, humans should approve anything irreversible.

## Getting Started with Continuous AI

The simplest Continuous AI pattern to start with is a **daily digest**:

```markdown
---
on:
  schedule: daily
permissions:
  contents: read
  issues: read
safe-outputs:
  create-issue:
    title-prefix: "[daily-status] "
    labels: [report]
    close-older-issues: true
---

Create an upbeat daily status report as a GitHub issue.
Include recent activity, progress highlights, and next steps.
```

This runs every day, creates a status report issue, and closes the previous day's report. Simple, useful, immediately deployable.

## Resources

- [Peli's Agent Factory blog series](https://github.github.com/gh-aw/blog/2026-01-12-welcome-to-pelis-agent-factory/) — 19-part series with real metrics
- [Continuous AI — GitHub Next](https://githubnext.com/projects/continuous-ai)
- [GitHub Community Feedback Discussions](https://github.com/orgs/community/discussions/186451)
- [GitHub Next Discord](https://gh.io/next-discord)
