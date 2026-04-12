class ProfilPage {
  constructor() {
    this.checkAuth();
  }

  checkAuth() {
    if (localStorage.getItem('loggedIn') !== 'true') {
      window.location.href = 'index.html';
    }
  }

  logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
  }
}

const profil = new ProfilPage();

function logout() { profil.logout(); }