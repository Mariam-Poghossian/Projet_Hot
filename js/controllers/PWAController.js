class PWAController {
  constructor() {
    this._deferredPrompt = null;
    this._btnInstall     = document.querySelector('#btn-install');

    this._registerSW();
    this._initInstallButton();
  }

  _registerSW() {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('[SW] Enregistré :', reg.scope))
      .catch(err => console.error('[SW] Erreur :', err));
  }

  _initInstallButton() {
    if (!this._btnInstall) return;

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      this._deferredPrompt = event;
      this._btnInstall.classList.remove('hidden');
    });

    this._btnInstall.addEventListener('click', async () => {
      if (!this._deferredPrompt) return;
      this._deferredPrompt.prompt();
      const { outcome } = await this._deferredPrompt.userChoice;
      console.log('[PWA] Installation :', outcome);
      this._deferredPrompt = null;
      this._btnInstall.classList.add('hidden');
    });

    window.addEventListener('appinstalled', () => {
      this._btnInstall.classList.add('hidden');
      this._deferredPrompt = null;
    });
  }
}