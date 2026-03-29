class AuthController {
  constructor() {
    this.model      = new AuthModel();
    this.btnToggle  = document.getElementById('btn-toggle');
    this.btnProfile = document.getElementById('btn-profile');

    this.btnToggle.addEventListener('click', () => this.toggle());

    if (this.model.isLoggedIn()) {
      this.setLoggedInUI(false);
    } else {
      this.setLoggedOutUI(false);
    }
  }

  toggle() {
    if (this.model.isLoggedIn()) {
      this.model.logout();
      this.setLoggedOutUI(true);
    } else {
      this.model.login();
      this.setLoggedInUI(true);
    }
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
