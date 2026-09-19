# Testing (ATDD + BDD E2E)

Playwright + `playwright-bdd` (Gherkin) against the Firebase Emulator Suite (auth 9099, Firestore 8085).

## Gherkin best practices

- Scenarios describe **behavior**, not implementation. Write them from the user's perspective: what they do and what they expect, not how the app achieves it.
- One behavior per scenario. If a scenario needs a second `When` or asserts two unrelated outcomes, split it.
- `Given` sets up context, `When` is a single action, `Then` is the observable result. Avoid stacking multiple `Then` steps for unrelated assertions.
- Use `Background` for shared preconditions that apply to every scenario in the feature file.
- Use `Examples` tables for data-driven variations of the same behavior instead of duplicating scenarios.
- Keep phrasing consistent across the feature file: if you write "Given a session with 3 players" in one scenario, don't write "Assuming there are three players in the room" in another.
- Avoid technical jargon (selectors, API calls, component names) in scenarios. Those belong in step definitions.

## Test layers (Page Object Model)

Tests follow a strict layer separation:

```
tests/
├── features/           # WHAT — Gherkin scenarios (business language)
├── steps/              # GLUE — thin mappings from Gherkin steps to page object calls
│   ├── fixtures.ts     # Test infrastructure (TestWorld, BrowserContext per player)
│   └── *.steps.ts      # Step definitions (one file per domain)
└── pages/              # HOW — Page Objects (locators, interactions, assertions)
    └── *.page.ts       # One page object per page/component
```

**Rules per layer:**

| Layer | Responsibility | Must NOT contain |
|-------|---------------|-----------------|
| `features/` | Behavior in Gherkin | Selectors, API calls, component names, technical details |
| `steps/` | Map each Gherkin step to a page object method | Locators, `page.click()`, `page.fill()`, logic |
| `pages/` | Encapsulate page structure: locators, actions, assertions | Gherkin keywords, test assertions unrelated to that page |
| `fixtures.ts` | Test setup/teardown, `TestWorld`, player creation | Page interactions, step logic |

- **Step definitions** should be a single line that delegates to a page object: `await world.player('Alice').page().clickVote(5)` — no inline selectors or multi-step logic.
- **Page Objects** own the locators and expose intent-revealing methods (`clickVote`, `waitForReveal`, `getAverage`). They may assert on their own state but never on cross-page invariants (that belongs in steps).
- **New page objects** go in `tests/pages/`. If a step needs to interact with a new UI area, create a page object first, then reference it from the step.

## Locator strategy

Locators follow a strict priority order; every page object must comply:

1. **Role** — `page.getByRole(...)` with a stable, human-meaningful accessible name. Preferred wherever the element exposes one.
2. **Test ID** — `page.getByTestId('...')` for elements without a stable accessible name (decorative or icon-only buttons, inputs without programmatic labels, dynamic values such as room codes, counters, board cards). `data-testid` attributes may be added to production code (`src/`) for this purpose.
3. **User-provided text** — `page.getByText(...)` only for text the user entered themselves (e.g. a player's name in the participant list).

Forbidden (fragile): CSS classes, CSS variables, placeholders, `title` attributes, structural selectors (tag names, `nth-child`), and UI label text as a locator — labels change with language. Asserting on UI text that *is* the behavior under test (e.g. the localized subtitle that proves a language switch) is allowed, but the element must still be located via priority 1 or 2.

## Conventions
- ATDD: acceptance scenarios are written before the feature (`tests/features/<domain>.feature`); step definitions go in `tests/steps/<domain>.steps.ts` (auto-discovered via the `steps` glob).
- **File naming**: a feature file and the step file implementing it share a base name that is the kebab-case of the feature's title — a feature titled `Theme Selection` lives in `tests/features/theme-selection.feature`, with its steps in `tests/steps/theme-selection.steps.ts`. Shared infrastructure files (`fixtures.ts`, orchestration helpers) are the exception.
- Multiplayer scenarios drive one page per player with `world.createPlayer(name)` — each player gets a fresh, isolated `BrowserContext` (separate localStorage/auth).
- Vote-related assertions must tolerate snapshot lag (see flakiness below).
- Run the suite only via `npm run test` (or `npm run test-ui`); never `npx playwright test` directly — the script cleans `.features-gen` first and `bddgen` must run before Playwright. If `bddgen` fails (e.g. missing step definitions), its errors are printed to the console and the run stops before any test executes.
- Generated specs (`.features-gen/**`) are a build artifact: never commit or hand-edit them.
- Tests must target the local Firebase emulators, never real Firebase.

## Pipeline mechanics
- `.feature` files live in `tests/features/`; step definitions in `tests/steps/**/*.ts` are auto-discovered via the `steps` glob in `playwright.config.ts`. New step files in that tree are picked up automatically.
- `bddgen` compiles features into `.features-gen/**.spec.js` (gitignored); Playwright's `testDir` is `.features-gen`. Editing a `.feature` or step file requires regenerating (`npm run bddgen` or `npm run test`).
- `tests/global-setup.ts` starts `firebase emulators:start --project test-project` (needs Java; `firebase-tools` is a devDependency) and waits up to 60s for "All emulators ready". It force-frees ports 8085/9099/4400/4500/9150 first. PID is tracked in `tests/.emulator.pid`; `global-teardown.ts` kills the process group and clears the ports again.
- Playwright's `webServer` runs `npm run dev -- --mode test --port 5174`, so Vite loads `.env.test`, which points the app at the emulators (`VITE_FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`, `VITE_FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`). A manually started dev server without `--mode test` will try real Firebase instead.
- Multiplayer steps use the `world` fixture in `tests/steps/fixtures.ts`: `world.createPlayer('Alice')` returns a page in a fresh, isolated `BrowserContext` per player.

## Flakiness
`submitVote`/`resetSession` in `src/context/SessionContext.tsx` write the entire `players` array back from local snapshot state, so two clients writing before the other's snapshot arrives can clobber each other's votes. Keep vote-related assertions tolerant of snapshot lag.
