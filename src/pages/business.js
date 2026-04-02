import { navigate } from '../main.js'
import { renderFooter } from './about.js'
import { startPageMatrix } from './pricing.js'

export function renderBusiness(app, state) {
  app.innerHTML = `
    <div class="cosmic-bg"></div>
    <canvas id="chat-matrix-canvas" style="position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.08;"></canvas>

    <nav class="navbar">
      <a class="navbar-logo" href="#" onclick="goHome()">🔮 Blessed<span>Astro</span></a>
      <ul class="navbar-links">
        <li><a href="#" onclick="goHome()">Chat</a></li>
        <li><a href="#" onclick="goAbout()">About</a></li>
        <li><a href="#" onclick="goPricing()">Pricing</a></li>
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
      <div style="text-align:center;padding:80px 24px 60px;border-bottom:1px solid var(--card-border);">
        <div style="font-size:12px;color:var(--saffron);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Coming Soon</div>
        <h1 style="font-family:'Cormorant Garamond',serif;font-size:56px;font-weight:700;color:var(--cream);margin-bottom:16px;">
          Vedic Intelligence<br/><span style="color:var(--saffron);">as a Service</span>
        </h1>
        <p style="font-size:18px;color:var(--grey);max-width:600px;margin:0 auto 32px;line-height:1.7;">
          Integrate 5000 years of Vedic wisdom directly into your business platform via our powerful API. Be the first to access it.
        </p>
        <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,102,0,0.1);border:1px solid var(--saffron);padding:12px 24px;border-radius:50px;">
          <span style="color:var(--saffron);font-size:14px;font-weight:600;">🚀 API Documentation Coming Soon</span>
        </div>
      </div>

      <!-- USE CASES -->
      <div style="max-width:1000px;margin:0 auto;padding:80px 24px;">
        <div style="text-align:center;margin-bottom:56px;">
          <div style="font-size:12px;color:var(--saffron);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Industry Use Cases</div>
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:700;color:var(--cream);">
            Which Industries Can Use This?
          </h2>
        </div>
        <div class="grid-3">
          ${[
            { icon: '🏥', name: 'Healthcare', desc: 'Surgery timing, patient wellness cycles, mental health pattern mapping based on planetary cycles.' },
            { icon: '👶', name: 'IVF & Fertility', desc: 'Conception timing guidance based on planetary cycles. Enhance success rates with cosmic timing.' },
            { icon: '👔', name: 'HR & Recruitment', desc: 'Team compatibility analysis, leadership potential assessment, auspicious joining dates.' },
            { icon: '📚', name: 'Education', desc: 'Student learning style mapping, exam timing optimisation, career guidance based on birth charts.' },
            { icon: '🏦', name: 'Banking & Finance', desc: 'Financial cycle analysis, investment timing signals, loan approval timing patterns.' },
            { icon: '🏠', name: 'Real Estate', desc: 'Property purchase Muhurta, Vastu combined analysis, auspicious dates for property transactions.' },
            { icon: '🎬', name: 'Film & Entertainment', desc: 'Auspicious release dates, casting compatibility, name correction for maximum success.' },
            { icon: '💊', name: 'Wellness & Pharma', desc: 'Patient recovery cycle analysis, treatment timing, personalised wellness calendars.' },
            { icon: '⚖️', name: 'Legal & Compliance', desc: 'Auspicious dates for contracts, court hearings, business agreements and partnerships.' },
          ].map(u => `
            <div class="card">
              <div style="font-size:36px;margin-bottom:12px;">${u.icon}</div>
              <div style="font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:var(--cream);margin-bottom:8px;">${u.name}</div>
              <p style="font-size:13px;color:var(--grey);line-height:1.6;">${u.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- HOW IT WORKS -->
      <div style="background:rgba(255,102,0,0.04);border-top:1px solid var(--card-border);border-bottom:1px solid var(--card-border);padding:80px 24px;">
        <div style="max-width:800px;margin:0 auto;">
          <div style="text-align:center;margin-bottom:56px;">
            <h2 style="font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:700;color:var(--cream);">How The API Works</h2>
          </div>
          <div style="display:flex;flex-direction:column;gap:32px;">
            ${[
              { step: '01', title: 'Send User Data', desc: 'Pass birth details, question, and domain to our API endpoint. All data encrypted in transit.' },
              { step: '02', title: 'Choose Your Model', desc: 'Select from 11 astrology models — Vedic, KP, Numerology, Tarot and more — via a simple parameter.' },
              { step: '03', title: 'Receive Intelligence', desc: 'Get structured JSON responses with cosmic guidance, timing recommendations, and actionable insights.' },
              { step: '04', title: 'Integrate Anywhere', desc: 'Works with any tech stack. REST API with full documentation, SDKs for Python, JavaScript, and more.' },
            ].map(s => `
              <div style="display:flex;gap:24px;align-items:flex-start;">
                <div style="
                  font-family:'Cormorant Garamond',serif;
                  font-size:48px;font-weight:700;
                  color:rgba(255,102,0,0.2);
                  flex-shrink:0;line-height:1;
                ">${s.step}</div>
                <div>
                  <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--cream);margin-bottom:8px;">${s.title}</div>
                  <p style="color:var(--grey);font-size:14px;line-height:1.6;">${s.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- REGISTER INTEREST -->
      <div style="max-width:600px;margin:0 auto;padding:80px 24px;text-align:center;">
        <div style="font-size:48px;margin-bottom:16px;">📬</div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;color:var(--cream);margin-bottom:16px;">
          Register Your Interest
        </h2>
        <p style="color:var(--grey);font-size:15px;line-height:1.7;margin-bottom:32px;">
          Be among the first businesses to access Vedic Intelligence as a Service. Early access partners get special pricing and dedicated support.
        </p>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <input type="text" id="biz-name" placeholder="Your Name" class="form-input" />
          <input type="text" id="biz-company" placeholder="Company Name" class="form-input" />
          <input type="email" id="biz-email" placeholder="Business Email" class="form-input" />
          <input type="text" id="biz-industry" placeholder="Industry" class="form-input" />
          <textarea id="biz-usecase" placeholder="How would you use Vedic Intelligence in your business?" class="form-input" rows="3" style="resize:none;"></textarea>
          <button class="btn-primary" style="justify-content:center;" onclick="submitBizInterest()">
            Register Interest →
          </button>
        </div>
        <p style="font-size:12px;color:var(--grey-2);margin-top:16px;">
          We will contact you within 48 hours.
        </p>
      </div>

    </div>

    ${renderFooter()}
  `

  startPageMatrix('chat-matrix-canvas')

  window.submitBizInterest = () => {
    const name = document.getElementById('biz-name').value.trim()
    const email = document.getElementById('biz-email').value.trim()
    if (!name || !email) { alert('Please fill in your name and email.'); return }
    alert('Thank you! We will contact you within 48 hours about the Blessed Astro Business API.')
  }
  window.goHome = () => navigate('chat')
  window.goAbout = () => navigate('about')
  window.goPricing = () => navigate('pricing')
  window.goTeam = () => navigate('team')
  window.goAuth = () => navigate('auth')
}