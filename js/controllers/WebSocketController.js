/*

Version TEST, avec VALEUUR DEFINI CAR API DOWN

*/


class WebSocketController {
  constructor(dashboardView, alertController) {
    this.wsUrl          = "wss://ws.hothothot.dog:9502";
    this.apiUrl = "https://localhost/api";
    this.dashboardView  = dashboardView;
    this.alertController = alertController;

    this._temperatureModel = new TemperatureModel();

    this._socket        = null;
    this._pollingTimer  = null;
    this._retryTimer    = null;
    this._usingFallback = false;

    this._connectWS();
  }

  _handlePayload(payload) {
    if (!payload.capteurs || !Array.isArray(payload.capteurs)) return;

    this._temperatureModel.update(payload);
    this.dashboardView.render(this._temperatureModel.getAll());

    const ext = payload.capteurs.find(c => c.Nom === "exterieur");
    const int = payload.capteurs.find(c => c.Nom === "interieur");
    if (ext && int) {
      this.alertController.analyse(
        { nom: ext.Nom, valeur: parseFloat(ext.Valeur) },
        { nom: int.Nom, valeur: parseFloat(int.Valeur) }
      );
    }
  }

  _connectWS() {
    console.log("[WS] Tentative →", this.wsUrl);

    const timeout = setTimeout(() => {
      console.warn("[WS] Timeout — bascule API HTTP");
      this._socket.close();
      this._startPolling();
    }, 5000);

    this._socket = new WebSocket(this.wsUrl);

    this._socket.addEventListener("open", () => {
      clearTimeout(timeout);
      console.log("[WS] Connecté");
      this._stopPolling();
      this._stopRetry();
      this._usingFallback = false;
    });

    this._socket.addEventListener("message", (event) => {
      try {
        this._handlePayload(JSON.parse(event.data));
      } catch (err) {
        console.error("[WS] Données invalides :", err);
      }
    });

    this._socket.addEventListener("error", () => {
      clearTimeout(timeout);
      if (!this._usingFallback) {
        console.warn("[WS] Erreur — bascule API HTTP");
        this._startPolling();
      }
    });

    this._socket.addEventListener("close", () => {
      clearTimeout(timeout);
      if (!this._usingFallback) {
        console.warn("[WS] Fermé — bascule API HTTP");
        this._startPolling();
      }
    });
  }

  _startPolling() {
    if (this._usingFallback) return;
    this._usingFallback = true;
    console.log("[API] Polling démarré");
    this._fetchOnce();
    this._pollingTimer = setInterval(() => this._fetchOnce(), 5000);
    this._retryTimer   = setInterval(() => {
      if (this._socket) this._socket.close();
      this._connectWS();
    }, 30000);
  }

  _stopPolling() {
    clearInterval(this._pollingTimer);
    this._pollingTimer = null;
    this._usingFallback = false;
  }

  _stopRetry() {
    clearInterval(this._retryTimer);
    this._retryTimer = null;
  }

async _fetchOnce() {
  try {
    const response = await fetch(this.apiUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log("[API] Données reçues :", data);
    this._handlePayload(data);
  } catch (err) {
    console.warn("[SIM] API indisponible, données simulées");
    this._handlePayload({
      "HotHotHot": "Api v1.0",
      "capteurs": [
        {
          "type": "Thermique",
          "Nom": "interieur",
          "Valeur": (18 + Math.random() * 10).toFixed(1),
          "Timestamp": Math.floor(Date.now() / 1000)
        },
        {
          "type": "Thermique",
          "Nom": "exterieur",
          "Valeur": (5 + Math.random() * 15).toFixed(1),
          "Timestamp": Math.floor(Date.now() / 1000)
        }
      ]
    });
  }
}

  disconnect() {
    this._stopPolling();
    this._stopRetry();
    if (this._socket) this._socket.close();
  }
}


/* 
VERSION POUR L'API !!!!!


class WebSocketController {
  constructor(onData) {
    this.wsUrl   = "wss://ws.hothothot.dog:9502";
    this.apiUrl  = "https://api.hothothot.dog/";
    this.onData  = onData;

    this._socket        = null;
    this._pollingTimer  = null;
    this._retryTimer    = null;
    this._usingFallback = false;

    this._connectWS();
  }

  _connectWS() {
    // Si déjà en fallback et qu'un retry tourne, on ne recrée pas de nouveau retry
    console.log("[WS] Tentative →", this.wsUrl);

    const timeout = setTimeout(() => {
      console.warn("[WS] Timeout — bascule API HTTP");
      this._socket.close();
      this._startPolling();
    }, 5000);

    this._socket = new WebSocket(this.wsUrl);

    this._socket.addEventListener("open", (event) => {
      clearTimeout(timeout);
      console.log("[WS] Connecté ✓");
      this._stopPolling();
      this._stopRetry();
      this._usingFallback = false;
    });

    this._socket.addEventListener("message", (event) => {
      try {
        this.onData(JSON.parse(event.data));
      } catch (err) {
        console.error("[WS] Données invalides :", err);
      }
    });

    this._socket.addEventListener("error", () => {
      clearTimeout(timeout);
      if (!this._usingFallback) {
        console.warn("[WS] Erreur — bascule API HTTP");
        this._startPolling();
      }
    });

    this._socket.addEventListener("close", (event) => {
      clearTimeout(timeout);
      if (!this._usingFallback) {
        console.warn("[WS] Fermé — bascule API HTTP");
        this._startPolling();
      }
    });
  }

  _startPolling() {
    if (this._usingFallback) return; // ← empêche les doublons
    this._usingFallback = true;
    console.log("[API] Polling démarré");
    this._fetchOnce();
    this._pollingTimer = setInterval(() => this._fetchOnce(), 5000);
    // Retry WebSocket une seule fois toutes les 30s
    this._retryTimer = setInterval(() => {
      console.log("[WS] Retry...");
      if (this._socket) this._socket.close();
      this._connectWS();
    }, 30000);
  }

  _stopPolling() {
    clearInterval(this._pollingTimer);
    this._pollingTimer = null;
    this._usingFallback = false;
  }

  _stopRetry() {
    clearInterval(this._retryTimer);
    this._retryTimer = null;
  }

  async _fetchOnce() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      console.log("[API] Données reçues :", data);
      this.onData(data);
    } catch (err) {
      console.error("[API] Erreur :", err.message);
    }
  }

  disconnect() {
    this._stopPolling();
    this._stopRetry();
    if (this._socket) this._socket.close();
  }
}

*/