import { navigate, state } from '../main.js'

// ── DATA ───────────────────────────────────────────────
const models = [
  { icon: '🪐', name: 'Vedic Astrology', desc: 'Life path, karma, dashas, remedies' },
  { icon: '⭐', name: 'KP Astrology', desc: 'Precise event timing and predictions' },
  { icon: '❓', name: 'Prashna / Horary', desc: 'Instant answers, no birth data needed' },
  { icon: '🔢', name: 'Numerology', desc: 'Life path number, name energy' },
  { icon: '🃏', name: 'Tarot', desc: 'Intuitive guidance, card spreads' },
  { icon: '📜', name: 'BNS — Brighu Nadi', desc: 'Past life, future events, karma' },
  { icon: '📕', name: 'Lal Kitab', desc: 'Practical remedies, unique insights' },
  { icon: '♈', name: 'Western Astrology', desc: 'Personality, sun and rising signs' },
  { icon: '🐉', name: 'Chinese Astrology', desc: 'Annual cycles, elements, animals' },
  { icon: '✍️', name: 'Name Correction', desc: 'Numerology based name optimisation' },
  { icon: '🏠', name: 'Vastu Shastra', desc: 'Space energy, direction guidance' },
]

const domains = [
  { icon: '👤', name: 'Self', house: '1st House', desc: 'Identity, appearance, health, personality' },
  { icon: '💰', name: 'Income & Wealth', house: '2nd House', desc: 'Savings, family wealth, speech' },
  { icon: '🗣️', name: 'Courage & Communication', house: '3rd House', desc: 'Siblings, courage, writing, travel' },
  { icon: '🏠', name: 'Home & Education', house: '4th House', desc: 'Mother, property, vehicles, emotions' },
  { icon: '❤️', name: 'Love & Progeny', house: '5th House', desc: 'Romance, children, creativity' },
  { icon: '⚕️', name: 'Health & Service', house: '6th House', desc: 'Enemies, debts, diseases, routine' },
  { icon: '💑', name: 'Marriage & Partnership', house: '7th House', desc: 'Spouse, business partner, contracts' },
  { icon: '🔮', name: 'Occult & Hidden', house: '8th House', desc: 'Inheritance, secrets, transformation' },
  { icon: '📚', name: 'Luck & Father', house: '9th House', desc: 'Guru, religion, higher study, luck' },
  { icon: '💼', name: 'Career & Occupation', house: '10th House', desc: 'Profession, status, reputation' },
  { icon: '🎯', name: 'Success & Community', house: '11th House', desc: 'Gains, friends, goals, networks' },
  { icon: '☮️', name: 'Foreign & Moksha', house: '12th House', desc: 'Foreign travel, spirituality, liberation' },
]

