import { navigate } from '../main.js'
import { renderFooter } from './about.js'
import { startPageMatrix } from './pricing.js'

export function renderTeam(app, state) {
  app.innerHTML = `
    <div class="cosmic-bg"></div>
    <canvas id="chat-matrix-canvas" style="position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.08;"></canvas>

    <nav class="navbar">
      <a class="navbar-logo" href="#" onclick="goHome()">🔮 Blessed<span>Astro</span></a>
      <ul class="navbar-links">
        <li><a href="#" onclick="goHome()">Chat</a></li>
        <li><a href="#" onclick="goAbout()">About</a></li>
        <li><a href="#" onclick="goPricing()">Pricing</a></li>
        <li><a href="#" onclick="goAPI()">Business API</a></li>
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
        <div style="font-size:12px;color:var(--saffron);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">The Cosmic Guides</div>
        <h1 style="font-family:'Cormorant Garamond',serif;font-size:56px;font-weight:700;color:var(--cream);margin-bottom:16px;">
          Meet Our <span style="color:var(--saffron);">Astrologers</span>
        </h1>
        <p style="font-size:18px;color:var(--grey);max-width:500px;margin:0 auto;line-height:1.6;">
          Our expert team combines decades of Vedic wisdom with modern analytical thinking to guide your cosmic journey.
        </p>
      </div>

      <!-- TEAM MEMBERS -->
      <div style="max-width:1000px;margin:0 auto;padding:0 24px 80px;">
        <div class="grid-3">
          ${[
            {
              name: 'Pandit Rajesh Sharma',
              role: 'Vedic & KP Astrology',
              exp: '28 Years',
              lang: 'Hindi, English',
              spec: ['Vedic Astrology','KP System','Prashna'],
              bio: 'A master of Vedic and KP astrology with 28 years of experience guiding families and businesses across India. Specialises in precise event timing and life path analysis.',
              rating: '4.9', sessions: '2,400+',
              avatar: '🧙‍♂️'
            },
            {
              name: 'Dr. Priya Nair',
              role: 'Tarot & Western Astrology',
              exp: '18 Years',
              lang: 'English, Malayalam, Hindi',
              spec: ['Tarot','Western Astrology','Numerology'],
              bio: 'A certified tarot reader and western astrology expert with a background in counselling psychology. Brings a unique blend of cosmic wisdom and emotional intelligence.',
              rating: '4.8', sessions: '1,800+',
              avatar: '🔮'
            },
            {
              name: 'Acharya Deepak Verma',
              role: 'Lal Kitab & Vastu',
              exp: '22 Years',
              lang: 'Hindi, Punjabi, English',
              spec: ['Lal Kitab','Vastu Shastra','BNS'],
              bio: 'An authority on Lal Kitab and Vastu Shastra with 22 years of practical experience. Known for powerful remedies and transformational guidance that creates real change.',
              rating: '4.9', sessions: '3,100+',
              avatar: '⭐'
            },
          ].map(m => `
            <div class="card" style="text-align:center;">
              <div style="font-size:64px;margin-bottom:12px;">${m.avatar}</div>
              <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--cream);margin-bottom:4px;">${m.name}</div>
              <div style="font-size:13px;color:var(--saffron);font-weight:500;margin-bottom:16px;">${m.role}</div>
              <p style="font-size:13px;color:var(--grey);line-height:1.6;margin-bottom:20px;">${m.bio}</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:20px;">
                ${m.spec.map(s => `
                  <span style="
                    background:rgba(255,102,0,0.1);border:1px solid var(--card-border);
                    color:var(--saffron);padding:4px 10px;border-radius:50px;font-size:11px;font-weight:500;
                  ">${s}</span>
                `).join('')}
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;padding:16px;background:var(--smoke);border-radius:var(--radius-sm);">
                <div>
                  <div style="font-size:18px;font-weight:700;color:var(--saffron);">${m.exp}</div>
                  <div style="font-size:11px;color:var(--grey);">Experience</div>
                </div>
                <div>
                  <div style="font-size:18px;font-weight:700;color:var(--saffron);">⭐ ${m.rating}</div>
                  <div style="font-size:11px;color:var(--grey);">Rating</div>
                </div>
                <div>
                  <div style="font-size:18px;font-weight:700;color:var(--saffron);">${m.sessions}</div>
                  <div style="font-size:11px;color:var(--grey);">Sessions</div>
                </div>
              </div>
              <div style="font-size:12px;color:var(--grey);margin-bottom:16px;">🗣️ ${m.lang}</div>
              <button class="btn-primary" style="width:100%;justify-content:center;font-size:13px;" onclick="goHome()">
                Book Consultation
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- JOIN CTA -->
      <div style="
        background:linear-gradient(135deg,rgba(255,102,0,0.08),rgba(139,0,0,0.08));
        border-top:1px solid var(--card-border);
        padding:80px 24px;text-align:center;
      ">
        <div style="max-width:600px;margin:0 auto;">
          <div style="font-size:48px;margin-bottom:16px;">🌟</div>
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;color:var(--cream);margin-bottom:16px;">
            Are You an Expert Astrologer?
          </h2>
          <p style="color:var(--grey);font-size:15px;line-height:1.7;margin-bottom:12px;">
            Blessed Astro is a curated, invitation-based platform. We accept only the most skilled and experienced astrologers.
          </p>
          <p style="color:var(--grey);font-size:15px;line-height:1.7;margin-bottom:32px;">
            Join our growing global community and reach thousands of seekers worldwide.
          </p>
          <div style="display:flex;flex-direction:column;gap:12px;align-items:center;max-width:400px;margin:0 auto;">
            <input type="text" placeholder="Your Name" class="form-input" style="width:100%;" />
            <input type="email" placeholder="Email Address" class="form-input" style="width:100%;" />
            <input type="text" placeholder="Years of Experience" class="form-input" style="width:100%;" />
            <input type="text" placeholder="Specialisation (e.g. Vedic, Tarot)" class="form-input" style="width:100%;" />
            <button class="btn-primary" style="width:100%;justify-content:center;" onclick="submitApplication()">
              Submit Application →
            </button>
          </div>
        </div>
      </div>

    </div>

    ${renderFooter()}
  `

  startPageMatrix('chat-matrix-canvas')

  window.submitApplication = () => {
    alert('Thank you for your application! We will review it and get back to you within 7 days.')
  }
  window.goHome = () => navigate('chat')
  window.goAbout = () => navigate('about')
  window.goPricing = () => navigate('pricing')
  window.goAPI = () => navigate('business')
  window.goAuth = () => navigate('auth')
}