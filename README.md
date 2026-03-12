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
npm run test:e2e  # 6/6 grønne i Chromium
```

Playwright-flowene for kritiske brukerreiser er nå grønne i Chromium. Det som fortsatt gjenstår er egen WebKit/Safari-verifisering; i dette miljøet stopper WebKit på manglende host-biblioteker. Se `docs/QA_CHECKLIST.md` for status og detaljer.

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

## Docker / Coolify

Appen kan nå bygges som container for Coolify eller annen standard Docker-runtime.
Den prod-buildede appen kjører via Next.js standalone-output og lytter på `$PORT`.

```bash
docker build -t superlearn .
docker run --rm -p 3000:3000 -e PORT=3000 superlearn
```

For Coolify:
- bygg direkte fra repoet med `Dockerfile`
- sett eventuelt `PORT=3000` eksplisitt
- runtime-imaget inkluderer `curl` og `wget` slik at Coolify sin standard healthcheck kan verifisere `GET /`
- health/smoke-check: åpne `/` og verifiser profilvelger + modulkort

## Playwright-miljø

Chromium-kjøringen er nå verifisert grønn i dette repoet.
Det som fortsatt er miljøblokkert er **WebKit/Safari-verifisering**; hosten mangler blant annet `libgtk-4.so.1`, `libgstreamer-1.0.so.0`, `libgraphene-1.0.so.0` og flere tilhørende biblioteker.

Når hosten tillater det, er raskeste vei normalt:

```bash
npx playwright install webkit
npx playwright install-deps webkit
npm run test:e2e:webkit
```

## Neste release-gater

Før issue #1 kan regnes som release candidate gjenstår hovedsakelig:
- WebKit/Safari-verifisering i miljø med nødvendige systembiblioteker
- Lighthouse-bevis
- faktisk Coolify-deploy og verifisert URL
