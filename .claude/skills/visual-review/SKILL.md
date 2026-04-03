---
name: visual-review
description: Use Playwright MCP to audit the running Helpexa frontend for visual inconsistencies and broken flows. Invoke when the user asks to check the UI, review a flow, find visual bugs, or inspect any frontend route.
---

The app runs at http://localhost:3000.

For each route or flow provided by the user:

1. Navigate to the route using the Playwright MCP browser tool
2. Take a screenshot
3. Inspect for: layout shifts, misaligned elements, overflow/clipping, broken spacing, incorrect colors/fonts, missing UI, broken interactions (dropdowns, modals, navigation) and deviation from design and implementation plan.
4. For flows (multi-step): click through each step, screenshot each state, note where transitions break or UI looks wrong

After reviewing all routes/flows, output a numbered findings list:

- **Route/Step**: the URL or action
- **Issue**: concise description of what's wrong
- **Severity**: Low / Medium / High

If no issues are found for a route, note it as passing.
