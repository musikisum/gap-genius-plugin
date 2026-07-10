# Gap Genius Plugin — Entwicklungsnotizen

## Build
```
yarn install   # Abhängigkeiten (braucht yarn, nicht npm)
yarn build     # oder: npx gulp build
yarn test      # Tests laufen mit vitest
```
`@educandu/dev-tools` muss **v15.1.0** sein — v14 fehlt `compressFiles`.

## Offener Fix — Fix #1 (noch nicht gemacht)

**Bug: `updateText` in `src/gap-genius-utils.js:79` ersetzt immer den ersten Treffer**

```js
const position = updatedText.indexOf(rawMatch); // BUG: findet immer erste Stelle
```

Wenn derselbe `rawMatch` (z.B. `(Akkord)()`) im Text zweimal vorkommt, wird beim
Update des zweiten Eintrags stattdessen der erste überschrieben. Text und
`replacements`-Array laufen dann auseinander.

**Fix-Strategie:** Beim Iterieren die Suchposition (`fromIndex`) mitführen, damit
`indexOf` nach der letzten Ersetzung weitersucht:

```js
let fromIndex = 0;
for (let index = 0; index < matches.length; index += 1) {
  if (replacements[index]) {
    const { expression, rawMatch } = matches[index];
    const newGapText = replacements[index]?.gaptext ?? '';
    const newResult = `(${expression})(${newGapText})`;
    const position = updatedText.indexOf(rawMatch, fromIndex); // fromIndex hinzufügen
    if (position !== -1) {
      const head = updatedText.substring(0, position);
      const tail = updatedText.substring(position + rawMatch.length);
      updatedText = head + newResult + tail;
      fromIndex = position + newResult.length;
    }
  }
}
```

Danach einen neuen Spec-Test für den Duplikat-Fall schreiben und alle Tests grün prüfen.

---

## Bereits erledigte Fixes (diese Session)

| Fix | Datei | Was |
|-----|-------|-----|
| CSS Canvas | `src/gap-genius.less` | `.right` bekommt `width:30%`, `min-width:150px`, `flex-shrink:0` — Canvas schrumpfte online |
| #5 | `src/gap-manager.js` | `isRight: result.length > 0` → `isRight: true` (war immer true) |
| #3 | `src/components/gap-game-text-input.js` | `exampleResults[index] ?? ''` — verhindert `undefined` bei >10 Lücken |
| #4 | `src/components/footnote-text.js` | `useState`/`useEffect` → `useMemo`, doppelter Parse-Durchlauf entfernt |
| S  | `src/gap-genius-info.js` | `cacheText` in `redactContent` und `getCdnResources` einbezogen |
| #2 | `src/gap-genius-editor.js` | RadioGroup: `defaultValue`→`value`, String-Booleans→echte Booleans |
| Tests | `src/gap-genius-info.spec.js` | `cacheText` zu Test-Objekten und Expected-Results ergänzt |
