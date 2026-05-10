// ── OPENROUTER API CLIENT ──────────────────────────────

/**
 * Send a chat completion request to OpenRouter API
 * @param {Array} messages - Chat messages array with role and content
 * @param {Object} options - Configuration options
 * @returns {Promise<string>} - AI response text
 */
export async function sendChatCompletion(messages, options = {}) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error(
      'OpenRouter API key is not configured. Please add VITE_OPENROUTER_API_KEY to your .env file and restart the app.'
    )
  }

  const {
    model = 'openrouter/auto',
    maxTokens = 700,
    temperature = 0.75,
  } = options

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://blessedastro.com',
        'X-Title': 'Blessed Astro'
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        `API Error ${response.status}: ${data.error?.message || JSON.stringify(data)}`
      )
    }

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response received from AI service')
    }

    return data.choices[0].message.content
  } catch (error) {
    console.error('OpenRouter API error:', error)
    throw error
  }
}

/**
 * Format birth chart data and user details into a system prompt
 * @param {Object} chart - Birth chart data
 * @param {Object} model - Selected astrology model
 * @param {Object} domain - Selected domain (house/life area)
 * @param {Object} userDetails - User birth details
 * @param {string} language - Response language ('en' or 'hi')
 * @returns {string} - Formatted system prompt
 */
export function buildSystemPrompt(chart, model, domain, userDetails, language = 'en') {
  let chartContext = ''

  if (chart && chart.vedic) {
    const v = chart.vedic
    const d = chart.dasha

    const planetLines = Object.entries(v.planets).map(([_, p]) => {
      const retro = p.isRetrograde ? ' (R)' : ''
      const combust = p.isCombust ? ' (Combust)' : ''
      return `  ${p.name}: ${p.sign} House ${p.house} | ${p.degree.toFixed(1)}° | ${p.nakshatra?.name || ''} Pada ${p.nakshatra?.pada || ''} | ${p.strength}${retro}${combust}`
    }).join('\n')

    const houseLines = Object.entries(v.houses).map(([num, h]) =>
      `  House ${num}: ${h.sign} (Lord: ${h.lord})`
    ).join('\n')

    const yogaList = chart.yogas?.positive?.map(y => `  + ${y.name}: ${y.description}`).join('\n') || '  None detected'
    const doshaList = chart.yogas?.doshas?.map(d => `  ! ${d.name}: ${d.description}`).join('\n') || '  None detected'

    chartContext = `
═══════════════════════════════════════
BIRTH CHART (Swiss Ephemeris Calculated)
═══════════════════════════════════════
Name   : ${chart.name}
DOB    : ${chart.dob}
TOB    : ${chart.tob || 'Unknown'}
Place  : ${chart.birthPlace}
Gender : ${chart.gender}

LAGNA: ${v.lagna.sign} ${v.lagna.degree.toFixed(2)}° | ${v.lagna.nakshatra?.name} Pada ${v.lagna.nakshatra?.pada} | Lord: ${v.lagna.lord}

PLANETS:
${planetLines}

HOUSES:
${houseLines}

DASHA:
  Mahadasha     : ${d?.mahadasha?.planet} (${d?.mahadasha?.start} to ${d?.mahadasha?.end})
  Antardasha    : ${d?.antardasha?.planet} (${d?.antardasha?.start} to ${d?.antardasha?.end})
  Pratyantardasha: ${d?.pratyantardasha?.planet || 'Calculating'}

YOGAS: ${yogaList}
DOSHAS: ${doshaList}

NUMEROLOGY:
  Life Path: ${chart.numerology?.lifePath} | Personal Year: ${chart.numerology?.personalYear}
  Meaning: ${chart.numerology?.lifePathMeaning || ''}

CHINESE: ${chart.chinese?.animalSign} (${chart.chinese?.element}) | 2026: ${chart.chinese?.currentYearImpact}

QUERY: ${domain?.name} (${domain?.house}) | MODEL: ${model?.name}
═══════════════════════════════════════`
  } else {
    chartContext = `User: ${userDetails?.name || 'Unknown'}, DOB: ${userDetails?.dob || 'Unknown'}, Place: ${userDetails?.birthPlace || 'Unknown'}, Gender: ${userDetails?.gender || 'Unknown'}`
  }

  return `You are an expert ${model.name} advisor with 30 years of experience.

${chartContext}

INSTRUCTIONS:
- Analyze the birth chart data provided above carefully
- Focus specifically on ${domain.name} (${domain.house})
- Reference specific planets, houses and dashas from the chart data
- Give practical, actionable guidance — not vague predictions
- Suggest specific remedies if any afflictions are found
- ${language === 'hi' ? 'Respond ONLY in Hindi using Devanagari script.' : 'Respond in English.'}
- Speak warmly like a trusted family astrologer
- End with one specific actionable advice or remedy`
}
