import { navigate } from '../main.js'
import { renderFooter } from './about.js'
import { startPageMatrix } from './pricing.js'

export function renderBlog(app, state) {
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
      <div style="text-align:center;padding:80px 24px 60px;">
        <div style="font-size:12px;color:var(--saffron);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">Cosmic Insights</div>
        <h1 style="font-family:'Cormorant Garamond',serif;font-size:56px;font-weight:700;color:var(--cream);margin-bottom:16px;">
          The <span style="color:var(--saffron);">Blessed Astro</span> Blog
        </h1>
        <p style="font-size:18px;color:var(--grey);max-width:500px;margin:0 auto;">
          Ancient wisdom, modern insights. Learn how Vedic astrology can guide every aspect of your life.
        </p>
      </div>

      <!-- FEATURED POST -->
      <div style="max-width:1000px;margin:0 auto;padding:0 24px 40px;">
        <div class="card" style="
          display:grid;grid-template-columns:1fr 1fr;gap:40px;
          background:rgba(255,102,0,0.06);border-color:var(--saffron);
        ">
          <div style="display:flex;align-items:center;justify-content:center;font-size:120px;">🪐</div>
          <div>
            <div style="font-size:11px;color:var(--saffron);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Featured · Vedic Astrology</div>
            <h2 style="font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:var(--cream);margin-bottom:12px;line-height:1.3;">
              Understanding Your Birth Chart: A Complete Beginner's Guide to Vedic Astrology
            </h2>
            <p style="color:var(--grey);font-size:14px;line-height:1.7;margin-bottom:20px;">
              Your birth chart is a cosmic snapshot of the sky at the exact moment you were born. It contains everything — your personality, strengths, challenges, career potential and life path according to 5000 years of Vedic wisdom.
            </p>
            <div style="display:flex;align-items:center;gap:16px;font-size:12px;color:var(--grey-2);">
              <span>🧙‍♂️ Pandit Rajesh Sharma</span>
              <span>·</span>
              <span>📅 March 2026</span>
              <span>·</span>
              <span>⏱️ 8 min read</span>
            </div>
          </div>
        </div>
      </div>

      <!-- BLOG POSTS GRID -->
      <div style="max-width:1000px;margin:0 auto;padding:0 24px 80px;">
        <div class="grid-3">
          ${[
            { icon:'🔢', cat:'Numerology', title:'Your Life Path Number: What It Means and How To Calculate It', author:'Dr. Priya Nair', time:'5 min read', date:'Mar 2026' },
            { icon:'🃏', cat:'Tarot', title:'The Major Arcana: Understanding the 22 Cards That Shape Your Destiny', author:'Dr. Priya Nair', time:'10 min read', date:'Mar 2026' },
            { icon:'📕', cat:'Lal Kitab', title:'Lal Kitab Remedies: Simple Daily Practices That Transform Your Life', author:'Acharya Deepak Verma', time:'7 min read', date:'Feb 2026' },
            { icon:'🏠', cat:'Vastu Shastra', title:'The 8 Directions of Vastu: How Your Home\'s Energy Affects Your Life', author:'Acharya Deepak Verma', time:'6 min read', date:'Feb 2026' },
            { icon:'⭐', cat:'KP Astrology', title:'KP System vs Vedic Astrology: Key Differences and When to Use Each', author:'Pandit Rajesh Sharma', time:'9 min read', date:'Jan 2026' },
            { icon:'🐉', cat:'Chinese Astrology', title:'Your Chinese Zodiac in 2026: What the Year of the Horse Means for You', author:'Dr. Priya Nair', time:'5 min read', date:'Jan 2026' },
          ].map(p => `
            <div class="card" style="cursor:pointer;" onclick="alert('Full blog coming soon!')">
              <div style="font-size:40px;margin-bottom:12px;">${p.icon}</div>
              <div style="font-size:11px;color:var(--saffron);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">${p.cat}</div>
              <h3 style="font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:700;color:var(--cream);margin-bottom:12px;line-height:1.4;">${p.title}</h3>
              <div style="display:flex;align-items:center;gap:8px;font-size:11px;color:var(--grey-2);margin-top:auto;flex-wrap:wrap;">
                <span>${p.author}</span>
                <span>·</span>
                <span>${p.date}</span>
                <span>·</span>
                <span>${p.time}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- NEWSLETTER -->
      <div style="
        background:linear-gradient(135deg,rgba(255,102,0,0.08),rgba(139,0,0,0.08));
        border-top:1px solid var(--card-border);
        padding:80px 24px;text-align:center;
      ">
        <div style="max-width:500px;margin:0 auto;">
          <div style="font-size:40px;margin-bottom:16px;">📬</div>
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:700;color:var(--cream);margin-bottom:12px;">
            Weekly Cosmic Insights
          </h2>
          <p style="color:var(--grey);font-size:14px;line-height:1.7;margin-bottom:24px;">
            Get weekly planetary updates, auspicious dates, and Vedic wisdom directly in your inbox.
          </p>
          <div style="display:flex;gap:12px;">
            <input type="email" id="newsletter-email" placeholder="Your email address" class="form-input" style="flex:1;" />
            <button class="btn-primary" style="white-space:nowrap;" onclick="subscribeNewsletter()">Subscribe →</button>
          </div>
        </div>
      </div>

    </div>

    ${renderFooter()}
  `

  startPageMatrix('chat-matrix-canvas')

  window.subscribeNewsletter = () => {
    const email = document.getElementById('newsletter-email').value.trim()
    if (!email) { alert('Please enter your email address.'); return }
    alert('Thank you for subscribing! Your first cosmic insights are on their way.')
  }
  window.goHome = () => navigate('chat')
  window.goAbout = () => navigate('about')
  window.goPricing = () => navigate('pricing')
  window.goTeam = () => navigate('team')
  window.goAuth = () => navigate('auth')
}