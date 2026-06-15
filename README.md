# Tombola Web Game

Gioco della Tombola italiana realizzato con HTML, CSS e JavaScript.

## Funzionalita

- Configurazione da 1 a 10 giocatori
- Da 1 a 4 cartelle per giocatore
- Cartelle italiane 3 x 9 con 15 numeri validi
- Estrazione casuale dei numeri da 1 a 90 senza duplicati
- Rilevamento automatico di ambo, terno, quaterna, cinquina e tombola
- Salvataggio e ripristino della partita tramite `localStorage`
- Interfaccia responsive per desktop, tablet e telefono
- Suono generato localmente, senza dipendenze esterne

## Avvio

Apri `firstPage.html` nel browser oppure servi la cartella con un server
statico locale.

Demo: https://tombola-iota.vercel.app/firstPage.html

## Test

Richiede Node.js:

```bash
node --test
```
