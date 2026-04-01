import { navigate, state } from '../main.js'

export function renderAuth(app) {
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

    <!-- Auth Container -->
    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: var(--navbar-height);
      padding-bottom: var(--music-bar-height);
    ">
      <div style="width: 100%; max-width: 420px; padding: 24px;">

        <!-- Logo -->
        <div style="text-align:center; margin-bottom: 32px;">
          <div style="font-family:'Cormorant Garamond',serif; font-size:40px; color:var(--saffron); text-shadow: 0 0 30px rgba(255,102,0,0.4);">🔮</div>
          <div style="font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:700; color:var(--cream); margin-top:8px;">Welcome Back</div>
          <div style="font-size:14px; color:var(--grey); margin-top:4px; font-style:italic; font-family:'Cormorant Garamond',serif;">The stars have been waiting for you</div>
        </div>

        <!-- Auth Card -->
        <div class="card" style="padding: 32px;">

          <!-- Tabs -->
          <div style="display:flex; gap:0; margin-bottom:28px; background:var(--smoke); border-radius:var(--radius-sm); padding:4px;">
            <button id="tab-login" onclick="switchTab('login')" style="
              flex:1; padding:10px; border:none; border-radius:6px;
              background: linear-gradient(135deg, var(--saffron), var(--saffron-dark));
              color:white; font-size:14px; font-weight:600; cursor:pointer;
              font-family:'Inter',sans-serif; transition: all 0.2s;
            ">Login</button>
            <button id="tab-signup" onclick="switchTab('signup')" style="
              flex:1; padding:10px; border:none; border-radius:6px;
              background:transparent; color:var(--grey);
              font-size:14px; font-weight:600; cursor:pointer;
              font-family:'Inter',sans-serif; transition: all 0.2s;
            ">Sign Up</button>
          </div>

          <!-- Login Form -->
          <div id="form-login">
            <div class="form-group" style="margin-bottom:16px;">
              <label class="form-label">Email or Phone</label>
              <input type="text" id="login-email" class="form-input" placeholder="Enter email or phone number" />
            </div>
            <div class="form-group" style="margin-bottom:8px;">
              <label class="form-label">Password</label>
              <input type="password" id="login-password" class="form-input" placeholder="Enter your password" />
            </div>
            <div style="text-align:right; margin-bottom:24px;">
              <a href="#" style="font-size:12px; color:var(--saffron); text-decoration:none;">Forgot password?</a>
            </div>
            <button class="btn-primary" style="width:100%; justify-content:center;" onclick="handleLogin()">
              Login to Blessed Astro
            </button>
            <div style="margin:20px 0; text-align:center; position:relative;">
              <div style="height:1px; background:var(--card-border);"></div>
              <span style="position:absolute; top:-9px; left:50%; transform:translateX(-50%); background:var(--smoke-2); padding:0 12px; font-size:12px; color:var(--grey);">or</span>
            </div>
            <button onclick="handleGoogleLogin()" style="
              width:100%; padding:12px; background:white; color:#333;
              border:1px solid #ddd; border-radius:50px; font-size:14px;
              font-weight:600; cursor:pointer; display:flex; align-items:center;
              justify-content:center; gap:10px; font-family:'Inter',sans-serif;
              transition: all 0.2s;
            ">
              <img src="https://www.google.com/favicon.ico" width="18" height="18" />
              Continue with Google
            </button>
          </div>

          <!-- Signup Form -->
          <div id="form-signup" style="display:none;">
            <div class="form-group" style="margin-bottom:16px;">
              <label class="form-label">Full Name</label>
              <input type="text" id="signup-name" class="form-input" placeholder="Your full name" />
            </div>
            <div class="form-group" style="margin-bottom:16px;">
              <label class="form-label">Email</label>
              <input type="email" id="signup-email" class="form-input" placeholder="Your email address" />
            </div>
            <div class="form-group" style="margin-bottom:16px;">
              <label class="form-label">Phone Number</label>
              <input type="tel" id="signup-phone" class="form-input" placeholder="+91 or international" />
            </div>
            <div class="form-group" style="margin-bottom:16px;">
              <label class="form-label">Password</label>
              <input type="password" id="signup-password" class="form-input" placeholder="Create a strong password" />
            </div>
            <div class="form-group" style="margin-bottom:24px;">
              <label class="form-label">Confirm Password</label>
              <input type="password" id="signup-confirm" class="form-input" placeholder="Repeat your password" />
            </div>
            <button class="btn-primary" style="width:100%; justify-content:center;" onclick="handleSignup()">
              Create My Account
            </button>
            <div style="margin:20px 0; text-align:center; position:relative;">
              <div style="height:1px; background:var(--card-border);"></div>
              <span style="position:absolute; top:-9px; left:50%; transform:translateX(-50%); background:var(--smoke-2); padding:0 12px; font-size:12px; color:var(--grey);">or</span>
            </div>
            <button onclick="handleGoogleLogin()" style="
              width:100%; padding:12px; background:white; color:#333;
              border:1px solid #ddd; border-radius:50px; font-size:14px;
              font-weight:600; cursor:pointer; display:flex; align-items:center;
              justify-content:center; gap:10px; font-family:'Inter',sans-serif;
            ">
              <img src="https://www.google.com/favicon.ico" width="18" height="18" />
              Continue with Google
            </button>
            <p style="font-size:11px; color:var(--grey-2); text-align:center; margin-top:16px;">
              By signing up you agree to our Terms & Conditions and Privacy Policy
            </p>
          </div>

        </div>

        <!-- Back to chat -->
        <div style="text-align:center; margin-top:20px;">
          <button class="btn-ghost" onclick="goToChat()">← Back to Chat</button>
        </div>

      </div>
    </div>
  `

  // Tab switching
  window.switchTab = (tab) => {
    const loginForm = document.getElementById('form-login')
    const signupForm = document.getElementById('form-signup')
    const loginTab = document.getElementById('tab-login')
    const signupTab = document.getElementById('tab-signup')

    if (tab === 'login') {
      loginForm.style.display = 'block'
      signupForm.style.display = 'none'
      loginTab.style.background = 'linear-gradient(135deg, var(--saffron), var(--saffron-dark))'
      loginTab.style.color = 'white'
      signupTab.style.background = 'transparent'
      signupTab.style.color = 'var(--grey)'
    } else {
      loginForm.style.display = 'none'
      signupForm.style.display = 'block'
      signupTab.style.background = 'linear-gradient(135deg, var(--saffron), var(--saffron-dark))'
      signupTab.style.color = 'white'
      loginTab.style.background = 'transparent'
      loginTab.style.color = 'var(--grey)'
    }
  }

  window.handleLogin = () => {
    const email = document.getElementById('login-email').value.trim()
    const password = document.getElementById('login-password').value

    if (!email || !password) {
      alert('Please enter your email/phone and password.')
      return
    }

    // Demo login — Supabase integration comes in Phase 2
    state.user = { name: 'Seeker', email, plan: 'Free' }
    navigate('chat')
  }

  window.handleSignup = () => {
    const name = document.getElementById('signup-name').value.trim()
    const email = document.getElementById('signup-email').value.trim()
    const phone = document.getElementById('signup-phone').value.trim()
    const password = document.getElementById('signup-password').value
    const confirm = document.getElementById('signup-confirm').value

    if (!name || !email || !password) {
      alert('Please fill in all required fields.')
      return
    }

    if (password !== confirm) {
      alert('Passwords do not match.')
      return
    }

    // Demo signup — Supabase integration comes in Phase 2
    state.user = { name, email, phone, plan: 'Free' }
    navigate('chat')
  }

  window.handleGoogleLogin = () => {
    // Google OAuth — Supabase integration in Phase 2
    state.user = { name: 'Cosmic Seeker', email: 'user@gmail.com', plan: 'Free' }
    navigate('chat')
  }

  window.goToChat = () => navigate('chat')
  window.toggleLang = () => {
    state.language = state.language === 'en' ? 'hi' : 'en'
  }
}