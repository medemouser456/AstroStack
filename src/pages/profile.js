import { navigate, state } from '../main.js'
import { calculateFullChart } from '../astro/engine.js'

export function renderProfile(app) {
  try {
    console.log('👤 renderProfile called, user:', state.user?.name)

    const app_html = `
    <div class="cosmic-bg"></div>

    <!-- Navbar -->
    <nav class="navbar">
      <a class="navbar-logo" href="#" onclick="event.preventDefault(); navigate('chat')">
        🔮 Blessed<span>Astro</span>
      </a>
      <div class="navbar-right">
        <button class="lang-toggle" onclick="toggleLang()">EN / हिं</button>
      </div>
    </nav>

    <!-- Main Container -->
    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: var(--navbar-height);
      padding-bottom: var(--music-bar-height);
    ">
      <div style="width: 100%; max-width: 700px; padding: 24px;">

        <!-- Header -->
        <div style="text-align:center; margin-bottom: 32px;">
          <div style="font-family:'Cormorant Garamond',serif; font-size:48px; color:var(--saffron); text-shadow: 0 0 30px rgba(255,102,0,0.4); animation: float 3s ease-in-out infinite;">👤</div>
          <div style="font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:700; color:var(--cream); margin-top:12px;">Your Cosmic Profile</div>
          <div style="font-size:14px; color:var(--grey); margin-top:8px; font-style:italic; font-family:'Cormorant Garamond',serif;">Manage your birth details and account settings</div>
        </div>

        <!-- Profile Card -->
        <div class="card" style="padding: 32px;">

          <!-- Profile Header -->
          <div style="display:flex; gap:20px; margin-bottom:32px; padding-bottom:24px; border-bottom:1px solid var(--card-border);">
            <div style="
              width:100px; height:100px; border-radius:50%;
              background: linear-gradient(135deg, var(--saffron), var(--saffron-dark));
              display:flex; align-items:center; justify-content:center;
              font-size:48px; color:white;
              flex-shrink:0; box-shadow: 0 8px 24px rgba(255,102,0,0.2);
            ">
              ${state.user?.name ? state.user.name[0].toUpperCase() : '👤'}
            </div>
            <div style="flex:1;">
              <div style="font-size:24px; font-weight:700; color:var(--cream); margin-bottom:8px;">${state.user?.name || 'User'}</div>
              <div style="font-size:14px; color:var(--grey); margin-bottom:4px;">📧 ${state.user?.email || 'Not set'}</div>
              <div style="font-size:14px; color:var(--grey); margin-bottom:8px;">📱 ${state.user?.phone || 'Not set'}</div>
              <div style="
                display:inline-block; padding:4px 12px; border-radius:20px;
                background:rgba(255,102,0,0.1); color:var(--saffron);
                font-size:12px; font-weight:600;
              ">✦ ${state.user?.plan || 'Free'} Plan</div>
            </div>
          </div>

          <!-- Birth Details Section -->
          <div style="margin-bottom:32px;">
            <div style="font-size:18px; font-weight:700; color:var(--cream); margin-bottom:16px; display:flex; align-items:center; gap:8px;">
              <span>🌍</span> Birth Details
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px;">
              <div>
                <div style="font-size:12px; color:var(--grey); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Date of Birth</div>
                <div style="font-size:16px; color:var(--cream); font-weight:600;">
                  ${state.userDetails?.dob ? formatDate(state.userDetails.dob) : '—'}
                </div>
              </div>
              <div>
                <div style="font-size:12px; color:var(--grey); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Time of Birth</div>
                <div style="font-size:16px; color:var(--cream); font-weight:600;">
                  ${state.userDetails?.tob ? state.userDetails.tob : '—'}
                </div>
              </div>
            </div>

            <div style="margin-bottom:16px;">
              <div style="font-size:12px; color:var(--grey); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Place of Birth</div>
              <div style="font-size:16px; color:var(--cream); font-weight:600;">
                ${state.userDetails?.place || '—'}
              </div>
            </div>

            <div style="margin-bottom:20px;">
              <div style="font-size:12px; color:var(--grey); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Current City</div>
              <div style="font-size:16px; color:var(--cream); font-weight:600;">
                ${state.userDetails?.city || '—'}
              </div>
            </div>

            <button class="btn-secondary" style="width:100%;" onclick="editBirthDetails()">
              ✏️ Edit Birth Details
            </button>
          </div>

          <!-- Chart Status -->
          ${state.birthChart ? `
          <div style="margin-bottom:32px;">
            <div style="font-size:18px; font-weight:700; color:var(--cream); margin-bottom:16px; display:flex; align-items:center; gap:8px;">
              <span>🔮</span> Chart Status
            </div>
            <div style="
              padding:16px; background:rgba(255,102,0,0.1); border-radius:8px;
              border-left:3px solid var(--saffron); color:var(--cream);
              margin-bottom:16px;
            ">
              ✅ Your birth chart has been calculated
            </div>
            <button class="btn-primary" style="width:100%; margin-bottom:12px;" onclick="navigate('chat')">
              🔮 View Your Chart
            </button>
          </div>
          ` : `
          <div style="margin-bottom:32px;">
            <div style="font-size:18px; font-weight:700; color:var(--cream); margin-bottom:16px; display:flex; align-items:center; gap:8px;">
              <span>🔮</span> Birth Chart
            </div>
            <div style="
              padding:16px; background:rgba(255,102,0,0.05); border-radius:8px;
              border-left:3px solid var(--grey-2); color:var(--grey-2);
              margin-bottom:16px;
            ">
              📊 No birth chart available yet. Edit your birth details to generate one.
            </div>
          </div>
          `}

          <!-- Account Section -->
          <div style="border-top:1px solid var(--card-border); padding-top:24px;">
            <div style="font-size:18px; font-weight:700; color:var(--cream); margin-bottom:16px; display:flex; align-items:center; gap:8px;">
              <span>⚙️</span> Account Settings
            </div>
            
            <div style="display:grid; gap:12px;">
              <button class="btn-secondary" style="justify-content:flex-start;" onclick="changePassword()">
                🔐 Change Password
              </button>
              <button class="btn-secondary" style="justify-content:flex-start;" onclick="downloadData()">
                📥 Download My Data
              </button>
              <button class="btn-secondary" style="justify-content:flex-start;" onclick="deleteAccount()">
                🗑️ Delete Account
              </button>
            </div>

            <div style="margin-top:24px; padding-top:24px; border-top:1px solid var(--card-border); text-align:center;">
              <button class="btn-danger" onclick="handleLogout()" style="width:100%;">
                🚪 Logout
              </button>
            </div>
          </div>

        </div>

        <!-- Back to Chat -->
        <div style="text-align:center; margin-top:24px;">
          <button onclick="navigate('chat')" style="
            padding:12px 24px; background:transparent; color:var(--saffron);
            border:1px solid var(--saffron); border-radius:50px;
            font-size:14px; cursor:pointer; transition:all 0.2s;
          ">← Back to Chat</button>
        </div>

      </div>
    </div>
    `

    app.innerHTML = app_html
    setupProfileHandlers()
    console.log('✅ Profile rendered successfully')
  } catch (error) {
    console.error('❌ renderProfile error:', error.message, error.stack)
    app.innerHTML = `
      <div style="padding:40px; color:var(--red); font-family:monospace; background:var(--black); min-height:100vh; overflow:auto;">
        <div style="color:var(--red); font-size:16px; font-weight:bold; margin-bottom:10px;">Error rendering profile:</div>
        <div style="color:var(--grey-2); font-size:12px; white-space:pre-wrap; word-break:break-all;">
${error.message}

${error.stack}
        </div>
      </div>
    `
  }
}

function formatDate(date) {
  if (!date) return '—'
  if (typeof date === 'string') {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return date
}

function setupProfileHandlers() {
  window.editBirthDetails = () => {
    console.log('📝 Navigating to userdetails for editing')
    navigate('userdetails')
  }

  window.changePassword = () => {
    alert('Password change feature coming soon! Phase 2: Backend integration with Supabase')
  }

  window.downloadData = () => {
    const data = {
      user: state.user,
      birthDetails: state.userDetails,
      birthChart: state.birthChart ? {
        ...state.birthChart,
        details: 'Full chart calculation with all systems'
      } : null,
      chatHistory: state.chatHistory
    }
    
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `blessed-astro-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    console.log('✅ Data downloaded')
  }

  window.deleteAccount = () => {
    if (confirm('⚠️ This will permanently delete your account and all data. This action cannot be undone. Are you sure?')) {
      alert('Account deletion coming in Phase 2 with backend integration')
    }
  }
}
