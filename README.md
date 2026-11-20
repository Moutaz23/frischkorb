# FrischKorb

Ein kleiner Mini-Onlineshop, den ich im Rahmen meiner JavaScript- und AJAX-Weiterbildung umgesetzt habe.

## Funktionen

- Produkte aus einer JSON-Datei laden
- Produkte suchen, nach Kategorien filtern und nach Preis oder Namen sortieren
- Produkte zum Warenkorb hinzufügen und wieder entfernen
- Mengen mit Plus und Minus ändern
- Gesamtpreis automatisch berechnen
- Warenkorb im LocalStorage speichern

## Technologien

HTML, CSS, Bootstrap, JavaScript, JSON, XMLHttpRequest und Font Awesome.

## Lokal starten

1. Projektordner in VS Code öffnen.
2. `index.html` mit **Live Server** starten.

Die Produktdaten werden mit XMLHttpRequest aus `data/products.json` geladen. Deshalb sollte das Projekt über einen lokalen Webserver statt direkt über `file://` geöffnet werden.

## Projektstruktur

- `index.html` – Aufbau der Seite
- `js/main.js` – Suche, Filter, Sortierung und Warenkorb
- `data/products.json` – Produktdaten
- `css/` – Stylesheets
- `assets/` – Schriftarten und Icons
- `img/` – Produktbilder, Banner und Logo

## Design

Das Layout wurde auf Grundlage von Elementen des **Ogani-Templates von Colorlib** für FrischKorb angepasst. Der Schwerpunkt des Übungsprojekts liegt auf der Umsetzung der interaktiven Funktionen mit JavaScript.
