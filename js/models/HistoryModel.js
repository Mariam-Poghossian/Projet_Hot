/**
 * HistoryModel
 * Stocke l'historique des relevés de température.
 * Chaque entrée : { nom, valeur, timestamp }
 */
class HistoryModel {
  constructor(maxEntries = 500) {
    this._entries   = [];  // toutes les entrées
    this._maxEntries = maxEntries;
  }

  /**
   * Ajoute des entrées depuis le payload WebSocket brut.
   * @param {object} payload - L'objet JSON reçu du serveur
   */
  add(payload) {
    if (!payload.capteurs || !Array.isArray(payload.capteurs)) return;

    for (const capteur of payload.capteurs) {
      const valeur = parseFloat(capteur.Valeur);
      if (isNaN(valeur)) continue;

      this._entries.push({
        nom:       capteur.Nom,
        valeur:    valeur,
        timestamp: capteur.Timestamp * 1000, // Unix → ms
      });
    }

    // Limite pour éviter une fuite mémoire
    if (this._entries.length > this._maxEntries) {
      this._entries = this._entries.slice(-this._maxEntries);
    }
  }

  /**
   * Retourne les entrées pour un capteur donné.
   * @param {string} nom - Nom du capteur
   * @param {"asc"|"desc"} order - Ordre de tri sur le timestamp
   * @returns {Array<{ nom, valeur, timestamp }>}
   */
  getForCapteur(nom, order = "desc") {
    const filtered = this._entries.filter(e => e.nom === nom);
    return this._sort(filtered, order);
  }

  /**
   * Retourne toutes les entrées.
   * @param {"asc"|"desc"} order
   * @returns {Array<{ nom, valeur, timestamp }>}
   */
  getAll(order = "desc") {
    return this._sort([...this._entries], order);
  }

  /**
   * Retourne le min et le max d'une journée pour un capteur.
   * @param {string} nom - Nom du capteur
   * @param {Date} date  - Le jour voulu
   * @returns {{ min: number|null, max: number|null }}
   */
  getDailyMinMax(nom, date) {
    const start = new Date(date).setHours(0, 0, 0, 0);
    const end   = new Date(date).setHours(23, 59, 59, 999);

    const entries = this._entries.filter(
      e => e.nom === nom && e.timestamp >= start && e.timestamp <= end
    );

    if (entries.length === 0) return { min: null, max: null };

    const valeurs = entries.map(e => e.valeur);
    return {
      min: Math.min(...valeurs),
      max: Math.max(...valeurs),
    };
  }

  // ── Privé ────────────────────────────────────────────────────────────────────

  _sort(arr, order) {
    return arr.sort((a, b) =>
      order === "asc"
        ? a.timestamp - b.timestamp
        : b.timestamp - a.timestamp
    );
  }
}
