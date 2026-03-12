---
title: Astro Framework
last_updated: 2026-03-12
sources:
  - url: https://github.com/withastro/astro
    title: Astro GitHub Repository
  - url: https://astro.build
    title: Astro — Build the web you want
---

# Astro Framework

Astro is the static site generator that powers the AgentPages website layer. It's chosen deliberately: Astro's "islands" architecture, zero-JS-by-default philosophy, and file-based routing make it ideal for AI-generated content sites that need to be fast, simple, and git-friendly.

## Why Astro for AgentPages

AgentPages needed a static site generator that an AI agent could update programmatically. The requirements:

- **Simple file structure** — one file per page, predictable output
- **Fast builds** — agent commits shouldn't take minutes to build
- **No client-side JavaScript by default** — research sites don't need React SPA complexity
- **Good GitHub Pages support** — static output goes straight into `docs/`
- **Readable output** — pages are just `.astro` files the agent can read and write

Astro ticks all of these. A full AgentPages site builds in seconds.

## The Islands Architecture

Astro's core innovation is **partial hydration** via "islands." By default, every Astro component renders to pure HTML at build time — zero JavaScript is shipped to the browser.

If you need interactivity (a search box, a live counter), you can opt specific components into hydration with `client:*` directives:

```astro
<!-- This renders to static HTML — no JS shipped -->
<MyComponent />

<!-- This hydrates on page load -->
<InteractiveWidget client:load />

<!-- This hydrates only when visible -->
<Chart client:visible />
```

The result: **content-heavy sites load extremely fast** because there's no JavaScript framework overhead. For a research knowledge base, this is the right trade-off.

## File-Based Routing

Astro uses the file system as the router. Files in `src/pages/` become URL paths:

```
src/pages/
├── index.astro          →  /
├── topics/
│   ├── how-agentpages-works.astro  →  /topics/how-agentpages-works
│   └── tavily-api.astro            →  /topics/tavily-api
```

AgentPages exploits this directly: when the agent discovers a new topic, it creates a new `.astro` file in `src/pages/topics/` and adds it to `site.json`. No routing configuration needed.

## Astro Components (.astro files)

An `.astro` file has two sections: a **frontmatter script** (JavaScript/TypeScript) and an **HTML template**:

```astro
---
// Frontmatter — runs at build time only (server-side)
import Layout from '../layouts/Base.astro';
const title = "My Page";
const data = await fetch('https://api.example.com/data').then(r => r.json());
---

<!-- Template — the actual HTML output -->
<Layout title={title}>
  <h1>{title}</h1>
  <p>Data fetched at build time: {data.message}</p>
</Layout>
```

The frontmatter runs **once at build time** — you can fetch data, import files, run arbitrary Node.js code. None of it is included in the browser bundle.

## Content Collections

For AgentPages-scale sites, Astro's **Content Collections** feature provides type-safe access to markdown files. Define a collection in `src/content/config.ts`, then query it from any page:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
export const collections = {
  topics: defineCollection({
    schema: z.object({
      title: z.string(),
      last_updated: z.string(),
    })
  })
};
```

AgentPages currently uses a simpler approach (direct `.astro` files + `site.json`), but Content Collections is a natural upgrade path for larger knowledge bases.

## Build and Output

Astro builds to plain HTML/CSS/JS in an output directory:

```bash
# Build the site
cd website && npx astro build
# Output goes to dist/ (or docs/ if configured)

# Preview the build locally
npx astro preview

# Dev server with hot reload
npx astro dev
```

AgentPages configures output to `docs/` (GitHub Pages convention) in `astro.config.mjs`:

```javascript
// website/astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  outDir: '../docs',
  site: 'https://USERNAME.github.io',
  base: '/REPO_NAME',
});
```

## Integrations

Astro has an extensive integration ecosystem. Notable ones for AgentPages-style sites:

| Integration | Purpose |
|-------------|---------|
| `@astrojs/sitemap` | Auto-generate sitemap.xml for SEO |
| `@astrojs/rss` | Generate RSS feeds for topic updates |
| `@astrojs/mdx` | Use MDX (Markdown + JSX) for richer content |
| `@astrojs/react` | Use React components where needed |

For a simple research site, none of these are required — the base Astro install is sufficient.

## Performance

Astro sites routinely score 100/100 on Lighthouse because they ship minimal JavaScript. For a research knowledge base, the practical benefits are:

- **Instant navigation** — no client-side routing overhead
- **No hydration cost** — content is server-rendered HTML
- **Small bundles** — no framework runtime to download
- **Great SEO** — search engines get fully rendered HTML

This makes Astro an excellent choice when GitHub Pages is your deployment target and your content is predominantly text and tables.
