// ── CHART PANEL — MAIN INTEGRATION ──────────────────
import { renderD9Tabs } from './vedic.js'
import { renderKPChart } from './kp.js'
import { renderLoShuGrid } from './numerology.js'
import { renderChineseSnapshot } from './chinese.js'
import { renderTarotSpread } from './tarot.js'
import { renderPrashnaLSRD } from './prashna.js'
import { renderWesternChart } from './western.js'
import { renderBNSJupiterChart } from './bns.js'

export function renderChartPanel(state) {
  if (!state.birthChart) {
    return `
      <div class="chart-panel chart-panel-empty">
        <div class="chart-message">
          📊 Enter your birth details to see your chart
        </div>
      </div>
    `
  }

  const chart = state.birthChart
  const model = state.selectedModel?.name || 'Vedic Astrology'

  let chartContent = ''

  switch (model) {
    case 'Vedic Astrology':
      chartContent = renderD9Tabs(chart)
      break
    case 'KP Astrology':
      chartContent = renderKPChart(chart)
      break
    case 'Numerology':
      chartContent = renderLoShuGrid(chart)
      break
    case 'Chinese Astrology':
      chartContent = renderChineseSnapshot(chart)
      break
    case 'Tarot':
      chartContent = renderTarotSpread(chart)
      break
    case 'Prashna / Horary':
      chartContent = renderPrashnaLSRD(chart)
      break
    case 'Western Astrology':
      chartContent = renderWesternChart(chart)
      break
    case 'BNS — Brighu Nadi':
      chartContent = renderBNSJupiterChart(chart)
      break
    default:
      chartContent = renderD9Tabs(chart)
  }

  return `
    <div class="chart-panel">
      <div class="chart-panel-header">
        <div class="chart-panel-title">${model}</div>
        <div class="chart-panel-actions">
          <button class="chart-btn" onclick="exportChartPDF('${model}')" title="Export PDF">📥</button>
          <button class="chart-btn" onclick="exportChartPNG('${model}')" title="Export PNG">🖼️</button>
          <button class="chart-btn" onclick="toggleChartPanel()" title="Collapse">✕</button>
        </div>
      </div>
      <div class="chart-panel-content">
        ${chartContent}
      </div>
    </div>
  `
}

export function getChartForModel(model, chart) {
  if (!chart) return null
  
  const map = {
    'Vedic Astrology': chart.vedic,
    'KP Astrology': chart.kp,
    'Numerology': chart.numerology,
    'Chinese Astrology': chart.chinese,
    'Western Astrology': chart.western,
  }
  
  return map[model] || chart.vedic
}
