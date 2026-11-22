// ==UserScript==
// @name         Ollama settings: readable AI costs
// @namespace    ollamamonkey
// @version      2.0
// @description  Show ollama.com/settings costs in millicents (1/100000 $), color-coded, with a total
// @match        https://ollama.com/settings*
// @license      MIT
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // Thresholds in millicents (100000 m¢ = $1)
  const SMALL_BELOW = 200;    // < 200 m¢ (< $0.002)  -> small
  const LARGE_FROM  = 2000;   // >= 2000 m¢ (>= $0.02) -> large; in between -> medium
  const COLORS = { small: '#2e9d4f', medium: '#d98a00', large: '#d43c3c' };

  const toMillicents = title => parseFloat(title.replace(/[^0-9.\-]/g, '')) * 100000;

  function format(mc) {
    return mc.toLocaleString('en-US', { maximumFractionDigits: mc < 10 ? 1 : 0 }) + ' m¢';
  }

  function color(mc) {
    return mc < SMALL_BELOW ? COLORS.small : mc < LARGE_FROM ? COLORS.medium : COLORS.large;
  }

  function style(td, mc) {
    td.textContent = format(mc);
    td.style.color = color(mc);
    td.style.fontVariantNumeric = 'tabular-nums';
  }

  function fix() {
    const totals = new Map(); // table -> { sum, cellIndex, cols }

    document.querySelectorAll('td[title^="$"]:not(.omk-total)').forEach(td => {
      const mc = toMillicents(td.title);
      if (isNaN(mc)) return;
      if (td.textContent !== format(mc)) style(td, mc);

      const table = td.closest('table');
      if (!table) return;
      const t = totals.get(table) || { sum: 0, cellIndex: td.cellIndex, cols: td.parentElement.cells.length };
      t.sum += mc;
      totals.set(table, t);
    });

    totals.forEach((t, table) => {
      let tfoot = table.querySelector('tfoot.omk-tfoot');
      if (!tfoot) {
        tfoot = document.createElement('tfoot');
        tfoot.className = 'omk-tfoot';
        const tr = tfoot.insertRow();
        const label = tr.insertCell();
        label.colSpan = t.cellIndex || 1;
        label.textContent = 'Total';
        label.style.cssText = 'font-weight:bold;padding:0.5em 0';
        const cell = tr.insertCell();
        cell.className = 'omk-total';
        cell.style.cssText = 'font-weight:bold;text-align:right;white-space:nowrap';
        table.appendChild(tfoot);
      }
      const cell = tfoot.querySelector('.omk-total');
      const text = format(t.sum);
      if (cell.textContent !== text) {
        style(cell, t.sum);
        cell.style.color = '';            // keep total in normal text color
        cell.title = '$' + (t.sum / 100000).toFixed(5);
      }
    });
  }

  fix();

  // Rows may be added later (pagination / live updates)
  new MutationObserver(fix).observe(document.body, { childList: true, subtree: true });
})();
