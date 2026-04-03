class NotificationView {
  constructor() {
    this._permission = Notification.permission; // "default" | "granted" | "denied"
    this._requestPermissionOnInteraction();
  }

  _requestPermissionOnInteraction() {
    if (this._permission === "granted") return;
    if (this._permission === "denied") return;

    const ask = async () => {
      this._permission = await Notification.requestPermission();
      document.removeEventListener("click", ask);
    };
    document.addEventListener("click", ask, { once: true });
  }

  /**
   * @returns {Promise<NotificationPermission>}
   */
  async requestPermission() {
    if (!("Notification" in window)) return "denied";
    this._permission = await Notification.requestPermission();
    return this._permission;
  }

  /**
   * @param {Array<{ type: 'danger'|'warning', msg: string }>} alertes
   */
  notifier(alertes) {
    if (!("Notification" in window)) return;
    if (this._permission !== "granted") return;
    if (!alertes || alertes.length === 0) return;

    alertes.forEach(alerte => {
      const titre = alerte.type === "danger" ? "⚠ Alerte HotHotHot" : "ℹ Info HotHotHot";
      const options = {
        body: alerte.msg,
        icon: "img/Logo.png",        // icône de votre logo
        badge: "img/Logo.png",       // petite icône sur mobile
        tag: `hothothot-${alerte.type}-${Date.now()}`, // tag unique = pas de doublons
        requireInteraction: alerte.type === "danger",  // les alertes danger restent jusqu'au clic
        data: {
          url: window.location.href, // URL de la page courante
          msg: alerte.msg,
          type: alerte.type
        }
      };

      const notif = new Notification(titre, options);

      notif.addEventListener("click", () => {
        window.focus();
        notif.close();
        this._ouvrirPanneau();
      });

      if (alerte.type !== "danger") {
        setTimeout(() => notif.close(), 8000);
      }
    });
  }


  _ouvrirPanneau() {
    document.dispatchEvent(new CustomEvent("hothothot:open-alerts"));

    const bell = document.querySelector(".av-bell");
    if (bell) bell.click();
  }
}