// ── FORMAT CHART FOR AI (inline — no import needed) ────
function formatChartForAI(chart, model, domain, language) {
  if (!chart || !chart.vedic) return null

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

  return `
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
}

// ── MAIN RENDER ────────────────────────────────────────
export function renderChat(app, state) {
  app.innerHTML = `
    <div class="cosmic-bg"></div>
    <canvas id="particle-canvas"></canvas>

    <nav class="navbar">
      <a class="navbar-logo" href="#">🔮 Blessed<span>Astro</span></a>
      <ul class="navbar-links">
        <li><a href="#" onclick="event.preventDefault();navigate('about')">About</a></li>
        <li><a href="#" onclick="event.preventDefault();navigate('pricing')">Pricing</a></li>
        <li><a href="#" onclick="event.preventDefault();navigate('business')">Business API</a></li>
        <li><a href="#" onclick="event.preventDefault();navigate('team')">Our Team</a></li>
      </ul>
      <div class="navbar-right">
        <button class="lang-toggle" id="lang-btn">EN / हिं</button>
        ${state.user
          ? `<div class="user-avatar" style="cursor:pointer;" title="${state.user.name}">${state.user.name[0].toUpperCase()}</div>`
          : `<button class="btn-primary" style="padding:8px 20px;font-size:13px;" onclick="goToAuth()">Login / Sign Up</button>`
        }
      </div>
    </nav>

    <button class="sidebar-toggle-btn" id="sidebar-toggle" onclick="toggleSidebar()">◀</button>

    <div class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <button class="new-chat-btn" onclick="startNewChat()">✦ New Chat</button>
      </div>

      ${state.user ? `
      <div class="sidebar-section">
        <div class="user-profile-card">
          <div class="user-avatar">${state.user.name[0].toUpperCase()}</div>
          <div class="user-info">
            <div class="user-name">${state.user.name}</div>
            <div class="user-plan">✦ ${state.user.plan || 'Free'} Plan</div>
          </div>
        </div>
      </div>
      ` : ''}

      <div class="sidebar-section">
        <div class="sidebar-section-title">Recent Chats</div>
        ${state.chatHistory.length === 0
          ? `<div style="padding:8px 12px; font-size:12px; color:var(--grey-2);">No chats yet. Start a new chat!</div>`
          : state.chatHistory.slice(0, 5).map((chat, i) => `
            <button class="sidebar-item" onclick="loadChat(${i})">
              <span class="sidebar-item-icon">${chat.model?.icon || '🔮'}</span>
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${chat.title || 'Chat ' + (i+1)}</span>
            </button>
          `).join('')
        }
      </div>

      <div class="sidebar-section">
        <div class="sidebar-section-title">Services</div>
        <button class="sidebar-item"><span class="sidebar-item-icon">📅</span> Personal Calendar</button>
        <button class="sidebar-item"><span class="sidebar-item-icon">📋</span> Life Reports</button>
        <button class="sidebar-item"><span class="sidebar-item-icon">🧑‍💼</span> Book Astrologer</button>
        <button class="sidebar-item"><span class="sidebar-item-icon">💬</span> Counselling</button>
      </div>

      <div class="sidebar-bottom">
        <button class="sidebar-item" onclick="goToSettings()">
          <span class="sidebar-item-icon">⚙️</span> Settings
        </button>
        ${state.user
          ? `<button class="sidebar-item" onclick="handleLogout()"><span class="sidebar-item-icon">🚪</span> Logout</button>`
          : `<button class="sidebar-item" onclick="goToAuth()"><span class="sidebar-item-icon">🔑</span> Login / Sign Up</button>`
        }
      </div>
    </div>

    <div class="chat-layout">
      <div class="chat-main" id="chat-main">
        <div class="chat-messages" id="chat-messages">
          ${state.currentChat.length === 0 ? renderWelcome() : renderMessages()}
        </div>

        <div class="chat-input-area">
          <div class="chat-input-selectors" style="position:relative;">
            <div style="position:relative;">
              <button class="selector-btn" id="model-btn" onclick="toggleModelDropdown()">
                ${state.selectedModel.icon} ${state.selectedModel.name} <span class="arrow">▾</span>
              </button>
              <div class="dropdown" id="model-dropdown">
                ${models.map(m => `
                  <div class="dropdown-item ${state.selectedModel.name === m.name ? 'selected' : ''}"
                    onclick="selectModel('${m.name}')">
                    <span class="dropdown-item-icon">${m.icon}</span>
                    <div>
                      <div class="dropdown-item-name">${m.name}</div>
                      <div class="dropdown-item-desc">${m.desc}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="position:relative;">
              <button class="selector-btn" id="domain-btn" onclick="toggleDomainDropdown()">
                ${state.selectedDomain.icon} ${state.selectedDomain.name} <span class="arrow">▾</span>
              </button>
              <div class="dropdown" id="domain-dropdown">
                ${domains.map(d => `
                  <div class="dropdown-item ${state.selectedDomain.name === d.name ? 'selected' : ''}"
                    onclick="selectDomain('${d.name}')">
                    <span class="dropdown-item-icon">${d.icon}</span>
                    <div>
                      <div class="dropdown-item-name">${d.name}</div>
                      <div class="dropdown-item-desc">${d.house} — ${d.desc}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <button class="selector-btn" id="lang-toggle-btn" onclick="toggleLanguage()">
              ${state.language === 'en' ? '🇬🇧 EN' : '🇮🇳 हिं'}
            </button>
          </div>

          <div class="chat-input-box">
            <textarea
              id="chat-textarea"
              class="chat-textarea"
              placeholder="Ask ${state.selectedModel.name} about ${state.selectedDomain.name}..."
              rows="1"
              onkeydown="handleChatKey(event)"
              oninput="autoResize(this)"
            ></textarea>
            <div class="chat-input-actions">
              <button class="upload-btn" title="Upload file">📎</button>
              <button class="send-btn send-pulse" id="send-btn" onclick="sendChatMessage()">➤</button>
            </div>
          </div>

          <div class="chat-disclaimer">
            Blessed Astro provides cosmic guidance for self-reflection. Not a substitute for professional advice.
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-bar" id="bottom-bar">
      <button class="bottom-bar-item active"><span class="icon">💬</span><span>Chat</span></button>
      <button class="bottom-bar-item" onclick="startNewChat()"><span class="icon">✦</span><span>New</span></button>
      <button class="bottom-bar-item"><span class="icon">📅</span><span>Calendar</span></button>
      <button class="bottom-bar-item"><span class="icon">👤</span><span>Profile</span></button>
      <button class="bottom-bar-item" onclick="toggleSidebar()"><span class="icon">☰</span><span>Menu</span></button>
    </div>
  `

  initParticles()
  initChatHandlers(state)
  checkUserDetails(state)
}

// ── WELCOME SCREEN ─────────────────────────────────────
function renderWelcome() {
  return `
    <div class="chat-welcome page-enter">
      <div class="chat-welcome-logo float">🔮</div>
      <div style="font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:700; color:var(--cream);">Blessed Astro</div>
      <div class="chat-welcome-tagline">"Indian Vedic Wisdom for all Life Decisions"</div>
      <div class="chat-welcome-hint">Select your astrology model and domain below, then ask your question</div>
      <div class="suggestion-chips">
        <div class="suggestion-chip" onclick="fillSuggestion('What does my birth chart say about my career?')">💼 Career guidance</div>
        <div class="suggestion-chip" onclick="fillSuggestion('When is the best time for me to get married?')">💑 Marriage timing</div>
        <div class="suggestion-chip" onclick="fillSuggestion('What are my lucky numbers and colours?')">🔢 Lucky numbers</div>
        <div class="suggestion-chip" onclick="fillSuggestion('How will my finances look this year?')">💰 Financial outlook</div>
        <div class="suggestion-chip" onclick="fillSuggestion('What does my Tarot say about my love life?')">🃏 Love & Tarot</div>
        <div class="suggestion-chip" onclick="fillSuggestion('Is my home Vastu compliant?')">🏠 Vastu check</div>
      </div>
    </div>
  `
}

function renderMessages() {
  return state.currentChat.map(msg => `
    <div class="message ${msg.role}">
      ${msg.role === 'ai' ? `<div class="msg-avatar">${state.selectedModel.icon}</div>` : ''}
      <div class="msg-content">
        <div class="msg-name">${msg.role === 'ai' ? state.selectedModel.name + ' Advisor' : 'You'}</div>
        <div class="msg-bubble">${msg.content}</div>
      </div>
      ${msg.role === 'user' ? `<div class="msg-avatar">👤</div>` : ''}
    </div>
  `).join('')
}

// ── PARTICLES ──────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particle-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.5,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.5 + 0.1,
    twinkle: Math.random() * Math.PI * 2,
  }))

  const symbols = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','☉','☽','♂','♃','♄']
  const floaters = Array.from({ length: 8 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    opacity: Math.random() * 0.08 + 0.03,
    size: Math.random() * 20 + 12,
    speed: (Math.random() - 0.5) * 0.2,
  }))

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy; p.twinkle += 0.02
      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0
      const opacity = p.opacity * (0.7 + 0.3 * Math.sin(p.twinkle))
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 140, 64, ${opacity})`
      ctx.fill()
    })
    floaters.forEach(f => {
      f.y += f.speed
      if (f.y > canvas.height) f.y = -30
      if (f.y < -30) f.y = canvas.height
      ctx.font = `${f.size}px serif`
      ctx.fillStyle = `rgba(200, 150, 12, ${f.opacity})`
      ctx.fillText(f.symbol, f.x, f.y)
    })
    requestAnimationFrame(animate)
  }
  animate()
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}

