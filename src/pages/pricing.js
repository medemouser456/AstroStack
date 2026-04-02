import { navigate } from '../main.js'
import { renderFooter } from './about.js'

export function renderPricing(app, state) {
  app.innerHTML = `
    <div class="cosmic-bg"></div>
    <canvas id="chat-matrix-canvas" style="position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.08;"></canvas>

    <nav class="navbar">
      <a class="navbar-logo" href="#" onclick="goHome()">🔮 Blessed<span>Astro</span></a>
      <ul class="navbar-links">
        <li><a href="#" onclick="goHome()">Chat</a></li>
        <li><a href="#" onclick="goAbout()">About</a></li>
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

    <div style="padding-top:var(--navbar-height);position:relative;z-index:1;">

      <!-- HERO -->
      <div style="text-align:center;padding:80px 24px 60px;">
        <div style="font-size:12px;color:var(--saffron);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Simple & Transparent</div>
        <h1 style="font-family:'Cormorant Garamond',serif;font-size:56px;font-weight:700;color:var(--cream);margin-bottom:16px;">
          Plans for Every <span style="color:var(--saffron);">Seeker</span>
        </h1>
        <p style="font-size:18px;color:var(--grey);max-width:500px;margin:0 auto;">
          Start free. Upgrade when you need more cosmic wisdom.
        </p>

        <!-- Country Toggle -->
        <div style="display:flex;gap:0;justify-content:center;margin-top:32px;">
          <button id="btn-inr" onclick="showINR()" style="
            padding:10px 28px;background:linear-gradient(135deg,var(--saffron),var(--saffron-dark));
            color:white;border:none;border-radius:50px 0 0 50px;font-size:14px;font-weight:600;
            cursor:pointer;font-family:'Inter',sans-serif;
          ">🇮🇳 India (₹)</button>
          <button id="btn-usd" onclick="showUSD()" style="
            padding:10px 28px;background:var(--smoke);color:var(--grey);
            border:1px solid var(--card-border);border-left:none;
            border-radius:0 50px 50px 0;font-size:14px;font-weight:600;
            cursor:pointer;font-family:'Inter',sans-serif;
          ">🌍 Global ($)</button>
        </div>
      </div>

      <!-- SUBSCRIPTION PLANS -->
      <div style="max-width:1000px;margin:0 auto;padding:0 24px 80px;">
        <div class="grid-3">
          ${[
            {
              name: 'Free', icon: '🌙',
              inr: '₹0', usd: '$0', period: 'forever',
              desc: 'Perfect for exploring cosmic wisdom',
              features: ['10 chats per day','1 astrology model (Vedic)','3 life domains','1 month chat history','Basic calendar (1 month demo)','Community support'],
              cta: 'Start Free', primary: false
            },
            {
              name: 'Basic', icon: '⭐',
              inr: '₹450', usd: '$9', period: 'per month',
              desc: 'For regular seekers of cosmic guidance',
              features: ['50 chats per day','5 astrology models','All 12 domains','3 month chat history','Full personal calendar','Email support','Priority AI responses'],
              cta: 'Start Basic', primary: false, popular: true
            },
            {
              name: 'Pro', icon: '🔮',
              inr: '₹900', usd: '$15', period: 'per month',
              desc: 'Unlimited cosmic intelligence',
              features: ['Unlimited chats','All 11 astrology models','All 12 domains','Unlimited chat history','Advanced personal calendar','Priority support','First access to new features','Exclusive Pro insights'],
              cta: 'Go Pro', primary: true
            },
          ].map(p => `
            <div class="card ${p.primary ? 'selected' : ''}" style="
              position:relative;
              ${p.primary ? 'border-color:var(--saffron);box-shadow:0 0 40px rgba(255,102,0,0.2);' : ''}
            ">
              ${p.popular ? `
                <div style="
                  position:absolute;top:-12px;left:50%;transform:translateX(-50%);
                  background:linear-gradient(135deg,var(--saffron),var(--saffron-dark));
                  color:white;padding:4px 16px;border-radius:50px;font-size:11px;
                  font-weight:700;white-space:nowrap;text-transform:uppercase;letter-spacing:1px;
                ">Most Popular</div>
              ` : ''}
              <div style="text-align:center;margin-bottom:24px;">
                <div style="font-size:40px;margin-bottom:8px;">${p.icon}</div>
                <div style="font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:var(--cream);">${p.name}</div>
                <div style="font-size:13px;color:var(--grey);margin-top:4px;">${p.desc}</div>
              </div>
              <div style="text-align:center;margin-bottom:24px;">
                <div class="price-inr" style="font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:700;color:var(--saffron);">
                  ${p.inr}<span style="font-size:16px;color:var(--grey);font-family:'Inter',sans-serif;">/${p.period}</span>
                </div>
                <div class="price-usd" style="display:none;font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:700;color:var(--saffron);">
                  ${p.usd}<span style="font-size:16px;color:var(--grey);font-family:'Inter',sans-serif;">/${p.period}</span>
                </div>
              </div>
              <div style="margin-bottom:28px;">
                ${p.features.map(f => `
                  <div style="display:flex;align-items:center;gap:10px;padding:6px 0;font-size:13px;color:var(--grey);">
                    <span style="color:var(--saffron);font-size:14px;">✓</span> ${f}
                  </div>
                `).join('')}
              </div>
              <button class="${p.primary ? 'btn-primary' : 'btn-secondary'}" style="width:100%;justify-content:center;" onclick="goHome()">
                ${p.cta}
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ADDITIONAL SERVICES -->
      <div style="background:rgba(255,102,0,0.04);border-top:1px solid var(--card-border);border-bottom:1px solid var(--card-border);padding:80px 24px;">
        <div style="max-width:1000px;margin:0 auto;">
          <div style="text-align:center;margin-bottom:56px;">
            <div style="font-size:12px;color:var(--saffron);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Additional Services</div>
            <h2 style="font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:700;color:var(--cream);">Purchase Separately</h2>
            <p style="color:var(--grey);font-size:15px;margin-top:8px;">These services can be added to any plan</p>
          </div>

          <div class="grid-2" style="gap:32px;">

            <!-- Life Reports -->
            <div class="card">
              <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
                <div style="font-size:36px;">📋</div>
                <div>
                  <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--cream);">Life Reports</div>
                  <div style="font-size:13px;color:var(--grey);">AI + Human Astrologer Team · 24-48hr Delivery</div>
                </div>
              </div>
              ${[
                { name: '3 Year Report', inr: '₹999', usd: '$19' },
                { name: '5 Year Report', inr: '₹1,499', usd: '$29' },
                { name: '10 Year Report', inr: '₹2,499', usd: '$49' },
                { name: 'Lifetime Report', inr: '₹4,999', usd: '$99' },
              ].map(r => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--card-border);">
                  <span style="font-size:14px;color:var(--grey);">${r.name}</span>
                  <span class="price-inr" style="font-weight:600;color:var(--saffron);">${r.inr}</span>
                  <span class="price-usd" style="display:none;font-weight:600;color:var(--saffron);">${r.usd}</span>
                </div>
              `).join('')}
              <button class="btn-primary" style="width:100%;justify-content:center;margin-top:20px;" onclick="goHome()">Order Report</button>
            </div>

            <!-- Consultations -->
            <div class="card">
              <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
                <div style="font-size:36px;">🧑‍💼</div>
                <div>
                  <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--cream);">Live Consultations</div>
                  <div style="font-size:13px;color:var(--grey);">Pre-paid wallet · Book within 7 days</div>
                </div>
              </div>
              ${[
                { name: 'Astrology Consultation', inr: '₹99/min', usd: '$2/min' },
                { name: 'Basic Counselling', inr: '₹69/min', usd: '$1/min' },
                { name: 'Personal Calendar (Monthly)', inr: '₹299', usd: '$6' },
              ].map(r => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--card-border);">
                  <span style="font-size:14px;color:var(--grey);">${r.name}</span>
                  <span class="price-inr" style="font-weight:600;color:var(--saffron);">${r.inr}</span>
                  <span class="price-usd" style="display:none;font-weight:600;color:var(--saffron);">${r.usd}</span>
                </div>
              `).join('')}
              <button class="btn-primary" style="width:100%;justify-content:center;margin-top:20px;" onclick="goHome()">Book Now</button>
            </div>

          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div style="max-width:700px;margin:0 auto;padding:80px 24px;">
        <div style="text-align:center;margin-bottom:48px;">
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:700;color:var(--cream);">Common Questions</h2>
        </div>
        ${[
          { q: 'Can I cancel anytime?', a: 'Yes. Cancel your subscription anytime with no questions asked. Your access continues until the end of the billing period.' },
          { q: 'Do Indian users see dollar prices?', a: 'Never. Indian users always see INR pricing. International users always see USD pricing. Auto-detected by your location.' },
          { q: 'How are reports delivered?', a: 'Reports are prepared by our AI and reviewed by human astrologers. Delivered as a beautiful PDF within 24-48 hours to your email and available in your account.' },
          { q: 'How does the consultation wallet work?', a: 'Load credits into your pre-paid wallet. Minutes are deducted as you chat with astrologers or counsellors. Unused credits never expire.' },
          { q: 'Is my birth data safe?', a: 'Absolutely. Your personal details are encrypted and never shared with third parties. Your cosmic data is sacred to us.' },
        ].map((f, i) => `
          <div style="border-bottom:1px solid var(--card-border);padding:20px 0;">
            <div onclick="toggleFAQ(${i})" style="
              display:flex;justify-content:space-between;align-items:center;
              cursor:pointer;color:var(--cream);font-size:15px;font-weight:500;
            ">
              <span>${f.q}</span>
              <span id="faq-icon-${i}" style="color:var(--saffron);font-size:20px;">+</span>
            </div>
            <div id="faq-answer-${i}" style="display:none;color:var(--grey);font-size:14px;line-height:1.7;margin-top:12px;">
              ${f.a}
            </div>
          </div>
        `).join('')}
      </div>

    </div>

    ${renderFooter()}
  `

  // Matrix background
  startPageMatrix('chat-matrix-canvas')

  // Price toggle
  window.showINR = () => {
    document.querySelectorAll('.price-inr').forEach(e => e.style.display = 'block')
    document.querySelectorAll('.price-usd').forEach(e => e.style.display = 'none')
    document.getElementById('btn-inr').style.background = 'linear-gradient(135deg,var(--saffron),var(--saffron-dark))'
    document.getElementById('btn-inr').style.color = 'white'
    document.getElementById('btn-usd').style.background = 'var(--smoke)'
    document.getElementById('btn-usd').style.color = 'var(--grey)'
  }

  window.showUSD = () => {
    document.querySelectorAll('.price-inr').forEach(e => e.style.display = 'none')
    document.querySelectorAll('.price-usd').forEach(e => e.style.display = 'block')
    document.getElementById('btn-usd').style.background = 'linear-gradient(135deg,var(--saffron),var(--saffron-dark))'
    document.getElementById('btn-usd').style.color = 'white'
    document.getElementById('btn-inr').style.background = 'var(--smoke)'
    document.getElementById('btn-inr').style.color = 'var(--grey)'
  }

  // FAQ toggle
  window.toggleFAQ = (i) => {
    const answer = document.getElementById(`faq-answer-${i}`)
    const icon = document.getElementById(`faq-icon-${i}`)
    if (answer.style.display === 'none') {
      answer.style.display = 'block'
      icon.textContent = '−'
    } else {
      answer.style.display = 'none'
      icon.textContent = '+'
    }
  }

  window.goHome = () => navigate('chat')
  window.goAbout = () => navigate('about')
  window.goAPI = () => navigate('business')
  window.goTeam = () => navigate('team')
  window.goAuth = () => navigate('auth')
}

export function startPageMatrix(canvasId) {
  const canvas = document.getElementById(canvasId)
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
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}