// ── CHINESE ASTROLOGY SNAPSHOT ──────────────────────
export function renderChineseSnapshot(chart) {
  if (!chart || !chart.chinese) return '<div class="chart-error">Chinese astrology data unavailable</div>'

  const cn = chart.chinese

  let html = `
    <div class="chinese-container">
      <div class="chart-title">Chinese Zodiac & BaZi</div>
      
      <div class="chart-summary" style="text-align: center; padding: 16px;">
        <div style="font-size: 48px; margin: 12px 0;">${cn.animalEmoji || '🐉'}</div>
        <div style="font-size: 18px; font-weight: bold; color: #ffa500; margin: 8px 0;">
          ${cn.animalSign} (${cn.element})
        </div>
        <div style="font-size: 12px; color: #cccccc; margin: 8px 0;">
          ${cn.polarity} | ${cn.triad}<br/>
          Compatibility: ${cn.compatibility}
        </div>
      </div>

      <table class="chinese-table">
        <tr style="background: #1a3a52; border-bottom: 2px solid #ffa500;">
          <th>Pillar</th><th>Element</th><th>Sign</th>
        </tr>
        <tr>
          <td>Year</td><td>${cn.yearElement}</td><td>${cn.yearSign}</td>
        </tr>
        <tr>
          <td>Month</td><td>${cn.monthElement}</td><td>${cn.monthSign}</td>
        </tr>
        <tr>
          <td>Day</td><td>${cn.dayElement}</td><td>${cn.daySign}</td>
        </tr>
        <tr>
          <td>Hour</td><td>${cn.hourElement}</td><td>${cn.hourSign}</td>
        </tr>
      </table>

      <div style="margin-top: 12px; font-size: 11px; color: #999;">
        <strong>2026 Impact:</strong> ${cn.currentYearImpact}<br/>
        <strong>Lucky Color:</strong> ${cn.luckyColor} | <strong>Lucky Number:</strong> ${cn.luckyNumber}
      </div>
    </div>
  `

  return html
}