// ── CHAT HANDLERS ──────────────────────────────────────
function initChatHandlers(state) {
  window.toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar')
    const chatMain = document.getElementById('chat-main')
    const toggleBtn = document.getElementById('sidebar-toggle')
    sidebar.classList.toggle('collapsed')
    const isCollapsed = sidebar.classList.contains('collapsed')
    chatMain.style.marginLeft = isCollapsed ? '0' : 'var(--sidebar-width)'
    toggleBtn.textContent = isCollapsed ? '▶' : '◀'
    toggleBtn.style.left = isCollapsed ? '12px' : 'calc(var(--sidebar-width) - 12px)'
  }

  window.toggleModelDropdown = () => {
    document.getElementById('model-dropdown').classList.toggle('open')
    document.getElementById('domain-dropdown').classList.remove('open')
  }

  window.toggleDomainDropdown = () => {
    document.getElementById('domain-dropdown').classList.toggle('open')
    document.getElementById('model-dropdown').classList.remove('open')
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#model-btn') && !e.target.closest('#model-dropdown')) {
      document.getElementById('model-dropdown')?.classList.remove('open')
    }
    if (!e.target.closest('#domain-btn') && !e.target.closest('#domain-dropdown')) {
      document.getElementById('domain-dropdown')?.classList.remove('open')
    }
  })

  window.selectModel = (name) => {
    const model = models.find(m => m.name === name)
    if (model) {
      state.selectedModel = model
      document.getElementById('model-btn').innerHTML = `${model.icon} ${model.name} <span class="arrow">▾</span>`
      document.getElementById('model-dropdown').classList.remove('open')
      document.querySelectorAll('#model-dropdown .dropdown-item').forEach(el => {
        el.classList.toggle('selected', el.querySelector('.dropdown-item-name').textContent === name)
      })
      const ta = document.getElementById('chat-textarea')
      if (ta) ta.placeholder = `Ask ${model.name} about ${state.selectedDomain.name}...`
    }
  }

  window.selectDomain = (name) => {
    const domain = domains.find(d => d.name === name)
    if (domain) {
      state.selectedDomain = domain
      document.getElementById('domain-btn').innerHTML = `${domain.icon} ${domain.name} <span class="arrow">▾</span>`
      document.getElementById('domain-dropdown').classList.remove('open')
      document.querySelectorAll('#domain-dropdown .dropdown-item').forEach(el => {
        el.classList.toggle('selected', el.querySelector('.dropdown-item-name').textContent === name)
      })
      const ta = document.getElementById('chat-textarea')
      if (ta) ta.placeholder = `Ask ${state.selectedModel.name} about ${domain.name}...`
    }
  }

  window.toggleLanguage = () => {
    state.language = state.language === 'en' ? 'hi' : 'en'
    const btn = document.getElementById('lang-toggle-btn')
    if (btn) btn.textContent = state.language === 'en' ? '🇬🇧 EN' : '🇮🇳 हिं'
  }

  window.autoResize = (el) => {
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  window.handleChatKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChatMessage()
    }
  }

  window.fillSuggestion = (text) => {
    const ta = document.getElementById('chat-textarea')
    if (ta) { ta.value = text; ta.focus(); autoResize(ta) }
  }

  window.startNewChat = () => {
    if (!state.user) { showCrystalBall(); return }
    state.currentChat = []
    const messages = document.getElementById('chat-messages')
    if (messages) messages.innerHTML = renderWelcome()
  }

  window.goToAuth = () => navigate('auth')
  window.goToSettings = () => alert('Settings coming in Phase 2!')
  window.handleLogout = () => { state.user = null; navigate('chat') }
  window.loadChat = (i) => {
    const chat = state.chatHistory[i]
    if (chat) { state.currentChat = chat.messages || []; state.selectedModel = chat.model || state.selectedModel }
  }
}

