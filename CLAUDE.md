# Gap Genius Plugin — Entwicklungsnotizen

## Build
```
yarn install   # Abhängigkeiten (braucht yarn, nicht npm)
yarn build     # oder: npx gulp build
yarn test      # Tests laufen mit vitest
```
`@educandu/dev-tools` muss **v15.1.0** sein — v14 fehlt `compressFiles`.

## Publish

Tag im Format `v1.2.3` pushen → GitHub Actions (`publish.yml`) baut und publiziert automatisch auf npm. Vor einem neuen Tag `package.json`-Version manuell erhöhen und committen.

## Node-Version — NICHT ohne Prüfung hochziehen (Stand 11.07.2026)

`node-version` ist aktuell überall (lokal, `publish.yml`, `verify.yml`, `package.json engines`) fest auf **20.17.0** gepinnt. Node 20 ("Iron") ist laut nodejs.org bereits **EOL seit 24.03.2026** — offiziell keine Security-Patches mehr. Trotzdem: **nicht vorschnell auf 22/24 heben**, siehe Testergebnis unten.

**Getestet (11.07.2026):** Lokaler Wechsel auf Node 22.20.0 (per `nvm-windows`, Admin-Rechte nötig für `nvm use`) + sauberer `yarn install --frozen-lockfile --ignore-engines`:
- `canvas` (native, `nan`-basiert, kein N-API) hat **kein Prebuild für Node 22 unter Windows** → Fallback-Kompilierung scheitert an fehlendem `cairo.h`/GTK. Bricht `yarn install` aber nicht ab, da `canvas` als *optionale* Dependency markiert ist.
- `gl`, `bcrypt` (ebenfalls native) hatten keine Probleme.
- **`gulp verify` schlägt unter Node 22 reproduzierbar fehl:** `gap-genius-info.spec.js` wirft `ReferenceError: document is not defined` in `node_modules/plyr/dist/plyr.js:302`. Ursache: `gap-genius-info.js` importiert `GithubFlavoredMarkdown` aus `@educandu/educandu`, dessen Markdown-Rendering für eingebettete Audio/Video-Links auf die Media-Player-Komponenten (`html5-player.js` etc.) zurückgreift, die `plyr` laden — `plyr` greift beim Modul-Laden ungeschützt auf `document` zu (setzt Browser/DOM voraus), was unter Node 20 bisher nie ausgelöst wurde.
- **Entscheidender Fund:** `@educandu/educandu` (Version ^4.0.0, aktuell installiert: 4.0.0) deklariert selbst `"engines": { "node": "^20.0.0" }` — das Framework ist explizit auf Node 20 festgelegt, nicht nur unser eigenes Plugin.

**Konsequenz:** Ein Node-Versions-Upgrade in CI/lokal hängt an einem `@educandu/educandu`-Update, nicht nur an unserem eigenen Code. Bevor `node-version` in `publish.yml`/`verify.yml` geändert wird: prüfen, ob eine neuere `@educandu/educandu`-Version Node 22/24 unterstützt (`engines`-Feld dort checken) und ob deren `plyr`/Media-Player-Integration das Node-only-Testszenario (kein DOM) verträgt.

**`package.json engines.node` (der Plugin-eigene Kompatibilitäts-Vertrag für Konsumenten) und `node-version` in den GitHub-Workflows sind unabhängig voneinander** — Ersteres betrifft, was Nutzer des Plugins brauchen, Letzteres nur die CI-Build-Umgebung. Trotzdem hängen aktuell beide praktisch an derselben Grenze, weil `@educandu/educandu` selbst nur Node 20 deklariert.

**Sicherheitsfenster:** Node-20-Support durch GitHub Actions (`setup-node`) selbst dürfte noch lange funktionieren (alte Node-Binaries bleiben über nodejs.org/dist archiviert, `setup-node` "verliert" alte Versionen nicht aktiv) — das eigentliche Risiko ist eher schleichend: (1) keine Security-Patches mehr für den Node-Build-Prozess selbst (Supply-Chain-Risiko beim `yarn install`/Build, nicht bei einer laufenden Produktionsanwendung, da CI nur transient läuft), (2) langfristig könnten GitHub-Runner-Images (`ubuntu-24.04` → Nachfolger) irgendwann zu neu für die alte Node-20-Binary werden (historisch eher ein Zeitrahmen von Jahren, nicht Monaten). Akuter Handlungsdruck kommt eher von einem nötigen `@educandu/educandu`-Update selbst als von GitHub Actions.

## Separates Thema: GitHub Actions Node-Runtime-Deprecation (nicht zu verwechseln mit obigem!)

**Das hier betrifft NICHT `node-version` in unseren Workflows**, sondern die Node-Laufzeit, mit der GitHub selbst die Action-Skripte ausführt (`actions/checkout`, `actions/setup-node`, `codecov/codecov-action`, `ilDug/get-tag-action` etc.) — reine GitHub-Infrastruktur, unabhängig von unserem Code/unserer `engines`-Konfiguration.

**Zeitplan (github.blog/changelog, 19.09.2025):**
- Seit 16.06.2026: Runner nutzen standardmäßig bereits Node 24 für Actions.
- Ab 16.09.2026: Node 20 wird komplett entfernt, kein Fallback mehr (`ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true` funktioniert nur bis dahin).

**Für uns:** Meist automatisch, kein Handlungsbedarf an `node-version`. Einziges Risiko: falls eine genutzte Action selbst noch hart auf Node 20 aufsetzt und nie aktualisiert wird. Am ehesten gefährdet: `ilDug/get-tag-action@v1.0.3` (kleines, wenig gepflegtes Community-Projekt) — im Gegensatz zu `actions/checkout`/`actions/setup-node` (GitHub-eigen, sicher rechtzeitig aktualisiert). **To-do:** nach dem 16.09.2026 prüfen, ob Publish-Workflow noch funktioniert; falls `ilDug/get-tag-action` bricht, durch Alternative ersetzen (z. B. Tag direkt aus `GITHUB_REF` extrahieren, ohne Fremd-Action).

Quelle: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
