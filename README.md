# Superlearn

Superlearn er et touch-first læringsskall for barn, bygget med Next.js App Router, React, TypeScript og Tailwind CSS.

## Hva som er levert i FASE A

- profilvelger ved oppstart med lokale profiler
- minst 12 forhåndsdefinerte avatarvalg
- modulvalg for **Bokstaver** og **Matte**
- grunnleggende progresjons- og belønningsmodell per profil
- robust lokal persistering med migrering/fallback
- error/fallback-UI for ødelagt lagring og runtime-feil
- plassholderruter for bokstaver og matte

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
- `src/lib/` – typer, progresjonslogikk og lokal lagring
- `tests/` – unit/integration/e2e

## Lokale data

Appen lagrer i `localStorage` under nøkkelen `superlearn.app`.
Hvis data blir korrupt, vises en trygg reset-knapp i UI.

## Avgrensning i denne fasen

Bokstaver- og mattespillene er **ikke** ferdig implementert ennå. I FASE A leveres navigasjon, dataflyt, persistering og fundament for neste fase.