// ── SEND MESSAGE ───────────────────────────────────────
async function sendChatMessage() {
  const ta = document.getElementById('chat-textarea')
  const text = ta?.value.trim()
  if (!text) return

  const sendBtn = document.getElementById('send-btn')
  const messagesEl = document.getElementById('chat-messages')

  if (state.currentChat.length === 0) messagesEl.innerHTML = ''

  state.currentChat.push({ role: 'user', content: text })
  addMessageToUI('user', text, '👤', 'You')
  ta.value = ''
  ta.style.height = 'auto'
  sendBtn.disabled = true

  const loadingId = addLoadingMessage()

  // Build chart context
  let chartContext = ''
  if (state.birthChart) {
    chartContext = formatChartForAI(state.birthChart, state.selectedModel, state.selectedDomain, state.language) || ''
  }

  if (!chartContext) {
    chartContext = `User: ${state.userDetails?.name || 'Unknown'}, DOB: ${state.userDetails?.dob || 'Unknown'}, Place: ${state.userDetails?.birthPlace || 'Unknown'}, Gender: ${state.userDetails?.gender || 'Unknown'}`
  }

  const systemPrompt = `You are an expert ${state.selectedModel.name} advisor with 30 years of experience.

${chartContext}

INSTRUCTIONS:
- Analyze the birth chart data provided above carefully
- Focus specifically on ${state.selectedDomain.name} (${state.selectedDomain.house})
- Reference specific planets, houses and dashas from the chart data
- Give practical, actionable guidance — not vague predictions
- Suggest specific remedies if any afflictions are found
- ${state.language === 'hi' ? 'Respond ONLY in Hindi using Devanagari script.' : 'Respond in English.'}
- Speak warmly like a trusted family astrologer
- End with one specific actionable advice or remedy`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://blessedastro.com',
        'X-Title': 'Blessed Astro'
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [
          { role: 'system', content: systemPrompt },
          ...state.currentChat.map(m => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.content
          }))
        ],
        max_tokens: 700,
        temperature: 0.75
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`API Error ${response.status}: ${data.error?.message || JSON.stringify(data)}`)
    }

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from AI')
    }

    const aiText = data.choices[0].message.content
    removeLoadingMessage(loadingId)
    state.currentChat.push({ role: 'ai', content: aiText })
    addMessageToUI('ai', aiText, state.selectedModel.icon, state.selectedModel.name + ' Advisor')

    if (state.currentChat.length === 2) {
      state.chatHistory.unshift({
        title: text.slice(0, 40) + (text.length > 40 ? '...' : ''),
        model: state.selectedModel,
        messages: state.currentChat,
        timestamp: Date.now()
      })
    }

  } catch (err) {
    removeLoadingMessage(loadingId)
    console.error('Chat error:', err.message)
    addMessageToUI('ai', 'The cosmic connection was interrupted. Please try again. (' + err.message + ')', state.selectedModel.icon, state.selectedModel.name + ' Advisor')
  } finally {
    sendBtn.disabled = false
    scrollToBottom()
  }
}

