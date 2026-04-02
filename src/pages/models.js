import { navigate } from '../main.js'
import { renderFooter } from './about.js'
import { startPageMatrix } from './pricing.js'

export function renderModels(app, state) {
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

      <div style="text-align:center;padding:80px 24px 60px;">
        <div style="font-size:12px;color:var(--saffron);text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">11 Ancient Systems</div>
        <h1 style="font-family:'Cormorant Garamond',serif;font-size:56px;font-weight:700;color:var(--cream);margin-bottom:16px;">
          Our Astrology <span style="color:var(--saffron);">Models</span>
        </h1>
        <p style="font-size:18px;color:var(--grey);max-width:500px;margin:0 auto;">
          Each system carries centuries of wisdom. Choose the one that resonates with your question.
        </p>
      </div>

      <div style="max-width:1000px;margin:0 auto;padding:0 24px 80px;">
        <div class="grid-3">
          ${[
            { icon:'🪐', name:'Vedic Astrology', origin:'India · 5000+ years', desc:'The most comprehensive astrology system in the world. Uses birth chart, planetary periods (dashas), and karma to reveal your complete life path, strengths, challenges and destiny.', needs:'Date, time, place of birth', bestFor:'Life path, career, relationships, timing' },
            { icon:'⭐', name:'KP Astrology', origin:'India · 20th Century', desc:'Krishnamurti Paddhati — a highly precise modern Indian system known for accurate event timing. Uses sub-lords and ruling planets to pinpoint exactly when events will occur.', needs:'Precise birth time required', bestFor:'Precise timing, specific event prediction' },
            { icon:'❓', name:'Prashna / Horary', origin:'India · Ancient', desc:'No birth details needed. Based on the exact time a question is asked, this system provides immediate, precise answers. Ideal for urgent decisions when birth data is unavailable.', needs:'No birth data needed', bestFor:'Urgent questions, immediate decisions' },
            { icon:'🔢', name:'Numerology', origin:'Global · Ancient', desc:'Numbers carry cosmic vibration. Your name and birth date contain a code that reveals your life path number, destiny number, and soul purpose — and how to optimise them.', needs:'Full name + date of birth', bestFor:'Name correction, lucky numbers, life purpose' },
            { icon:'🃏', name:'Tarot', origin:'Europe · 15th Century', desc:'78 cards, each carrying archetypal wisdom. Tarot taps into your subconscious and the collective unconscious to reveal hidden patterns, possibilities and guidance for your situation.', needs:'Optional personal details', bestFor:'Intuitive guidance, relationship clarity, decisions' },
            { icon:'📜', name:'BNS — Brighu Nadi', origin:'India · Ancient', desc:'One of the most mystical and powerful Vedic systems. Based on ancient palm leaf manuscripts, Brighu Nadi reveals past life karma, present life lessons and future possibilities with remarkable accuracy.', needs:'Date, time, place of birth', bestFor:'Past life, karma, deep spiritual guidance' },
            { icon:'📕', name:'Lal Kitab', origin:'India/Pakistan · 19th Century', desc:'A unique system written in Urdu-Hindi, Lal Kitab is famous for its simple yet powerful remedies. Based on hand reading and planetary positions, it provides practical solutions to life problems.', needs:'Birth details + physical features', bestFor:'Practical remedies, debt, relationships, health' },
            { icon:'♈', name:'Western Astrology', origin:'Greece/Europe · Ancient', desc:'The most widely known astrology system globally. Uses sun signs, rising signs, and planetary aspects to reveal personality, psychological patterns and life themes in a modern framework.', needs:'Date, time, place of birth', bestFor:'Personality analysis, psychological patterns' },
            { icon:'🐉', name:'Chinese Astrology', origin:'China · 2000+ years', desc:'Based on 12 animal signs, five elements, and yearly cycles. Chinese astrology reveals your fundamental nature, compatibility with others, and how each year\'s energy affects your life journey.', needs:'Year and date of birth', bestFor:'Annual forecasts, compatibility, lucky periods' },
            { icon:'✍️', name:'Name Correction', origin:'Numerology based', desc:'Your name carries a specific vibration that influences your life energy. Name correction analysis reveals if your current name supports your birth number and suggests modifications for better alignment.', needs:'Current name + date of birth', bestFor:'Business names, baby names, personal branding' },
            { icon:'🏠', name:'Vastu Shastra', origin:'India · 5000+ years', desc:'The ancient Indian science of space and direction. Vastu analyses how the energy of your home or workplace affects your health, wealth and relationships — and how to optimise it.', needs:'Floor plan or description/photo', bestFor:'Home energy, office setup, property selection' },
          ].map(m => `
            <div class="card">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                <div style="font-size:40px;">${m.icon}</div>
                <div>
                  <div style="font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:var(--cream);">${m.name}</div>
                  <div style="font-size:11px;color:var(--saffron);">${m.origin}</div>
                </div>
              </div>
              <p style="color:var(--grey);font-size:13px;line-height:1.7;margin-bottom:16px;">${m.desc}</p>
              <div style="padding:12px;background:var(--smoke);border-radius:var(--radius-sm);margin-bottom:16px;font-size:12px;">
                <div style="color:var(--grey-2);margin-bottom:4px;">📋 Needs: <span style="color:var(--grey);">${m.needs}</span></div>
                <div style="color:var(--grey-2);">✨ Best for: <span style="color:var(--grey);">${m.bestFor}</span></div>
              </div>
              <button class="btn-primary" style="width:100%;justify-content:center;font-size:13px;" onclick="startChat('${m.name}')">
                Chat with ${m.name} →
              </button>
            </div>
          `).join('')}
        </div>
      </div>

    </div>

    ${renderFooter()}
  `

  startPageMatrix('chat-matrix-canvas')

  window.startChat = (modelName) => {
    const models = [
      { icon:'🪐', name:'Vedic Astrology', desc:'Ancient Indian system' },
      { icon:'⭐', name:'KP Astrology', desc:'Precise event timing' },
      { icon:'❓', name:'Prashna / Horary', desc:'Instant answers' },
      { icon:'🔢', name:'Numerology', desc:'Life path numbers' },
      { icon:'🃏', name:'Tarot', desc:'Intuitive guidance' },
      { icon:'📜', name:'BNS — Brighu Nadi', desc:'Past life karma' },
      { icon:'📕', name:'Lal Kitab', desc:'Practical remedies' },
      { icon:'♈', name:'Western Astrology', desc:'Personality mapping' },
      { icon:'🐉', name:'Chinese Astrology', desc:'Annual cycles' },
      { icon:'✍️', name:'Name Correction', desc:'Name optimisation' },
      { icon:'🏠', name:'Vastu Shastra', desc:'Space energy' },
    ]
    const model = models.find(m => m.name === modelName)
    if (model) state.selectedModel = model
    navigate('chat')
  }
  window.goHome = () => navigate('chat')
  window.goAbout = () => navigate('about')
  window.goPricing = () => navigate('pricing')
  window.goTeam = () => navigate('team')
  window.goAuth = () => navigate('auth')
}