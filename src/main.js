import './styles/main.css'

const app = document.getElementById('app')

app.innerHTML = `
  <div class="stars"></div>

  <!-- NAVBAR -->
  <nav>
    <div class="container">
      <div class="navbar">
        <div class="logo">Astro<span>Stack</span></div>
        <ul class="nav-links">
          <li><a href="#">Models</a></li>
          <li><a href="#">Domains</a></li>
          <li><a href="#">Business API</a></li>
          <li><a href="#">Pricing</a></li>
        </ul>
        <button class="btn-primary" style="padding: 10px 24px; font-size:14px;">Get Started Free</button>
      </div>
    </div>
  </nav>

  <!-- HERO -->
  <div class="container">
    <div class="hero">
      <div class="hero-badge">✨ 8 Astrology Systems · 12 Life Domains · 1 Platform</div>
      <h1>Ancient Wisdom.<br/><span>Modern Decisions.</span></h1>
      <p>The world's first multi-model astrology intelligence platform. Choose your Astrology system, choose your life domain, and get real guidance — not just predictions.</p>
      <div class="hero-buttons">
        <button class="btn-primary" onclick="showModels()">🔮 Start Free Chat</button>
        <button class="btn-secondary">View Business API →</button>
      </div>
    </div>
  </div>

  <!-- MODELS SECTION -->
  <div class="container">
    <div class="section">
      <div class="section-title">Choose Your Astrology System</div>
      <div class="section-subtitle">Each system has its own wisdom. Pick the one that resonates with you.</div>
      <div class="grid-3" id="models-grid"></div>
    </div>
  </div>

  <!-- DOMAINS SECTION -->
  <div class="container">
    <div class="section" style="background: var(--card-bg); border-radius: 24px; padding: 60px 40px;">
      <div class="section-title">Choose Your Life Domain</div>
      <div class="section-subtitle">What area of life do you need guidance on today?</div>
      <div class="grid-3" id="domains-grid"></div>
    </div>
  </div>

  <!-- HOW IT WORKS -->
  <div class="container">
    <div class="section">
      <div class="section-title">How It Works</div>
      <div class="section-subtitle">Three steps to real cosmic guidance</div>
      <div class="grid-3">
        <div class="card" style="text-align:center;">
          <div style="font-size:48px; margin-bottom:16px;">1️⃣</div>
          <div class="model-name">Pick Your System</div>
          <div class="model-desc">Choose from 8 ancient astrology systems — Vedic, Tarot, KP, Numerology, Chinese and more.</div>
        </div>
        <div class="card" style="text-align:center;">
          <div style="font-size:48px; margin-bottom:16px;">2️⃣</div>
          <div class="model-name">Select Life Domain</div>
          <div class="model-desc">Pick what matters to you right now — career, money, relationships, health, peace and more.</div>
        </div>
        <div class="card" style="text-align:center;">
          <div style="font-size:48px; margin-bottom:16px;">3️⃣</div>
          <div class="model-name">Chat & Decide</div>
          <div class="model-desc">Have a real conversation. Get practical guidance you can act on — not vague predictions.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <footer>
    <div class="container">
      <div class="footer">
        <div class="logo" style="margin-bottom:12px;">Astro<span>Stack</span></div>
        <p>Ancient Vedic Intelligence. Built for Modern Decisions.</p>
        <p style="margin-top:16px;">© 2026 BlessedAstro · All Rights Reserved</p>
      </div>
    </div>
  </footer>
`