// ── UI HELPERS ─────────────────────────────────────────
function addMessageToUI(role, content, avatar, name) {
  const messagesEl = document.getElementById('chat-messages')
  const div = document.createElement('div')
  div.className = `message ${role}`
  div.innerHTML = `
    ${role === 'ai' ? `<div class="msg-avatar">${avatar}</div>` : ''}
    <div class="msg-content">
      <div class="msg-name">${name}</div>
      <div class="msg-bubble">${content}</div>
    </div>
    ${role === 'user' ? `<div class="msg-avatar">${avatar}</div>` : ''}
  `
  messagesEl.appendChild(div)
  scrollToBottom()
}

function addLoadingMessage() {
  const id = 'loading-' + Date.now()
  const messagesEl = document.getElementById('chat-messages')
  const div = document.createElement('div')
  div.className = 'message ai'
  div.id = id
  div.innerHTML = `
    <div class="msg-avatar">${state.selectedModel.icon}</div>
    <div class="msg-content">
      <div class="msg-name">${state.selectedModel.name} Advisor</div>
      <div class="msg-bubble"><div class="loading-dots"><span></span><span></span><span></span></div></div>
    </div>
  `
  messagesEl.appendChild(div)
  scrollToBottom()
  return id
}

function removeLoadingMessage(id) {
  document.getElementById(id)?.remove()
}

function scrollToBottom() {
  const el = document.getElementById('chat-messages')
  if (el) el.scrollTop = el.scrollHeight
}

