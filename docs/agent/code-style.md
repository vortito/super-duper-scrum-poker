# Code style

TypeScript everywhere, React function components, Tailwind.

## Language & formatting
- TypeScript everywhere; React function components as named exports (`export const PokerTable: React.FC`).
- 4-space indentation, single quotes, semicolons.
- No comments: code must be clean and self-explanatory (clean code) — rely on well-chosen names instead of explanations. The only allowed exception is a functional lint directive (`eslint-disable`) when a rule cannot be satisfied otherwise.

## Architecture rules
- Shared domain types live in `src/types/index.ts`.
- Firebase SDK access only through `src/services/firebase.ts` and `SessionContext` — components never import Firebase directly.
- All app state sync flows through `SessionContext` (`onSnapshot` on the single `sessions/{id}` doc); game actions (`createSession`, `joinSession`, `submitVote`, `revealVotes`, `resetSession`, `leaveSession`) live there too.
- No client routing — `react-router-dom` is a dependency but unused; keep it that way (YAGNI). The URL is kept in sync with the session via `history.replaceState`.

## Styling
- Tailwind utility classes; combine conditionally with `clsx` / `tailwind-merge`.

## Scope
- Keep it simple: no libraries, abstractions, or code paths beyond what the acceptance scenarios require.
