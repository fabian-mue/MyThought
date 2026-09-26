# My Thought – Fabians Blog

Jeden Tag ein Gedanke. Beim Öffnen der Seite erscheinen das heutige Datum und der Gedanke dazu.

## Aufbau

```
MyThought/
├── index.html            Die Seite
├── css/style.css         Aussehen (hell/dunkel automatisch)
├── js/thoughts.js        ← DEINE SAMMLUNG: hier Gedanken mit Datum eintragen
├── js/app.js             Logik: heutigen Gedanken finden und anzeigen
├── manifest.webmanifest  App-Beschreibung (für „Zum Home-Bildschirm“)
├── sw.js                 Service Worker (offline-fähig, installierbar)
└── icons/icon.svg        App-Icon
```

## Einen Gedanken hinzufügen

In `js/thoughts.js` einen Eintrag ergänzen:

```js
{
  date: "2026-09-27",
  title: "Titel",
  text: `Erster Absatz.

Zweiter Absatz.`
},
```

- Absätze mit einer Leerzeile trennen.
- Gedanken für zukünftige Tage bleiben verborgen, bis der Tag da ist.
- Ältere Gedanken erreicht man über die Pfeile (oder Pfeiltasten) bzw. per Link: `index.html#2026-09-25`.

## Ansehen

- **Schnell:** `index.html` doppelklicken.
- **Wie eine echte Website** (nötig für die App-Funktion): im Projektordner im Terminal
  ```
  python3 -m http.server 8000
  ```
  und dann http://localhost:8000 öffnen.

## Später als App

Die Seite ist bereits als Progressive Web App vorbereitet. Sobald sie online ist (z. B. über GitHub Pages oder Netlify),
kann man sie auf dem Handy über „Zum Home-Bildschirm“ wie eine App installieren. Für den App Store ließe sie sich später
z. B. mit Capacitor verpacken.
