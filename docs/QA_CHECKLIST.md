# QA-checklist for Superlearn

Oppdatert: 2026-03-11

Denne sjekklisten dokumenterer faktisk verifisering utført i repoet og hva som fortsatt gjenstår før hele epicen kan regnes som helt ferdig.

## Automatiske quality gates

- [x] `npm test` grønn
  - Resultat: **30 tester grønne**
- [x] `npm run test:e2e` grønn
  - Resultat: **6/6 Playwright-flows grønne**
- [x] `npm run lint` grønn
- [x] `npm run typecheck` grønn
- [x] `npm run build` grønn

### Kommando-output (kort)

```text
npm run test:e2e   -> 6 passed
npm test           -> 30 passed
npm run lint       -> ok
npm run typecheck  -> ok
npm run build      -> ok
```

## Kritiske flows

### 1. Opprette profil + velge avatar
- [x] Playwright-flow kjørt grønt
- [x] Ny profil blir aktiv etter lagring

### 2. Bytte profil
- [x] Playwright-flow kjørt grønt
- [x] Aktiv profil oppdateres korrekt

### 3. Fullføre letters-øvelse og se progresjon oppdatert
- [x] Playwright-flow kjørt grønt
- [x] Progresjon oppdateres på hjemskjerm etter retur

### 4. Fullføre math-øvelse og se progresjon oppdatert
- [x] Playwright-flow kjørt grønt
- [x] Progresjon oppdateres på hjemskjerm etter retur

### 5. Refresh/restart: progresjon beholdes
- [x] Playwright-flow kjørt grønt
- [x] Lagret progresjon beholdes etter reload

### 6. Mobil viewport: ingen horisontal scroll og store trykkflater fungerer
- [x] Playwright-flow kjørt grønt
- [x] Verifisert i 390×844

## Mobil og iPad

- [x] Mobil 390×844: profilvelger, modulvalg, letters, math og progresjon dokumentert med skjermbilder
- [x] iPad 768×1024: profilvelger, modulvalg, letters, math og progresjon dokumentert med skjermbilder
- [x] iPad 1024×768: profilvelger, modulvalg, letters, math og progresjon dokumentert med skjermbilder
- [x] Ingen horisontal scroll i mobiltest
- [ ] Safari/WebKit-hensyn dokumentert med egen kjøring
  - WebKit-prosjekt er nå lagt inn i Playwright-konfigen (`npm run test:e2e:webkit`)
  - Kjøring er fortsatt blokkert i dette miljøet av manglende host-biblioteker (`libgtk-4.so.1`, `libgstreamer-1.0.so.0`, `libgraphene-1.0.so.0`, m.fl.)

## Stabilitet og brukbarhet

- [x] Ingen kjente typefeil eller lint-feil i nåværende kode
- [x] Progresjon per profil og per modul dekkes av eksisterende tester
- [x] Stress-test: 20 raske runder uten crash eller state-bugs
  - Verifisert i `docs/qa/qa-smoke-report-2026-03-11.md`
- [x] Console-clean verifisert under standard flyt
  - Verifisert i `docs/qa/qa-smoke-report-2026-03-11.md` (0 console errors, 0 page errors)
- [ ] Lighthouse Accessibility > 90
- [ ] Lighthouse Best Practices > 90

## Skjermbilder / bevis

Alle skjermbilder ligger under `docs/qa/screenshots/`.

### Mobil 390×844
- [x] `docs/qa/screenshots/mobil-390x844-profilvelger.png`
- [x] `docs/qa/screenshots/mobil-390x844-modulvalg.png`
- [x] `docs/qa/screenshots/mobil-390x844-letters.png`
- [x] `docs/qa/screenshots/mobil-390x844-math.png`
- [x] `docs/qa/screenshots/mobil-390x844-progresjon.png`

### iPad 768×1024
- [x] `docs/qa/screenshots/ipad-768x1024-profilvelger.png`
- [x] `docs/qa/screenshots/ipad-768x1024-modulvalg.png`
- [x] `docs/qa/screenshots/ipad-768x1024-letters.png`
- [x] `docs/qa/screenshots/ipad-768x1024-math.png`
- [x] `docs/qa/screenshots/ipad-768x1024-progresjon.png`

### iPad 1024×768
- [x] `docs/qa/screenshots/ipad-1024x768-profilvelger.png`
- [x] `docs/qa/screenshots/ipad-1024x768-modulvalg.png`
- [x] `docs/qa/screenshots/ipad-1024x768-letters.png`
- [x] `docs/qa/screenshots/ipad-1024x768-math.png`
- [x] `docs/qa/screenshots/ipad-1024x768-progresjon.png`

## Vurdering akkurat nå

Status er nå **release candidate-nær** på app/logikk og testgrunnmur:
- alle automatiske gates i lokal kjøring er grønne
- e2e-suiten er grønn
- viewport-bevis er lagret for mobil og begge iPad-retninger
- Dockerfile finnes allerede i repoet

Det som fortsatt gjenstår før hele epic #1 kan regnes som helt ferdig:
- WebKit/Safari-spesifikk verifisering
- stress-test / console-clean-bevis
- Lighthouse-målinger
- faktisk Coolify-deploy med URL og verifisering etter deploy
  - Første Coolify-deploy bygget image og startet container, men standard healthcheck feilet fordi runtime-imaget manglet `curl`/`wget`
  - Dockerfile er oppdatert til å inkludere begge verktøyene for å gjøre standard Coolify-healthcheck realistisk i neste deploy

## Anbefalt neste steg

1. Kjør WebKit-/Safari-verifisering og dokumenter eventuelle touch-avvik
2. Kjør Lighthouse og legg inn faktiske tall i denne filen
3. Gjør enkel stress-test av raske runder i Letters og Math
4. Fullfør Coolify-deploy og post URL + verifisering i issue-kommentar
