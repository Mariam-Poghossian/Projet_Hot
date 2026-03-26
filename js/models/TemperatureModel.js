/**
 * TemperatureModel
 * Stocke la dernière valeur, le min et le max du jour pour chaque capteur.
 *
 * Format reçu depuis le serveur :
 * {
 *   "HotHotHot": "Api v1.0",
 *   "capteurs": [
 *     { "type": "Thermique", "Nom": "interieur", "Valeur": "16.5", "Timestamp": 1774513947 },
 *     { "type": "Thermique", "Nom": "exterieur", "Valeur": "10.2", "Timestamp": 1774513947 }
 *   ]
 * }
 */
class TemperatureModel {
  constructor() {
    // Clé = Nom du capteur (ex: "interieur", "exterieur")
    // Valeur = { current, min, max, timestamp }
    this._data = {};
  }

  /**
   * Met à jour les données à partir du payload WebSocket brut.
   * @param {object} payload - L'objet JSON reçu du serveur
   * @returns {Array} - Liste des capteurs mis à jour
   */
  update(payload) {
    if (!payload.capteurs || !Array.isArray(payload.capteurs)) {
      throw new Error("Payload invalide : champ 'capteurs' manquant ou non-tableau");
    }

    const updated = [];

    for (const capteur of payload.capteurs) {
      const nom       = capteur.Nom;
      const valeur    = parseFloat(capteur.Valeur);
      const timestamp = capteur.Timestamp * 1000; // Unix → ms pour Date

      if (isNaN(valeur)) {
        console.warn(`[TemperatureModel] Valeur non numérique pour ${nom} :`, capteur.Valeur);
        continue;
      }

      if (!this._data[nom]) {
        // Premier enregistrement pour ce capteur
        this._data[nom] = {
          current:   valeur,
          min:       valeur,
          max:       valeur,
          timestamp: timestamp,
        };
      } else {
        // Mise à jour
        const entry = this._data[nom];
        entry.current   = valeur;
        entry.timestamp = timestamp;
        if (valeur < entry.min) entry.min = valeur;
        if (valeur > entry.max) entry.max = valeur;
      }

      updated.push({ nom, ...this._data[nom] });
    }

    return updated;
  }

  /**
   * Retourne les données d'un capteur par son nom.
   * @param {string} nom - "interieur" ou "exterieur"
   * @returns {{ current, min, max, timestamp } | null}
   */
  get(nom) {
    return this._data[nom] ?? null;
  }

  /**
   * Retourne tous les capteurs.
   * @returns {Array<{ nom, current, min, max, timestamp }>}
   */
  getAll() {
    return Object.entries(this._data).map(([nom, data]) => ({ nom, ...data }));
  }

  /**
   * Remet le min/max à zéro (à appeler au changement de jour).
   */
  resetDailyStats() {
    for (const nom in this._data) {
      const entry = this._data[nom];
      entry.min = entry.current;
      entry.max = entry.current;
    }
  }
}
