# Superlearn

Superlearn er en touch-first læringsapp for barn, bygget med Next.js App Router, React, TypeScript og Tailwind CSS.

## Status akkurat nå

Kjernen er nå spillbar:
- profilvelger med flere barn og separat progresjon
- minst 12 avatarvalg
- **Bokstaver** med to spillmodi:
  - bokstavjakt
  - bygg ord
- **Matte** med to spillmodi:
  - tell og velg
  - pluss og minus
- stjerner og klistremerker per profil
- robust lokal persistering med migrering/fallback
- error/fallback-UI for ødelagt lagring og runtime-feil

## Verifisert

```bash
npm test        # 30 tester grønne
npm run lint
npm run typecheck
npm run build
```

Playwright-flowene for kritiske brukerreiser er skrevet, men full kjøring er foreløpig blokkert i dette miljøet av manglende systembiblioteker for headless Chromium. Se `docs/QA_CHECKLIST.md` for status og detaljer.

## Kom i gang lokalt

```bash
npm install
npm run dev
```

Åpne <http://localhost:3000>.

## Nyttige scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

## Teknisk struktur

- `src/app/` – App Router-ruter og global layout
- `src/components/` – UI-komponenter og app-shell
- `src/data/` – statiske valg som avatarer
- `src/lib/` – typer, progresjonslogikk, spilllogikk og lokal lagring
- `tests/` – unit/integration/e2e
- `docs/` – plan, QA-bevis og release-notater

## Lokale data

Appen lagrer i `localStorage` under nøkkelen `superlearn.app`.
Hvis data blir korrupt, vises en trygg reset-knapp i UI.

## Neste release-gater

Før issue #1 kan regnes som release candidate gjenstår hovedsakelig:
- grønn Playwright-kjøring
- dokumentert mobil/iPad-QA med skjermbilder
- Lighthouse-bevis
- Dockerfile/Coolify deploy og verifisert URL
