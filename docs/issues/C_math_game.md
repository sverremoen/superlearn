# C — Math game

## Mål
Levere en robust matematikkmodul med minst to spillmodi: tell & velg og pluss/minus. Modulen skal være intuitiv, rask å spille og trygg for små barn som lærer grunnleggende telling og enkel regning.

## Scope / leveranser

### 1. Felles modulramme for Math
- Egen Math-landingsside eller modulflate
- Samme progresjons- og rewardmodell som Letters
- Samme touch-first navigasjon og feedbackmønster
- Norsk språk i UI og instruksjoner

### 2. Spillmodus: Tell & velg
- Barnet teller objekter og velger riktig svar
- Store svaralternativer med god avstand
- Oppgaver må være visuelt tydelige og ikke for støyete
- Variasjon i objekter, antall og rekkefølge
- Riktig/feil feedback og hint

### 3. Spillmodus: Pluss / minus
- Enkle regnestykker innen et kontrollert spenn tilpasset målgruppen
- Tydelig visualisering av oppgaven
- Store svarknapper eller trygg inputmekanikk
- Må støtte både pluss og minus
- Hints for å hjelpe barnet videre uten å skape frustrasjon

### 4. Innhold og vanskelighetsstyring
- Starter enkelt og øker gradvis
- Ingen brå hopp i vanskelighet
- Nok variasjon til at modulen kan spilles flere runder
- Telleobjekter og tallpresentasjon må være tydelige på iPad og mobil

### 5. Progression og gamification
- Progresjon per profil lagres separat for Math
- Belønninger vises konsekvent med resten av appen
- Små feiringer ved fullførte runder
- Mulighet for bonusstjerne ved flere riktige på rad hvis enkelt å implementere

## Konkrete acceptance criteria
- Minst 2 fullt fungerende spillmodi: tell & velg og pluss/minus
- Begge moduser fungerer på mobil og iPad uten h-scroll
- Begge moduser kan fullføres med kun touch
- Resultater lagres per profil
- Hint finnes i begge moduser
- Vanskelighetsnivå oppleves jevnt og ikke frustrerende

## QA gates for C
- Totalt testmål etter A+B+C: minst 26 unit/integration-tester
- C bidrar med minst 8 tester for:
  - oppgavegenerering
  - riktig svarvalidering
  - hintlogikk
  - progresjonsoppdatering
  - nivåstyring / tallgrenser
- Minst 2 Playwright-flows:
  1. fullfør tell & velg
  2. fullfør pluss/minus og verifiser reward/progresjon
- Skjermbilder fra Math-modulen i mobil + iPad
- Interaksjoner tåler rask tapping uten inkonsistent state

## Avhengigheter
- Krever A sin grunnmur og reward/persistens
- B og C bør dele mønstre for spillmotor, rundeoppsett, feedback og teststrategi
- D avhenger av at C leverer dokumenterte happy-path og edge-case flows

## Prioritering hvis tidspress
1. Stabil tell & velg
2. Stabil pluss/minus
3. Progression + rewards
4. Variasjon i oppgaver
5. Bonusmekanikker utover kjerneflyt

## Notater til Builder
- Hold tallspennet konservativt for release candidate
- Bruk tydelige, store visuelle elementer fremfor tett layout
- Ikke introduser kompleks input hvis valgknapper dekker behovet
