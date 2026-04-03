class AlertView {
  constructor() {
    this._alertes    = [];
    this._synthese   = null;
    this._panelOpen  = false;
    this._toastTimer = null;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this._buildDOM());
    } else {
      this._buildDOM();
    }
  }

  _buildDOM() {
    this._buildBell();
    this._buildPanel();
    this._buildOverlay();
    this._buildToast();
    this._bindEvents();
  }

  _buildBell() {
    const headerInner = document.querySelector(".header-inner");
    if (!headerInner) { console.warn("[AlertView] .header-inner introuvable"); return; }

    this._bellWrapper = document.createElement("div");
    this._bellWrapper.className = "av-bell";
    this._bellWrapper.setAttribute("role", "button");
    this._bellWrapper.setAttribute("aria-label", "Ouvrir les alertes");
    this._bellWrapper.setAttribute("tabindex", "0");
    this._bellWrapper.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none"
           stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round"
           width="22" height="22">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span class="av-badge" aria-live="polite" style="display:none">0</span>
    `;

    const actions = headerInner.querySelector(".header-actions");
    if (actions) {
      headerInner.insertBefore(this._bellWrapper, actions);
    } else {
      headerInner.appendChild(this._bellWrapper);
    }

    this._badge = this._bellWrapper.querySelector(".av-badge");
  }

  _buildPanel() {
    this._panel = document.createElement("aside");
    this._panel.className = "av-panel";
    this._panel.setAttribute("role", "dialog");
    this._panel.setAttribute("aria-label", "Alertes et synthèse journalière");
    this._panel.setAttribute("aria-hidden", "true");
    this._panel.innerHTML = `
      <div class="av-panel-head">
        <span class="av-panel-title">Alertes et Synthèse</span>
        <button class="av-close" aria-label="Fermer le panneau">✕</button>
      </div>
      <div class="av-section">
        <div class="av-section-label">Synthèse du jour</div>
        <div class="av-synth" id="av-synth">
          <p class="av-empty">En attente de données…</p>
        </div>
      </div>
      <div class="av-section av-section--grow">
        <div class="av-section-label">
          Alertes reçues
          <button class="av-btn-clear" id="av-btn-clear">Tout effacer</button>
        </div>
        <ul class="av-list" id="av-list" role="list">
          <li class="av-empty">Aucune alerte.</li>
        </ul>
      </div>
    `;
    document.body.appendChild(this._panel);
  }

  _buildOverlay() {
    this._overlay = document.createElement("div");
    this._overlay.className = "av-overlay";
    document.body.appendChild(this._overlay);
  }

  _buildToast() {
    this._toast = document.createElement("div");
    this._toast.className = "av-toast";
    this._toast.setAttribute("role", "alert");
    this._toast.setAttribute("aria-live", "assertive");
    document.body.appendChild(this._toast);
  }

  _bindEvents() {
    if (this._bellWrapper) {
      this._bellWrapper.addEventListener("click", () => this._togglePanel());
      this._bellWrapper.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this._togglePanel(); }
      });
    }
    this._panel.querySelector(".av-close").addEventListener("click", () => this._closePanel());
    this._overlay.addEventListener("click", () => this._closePanel());
    document.getElementById("av-btn-clear").addEventListener("click", () => this._clearAll());
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && this._panelOpen) this._closePanel();
    });
  }

  afficher(alertes) {
    if (!alertes || alertes.length === 0) return;
    const heure = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    alertes.forEach(a => this._alertes.unshift({ ...a, heure }));
    this._renderList();
    this._updateBadge();
    this._showToast(alertes);
  }

  renderSynthese(data) {
    this._synthese = data;
    this._renderSynth();
  }


  _renderSynth() {
    const el = document.getElementById("av-synth");
    if (!el || !this._synthese) return;
    const fmt = v => (v === Infinity || v === -Infinity || v == null) ? "—" : `${parseFloat(v).toFixed(1)} °C`;
    const { ext, int } = this._synthese;
    el.innerHTML = `
      <div class="av-synth-card av-synth-ext">
        <span class="av-synth-lbl">Extérieur 🌳</span>
        <div class="av-synth-vals">
          <span class="av-s-min">↓ ${fmt(ext.min)}</span>
          <span class="av-s-max">↑ ${fmt(ext.max)}</span>
        </div>
      </div>
      <div class="av-synth-card av-synth-int">
        <span class="av-synth-lbl">Intérieur 🏠</span>
        <div class="av-synth-vals">
          <span class="av-s-min">↓ ${fmt(int.min)}</span>
          <span class="av-s-max">↑ ${fmt(int.max)}</span>
        </div>
      </div>
    `;
  }

  _renderList() {
    const list = document.getElementById("av-list");
    if (!list) return;
    if (this._alertes.length === 0) {
      list.innerHTML = `<li class="av-empty">Aucune alerte.</li>`;
      return;
    }
    list.innerHTML = this._alertes.map(a => `
      <li class="av-item av-item--${a.type}">
        <span class="av-item-ico" aria-hidden="true">${a.type === "danger" ? "⚠" : "ℹ"}</span>
        <span class="av-item-msg">${this._esc(a.msg)}</span>
        <time class="av-item-t">${a.heure}</time>
      </li>
    `).join("");
  }

  _updateBadge() {
    if (!this._badge) return;
    const n = this._alertes.length;
    this._badge.style.display = n === 0 ? "none" : "";
    this._badge.textContent = n > 99 ? "99+" : n;
    this._badge.setAttribute("aria-label", `${n} alerte${n > 1 ? "s" : ""}`);
  }

  _showToast(alertes) {
    this._toast.textContent = alertes.map(a => a.msg).join(" · ");
    this._toast.classList.add("av-toast--on");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => this._toast.classList.remove("av-toast--on"), 4500);
  }

  _clearAll() {
    this._alertes = [];
    this._renderList();
    this._updateBadge();
  }

  // ── Panneau ──────────────────────────────

  _togglePanel() { this._panelOpen ? this._closePanel() : this._openPanel(); }

  _openPanel() {
    this._panelOpen = true;
    this._panel.classList.add("av-panel--open");
    this._overlay.classList.add("av-overlay--on");
    this._panel.setAttribute("aria-hidden", "false");
    this._panel.querySelector(".av-close").focus();
  }

  _closePanel() {
    this._panelOpen = false;
    this._panel.classList.remove("av-panel--open");
    this._overlay.classList.remove("av-overlay--on");
    this._panel.setAttribute("aria-hidden", "true");
    this._bellWrapper?.focus();
  }


  _esc(str) {
    const d = document.createElement("div");
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }
}