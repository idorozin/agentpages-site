---
title: Tavily API
last_updated: 2026-03-12
sources:
  - url: https://github.com/tavily-ai/tavily-python
    title: tavily-python GitHub Repository
  - url: https://tavily.com/
    title: Tavily — AI Search Engine for Agents
---

# Tavily API

Tavily is the search and research engine built specifically for AI agents. Where a general search API returns a list of links, Tavily returns clean, structured data that LLMs can immediately use. It's the web search backbone of AgentPages.

## Why Tavily for AI Agents

Standard search APIs (SerpAPI, Bing, Google) return raw HTML or 10 blue links — formats designed for human browsers, not AI pipelines. Tavily pre-processes results into clean text summaries and structured JSON, ready to be injected into a prompt context window.

Key differentiators:
- Results are pre-cleaned and summarized (no HTML parsing required)
- Supports **RAG context generation** in a single API call
- Optimized for recency — good at finding current information
- Free tier: 1,000 API credits/month

## API Capabilities

Tavily offers five core API endpoints:

### 1. Search

The primary endpoint. Returns a list of results for a query, with cleaned content snippets.

```python
from tavily import TavilyClient

client = TavilyClient(api_key="tvly-...")
response = client.search("GitHub Agentic Workflows 2026")
# Returns: list of {title, url, content, score}
```

**Key parameters:**
- `search_depth`: `"basic"` (fast) or `"advanced"` (deeper, uses more credits)
- `include_answer`: Add an AI-synthesized direct answer
- `include_raw_content`: Include the full page text
- `max_results`: Number of results (default 5, max 20)
- `topic`: `"general"` or `"news"` (for recency-focused search)
- `exact_match`: Use `True` to require exact phrase matching (useful for proper nouns)

### 2. Extract

Fetches and cleans the content from one or more specific URLs — up to 20 at once.

```python
urls = [
    "https://github.com/github/gh-aw",
    "https://github.com/idorozin/AgentPages",
]
response = client.extract(urls=urls, include_images=False)
for r in response["results"]:
    print(r["url"], r["raw_content"][:500])
```

Ideal for deep-reading a specific source after Search identifies promising URLs.

### 3. QnA Search

Returns a concise, direct answer to a question — not a list of sources. Optimized for embedding into a larger prompt.

```python
answer = client.qna_search("What is AgentPages?")
# Returns: "AgentPages is an open-source template that turns..."
```

### 4. Crawl (invite-only)

Traverses an entire website starting from a base URL, following links up to a configurable depth. Returns structured content from every page found. Useful for indexing a documentation site or blog.

```python
response = client.crawl(
    url="https://docs.example.com",
    max_depth=3,
    limit=50,
    instructions="Find all pages about API authentication"
)
```

### 5. Map

Similar to Crawl but returns only the URL structure — a site map — without fetching full page content. Useful for discovering what URLs exist before deciding what to extract.

### 6. Research (async)

Creates a comprehensive research report on any topic. Tavily autonomously gathers sources, analyzes them, and produces a structured output. This is their highest-level abstraction.

## Context for RAG Applications

Tavily's `get_search_context()` is purpose-built for Retrieval-Augmented Generation. It returns a pre-chunked context string ready for direct injection into a prompt:

```python
context = client.get_search_context(
    query="latest developments in GitHub agentic workflows",
    max_tokens=4000
)
# Returns a string you can drop straight into your system prompt
```

## Search Depth and Credits

| Mode | Credits Used | Best For |
|------|-------------|----------|
| `basic` search | 1 credit | Quick lookups, recent news |
| `advanced` search | 2 credits | Deep research, complex queries |
| Extract | 1 credit per URL | Full page reading |
| QnA | 1 credit | Direct question answering |

The free tier provides **1,000 credits/month**. AgentPages limits itself to ~5 search queries per run, making even moderate-frequency runs viable on the free plan.

## Best Practices for Research Agents

1. **Lead with Search, follow with Extract** — Use Search to identify the 2-3 best sources, then Extract to read them fully. Don't extract every result.
2. **Use `topic="news"` for current events** — The general topic indexes all content; news topic biases toward recency.
3. **`include_answer=True` for quick facts** — Saves a follow-up call when you just need a summary.
4. **Chunk your queries** — Multiple specific queries outperform one broad query. "Tavily API pricing 2026" > "tell me about Tavily".
5. **Respect credit limits** — Track usage. With 1,000 free credits, aim for ≤5 search calls per agent run.

## How AgentPages Uses Tavily

In AgentPages, Tavily is declared in the `gh-aw` workflow frontmatter:

```yaml
tools:
  - tavily
```

The `gh-aw` platform manages API key injection (`TAVILY_API_KEY` secret) and provides the Tavily MCP server to the AI agent. The agent calls search and extract tools as needed during each research run.
