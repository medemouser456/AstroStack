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
  console.log('🔍 renderChartPanel called', { 
    hasChart: !!state.birthChart, 
    model: state.selectedModel?.name,
    chartStructure: state.birthChart ? {
      hasVedic: !!state.birthChart.vedic,
      hasWestern: !!state.birthChart.western,
      hasKP: !!state.birthChart.kp,
      hasNumerology: !!state.birthChart.numerology,
      hasChinese: !!state.birthChart.chinese
    } : 'NO_CHART'
  })

  if (!state.birthChart) {
    console.warn('⚠️ No birth chart in state')
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
  let renderError = null

  try {
    console.log('🎨 Attempting to render:', model)
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
        console.log('🔄 Using default Vedic Astrology')
        chartContent = renderD9Tabs(chart)
    }
    
    console.log('✅ Chart rendered successfully for:', model, 'Content length:', chartContent?.length || 0)
  } catch (error) {
    console.error('❌ Chart rendering error:', error.message, error)
    renderError = error.message
    chartContent = `<div class="chart-error">Error rendering chart: ${error.message}</div>`
  }

  if (!chartContent) {
    console.warn('⚠️ Chart rendering returned empty content')
    chartContent = `<div class="chart-error">Chart rendering produced no output</div>`
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
        ${renderError ? `<div style="color:#ff6666; margin-top:12px; padding:8px; background:#1a0a00; border-radius:4px; font-size:11px;">Error: ${renderError}</div>` : ''}
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
