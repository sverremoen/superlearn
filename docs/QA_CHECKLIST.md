# QA-checklist for Superlearn

Oppdatert: 2026-03-11

Denne sjekklisten dokumenterer faktisk verifisering utført i repoet, samt åpne blokkeringer som hindrer full release-gate akkurat nå.

## Automatiske quality gates

- [x] `npm test` grønn
  - Resultat: **30 tester grønne**
- [x] `npm run lint` grønn
- [x] `npm run typecheck` grønn
- [x] `npm run build` grønn
- [ ] `npm run test:e2e` grønn
  - **Blokkert av miljøet**, ikke app-logikken
  - Første kjøring manglet Playwright Chromium lokalt
  - Etter installasjon av Chromium feilet kjøring fortsatt fordi host-miljøet mangler systembibliotek for headless Chromium (`libnspr4.so`)
  - Feilen skjer før første side lastes, altså i browser-launch og ikke i selve app-flyten
  - Anbefalt host-fix når privilegier finnes: `npx playwright install-deps chromium`
  - Konsekvens: Playwright-testene er skrevet og klare, men kan ikke fullkjøres i denne subagent-sesjonen uten ekstra host-avhengigheter

## Kritiske flows

### 1. Opprette profil + velge avatar
- [x] Playwright-flow skrevet
- [ ] Fullt kjørt grønt i dette miljøet

### 2. Bytte profil
- [x] Playwright-flow skrevet
- [ ] Fullt kjørt grønt i dette miljøet

### 3. Fullføre letters-øvelse og se progresjon oppdatert
- [x] Playwright-flow skrevet
- [x] Underliggende logikk verifisert i unit/integration
- [ ] Fullt kjørt grønt i dette miljøet

### 4. Fullføre math-øvelse og se progresjon oppdatert
- [x] Playwright-flow skrevet
- [x] Underliggende logikk verifisert i unit/integration
- [ ] Fullt kjørt grønt i dette miljøet

### 5. Refresh/restart: progresjon beholdes
- [x] Playwright-flow skrevet
- [x] Lagrings-/rehydreringslogikk verifisert i unit/integration
- [ ] Fullt kjørt grønt i dette miljøet

### 6. Mobil viewport: ingen horisontal scroll og store trykkflater fungerer
- [x] Playwright-flow skrevet
- [ ] Fullt kjørt grønt i dette miljøet

## Mobil og iPad

- [ ] Mobil 390×844: alle skjermer, ingen overlapp, ingen horisontal scroll
  - Delvis dekket av skrevet Playwright-test, men ikke fullkjørt pga miljøblokkering
- [ ] iPad 768×1024: alle skjermer, touch fungerer
- [ ] iPad 1024×768: alle skjermer, touch fungerer
- [ ] Safari/WebKit-hensyn dokumentert med kjøring

## Stabilitet og brukbarhet

- [x] Ingen kjente typefeil eller lint-feil i nåværende kode
- [x] Progresjon per profil og per modul dekkes av eksisterende tester
- [ ] Stress-test: 20 raske runder uten crash eller state-bugs
- [ ] Console-clean verifisert under standard flyt
- [ ] Lighthouse Accessibility > 90
- [ ] Lighthouse Best Practices > 90

## Skjermbilder / bevis

- [ ] Profilvelger — mobil
- [ ] Modulvalg — mobil
- [ ] Letters-øvelse — mobil
- [ ] Math-øvelse — mobil
- [ ] Progresjonsskjerm — mobil
- [ ] Tilsvarende iPad-visninger

## Vurdering akkurat nå

Status er **betydelig nærmere release candidate**, men issue #1 er **ikke ferdig** fordi følgende fortsatt mangler eller er blokkert:
- grønn Playwright-kjøring med faktisk browser-runtime
- manuell viewport-/QA-dokumentasjon og skjermbilder
- Lighthouse-bevis
- deploy/herding (Dockerfile/Coolify/runbook)

## Anbefalt neste steg

1. Kjør i miljø med Playwright systemavhengigheter tilgjengelig, eller installer host-bibliotekene (`libnspr4.so` m.fl.)
2. Kjør `npm run test:e2e` til grønt og lagre artefakter/skjermbilder
3. Fullfør mobil/iPad/Safari-verifisering og legg inn faktisk bevis
4. Ta Docker/Coolify/deploy som siste release-gate
