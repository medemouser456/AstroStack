// ── PRASHNA L/S/R/D DISPLAY ────────────────────────
export function renderPrashnaLSRD(chart) {
  if (!chart || !chart.vedic) return '<div class="chart-error">Prashna data unavailable</div>'

  const vedic = chart.vedic
  const now = new Date()

  // L = Lagna
  const lagna = vedic.lagna

  // S = Sun
  const sun = vedic.planets.Sun

  // R = Ruling planets at query time
  const ruling = getRulingPlanetsAtTime(now)

  // D = Day lord
  const dayLord = getDayLord(now)

  let html = `
    <div class="prashna-container">
      <div class="chart-title">Prashna - L / S / R / D</div>
      
      <table class="prashna-table">
        <tr style="background: #1a3a52; border-bottom: 2px solid #ffa500;">
          <th>Component</th><th>Sign</th><th>Nakshatra</th><th>Sub Lord</th><th>Strength</th>
        </tr>
        <tr>
          <td><strong>L - Lagna</strong></td>
          <td>${lagna.sign}</td>
          <td>${lagna.nakshatra?.name} Pada ${lagna.nakshatra?.pada}</td>
          <td>${lagna.lord}</td>
          <td>${lagna.strength}</td>
        </tr>
        <tr>
          <td><strong>S - Sun</strong></td>
          <td>${sun?.sign}</td>
          <td>${sun?.nakshatra?.name} Pada ${sun?.nakshatra?.pada}</td>
          <td>${sun?.lord || '—'}</td>
          <td>${sun?.strength || '—'}</td>
        </tr>
        <tr>
          <td><strong>R - Ruling</strong></td>
          <td colspan="4" style="font-size: 11px;">
            Day: ${ruling.dayLord} | Moon: ${ruling.moonLord} | Time: ${ruling.timeLord} | Hora: ${ruling.horaLord}
          </td>
        </tr>
        <tr>
          <td><strong>D - Day Lord</strong></td>
          <td colspan="4" style="font-size: 11px;">
            ${dayLord} (Query Time: ${now.toLocaleTimeString()})
          </td>
        </tr>
      </table>

      <div style="margin-top: 12px; font-size: 11px; color: #999;">
        <strong>Query Time:</strong> ${now.toLocaleString()}<br/>
        <strong>Prashna Lagna:</strong> Indicates the nature of query<br/>
        <strong>Ruling Planets:</strong> Show hidden influences at query moment
      </div>
    </div>
  `

  return html
}

// ── HELPERS ────────────────────────────────────────────
function getRulingPlanetsAtTime(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const hours = ['Mercury', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars']
  
  const dayLord = days[date.getDay()]
  const hour = date.getHours() % 12 || 12
  const horaIndex = (hour - 1) % 7
  
  return {
    dayLord,
    moonLord: '—', // Would need lunar position
    timeLord: hours[horaIndex],
    horaLord: hours[horaIndex]
  }
}

function getDayLord(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[date.getDay()]
}
