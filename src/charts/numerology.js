// ── NUMEROLOGY LO SHU GRID (CHALDEAN METHOD) ────────
export function renderLoShuGrid(chart) {
  if (!chart || !chart.numerology) return '<div class="chart-error">Numerology data unavailable</div>'

  const num = chart.numerology
  const lifePath = num.lifePath || 1
  
  // Chaldean Lo Shu: Map numbers 1-9 to grid
  const grid = createLoShuGrid(chart.name, chart.dob)

  let html = `
    <div class="loshu-container">
      <div class="chart-title">Lo Shu Grid (Chaldean)</div>
      
      <div class="loshu-grid">
  `

  for (let i = 0; i < 9; i++) {
    const number = (i % 3) + 1 + Math.floor(i / 3) * 3
    const count = countInGrid(grid, number)
    const isEmpty = count === 0
    const isStrong = count >= 2
    
    const cellClass = isEmpty ? 'loshu-empty' : isStrong ? 'loshu-strong' : 'loshu-normal'
    
    html += `
      <div class="loshu-cell ${cellClass}">
        <div class="loshu-number">${number}</div>
        <div class="loshu-count">${count > 0 ? '●'.repeat(count) : 'weak'}</div>
      </div>
    `
  }

  html += `
      </div>
      
      <div class="chart-summary">
        <strong>Life Path:</strong> ${lifePath}<br/>
        <strong>Meaning:</strong> ${num.lifePathMeaning || 'Calculating...'}<br/>
        <strong>Personal Year:</strong> ${num.personalYear}<br/>
        <div style="margin-top: 8px; font-size: 11px; color: #999;">
          <strong>Legend:</strong> • = Present | weak = Absent (growth area)
        </div>
      </div>
    </div>
  `

  return html
}

// ── HELPERS ────────────────────────────────────────────
function createLoShuGrid(name, dob) {
  // Convert name + DOB to digits and arrange in 3x3
  const digits = []
  
  // Add birth date digits
  if (dob) {
    dob.split('-').forEach(part => {
      part.split('').forEach(d => digits.push(parseInt(d)))
    })
  }
  
  // Add name numerology (A=1, B=2, ... Z=26, reduce to single digit)
  if (name) {
    name.toUpperCase().split('').forEach(char => {
      const code = char.charCodeAt(0) - 64 // A=1, Z=26
      if (code > 0 && code <= 26) {
        const num = reduceToSingleDigit(code)
        digits.push(num)
      }
    })
  }
  
  return digits
}

function reduceToSingleDigit(num) {
  while (num > 9) {
    num = Math.floor(num / 10) + (num % 10)
  }
  return num
}

function countInGrid(grid, number) {
  return grid.filter(n => n === number).length
}
