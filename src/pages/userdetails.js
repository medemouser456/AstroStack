import { navigate, state } from '../main.js'

export function renderUserDetails(app) {
  app.innerHTML = `
    <div class="cosmic-bg"></div>

    <!-- Navbar -->
    <nav class="navbar">
      <a class="navbar-logo" href="#">
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
      <div style="width: 100%; max-width: 600px; padding: 24px;">

        <!-- Header -->
        <div style="text-align:center; margin-bottom: 32px;">
          <div style="font-family:'Cormorant Garamond',serif; font-size:48px; color:var(--saffron); text-shadow: 0 0 30px rgba(255,102,0,0.4); animation: float 3s ease-in-out infinite;">✨</div>
          <div style="font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:700; color:var(--cream); margin-top:12px;">Let the planets know you</div>
          <div style="font-size:14px; color:var(--grey); margin-top:8px; font-style:italic; font-family:'Cormorant Garamond',serif;">Your birth details help us calculate your accurate cosmic profile</div>
        </div>

        <!-- Form Card -->
        <div class="card" style="padding: 32px;">

          <!-- Name & Gender Row -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:20px;">
            <div class="form-group">
              <label class="form-label">Your Name *</label>
              <input type="text" id="ud-name" class="form-input" placeholder="Full name" value="${state.user?.name || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">Gender *</label>
              <div class="gender-toggle" style="display:flex; gap:8px; flex-wrap:wrap;">
                <button class="gender-btn active" id="g-male" onclick="window.setGender('Male')" style="flex:1; min-width:60px;">♂ Male</button>
                <button class="gender-btn" id="g-female" onclick="window.setGender('Female')" style="flex:1; min-width:60px;">♀ Female</button>
                <button class="gender-btn" id="g-other" onclick="window.setGender('Other')" style="flex:1; min-width:60px;">⚧ Other</button>
              </div>
            </div>
          </div>

          <!-- DOB & TOB Row -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:20px;">
            <div class="form-group">
              <label class="form-label">Date of Birth *</label>
              <input type="date" id="ud-dob" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Time of Birth</label>
              <input type="time" id="ud-tob" class="form-input" />
              <small style="color:var(--grey); font-size:11px; margin-top:4px;">Leave blank if unknown</small>
            </div>
          </div>

          <!-- Place of Birth -->
          <div class="form-group" style="margin-bottom:20px;">
            <label class="form-label">Place of Birth *</label>
            <input type="text" id="ud-place" class="form-input" placeholder="City, Country (e.g., Mumbai, India)" />
            <small style="color:var(--grey); font-size:11px; margin-top:4px;">We use this to get accurate timezone and coordinates</small>
          </div>

          <!-- Current City -->
          <div class="form-group" style="margin-bottom:24px;">
            <label class="form-label">Current City</label>
            <input type="text" id="ud-city" class="form-input" placeholder="Where you live now (optional)" />
          </div>

          <!-- Buttons -->
          <button class="btn-primary" style="width:100%;justify-content:center;margin-bottom:12px;" id="calculate-btn" onclick="calculateUserChart()">
            ✨ Calculate My Birth Chart
          </button>

          <button class="btn-ghost" style="width:100%;text-align:center;" onclick="goBackToChat()">
            ← Continue without chart
          </button>

          <p style="font-size:11px; color:var(--grey-2); text-align:center; margin-top:16px; line-height:1.6;">
            🔒 Your details are sacred and never shared. We calculate your Vedic, Western, KP charts and more using Swiss Ephemeris.
          </p>

        </div>

      </div>
    </div>
  `

  let selectedGender = 'Male'

  window.setGender = (g) => {
    selectedGender = g
    document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'))
    document.getElementById('g-' + g.toLowerCase())?.classList.add('active')
  }

  window.calculateUserChart = async () => {
    const name = document.getElementById('ud-name').value.trim()
    const dob = document.getElementById('ud-dob').value
    const place = document.getElementById('ud-place').value.trim()
    const tob = document.getElementById('ud-tob').value
    const city = document.getElementById('ud-city').value.trim()

    if (!name || !dob || !place) {
      alert('Please fill in: Name, Date of Birth, and Place of Birth')
      return
    }

    console.log('📝 User entered:', { name, dob, tob, place })

    // Update state with user details
    state.userDetails = {
      name,
      gender: selectedGender,
      dob,
      tob: tob || '',
      birthPlace: place,
      currentCity: city
    }

    console.log('✅ state.userDetails set:', state.userDetails)

    // Update user if not already set
    if (!state.user) {
      state.user = { name, plan: 'Free' }
    } else {
      state.user.name = name
    }

    // Show calculating state
    const btn = document.getElementById('calculate-btn')
    btn.textContent = '⏳ Reading the stars...'
    btn.disabled = true

    // Calculate birth chart
    try {
      console.log('🔮 Calling calculateFullChart...')
      const { calculateFullChart } = await import('../astro/engine.js')
      const result = await calculateFullChart(state.userDetails)
      
      console.log('📊 Chart calculation result:', { success: result.success, hasChart: !!result.chart })
      
      if (result.success) {
        state.birthChart = result.chart
        console.log('✅ state.birthChart set successfully')
        console.log('✅ Chart calculated:', result.chart.vedic.lagna.sign, result.chart.vedic.lagna.degree.toFixed(2))
      } else {
        console.warn('⚠️ Chart calculation failed:', result.error || 'Unknown error')
        alert('Error calculating chart: ' + (result.error || 'Unknown error'))
        btn.textContent = '✨ Calculate My Birth Chart'
        btn.disabled = false
        return
      }
    } catch (e) {
      console.error('❌ Chart calculation error:', e)
      alert('Error calculating chart: ' + e.message)
      btn.textContent = '✨ Calculate My Birth Chart'
      btn.disabled = false
      return
    }

    console.log('🚀 Navigating to chat...')
    // Navigate to chat
    navigate('chat')
  }

  window.goBackToChat = () => {
    // Update user info even without full details
    const name = document.getElementById('ud-name').value.trim()
    if (name) {
      if (!state.user) {
        state.user = { name, plan: 'Free' }
      } else {
        state.user.name = name
      }
    }
    navigate('chat')
  }

  window.toggleLang = () => {
    state.language = state.language === 'en' ? 'hi' : 'en'
  }
}
