# Feedback for Agent

<!--
Write feedback here after reviewing the agent's work.
The agent reads this file each run and adjusts its behavior.
Delete old feedback once the agent has addressed it.
-->

## Latest Feedback
- Always use `<style is:global>` in Base.astro — scoped styles don't reach slot content (topic cards, grids, etc. from index.astro). This was causing the homepage to render as plain unstyled links.
- Always use light mode as the default theme. Dark mode should only apply via `prefers-color-scheme: dark`.
- Keep polishing the UI/UX — the content is good enough for now.
