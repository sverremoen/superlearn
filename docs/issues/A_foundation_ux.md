# A — Foundation + UX

## Mål
Etablere en produksjonsklar grunnmur for Superlearn slik at resten av appen kan bygges sekvensielt med lav risiko. Dette inkluderer app-shell, navigasjon, profilflyt, persistering, designsystem, tilgjengelighet og fail-safe UI.

## Scope / leveranser

### 1. Teknisk grunnoppsett
- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Strukturert `app/`, `components/`, `lib/`, `store/`, `data/`, `tests/`
- Enkle npm-scripts for `dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`

### 2. App-shell og navigasjon
- Startskjerm med profilvelger ved oppstart
- Hjemskjerm som viser minst:
  - aktiv profil
  - modulkort for Letters og Math
  - synlig progresjon per modul
  - enkel belønningsoversikt (stjerner/klistremerker)
- Tydelig tilbakeknapp / hjemknapp på alle spillflater
- Ingen horisontal scrolling på mobil eller iPad

### 3. Profiler og progresjon
- Minst 2 profiler støttet fra dag 1
- Opprett / velg / bytt profil
- Avatarvalg med minst 12 forhåndsdefinerte avatarer
- Mulighet for bildeopplasting kan tas hvis det ikke går ut over stabilitet; ikke blokker release
- Progresjon lagres per profil per modul
- Persistens må overleve refresh og app-restart

### 4. Robust persistering
- Lokal lagring med versjonert datastruktur
- Safe hydration i klient
- Migreringsstrategi for eldre lagret data
- Fallback ved korrupt storage:
  - appen krasjer ikke
  - bruker får trygg reset-mulighet
  - profil-/progresjonsfeil vises forståelig

### 5. Designsystem / premium UX
- Touch-first komponenter med store trykkflater
- Konsistent spacing, typografi og fargepalett
- Barnevennlige, tydelige CTA-er
- Mikroanimasjoner som ikke forstyrrer
- Komponentsett for:
  - knapper
  - kort
  - modal/dialog
  - progresjonsindikator
  - reward badge
  - toast/feedback

### 6. Stabilitet og sikker UI
- Error boundary rundt app-shell og spillflater
- Not-found / generic error UI
- Loading states og tomtilstander
- Offline-ish strategi:
  - app fungerer for lokalt innhold uten nett etter første load
  - statiske assets caches
- Ingen tracking eller tredjeparts analytics

## Konkrete acceptance criteria
- App åpner direkte til profilvelger eller husker sist aktive profil på trygg måte
- Bruker kan opprette 2 profiler, velge ulike avatarer og se ulik progresjon for hver
- Ingen views har h-scroll på 390x844, 768x1024 eller 1024x768
- Alle primære handlinger kan utføres med touch uten små presisjonskrav
- Ved ødelagt localStorage vises fail-safe UI i stedet for blank skjerm
- Letters og Math kan plugges inn i samme progresjons- og belønningsmodell

## QA gates for A
- Lint grønt
- Typecheck grønt
- Minst 10 unit/integration-tester for:
  - profilopprettelse
  - profilbytte
  - progress store
  - storage-migrering
  - error/fallback-logikk
- Minst 2 Playwright-flows:
  1. opprett to profiler og bytt mellom dem
  2. restart/refresh og verifiser at progresjon bevares
- Skjermbilder for 390x844, 768x1024 og 1024x768
- Lighthouse >90 for Accessibility og Best Practices på start/hjem

## Avhengigheter
- Må gjøres først
- B og C avhenger av profilmodell, progresjonsmodell, app-shell og reward-komponenter fra A
- D avhenger av at A leverer testoppsett, dokumentstruktur og release-rammeverk

## Prioritering hvis tidspress
1. Profilvelger + 12 avatarer + trygg persistering
2. Hjemskjerm + modulnavigasjon + progresjon
3. Error boundaries + fail-safe reset
4. Offline-ish caching
5. Bildeopplasting for avatar (kan kuttes før RC hvis stabilitet trues)
