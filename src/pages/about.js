import { navigate } from '../main.js'

export function renderAbout(app, state) {
  app.innerHTML = `
    <div class="cosmic-bg"></div>
    <canvas id="chat-matrix-canvas" style="position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.08;"></canvas>

    <!-- Navbar -->
    <nav class="navbar">
      <a class="navbar-logo" href="#" onclick="goHome()">🔮 Blessed<span>Astro</span></a>
      <ul class="navbar-links">
        <li><a href="#" onclick="goHome()">Chat</a></li>
        <li><a href="#" onclick="goPricing()">Pricing</a></li>
        <li><a href="#" onclick="goAPI()">Business API</a></li>
        <li><a href="#" onclick="goTeam()">Our Team</a></li>
      </ul>
      <div class="navbar-right">
        <button class="lang-toggle">EN / हिं</button>
        ${state.user
          ? `<div class="user-avatar">${state.user.name[0].toUpperCase()}</div>`
          : `<button class="btn-primary" style="padding:8px 20px;font-size:13px;" onclick="goAuth()">Login / Sign Up</button>`
        }
      </div>
    </nav>

    <!-- Page Content -->
    <div style="padding-top:var(--navbar-height); position:relative; z-index:1;">

      <!-- HERO -->
      <div style="
        text-align:center;
        padding: 100px 24px 80px;
        background: linear-gradient(180deg, rgba(255,102,0,0.05) 0%, transparent 100%);
        border-bottom: 1px solid var(--card-border);
      ">
        <div style="
          display:inline-block;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          padding: 8px 24px;
          border-radius: 50px;
          font-size:13px;
          color: var(--saffron);
          margin-bottom: 32px;
          letter-spacing: 2px;
          text-transform: uppercase;
        ">Est. 1999 · 25 Years of Cosmic Wisdom</div>

        <h1 style="
          font-family:'Cormorant Garamond',serif;
          font-size:64px;
          font-weight:700;
          color:var(--cream);
          line-height:1.1;
          margin-bottom:24px;
        ">Born in India.<br/><span style="color:var(--saffron);">Built for the World.</span></h1>

        <p style="
          font-size:20px;
          color:var(--grey);
          max-width:600px;
          margin:0 auto 48px;
          line-height:1.7;
          font-family:'Cormorant Garamond',serif;
          font-style:italic;
        ">"5000 years of Vedic wisdom, now in your pocket"</p>

        <!-- Stats -->
        <div style="
          display:flex;
          gap:48px;
          justify-content:center;
          flex-wrap:wrap;
          margin-top:48px;
        ">
          ${[
            { num: '25+', label: 'Years Experience' },
            { num: '11', label: 'Astrology Systems' },
            { num: '12', label: 'Life Domains' },
            { num: '5000', label: 'Years of Wisdom' },
          ].map(s => `
            <div style="text-align:center;">
              <div style="
                font-family:'Cormorant Garamond',serif;
                font-size:48px;
                font-weight:700;
                color:var(--saffron);
                line-height:1;
              ">${s.num}</div>
              <div style="font-size:13px;color:var(--grey);margin-top:4px;text-transform:uppercase;letter-spacing:1px;">${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- OUR STORY -->
      <div style="max-width:900px;margin:0 auto;padding:80px 24px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;">
          <div>
            <div style="font-size:12px;color:var(--saffron);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Our Story</div>
            <h2 style="
              font-family:'Cormorant Garamond',serif;
              font-size:40px;
              font-weight:700;
              color:var(--cream);
              margin-bottom:24px;
              line-height:1.2;
            ">Where Ancient Stars Meet Modern Minds</h2>
            <p style="color:var(--grey);line-height:1.8;margin-bottom:16px;font-size:15px;">
              For over 25 years, Blessed Astro has been the trusted family astrologer for thousands of families and businesses — first offline, now bringing that same wisdom to the world through technology.
            </p>
            <p style="color:var(--grey);line-height:1.8;margin-bottom:16px;font-size:15px;">
              India has always been the birthplace of the world's most sophisticated life-guidance system. Vedic astrology, Lal Kitab, KP System, Vastu — these are not superstitions. They are frameworks built over millennia to understand time, personality, karma and destiny.
            </p>
            <p style="color:var(--grey);line-height:1.8;font-size:15px;">
              Our mission is simple — to make this ancient intelligence practical, accessible and life-changing for every person on Earth, regardless of where they live.
            </p>
          </div>
          <div>
            <div class="card" style="text-align:center;padding:40px;">
              <div style="font-size:80px;margin-bottom:16px;">🔮</div>
              <div style="font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--saffron);margin-bottom:8px;">Our Vision</div>
              <p style="color:var(--grey);font-size:14px;line-height:1.7;font-style:italic;">
                "To carry India's ancient cosmic intelligence to every corner of the world — making Vedic wisdom practical, accessible and life-changing for all."
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- WHY VEDIC ASTROLOGY -->
      <div style="
        background: rgba(255,102,0,0.04);
        border-top: 1px solid var(--card-border);
        border-bottom: 1px solid var(--card-border);
        padding: 80px 24px;
      ">
        <div style="max-width:900px;margin:0 auto;">
          <div style="text-align:center;margin-bottom:56px;">
            <div style="font-size:12px;color:var(--saffron);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Why Vedic Astrology</div>
            <h2 style="font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:700;color:var(--cream);">India's Gift to the World</h2>
          </div>
          <div class="grid-3">
            ${[
              { icon: '📜', title: 'Oldest Knowledge System', desc: 'Vedic astrology is the oldest continuously practiced wisdom system in human history — over 5000 years of refinement and validation.' },
              { icon: '🏛️', title: 'Proven Over Millennia', desc: 'Used by Indian families, businesses, and rulers for thousands of years to navigate life\'s most important decisions.' },
              { icon: '🧠', title: 'Not Superstition', desc: 'A sophisticated framework for understanding time cycles, personality patterns, karma and the relationship between cosmos and human life.' },
              { icon: '🌍', title: 'Now Global', desc: 'Combined with modern AI, Vedic wisdom is now accessible to anyone, anywhere — in their own language, 24/7.' },
              { icon: '💡', title: 'Practical Guidance', desc: 'We don\'t just predict. We provide actionable insights you can use to make better decisions in career, relationships and life.' },
              { icon: '🇮🇳', title: 'India\'s Pride', desc: 'Blessed Astro is India\'s contribution to the global wellness and self-development space — ancient intelligence in a modern platform.' },
            ].map(f => `
              <div class="card" style="text-align:center;">
                <div style="font-size:36px;margin-bottom:16px;">${f.icon}</div>
                <div style="font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:var(--cream);margin-bottom:12px;">${f.title}</div>
                <p style="color:var(--grey);font-size:13px;line-height:1.6;">${f.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- OUR MISSION -->
      <div style="max-width:700px;margin:0 auto;padding:80px 24px;text-align:center;">
        <div style="font-size:12px;color:var(--saffron);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Our Mission</div>
        <h2 style="
          font-family:'Cormorant Garamond',serif;
          font-size:40px;
          font-weight:700;
          color:var(--cream);
          margin-bottom:32px;
          line-height:1.3;
        ">"Indian Vedic Wisdom for all Life Decisions"</h2>
        <p style="color:var(--grey);font-size:16px;line-height:1.8;margin-bottom:48px;">
          Every major decision in life — career, marriage, business, family — deserves the depth of 5000 years of cosmic intelligence. We make that wisdom available to everyone, everywhere, in a practical and modern format.
        </p>
        <button class="btn-primary" onclick="goHome()" style="font-size:16px;padding:16px 40px;">
          🔮 Start Your Journey
        </button>
      </div>

      <!-- JOIN AS ASTROLOGER -->
      <div style="
        background: linear-gradient(135deg, rgba(255,102,0,0.08), rgba(139,0,0,0.08));
        border-top: 1px solid var(--card-border);
        padding: 80px 24px;
        text-align:center;
      ">
        <div style="max-width:600px;margin:0 auto;">
          <div style="font-size:48px;margin-bottom:16px;">🌟</div>
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;color:var(--cream);margin-bottom:16px;">
            Are You an Astrologer?
          </h2>
          <p style="color:var(--grey);font-size:15px;line-height:1.7;margin-bottom:32px;">
            Join the Blessed Astro platform and reach thousands of seekers globally. We are a curated, invitation-based community of expert astrologers. Apply to join our growing team.
          </p>
          <button class="btn-secondary" style="font-size:15px;padding:14px 36px;">
            Apply to Join Our Team →
          </button>
        </div>
      </div>

    </div>

    <!-- Footer -->
    ${renderFooter()}
  `

  // Start matrix background
  startAboutMatrix()

  // Navigation
  window.goHome = () => navigate('chat')
  window.goPricing = () => navigate('pricing')
  window.goAPI = () => navigate('business')
  window.goTeam = () => navigate('team')
  window.goAuth = () => navigate('auth')
}

function startAboutMatrix() {
  const canvas = document.getElementById('chat-matrix-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const chars = 'ॐ♈♉♊♋♌♍♎♏♐♑♒♓☉☽♂♃♄१२३४५'.split('')
  const fontSize = 14
  let drops = Array(Math.floor(canvas.width / fontSize)).fill(1)
  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.04)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drops.forEach((y, i) => {
      ctx.fillStyle = ['#FF6600','#C8960C','#FF8C40'][Math.floor(Math.random()*3)]
      ctx.font = `${fontSize}px serif`
      ctx.fillText(chars[Math.floor(Math.random()*chars.length)], i*fontSize, y*fontSize)
      if (y*fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
      drops[i]++
    })
  }
  setInterval(draw, 60)
}

function renderFooter() {
  return `
    <footer style="
      border-top: 1px solid var(--card-border);
      padding: 60px 24px 40px;
      background: rgba(13,0,5,0.8);
      position:relative; z-index:1;
    ">
      <div style="max-width:1200px;margin:0 auto;">
        <div class="grid-4" style="margin-bottom:48px;">
          <div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:var(--cream);margin-bottom:12px;">
              🔮 Blessed<span style="color:var(--saffron);">Astro</span>
            </div>
            <p style="font-size:13px;color:var(--grey);line-height:1.6;">
              Indian Vedic Wisdom for all Life Decisions
            </p>
          </div>
          <div>
            <div style="font-size:12px;font-weight:600;color:var(--cream);text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">Services</div>
            ${['AI Chat','Life Reports','Personal Calendar','Consultations','Counselling'].map(s =>
              `<div style="font-size:13px;color:var(--grey);margin-bottom:8px;cursor:pointer;" onmouseover="this.style.color='var(--saffron)'" onmouseout="this.style.color='var(--grey)'">${s}</div>`
            ).join('')}
          </div>
          <div>
            <div style="font-size:12px;font-weight:600;color:var(--cream);text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">Company</div>
            ${['About Us','Our Team','Business API','Blog','Careers'].map(s =>
              `<div style="font-size:13px;color:var(--grey);margin-bottom:8px;cursor:pointer;" onmouseover="this.style.color='var(--saffron)'" onmouseout="this.style.color='var(--grey)'">${s}</div>`
            ).join('')}
          </div>
          <div>
            <div style="font-size:12px;font-weight:600;color:var(--cream);text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">Follow Us</div>
            ${[
              { icon: '📘', name: 'Facebook' },
              { icon: '▶️', name: 'YouTube' },
              { icon: '📸', name: 'Instagram' },
              { icon: '💬', name: 'WhatsApp' },
              { icon: '✈️', name: 'Telegram' },
            ].map(s =>
              `<div style="font-size:13px;color:var(--grey);margin-bottom:8px;cursor:pointer;display:flex;align-items:center;gap:8px;" onmouseover="this.style.color='var(--saffron)'" onmouseout="this.style.color='var(--grey)'">${s.icon} ${s.name}</div>`
            ).join('')}
          </div>
        </div>
        <div style="
          border-top: 1px solid var(--card-border);
          padding-top:24px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          flex-wrap:wrap;
          gap:12px;
        ">
          <div style="font-size:13px;color:var(--grey-2);">
            © 2026 Blessed Astro. All Rights Reserved. Made with 🔮 in India.
          </div>
          <div style="display:flex;gap:24px;">
            ${['Privacy Policy','Terms & Conditions','Refund Policy'].map(s =>
              `<span style="font-size:12px;color:var(--grey-2);cursor:pointer;" onmouseover="this.style.color='var(--saffron)'" onmouseout="this.style.color='var(--grey-2)'">${s}</span>`
            ).join('')}
          </div>
        </div>
      </div>
    </footer>
  `
}

export { renderFooter }