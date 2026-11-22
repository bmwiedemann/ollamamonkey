# ollamamonkey

A userscript that makes the AI costs on <https://ollama.com/settings> readable.

The settings page shows most costs as `<$0.01`; the exact value is only in a
tooltip. This script:

- shows every cost in **millicents** (m¢), where 100,000 m¢ = $1
  (e.g. `$0.00231` → `231 m¢`)
- color-codes the values:
  - green: below 200 m¢
  - orange: 200–1999 m¢
  - red: 2,000 m¢ ($0.02) and above
- adds a **Total** row summing all cost rows currently loaded on the page
- keeps the original dollar value in the tooltip of each cell (and of the total)

## Install (Firefox)

1. Install a userscript manager add-on:
   [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/),
   [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/) or
   [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/).
2. Open the add-on's dashboard and create a new script.
3. Replace its contents with the contents of
   [`ollama-costs.user.js`](ollama-costs.user.js) and save.
4. Reload <https://ollama.com/settings>.

Alternatively, open the raw `ollama-costs.user.js` file in Firefox (e.g. from a
hosted copy of this repository); the userscript manager will offer to install it.

The same steps work in Chrome and other browsers with Tampermonkey or Violentmonkey.

## Configuration

Edit the constants near the top of the script:

```js
const SMALL_BELOW = 200;    // below this: green
const LARGE_FROM  = 2000;   // from this on: red; in between: orange
const COLORS = { small: '#2e9d4f', medium: '#d98a00', large: '#d43c3c' };
```

## Limitations

- Cost cells are found by their `title="$..."` attribute. If ollama.com changes
  its HTML, the script may need updating.
- The total only covers rows that are loaded on the page, not your full history.

## License

MIT, see [LICENSE](LICENSE).
