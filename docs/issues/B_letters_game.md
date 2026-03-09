# B — Letters game

## Mål
Levere en stabil og underholdende bokstavmodul med minst to spillmodi: bokstavjakt og bygg ord. Modulen skal føles ferdig, gi variasjon og fungere for små barn uten voksenhjelp i normal bruk.

## Scope / leveranser

### 1. Felles modulramme for Letters
- Egen Letters-landingsside eller modulflate
- Vanskelighetsnivå / progresjonstrinn som er enkle å forstå
- Felles reward-hook mot stjerner/poeng/klistremerker
- Hints og positiv feedback ved feil / treghet

### 2. Spillmodus: Bokstavjakt
- Barnet får en tydelig bokstav å finne
- Flere store trykkbare valg på skjermen
- Variasjon i bokstaver, rekkefølge og presentasjon
- Umiddelbar feedback:
  - riktig → feiring/poeng
  - feil → rolig hint/forsøk igjen
- Rundeavslutning med oppsummering

### 3. Spillmodus: Bygg ord
- Barnet bygger enkle ord av bokstaver/stavelser avhengig av nivå
- Start med korte, kjente ord som er realistiske for målgruppen
- Drag/drop er valgfritt; trykk-for-å-velge er minimum for robust touch UX
- Visuell støtte med ikon/illustrasjon kan brukes hvis tilgjengelig, men må ikke blokkere release
- Tydelig success state og neste oppgave uten friksjon

### 4. Innhold og variasjon
- Nok oppgaver til at modulen ikke føles repetitiv etter få minutter
- Balansert blanding av repetisjon og variasjon
- Norsk språk i UI og innhold
- Bokstavsett og ordliste må være kuratert for små barn; unngå rare eller vanskelige ord

### 5. Progression og gamification
- Lagre fullførte runder per profil
- Vis progresjon og belønninger på modulkort og i Letters-modulen
- Små feiringer uten å sinke flyten
- Mulighet for streak/serie eller dagens mål hvis det kan gjøres uten risiko

## Konkrete acceptance criteria
- Minst 2 fullt fungerende spillmodi: bokstavjakt og bygg ord
- Begge spillmodi fungerer på mobil og iPad uten h-scroll
- Barn kan fullføre minst én hel runde i hver modus kun med touch
- Hver modus oppdaterer progresjon per profil
- Hint finnes i begge modi
- UI-tekster og innhold er på norsk

## QA gates for B
- Totalt testmål etter A+B: minst 18 unit/integration-tester
- B bidrar med minst 8 tester for:
  - oppgavegenerering
  - scoring/reward
  - hintlogikk
  - progresjonsoppdatering
  - riktig/feil state transitions
- Minst 2 Playwright-flows:
  1. fullfør bokstavjakt med profil A
  2. fullfør bygg ord med profil B og verifiser lagret progresjon
- Manuelle skjermbilder fra begge spillmodi i mobil + iPad
- Ingen blokkeringer ved rask tapping / dobbelttap

## Avhengigheter
- Krever A ferdig eller nesten ferdig:
  - profilmodell
  - app-shell
  - persistering
  - reward-system
  - felles UI-komponenter
- C kan gjenbruke mønstre fra B for oppgaveflyt, feedback og progresjon
- D trenger stabile selectors og dokumenterte testscenarier fra B

## Prioritering hvis tidspress
1. Stabil bokstavjakt
2. Stabil bygg ord
3. God progresjon + rewards
4. Variasjon i innhold
5. Ekstra visuelle effekter / illustration polish

## Notater til Builder
- Velg robuste interaksjoner fremfor fancy interaksjoner
- Ikke gjør drag/drop obligatorisk hvis det skaper mobilfeil
- Foretrekk liten, håndkuratert ordliste fremfor stor, svak ordliste
