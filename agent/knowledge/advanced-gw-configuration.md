---
title: Advanced gh-aw Configuration
last_updated: 2026-03-13
sources:
  - url: https://github.com/github/gh-aw
    title: GitHub Agentic Workflows (gh-aw) Repository
  - url: https://github.github.com/gh-aw/reference/engines/
    title: gh-aw Engine Reference
  - url: https://github.github.com/gh-aw/guides/mcps/
    title: gh-aw MCP Configuration Guide
  - url: https://github.com/idorozin/AgentPages
    title: AgentPages Repository - Workflow Examples
---

# Advanced gh-aw Configuration

Beyond basic setup, gh-aw supports sophisticated configurations that unlock powerful patterns for production agents. This guide covers advanced MCP server management, environment variable strategies, debugging techniques, and cross-workflow coordination.

## MCP Server Deep Dive

### Custom MCP Servers

While gh-aw ships with reference servers (Tavily, GitHub, Memory), you can run custom MCP servers in your workflows:

```yaml
mcp-servers:
  custom-service:
    command: "node"
    args: ["./custom-mcp-server.js"]
    env:
      API_KEY: "${{ secrets.CUSTOM_API_KEY }}"
      DEBUG: "true"
    allowed: ["tool_name_1", "tool_name_2"]
```

**Key patterns:**
- **Stdio transport** — most common for local Node.js or Python servers
- **Environment variables** — passed at server startup, scoped to that server
- **Allowed tools filtering** — restrict which MCP tools agents can invoke (security boundary)
- **Multiple instances** — run the same MCP server multiple times with different configs

### Server Lifecycle

MCP servers are spawned once per workflow run and reused across all agent steps. Failed servers trigger workflow cancellation. Monitor server health via:

```bash
gh aw debug --workflow research.md
```

This shows server startup logs, tool registry, and any initialization errors.

## Environment Variables & Secrets

### Secret Management

GitHub Agentic Workflows integrate with GitHub's secrets vault:

```bash
# Set secrets for use in workflows
gh aw secrets set ANTHROPIC_API_KEY --value "sk-ant-..."
gh aw secrets set TAVILY_API_KEY --value "tvly-..."
gh aw secrets set CUSTOM_SERVICE_TOKEN --value "token-..."

# List all configured secrets
gh aw secrets list
```

**Best practices:**
- Never commit `.env` files or hardcoded keys
- Use minimal-privilege keys when possible
- Rotate keys regularly
- Namespace secrets: `TAVILY_API_KEY`, `OPENAI_API_KEY`, `GITHUB_TOKEN`

### Environment Variable Propagation

Variables flow through three layers:

1. **Workflow-level** — defined in `mcp-servers` → passed to MCP server processes
2. **Agent-level** — accessed via `process.env` in agent code (limited by design)
3. **Tool-level** — MCP tools receive sanitized context from their parent server

Example: Tavily API key flows from GitHub Secrets → workflow YAML → MCP server startup → Tavily tool within the agent's context.

## Workflow Patterns for Complex Agents

### Composing Multiple Agents

Run different agents sequentially in a single workflow for staged processing:

```yaml
---
engine:
  id: claude
  model: claude-sonnet-4-6

on:
  schedule:
    - cron: "0 2 * * *"  # Daily at 2 AM

mcp-servers:
  research:
    command: "npx"
    args: ["-y", "tavily-mcp"]
    env:
      TAVILY_API_KEY: "${{ secrets.TAVILY_API_KEY }}"

safe-outputs:
  create-pull-request:
    max: 2  # Allow up to 2 PRs per run

---

# Research Pipeline

## Stage 1: Research (Primary Agent)

The main agent researches new topics and updates knowledge.

## Stage 2: Synthesis (Secondary Agent)

A second agent processes the research to identify gaps, cross-references, and meta-trends.

## Stage 3: Website Update (Tertiary Agent)

A third agent refines the website presentation and optimizes for SEO.
```