// Astrology Models Data
const models = [
  { icon: '🪐', name: 'Vedic Astrology', desc: 'Ancient Indian system. Birth chart, dashas, karma and life path.' },
  { icon: '⭐', name: 'KP System', desc: 'Krishnamurti Paddhati. Precise event timing and predictions.' },
  { icon: '🔢', name: 'Numerology', desc: 'Numbers reveal your destiny. Name, date, life path analysis.' },
  { icon: '📜', name: 'Brighu Nadi', desc: 'Ancient palm leaf system. Past lives and future events.' },
  { icon: '🃏', name: 'Tarot', desc: 'Card-based intuitive guidance for decisions and clarity.' },
  { icon: '✋', name: 'Palmistry', desc: 'Read life lines. Physical traits reveal your destiny.' },
  { icon: '📕', name: 'Lal Kitab', desc: 'Unique Urdu-Hindi system. Practical remedies for life problems.' },
  { icon: '🐉', name: 'Chinese Astrology', desc: 'Yearly animal cycles, five elements and compatibility.' },
  { icon: '♈', name: 'Western Astrology', desc: 'Sun signs, rising signs and planetary personality mapping.' },
]

// Life Domains Data
const domains = [
 
  { icon: '👤', name: 'Self & Personality', house: '1st House', desc: 'Body, appearance, health, vitality, head, brain, overall life path' },
  { icon: '💰', name: 'Money & Wealth', house: '2nd House', desc: 'Savings, family wealth, speech, face, eyes, teeth, tongue, food habits' },
  { icon: '🗣️', name: 'Communication', house: '3rd House', desc: 'Siblings, courage, short travel, hands, arms, shoulders, ears, writing' },
  { icon: '🏠', name: 'Home & Family', house: '4th House', desc: 'Mother, property, vehicles, chest, lungs, heart, emotional roots, homeland' },
  { icon: '❤️', name: 'Romance & Children', house: '5th House', desc: 'Children, love affairs, creativity, intelligence, stomach, liver, speculation' },
  { icon: '⚕️', name: 'Health & Work', house: '6th House', desc: 'Enemies, debts, diseases, daily routine, intestines, kidneys, colleagues, pets' },
  { icon: '💑', name: 'Marriage & Partners', house: '7th House', desc: 'Spouse, business partners, legal contracts, lower back, kidneys, public life' },
  { icon: '🔮', name: 'Transformation', house: '8th House', desc: 'Death, rebirth, inheritance, hidden wealth, secrets, reproductive organs, occult' },
  { icon: '📚', name: 'Education & Travel', house: '9th House', desc: 'Father, guru, higher education, long travel, religion, hips, thighs, luck, dharma' },
  { icon: '💼', name: 'Career & Business', house: '10th House', desc: 'Profession, status, reputation, authority, knees, government, life purpose, fame' },
  { icon: '🎯', name: 'Goals & Income', house: '11th House', desc: 'Gains, elder siblings, friends, social circle, calves, ankles, wishes, networks' },
  { icon: '☮️', name: 'Peace & Liberation', house: '12th House', desc: 'Losses, expenses, foreign travel, spirituality, feet, sleep, isolation, moksha' },

]
// Render Models
const modelsGrid = document.getElementById('models-grid')
models.forEach(model => {
  modelsGrid.innerHTML += `
    <div class="card" style="text-align:center; cursor:pointer;" onclick="selectModel('${model.name}')">
      <div class="model-icon">${model.icon}</div>
      <div class="model-name">${model.name}</div>
      <div class="model-desc">${model.desc}</div>
    </div>
  `
})

// Render Domains
const domainsGrid = document.getElementById('domains-grid')
domains.forEach(domain => {
  domainsGrid.innerHTML += `
    <div class="card" style="display:flex; align-items:center; gap:16px; cursor:pointer;" onclick="selectDomain('${domain.name}')">
      <div style="font-size:32px;">${domain.icon}</div>
      <div>
        <div class="model-name" style="font-size:15px;">${domain.name}</div>
        <div class="model-desc">${domain.house}</div>
      </div>
    </div>
  `
})

// Functions
window.selectModel = (name) => {
  alert(`✅ You selected: ${name}\n\nChat screen coming in next build!`)
}

window.selectDomain = (name) => {
  alert(`✅ You selected: ${name}\n\nChat screen coming in next build!`)
}

window.showModels = () => {
  document.getElementById('models-grid').scrollIntoView({ behavior: 'smooth' })
}