// ── CRYSTAL BALL USER DETAILS ──────────────────────────
function checkUserDetails(state) {
  if (!state.userDetails && state.currentChat.length === 0) {
    setTimeout(() => showCrystalBall(), 500)
  }
}

window.showCrystalBall = function () {
  const overlay = document.createElement('div')
  overlay.id = 'crystal-overlay'
  overlay.className = 'crystal-screen'
  overlay.innerHTML = `
    <div class="crystal-title">Let the planets know you...</div>
    <div class="crystal-subtitle">Your details help us give you accurate cosmic guidance</div>
    <div class="crystal-ball pulse"></div>
    <div class="crystal-form page-enter">
      <div class="crystal-form-row">
        <div class="form-group">
          <label class="form-label">Your Name *</label>
          <input type="text" id="cd-name" class="form-input" placeholder="Full name" />
        </div>
        <div class="form-group">
          <label class="form-label">Gender *</label>
          <div class="gender-toggle">
            <button class="gender-btn active" id="g-male" onclick="setGender('Male')">♂ Male</button>
            <button class="gender-btn" id="g-female" onclick="setGender('Female')">♀ Female</button>
            <button class="gender-btn" id="g-other" onclick="setGender('Other')">⚧ Other</button>
          </div>
        </div>
      </div>
      <div class="crystal-form-row">
        <div class="form-group">
          <label class="form-label">Date of Birth *</label>
          <input type="date" id="cd-dob" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Time of Birth</label>
          <input type="time" id="cd-tob" class="form-input" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Place of Birth *</label>
        <input type="text" id="cd-place" class="form-input" placeholder="City, Country" />
      </div>
      <div class="form-group">
        <label class="form-label">Current City</label>
        <input type="text" id="cd-city" class="form-input" placeholder="Where you live now" />
      </div>
      <button class="btn-primary" style="width:100%;justify-content:center;margin-top:8px;" id="begin-btn" onclick="saveCrystalDetails()">
        ✨ Begin My Journey
      </button>
      <button class="btn-ghost" style="width:100%;text-align:center;margin-top:8px;" onclick="skipCrystalBall()">
        Skip for now
      </button>
      <p class="privacy-note">🔒 Your details are sacred and never shared</p>
    </div>
  `
  document.body.appendChild(overlay)

  let selectedGender = 'Male'

  window.setGender = (g) => {
    selectedGender = g
    document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'))
    document.getElementById('g-' + g.toLowerCase())?.classList.add('active')
  }

  window.saveCrystalDetails = async () => {
    const name = document.getElementById('cd-name').value.trim()
    const dob = document.getElementById('cd-dob').value
    const place = document.getElementById('cd-place').value.trim()

    if (!name || !dob || !place) {
      alert('Please fill in Name, Date of Birth and Place of Birth.')
      return
    }

    const userDetails = {
      name,
      gender: selectedGender,
      dob,
      tob: document.getElementById('cd-tob').value,
      birthPlace: place,
      currentCity: document.getElementById('cd-city').value.trim()
    }

    state.userDetails = userDetails

    // Show calculating state
    const beginBtn = document.getElementById('begin-btn')
    if (beginBtn) {
      beginBtn.textContent = '⏳ Reading the stars...'
      beginBtn.disabled = true
    }

    // Calculate birth chart
    try {
      const { calculateFullChart } = await import('../astro/engine.js')
      const result = await calculateFullChart(userDetails)
      if (result.success) {
        state.birthChart = result.chart
        console.log('✅ Chart calculated:', result.chart.vedic.lagna.sign, result.chart.vedic.lagna.degree.toFixed(2))
      } else {
        console.warn('Chart calculation failed:', result.error)
      }
    } catch (e) {
      console.error('Chart import error:', e)
    }

    // Set user
    if (!state.user) {
      state.user = { name, plan: 'Free' }
    }

    // Close overlay
    overlay.style.transition = 'opacity 0.5s ease'
    overlay.style.opacity = '0'
    setTimeout(() => {
      overlay.remove()
      navigate('chat')
    }, 500)
  }

  window.skipCrystalBall = () => {
    overlay.remove()
  }
}