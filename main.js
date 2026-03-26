class AuthManager {
  constructor() {
    this.btnToggle  = document.getElementById('btn-toggle');
    this.btnProfile = document.getElementById('btn-profile');

    this.btnToggle.addEventListener('click', () => this.toggle());

    if (this.isLoggedIn()) {
      this.setLoggedInUI(false);
    } else {
      this.setLoggedOutUI(false);
    }
  }

  isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
  }

  toggle() {
    if (this.isLoggedIn()) {
      this.logout();
    } else {
      this.login();
    }
  }

  login() {
    localStorage.setItem('loggedIn', 'true');
    this.setLoggedInUI(true);
  }

  logout() {
    localStorage.removeItem('loggedIn');
    this.setLoggedOutUI(true);
  }

  setLoggedInUI(animate = true) {
    this.btnToggle.textContent = 'Se déconnecter';
    this.btnToggle.classList.remove('btn-login');
    this.btnToggle.classList.add('btn-logout');
    this.btnProfile.classList.remove('hidden');
    if (animate) this._popIn(this.btnProfile);
  }

  setLoggedOutUI() {
    this.btnToggle.textContent = 'Se connecter';
    this.btnToggle.classList.remove('btn-logout');
    this.btnToggle.classList.add('btn-login');
    this.btnProfile.classList.add('hidden');
  }

  _popIn(el) {
    el.classList.add('pop-in');
    setTimeout(() => el.classList.remove('pop-in'), 300);
  }
}

// Le script est en bas du <body> : le DOM est déjà prêt, on instancie directement
new AuthManager();