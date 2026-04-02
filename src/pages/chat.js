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

// ── MAIN RENDER ────────────────────────────────────────
export function renderChat(app, state) {
  app.innerHTML = `
    <div class="cosmic-bg"></div>
    <canvas id="particle-canvas"></canvas>

    <!-- Navbar -->
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

    <!-- Sidebar Toggle -->
    <button class="sidebar-toggle-btn" id="sidebar-toggle" onclick="toggleSidebar()">◀</button>

    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <button class="new-chat-btn" onclick="startNewChat()">
          ✦ New Chat
        </button>
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
        <button class="sidebar-item">
          <span class="sidebar-item-icon">📅</span> Personal Calendar
        </button>
        <button class="sidebar-item">
          <span class="sidebar-item-icon">📋</span> Life Reports
        </button>
        <button class="sidebar-item">
          <span class="sidebar-item-icon">🧑‍💼</span> Book Astrologer
        </button>
        <button class="sidebar-item">
          <span class="sidebar-item-icon">💬</span> Counselling
        </button>
      </div>

      <div class="sidebar-bottom">
        <button class="sidebar-item" onclick="goToSettings()">
          <span class="sidebar-item-icon">⚙️</span> Settings
        </button>
        ${state.user
          ? `<button class="sidebar-item" onclick="handleLogout()">
              <span class="sidebar-item-icon">🚪</span> Logout
             </button>`
          : `<button class="sidebar-item" onclick="goToAuth()">
              <span class="sidebar-item-icon">🔑</span> Login / Sign Up
             </button>`
        }
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="chat-layout">
      <div class="chat-main" id="chat-main">

        <!-- Messages or Welcome -->
        <div class="chat-messages" id="chat-messages">
          ${state.currentChat.length === 0 ? renderWelcome() : renderMessages()}
        </div>

        <!-- Chat Input Bar -->
        <div class="chat-input-area">

          <!-- Selectors Row -->
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

          <!-- Input Box -->
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

    <!-- Mobile Bottom Bar -->
    <div class="bottom-bar" id="bottom-bar">
      <button class="bottom-bar-item active">
        <span class="icon">💬</span>
        <span>Chat</span>
      </button>
      <button class="bottom-bar-item" onclick="startNewChat()">
        <span class="icon">✦</span>
        <span>New</span>
      </button>
      <button class="bottom-bar-item">
        <span class="icon">📅</span>
        <span>Calendar</span>
      </button>
      <button class="bottom-bar-item">
        <span class="icon">👤</span>
        <span>Profile</span>
      </button>
      <button class="bottom-bar-item" onclick="toggleSidebar()">
        <span class="icon">☰</span>
        <span>Menu</span>
      </button>
    </div>
  `

  // Initialize everything
  initParticles()
  initChatHandlers(state)
  checkUserDetails(state)
}

// ── WELCOME SCREEN ─────────────────────────────────────
function renderWelcome() {
  return `
    <div class="chat-welcome page-enter">
      <div class="chat-welcome-logo float">🔮</div>
      <div style="font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:700; color:var(--cream);">
        Blessed Astro
      </div>
      <div class="chat-welcome-tagline">
        "Indian Vedic Wisdom for all Life Decisions"
      </div>
      <div class="chat-welcome-hint">
        Select your astrology model and domain below, then ask your question
      </div>
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

// ── RENDER MESSAGES ────────────────────────────────────
function renderMessages() {
  return state.currentChat.map(msg => `
    <div class="message ${msg.role}">
      ${msg.role === 'ai'
        ? `<div class="msg-avatar">${state.selectedModel.icon}</div>`
        : ''
      }
      <div class="msg-content">
        <div class="msg-name">${msg.role === 'ai' ? state.selectedModel.name + ' Advisor' : 'You'}</div>
        <div class="msg-bubble">${msg.content}</div>
      </div>
      ${msg.role === 'user'
        ? `<div class="msg-avatar">👤</div>`
        : ''
      }
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

    // Draw star particles
    particles.forEach(p => {
      p.x += p.dx
      p.y += p.dy
      p.twinkle += 0.02

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

    // Draw floating symbols
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

  // Sidebar toggle
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

  // Model dropdown
  window.toggleModelDropdown = () => {
    document.getElementById('model-dropdown').classList.toggle('open')
    document.getElementById('domain-dropdown').classList.remove('open')
  }

  // Domain dropdown
  window.toggleDomainDropdown = () => {
    document.getElementById('domain-dropdown').classList.toggle('open')
    document.getElementById('model-dropdown').classList.remove('open')
  }

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#model-btn') && !e.target.closest('#model-dropdown')) {
      document.getElementById('model-dropdown')?.classList.remove('open')
    }
    if (!e.target.closest('#domain-btn') && !e.target.closest('#domain-dropdown')) {
      document.getElementById('domain-dropdown')?.classList.remove('open')
    }
  })

  // Select model
  window.selectModel = (name) => {
    const model = models.find(m => m.name === name)
    if (model) {
      state.selectedModel = model
      document.getElementById('model-btn').innerHTML =
        `${model.icon} ${model.name} <span class="arrow">▾</span>`
      document.getElementById('model-dropdown').classList.remove('open')
      document.querySelectorAll('#model-dropdown .dropdown-item').forEach(el => {
        el.classList.toggle('selected', el.querySelector('.dropdown-item-name').textContent === name)
      })
      // Update placeholder
      const ta = document.getElementById('chat-textarea')
      if (ta) ta.placeholder = `Ask ${model.name} about ${state.selectedDomain.name}...`
    }
  }

  // Select domain
  window.selectDomain = (name) => {
    const domain = domains.find(d => d.name === name)
    if (domain) {
      state.selectedDomain = domain
      document.getElementById('domain-btn').innerHTML =
        `${domain.icon} ${domain.name} <span class="arrow">▾</span>`
      document.getElementById('domain-dropdown').classList.remove('open')
      document.querySelectorAll('#domain-dropdown .dropdown-item').forEach(el => {
        el.classList.toggle('selected', el.querySelector('.dropdown-item-name').textContent === name)
      })
      const ta = document.getElementById('chat-textarea')
      if (ta) ta.placeholder = `Ask ${state.selectedModel.name} about ${domain.name}...`
    }
  }

  // Language toggle
  window.toggleLanguage = () => {
    state.language = state.language === 'en' ? 'hi' : 'en'
    const btn = document.getElementById('lang-toggle-btn')
    if (btn) btn.textContent = state.language === 'en' ? '🇬🇧 EN' : '🇮🇳 हिं'
  }

  // Auto resize textarea
  window.autoResize = (el) => {
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  // Enter key
  window.handleChatKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChatMessage()
    }
  }

  // Fill suggestion
  window.fillSuggestion = (text) => {
    const ta = document.getElementById('chat-textarea')
    if (ta) {
      ta.value = text
      ta.focus()
      autoResize(ta)
    }
  }

  // New chat
  window.startNewChat = () => {
    if (!state.user) {
      showCrystalBall()
      return
    }
    state.currentChat = []
    const messages = document.getElementById('chat-messages')
    if (messages) messages.innerHTML = renderWelcome()
  }

  // Navigation
  window.goToAuth = () => navigate('auth')
  window.goToSettings = () => alert('Settings coming in Phase 2!')
  window.handleLogout = () => {
    state.user = null
    navigate('chat')
  }
  window.loadChat = (i) => {
    const chat = state.chatHistory[i]
    if (chat) {
      state.currentChat = chat.messages || []
      state.selectedModel = chat.model || state.selectedModel
    }
  }
}

