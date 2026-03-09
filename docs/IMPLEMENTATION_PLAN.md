# Superlearn — implementeringsplan for release candidate

## Mål for i morgen tidlig
Levere en stabil release candidate som føles premium nok for barn og foreldre, med kjerneflyt ferdig før ekstra polish.

## Prioritert rekkefølge

### A. Foundation + UX
Først bygg grunnmuren som alt annet avhenger av:
- Next.js App Router + TypeScript + Tailwind
- app-shell, navigasjon og hjemskjerm
- profilvelger ved oppstart
- minst 2 profiler
- 12 avatarer
- robust persistering per profil/per modul
- reward/progresjonsmodell
- error boundaries og fail-safe reset

**Definition of done for A:** Appen kan brukes med to profiler uten krasj, og progresjon bevares etter refresh.

### B. Letters
Bygg Letters først fordi dette ofte er den mest umiddelbare “wow”-modulen for små barn:
- bokstavjakt
- bygg ord
- hints, feedback og små feiringer
- progresjon/rewards koblet til profil

**Definition of done for B:** Begge spillmodi er fullt spillbare på mobil og iPad.

### C. Math
Bygg Math etter at spillmønstrene fra Letters er bevist:
- tell & velg
- pluss/minus
- samme feedback-/rewardmodell
- kontrollert vanskelighetskurve

**Definition of done for C:** Begge matemodusene er stabile og lagrer progresjon korrekt.

### D. QA + Release
Siste fase er hardening, ikke ny funksjonsjakt:
- fyll testkrav til minst 30 unit/integration tests
- fyll e2e-krav til minst 6 Playwright-flows
- lint/typecheck/build grønt
- docs/QA_CHECKLIST.md
- screenshots
- Lighthouse >90 a11y/best practices
- Dockerfile + Coolify deploy

**Definition of done for D:** Go/no-go kan tas på bevis, ikke magefølelse.

## Foreslått tidsbruk under tidspress
1. **40%** A — grunnmur og data-integritet
2. **25%** B — Letters
3. **20%** C — Math
4. **15%** D — QA/release

## Topp 3 tekniske risiki og minimal risikoredusering

### 1. Korrupt eller skjør persistering
**Risiko:** Profil- og progresjonsdata kan bli borte eller blandes mellom profiler.
**Minimal strategi:** Én versjonert lagringsmodell, streng validering ved innlasting, safe fallback/reset og tester for rehydrering/migrering.

### 2. For kompleks touch-UX i spillene
**Risiko:** Små barn bommer, UI låser seg eller oppleves frustrerende på mobil/iPad.
**Minimal strategi:** Store knapper, enkel trykkbasert interaksjon først, unngå obligatorisk drag/drop, test tidlig i 390x844 og iPad-viewports.

### 3. For mye scope for kort tidsfrist
**Risiko:** Mange halvferdige features i stedet for en stabil helhet.
**Minimal strategi:** Lås kjernekrav tidlig, kutt nice-to-have før kjerne, gjenbruk samme spill-/reward-/testmønstre i Letters og Math.

## Kuttliste hvis nødvendig
Kutt i denne rekkefølgen — aldri før kjerneflyt/stabilitet:
1. avatar-bildeopplasting
2. ekstra animasjoner og polish
3. bonusmekanikker utover stjerner/klistremerker
4. ekstra innholdsvolum utover det som trengs for god variasjon