Each stage can use different MCP servers, models, or prompting strategies.

### Cross-Repo Workflows

Some teams run centralized research agents that update multiple repos:

```yaml
safe-outputs:
  create-pull-request:
    repo: "org/knowledge-base"  # Different from workflow repo
    title-prefix: "[Research] "
    labels: [auto-research]
```

Requires careful permission scoping and cross-repo SSH keys configured in GitHub.

## Debugging & Observability

### Workflow Debugging

Enable detailed logs during development:

```bash
# Compile with verbose flag
gh aw compile --verbose .github/workflows/research.md

# Run with debug output
gh aw run research --debug 2>&1 | tee debug.log
```

### MCP Server Inspection

Inspect registered tools and their schemas:

```bash
gh aw mcp-info --workflow .github/workflows/research.md
```

Output shows:
- Server name and status
- All available tools
- Tool input/output schemas
- Error logs from server startup

### Agent Performance Metrics

Track workflow performance over time:

```yaml
# In your research.md prompt, the agent has access to:
# - ${{ job.status }} — workflow status
# - ${{ github.run_number }} — run count
# - ${{ github.run_id }} — unique run ID
```

## Advanced Patterns

### Incremental Knowledge Updates

Instead of full rewrites, diff your knowledge files to minimize PR size:

```bash
# Within agent logic:
# 1. Read existing file from git
# 2. Parse YAML frontmatter
# 3. Merge new findings with existing content
# 4. Update last_updated timestamp only if content changed
```

AgentPages implements this pattern to keep PRs focused and reviewable.

### Conditional Tool Availability

Use `allowed` to gate tools by workflow context:

```yaml
mcp-servers:
  research:
    command: "npx"
    args: ["-y", "tavily-mcp"]
    allowed: ${{ github.event_name == 'schedule' ? ['search', 'extract'] : ['extract'] }}
```

Restrict expensive search queries to scheduled runs; allow only extracts during manual triggers.

### Model Switching by Workflow

Run different models for different tasks without workflow duplication:

```yaml
engine:
  id: claude
  model: ${{ github.event.inputs.model || 'claude-haiku-4-5' }}

on:
  schedule:
    - cron: "0 */12 * * *"
  workflow_dispatch:
    inputs:
      model:
        description: "AI model"
        required: true
        default: "claude-haiku-4-5"
```

Allows manual runs to experiment with Opus, while scheduled runs use cheaper Haiku.

### Rate Limiting & Backoff

For tools with rate limits, implement retry logic:

```javascript
// Within agent code
const search = async (query, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await tools.tavily.search(query);
    } catch (e) {
      if (e.status === 429 && i < retries - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
      } else {
        throw e;
      }
    }
  }
};
```

## Common Pitfalls

**Over-fetching with MCP tools** — Limit to top N results; process incrementally. Tavily free tier is 1,000/month.

**Hardcoding API keys** — Always use `${{ secrets.* }}` interpolation; never commit credentials.

**Overly broad `allowed` lists** — Restrict tools to those actually needed; reduces attack surface.

**Long-running workflows** — GitHub limits jobs to 6 hours; break work into smaller steps.

**MCP server crashes** — Handle initialization errors gracefully; log stderr for debugging.

## Monitoring Health

Set up notifications for workflow failures:

```yaml
on:
  workflow_run:
    workflows: ["research"]
    types: [completed]

jobs:
  notify:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    steps:
      - name: Notify on Slack
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{"text":"AgentPages research failed"}'
```

Use GitHub Actions, Slack, or third-party observability tools to track workflow health over weeks and months.

## Summary

Advanced gh-aw configuration enables:
- **Multi-agent pipelines** for complex reasoning tasks
- **Custom MCP servers** tailored to your domain
- **Sophisticated secret management** with least-privilege access
- **Production-grade debugging** and observability
- **Cost optimization** through selective model usage and rate limiting

As AgentPages and similar tools mature, these patterns will become standard practice for organizations running agents at scale.
