---
title: Model Context Protocol (MCP)
last_updated: 2026-03-12
sources:
  - url: https://github.com/modelcontextprotocol/modelcontextprotocol
    title: Model Context Protocol — GitHub Repository
  - url: https://github.com/modelcontextprotocol/servers
    title: MCP Reference Servers
  - url: https://github.github.com/gh-aw/guides/mcps/
    title: GitHub Agentic Workflows — MCP Guide
  - url: https://github.github.com/gh-aw/introduction/how-they-work/
    title: GitHub Agentic Workflows — How They Work
---

# Model Context Protocol (MCP)

Model Context Protocol (MCP) is an open standard for connecting AI agents to external tools, data sources, and services. It is the "glue" that lets AI models like Claude or Copilot securely call external APIs, read files, query databases, and use custom tools — without bespoke integrations for every combination.

Created by David Soria Parra and Justin Spahr-Summers, MCP is governed by the `modelcontextprotocol` GitHub organization and licensed MIT.

## Why MCP Matters

Before MCP, connecting an AI to a tool meant writing a custom integration for every AI model × every tool combination. MCP standardizes this: write one MCP server per tool, and any MCP-compatible AI agent can use it.

This is directly analogous to what USB did for hardware peripherals — one standard port, many devices.

## Core Concepts

### MCP Server
A process that exposes **tools**, **resources**, and **prompts** over the MCP protocol. Examples:
- A filesystem server exposing `read_file`, `write_file`
- A GitHub server exposing `create_issue`, `search_code`
- A Tavily server exposing `search`, `extract`

### MCP Client
The AI agent (or the runtime hosting the agent) that calls MCP server tools. In GitHub Agentic Workflows, the gh-aw runtime acts as the MCP client.

### Transport Types
MCP servers can communicate over:
- **stdio** — local process with stdin/stdout (fastest, most common for local tools)
- **HTTP/SSE** — remote HTTP endpoint (cloud APIs, shared infrastructure)
- **Docker containers** — containerized MCP servers with volume mounts and env vars

## MCP in GitHub Agentic Workflows

GitHub Agentic Workflows uses MCP as its primary tool integration mechanism. Every tool the agent can call — from GitHub operations to external APIs — is exposed via MCP.

### Built-in GitHub MCP
gh-aw includes a built-in GitHub MCP server with comprehensive access to repositories, issues, PRs, code search, and more. This is pre-configured and requires no setup.

### Adding Custom MCP Servers

Custom MCP servers are declared in the workflow frontmatter under `mcp-servers:`:

```yaml
mcp-servers:
  notion:
    container: "mcp/notion"
    env:
      NOTION_TOKEN: "${{ secrets.NOTION_TOKEN }}"
    allowed:
      - "search_pages"
      - "get_page"
  deepwiki:
    url: "https://mcp.deepwiki.com/sse"
    allowed: ["*"]
```

### Using the Registry

The easiest way to add MCP servers is via the gh-aw CLI:

```bash
# Browse available servers
gh aw mcp add

# Add a specific server
gh aw mcp add my-workflow makenotion/notion-mcp-server
```

This auto-configures the server and recompiles the workflow.

### Tool Filtering with `allowed:`

For security, use `allowed:` to restrict which tools an MCP server exposes to the agent:

```yaml
mcp-servers:
  postgres:
    container: "mcp/postgres"
    allowed: ["query"]  # read-only; blocks write operations
```

Use `["*"]` to allow all tools (only for trusted, well-understood servers).

## Official Reference Servers

The MCP organization maintains reference implementations to showcase capabilities:

| Server | What It Does |
|--------|-------------|
| **Filesystem** | Secure file operations with configurable access |
| **Git** | Read, search, and manipulate Git repositories |
| **Fetch** | Web content fetching and conversion for LLMs |
| **Memory** | Knowledge graph-based persistent memory |
| **Sequential Thinking** | Dynamic problem-solving through thought sequences |
| **Time** | Time and timezone conversion |

A full registry of community MCP servers is available at [registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io/).

## Pre-configured MCP Servers in gh-aw

The `gh-aw` repository ships with ready-to-import MCP configurations in `.github/workflows/shared/mcp/`:

- **Tavily** — AI-native web search and extraction
- **Jupyter** — Execute code and manage notebooks
- **Notion** — Read/write Notion pages and databases
- **Slack** — Channel management and messaging
- **Sentry** — Error tracking and issue analysis
- **DeepWiki** — GitHub repository documentation search
- **Microsoft Docs** — Search official Microsoft documentation
- **Azure, DataDog, Brave Search, MarkItDown** — and more

## SDKs

MCP servers can be built in any language with an official SDK:

| Language | SDK |
|----------|-----|
| TypeScript | `modelcontextprotocol/typescript-sdk` |
| Python | `modelcontextprotocol/python-sdk` |
| Go | `modelcontextprotocol/go-sdk` |
| Java | `modelcontextprotocol/java-sdk` |
| Rust | `modelcontextprotocol/rust-sdk` |
| C# | `modelcontextprotocol/csharp-sdk` |
| Kotlin, PHP, Ruby, Swift | Official SDKs available |

## MCP and AgentPages

AgentPages uses MCP via gh-aw to access:
- **Tavily MCP** — web search and URL extraction for research
- **GitHub MCP (built-in)** — creating PRs, committing files, reading repo contents
- **Safe Outputs MCP** — the sanitized write layer for GitHub operations (issues, PRs, comments)

When you extend AgentPages with custom MCP servers (e.g., adding a Notion server to publish findings to a Notion database), you declare them in `.github/workflows/research.md` and recompile with `gh aw compile`.
