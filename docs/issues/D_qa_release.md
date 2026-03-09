# D — QA + Release

## Mål
Gjøre Superlearn klar for stabil release candidate i morgen tidlig med dokumentert kvalitet, testdekning, deploy-oppsett og tydelig go/no-go-beslutning.

## Scope / leveranser

### 1. Kvalitetsgates
- Minst 30 unit/integration tests totalt
- Minst 6 Playwright e2e-flows totalt
- `lint` grønt
- `typecheck` grønt
- Produksjonsbuild grønn

### 2. Testdekning som minimum skal finnes
- Profilflyt
- Persistens / rehydrering
- Reward/progresjon
- Letters: bokstavjakt
- Letters: bygg ord
- Math: tell & velg
- Math: pluss/minus
- Error boundary / fail-safe state

### 3. E2E-flows som minimum skal finnes
1. Opprett to profiler og velg avatarer
2. Spill Letters bokstavjakt og se lagret progresjon
3. Spill Letters bygg ord og verifiser reward
4. Spill Math tell & velg og verifiser progresjon
5. Spill Math pluss/minus og verifiser reward
6. Refresh/restart og verifiser at riktig data er bevart per profil

### 4. QA-dokumentasjon
- `docs/QA_CHECKLIST.md` med:
  - testmatrise
  - manuelle sjekker per viewport
  - feilklassifisering (blokkerende / alvorlig / kosmetisk)
  - release sign-off
- Screenshots for sentrale skjermer på mobil og iPad
- Kort oversikt over kjente begrensninger hvis noen må aksepteres før morgenens RC

### 5. Performance / UX / tilgjengelighet
- Lighthouse >90 på Accessibility og Best Practices
- Verifiser touch-first UI
- Verifiser ingen horisontal scrolling på krevde viewports
- Verifiser tydelige fokusstates og lesbare kontraster
- Verifiser at appen er offline-ish etter første load

### 6. Deploy / drift
- Dockerfile for produksjonskjøring
- Coolify-kompatibelt oppsett
- Miljøvariabler dokumentert
- Enkel health-/smoke-check etter deploy
- Fallback-plan hvis deploy feiler: lokal kjørbar build må fortsatt kunne demonstreres

## Go / No-Go kriterier

### Go
- Kjerneflyt virker stabilt for minst 2 profiler
- Begge Letters-modi fungerer
- Begge Math-modi fungerer
- Persistens fungerer konsekvent
- Test- og build-gates er grønne
- Ingen kritiske krasj eller blanke skjermer

### No-Go
- Profildata kan forsvinne eller blandes mellom profiler
- En av kjernemodusene er ustabil eller uferdig
- Touch UX er dårlig på mobil/iPad
- Test/build/lint/typecheck feiler
- Deploy mangler eller er ikke reproducerbar

## QA gates for D
- Totalt minst 30 unit/integration tests
- Totalt minst 6 Playwright-flows
- Lint/typecheck/build grønt i CI-lignende kjøring lokalt
- Dokumenterte Lighthouse-målinger og screenshots
- `docs/QA_CHECKLIST.md` ferdig
- Dockerfile + Coolify deploy-instruks eller konfig verifisert

## Avhengigheter
- Avhenger av ferdig A, B og C
- Må kjøres til slutt, men testarbeid bør bygges opp underveis
- Builder bør levere testbare selectors og stabile komponentkontrakter før D starter

## Prioritering hvis tidspress
1. Verifiser kjerneflyt og data-integritet
2. Få testgates over minimumskrav
3. Sikre build + Docker + Coolify
4. Dokumenter screenshots og QA-checklist
5. Finpuss ikke-kritiske kosmetiske feil
