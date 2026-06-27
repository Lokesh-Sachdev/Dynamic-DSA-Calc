function update() {
    const budget = parseInt(document.getElementById('budget').value);
    const btcPct = parseInt(document.getElementById('btcpct').value);
    const ethPct = 100 - btcPct;
    const w1 = parseInt(document.getElementById('w1').value);
    const w2 = parseInt(document.getElementById('w2').value);
    const w3 = parseInt(document.getElementById('w3').value);
    const w4 = parseInt(document.getElementById('w4').value);
    const wIdle = 26 - w1 - w2 - w3 - w4;

    document.getElementById('budget-out').textContent = fmt(budget);
    document.getElementById('btcpct-out').textContent = btcPct + '%';
    document.getElementById('w1-out').textContent = w1 + ' wks';
    document.getElementById('w2-out').textContent = w2 + ' wks';
    document.getElementById('w3-out').textContent = w3 + ' wks';
    document.getElementById('w4-out').textContent = w4 + ' wks';

    const totalUnits = w1 * 1 + w2 * 2 + w3 * 3 + w4 * 4;
    const btcBudget = budget * btcPct / 100;
    const ethBudget = budget * ethPct / 100;

    const idleColor = wIdle >= 0 ? '#898781' : '#a32d2d';
    document.getElementById('week-summary').innerHTML =
        '<strong>' + (w1 + w2 + w3 + w4) + '</strong> buying weeks + ' +
        '<span style="color:' + idleColor + '"><strong>' + Math.max(0, wIdle) + '</strong> idle weeks</span> = 26 total' +
        (wIdle < 0 ? ' <span style="color:#a32d2d;">(exceeds 26 — reduce tiers)</span>' : '');

    const xBtc = totalUnits > 0 ? btcBudget / totalUnits : 0;
    const xEth = totalUnits > 0 ? ethBudget / totalUnits : 0;

    const ethRatio = 1560 / 59000;
    const ethT = [55000, 50000, 45000, 40000].map(p => Math.round(p * ethRatio / 50) * 50);

    document.getElementById('metric-cards').innerHTML = `
      <div class="metric-card">
        <div class="metric-label">x — base buy (BTC)</div>
        <div class="metric-value">${fmt(xBtc)}</div>
        <div class="metric-sub">weekly at &lt;$55K</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">2× buy (BTC)</div>
        <div class="metric-value">${fmt(xBtc * 2)}</div>
        <div class="metric-sub">weekly at &lt;$50K</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">3× buy (BTC)</div>
        <div class="metric-value">${fmt(xBtc * 3)}</div>
        <div class="metric-sub">weekly at &lt;$45K</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">4× buy (BTC)</div>
        <div class="metric-value">${fmt(xBtc * 4)}</div>
        <div class="metric-sub">weekly at &lt;$40K</div>
      </div>
      ${ethPct > 0 ? `
      <div class="metric-card">
        <div class="metric-label">x — base buy (ETH)</div>
        <div class="metric-value">${fmt(xEth)}</div>
        <div class="metric-sub">weekly at ~&lt;$${ethT[0]}</div>
      </div>` : ''}
    `;

    const tiers = [
        { label: 'Tier 1 — &lt;$55K (1×)', weeks: w1, mult: 1, color: '#1baf7a' },
        { label: 'Tier 2 — &lt;$50K (2×)', weeks: w2, mult: 2, color: '#eda100' },
        { label: 'Tier 3 — &lt;$45K (3×)', weeks: w3, mult: 3, color: '#e34948' },
        { label: 'Tier 4 — &lt;$40K (4×)', weeks: w4, mult: 4, color: '#534ab7' },
    ];

    const barsHTML = tiers.map(t => {
        const spend = t.weeks * t.mult * xBtc;
        const barW = btcBudget > 0 ? Math.min(100, Math.round((spend / btcBudget) * 100)) : 0;
        return `
        <div class="bar-wrap">
          <span class="bar-label">${t.label}</span>
          <div class="bar-bg">
            <div class="bar-fill" style="width:${barW}%; background:${t.color}; min-width:${spend > 0 ? '4px' : '0'};">
              ${spend > 0 ? fmt(spend) : ''}
            </div>
          </div>
          <span class="bar-amount">${t.weeks} wks × ${t.mult}× = ${fmt(spend)}</span>
        </div>
      `;
    }).join('') + `
      <div class="total-row">
        <span class="bar-label" style="font-weight:500; color:var(--text-primary);">Total deployed</span>
        <div style="flex:1; font-size:13px; font-weight:500; color:var(--text-primary); padding-left:8px;">
          ${fmt(btcBudget)} BTC${ethPct > 0 ? ' + ' + fmt(ethBudget) + ' ETH' : ''}
        </div>
        <span class="bar-amount" style="font-weight:500; color:var(--text-primary);">${fmt(budget)} total</span>
      </div>
    `;

    document.getElementById('tier-bars').innerHTML = barsHTML;

    let boxes = '';
    if (totalUnits > 0) {
        const formula = [
            w1 > 0 ? w1 + '×1' : '',
            w2 > 0 ? w2 + '×2' : '',
            w3 > 0 ? w3 + '×3' : '',
            w4 > 0 ? w4 + '×4' : '',
        ].filter(Boolean).join(' + ');
        boxes += `<div class="info-box">x = ${fmt(budget)} ÷ (${formula}) = ${fmt(budget)} ÷ ${totalUnits} units → <strong>x = ${fmt(xBtc)}/week BTC${ethPct > 0 ? ', ' + fmt(xEth) + '/week ETH' : ''}</strong></div>`;
    }
    if (wIdle > 0) {
        boxes += `<div class="warn-box">${wIdle} idle week${wIdle > 1 ? 's' : ''} (BTC above $55K) — consider a fallback plan if price doesn't drop within 3 months.</div>`;
    }
    document.getElementById('info-boxes').innerHTML = boxes;
}