// ── SEND MESSAGE ───────────────────────────────────────
async function sendChatMessage() {
  const ta = document.getElementById('chat-textarea')
  const text = ta?.value.trim()
  if (!text) return

  const sendBtn = document.getElementById('send-btn')
  const messagesEl = document.getElementById('chat-messages')

  // Clear welcome if first message
  if (state.currentChat.length === 0) {
    messagesEl.innerHTML = ''
  }

  // Add user message
  state.currentChat.push({ role: 'user', content: text })
  addMessageToUI('user', text, '👤', 'You')
  ta.value = ''
  ta.style.height = 'auto'
  sendBtn.disabled = true

  // Add loading
  const loadingId = addLoadingMessage()

  // Build system prompt
  const userInfo = state.user
    ? `User: ${state.user.name}${state.userDetails ? `, born ${state.userDetails.dob} in ${state.userDetails.birthPlace}, Gender: ${state.userDetails.gender}` : ''}.`
    : 'User details not provided yet.'

  const systemPrompt = `You are an expert ${state.selectedModel.name} advisor with 30 years of experience.
${userInfo}
The user seeks guidance on: ${state.selectedDomain.name} (${state.selectedDomain.house}).
Speak with warmth and wisdom like a trusted family astrologer.
Give practical, actionable guidance — not vague predictions.
Keep responses to 3-5 sentences unless asked for more detail.
${state.language === 'hi' ? 'Respond in Hindi (Devanagari script).' : 'Respond in English.'}
Never claim 100% certainty — frame insights as guidance and possibilities.
Always relate answers to the specific domain: ${state.selectedDomain.desc}.`

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
        model: 'meta-llama/llama-4-scout:free',
        messages: [
          { role: 'system', content: systemPrompt },
          ...state.currentChat.map(m => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.content
          }))
        ],
        max_tokens: 600,
        temperature: 0.75
      })
    })

    const data = await response.json()
    const aiText = data.choices?.[0]?.message?.content || 'I apologize, I could not connect to the cosmic realm. Please try again.'

    removeLoadingMessage(loadingId)
    state.currentChat.push({ role: 'ai', content: aiText })
    addMessageToUI('ai', aiText, state.selectedModel.icon, state.selectedModel.name + ' Advisor')

    // Save to history
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
    addMessageToUI('ai', 'The cosmic connection was interrupted. Please check your connection and try again.', state.selectedModel.icon, state.selectedModel.name + ' Advisor')
  }

  sendBtn.disabled = false
  scrollToBottom()
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
      <div class="msg-bubble">
        <div class="loading-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
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
    // Show crystal ball after short delay on first visit
    setTimeout(() => showCrystalBall(), 500)
  }
}

window.showCrystalBall = function() {
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
      <button class="btn-primary" style="width:100%;justify-content:center;margin-top:8px;" onclick="saveCrystalDetails()">
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

  window.saveCrystalDetails = () => {
    const name = document.getElementById('cd-name').value.trim()
    const dob = document.getElementById('cd-dob').value
    const place = document.getElementById('cd-place').value.trim()

    if (!name || !dob || !place) {
      alert('Please fill in Name, Date of Birth and Place of Birth.')
      return
    }

    state.userDetails = {
      name,
      gender: selectedGender,
      dob,
      tob: document.getElementById('cd-tob').value,
      birthPlace: place,
      currentCity: document.getElementById('cd-city').value.trim()
    }

    if (!state.user) {
      state.user = { name, plan: 'Free' }
    }

    // Animate close
    overlay.style.transition = 'opacity 0.5s ease'
    overlay.style.opacity = '0'
    setTimeout(() => {
      overlay.remove()
      // Refresh sidebar with user name
      navigate('chat')
    }, 500)
  }

  window.skipCrystalBall = () => {
    overlay.remove()
  }
}