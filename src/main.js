import './styles/main.css'
import './styles/animations.css'
import { renderMatrix, startMatrixBackground } from './pages/home.js'
import { renderChat } from './pages/chat.js'
import { renderAuth } from './pages/auth.js'
import { renderUserDetails } from './pages/userdetails.js'
import { renderProfile } from './pages/profile.js'
import { renderAbout } from './pages/about.js'
import { renderPricing } from './pages/pricing.js'
import { renderTeam } from './pages/team.js'
import { renderBusiness } from './pages/business.js'
import { renderBlog } from './pages/blog.js'
import { renderModels } from './pages/models.js'

export const state = {
  user: null,
  currentPage: 'chat',
  selectedModel: { icon: '🪐', name: 'Vedic Astrology', desc: 'Ancient Indian system' },
  selectedDomain: { icon: '👤', name: 'Self', house: '1st House', desc: 'Identity, appearance, health' },
  chatHistory: [],
  currentChat: [],
  sidebarOpen: true,
  language: 'en',
  musicPlaying: false,
  userDetails: null,
  birthChart: null,
}

export function navigate(page) {
  state.currentPage = page
  render()
}
window.navigate = navigate 
function setupMusic() {
  const audio = document.getElementById('bg-music')
  const toggle = document.getElementById('music-toggle')
  const volume = document.getElementById('music-volume')
  if (!audio) return

  // Restore saved volume
  const savedVol = localStorage.getItem('ba_music_vol')
  audio.volume = savedVol ? savedVol / 100 : 0.15
  if (volume) volume.value = savedVol || 15

  // Try autoplay immediately
  const tryPlay = () => {
    audio.play().then(() => {
      state.musicPlaying = true
      if (toggle) toggle.textContent = '⏸'
    }).catch(() => {})
  }

  tryPlay()

  // Also try on first user interaction
  document.addEventListener('click', () => {
    if (!state.musicPlaying) {
      tryPlay()
    }
  }, { once: false })

  if (toggle) {
    toggle.addEventListener('click', () => {
      if (audio.paused) {
        audio.play()
        toggle.textContent = '⏸'
        state.musicPlaying = true
      } else {
        audio.pause()
        toggle.textContent = '▶'
        state.musicPlaying = false
      }
    })
  }

  if (volume) {
    volume.addEventListener('input', () => {
      audio.volume = volume.value / 100
      localStorage.setItem('ba_music_vol', volume.value)
    })
  }
}

function render() {
  const app = document.getElementById('app')
  
  try {
    console.log('🎨 Rendering page:', state.currentPage)
    
    switch (state.currentPage) {
      case 'chat':
        renderChat(app, state)
        startMatrixBackground()
        break
      case 'auth':
        renderAuth(app, state)
        break
      case 'userdetails':
        renderUserDetails(app)
        break
      case 'profile':
        renderProfile(app)
        break
      case 'about':
        renderAbout(app, state)
        break
      case 'pricing':
        renderPricing(app, state)
        break
      case 'team':
        renderTeam(app, state)
        break
      case 'business':
        renderBusiness(app, state)
        break
      case 'blog':
        renderBlog(app, state)
        break
      case 'models':
        renderModels(app, state)
        break
      default:
        renderChat(app, state)
        startMatrixBackground()
    }
    
    console.log('✅ Page rendered:', state.currentPage)
  } catch (error) {
    console.error('❌ RENDER ERROR:', error.message, error.stack)
    app.innerHTML = `
      <div style="color:red; padding:40px; font-family:monospace; font-size:14px;">
        <h2>⚠️ Application Error</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Stack:</strong></p>
        <pre style="background:#000; color:#0f0; padding:10px; overflow:auto; max-height:300px;">${error.stack}</pre>
        <button onclick="location.reload()" style="padding:10px 20px; background:#666; color:white; border:none; cursor:pointer; border-radius:4px;">Reload Page</button>
      </div>
    `
  }
}

function init() {
  try {
    console.log('🚀 AstroStack initializing...')
    setupMusic()
    renderMatrix(() => {
      console.log('🎬 Matrix background loaded')
      render()
    })
    console.log('✅ Init complete')
  } catch (error) {
    console.error('❌ INIT ERROR:', error.message, error.stack)
    const app = document.getElementById('app')
    if (app) {
      app.innerHTML = `
        <div style="color:red; padding:40px; font-family:monospace; font-size:14px;">
          <h2>❌ Initialization Failed</h2>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Stack:</strong></p>
          <pre style="background:#000; color:#0f0; padding:10px; overflow:auto; max-height:300px;">${error.stack}</pre>
        </div>
      `
    }
  }
}

init()