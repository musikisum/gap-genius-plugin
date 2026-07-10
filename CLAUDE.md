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
