# hansetalent.de

Statische Kopie der bisherigen Onepage-Seite, gesichert am 16.09.2026, damit die
Domain mit allen Adressen (insbesondere /legal mit den AGB, auf die jeder Vertrag
verweist) unabhängig von Onepage weiterläuft.

Kein Build. Der Ordner wird unverändert ausgeliefert: `index.html` in der Wurzel,
Unterseiten in eigenen Ordnern, alle Bilder, Schriften und Skripte unter `assets/`.

Bekannte Grenzen: Die Formulare auf /strategie und
/karriere-vertrieb-bewerbungsformular sendeten an die Onepage-Schnittstelle und
funktionieren ohne Onepage nicht mehr. Die Seite lädt nichts mehr von onecdn.io.

## Suchmaschinen, 05.11.2026

Auf ausdrücklichen Wunsch von Ben bleibt die Website mit allen Vertrags-, AGB- und Formularadressen erreichbar, wird aber nicht mehr zur Indexierung angeboten. Alle HTML-Seiten tragen `noindex, nofollow, noimageindex`. robots.txt erlaubt den Abruf, damit Suchmaschinen diese Anweisung lesen können. Die Sitemap enthält keine URLs. Es gibt keine Weiterleitung, keine DNS- oder Mailänderung und keine Löschung. Bereits vorhandene Suchtreffer verschwinden erst nach erneuter Verarbeitung durch die Suchmaschine. Die vorherige Version ist im Git-Verlauf erhalten.
