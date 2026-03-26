class DashboardView {

  _phrase(valeur) {
    if (valeur === null) return "En attente de données…";
    if (valeur > 30) return "🔥 Température élevée — alerte chaleur !";
    if (valeur > 20) return "✅ Température normale";
    if (valeur > 10) return "🌿 Température fraîche";
    return "🥶 Température très basse — alerte froid !";
  }

  _couleur(valeur) {
    if (valeur === null) return "";
    if (valeur > 30) return "card--chaud";
    if (valeur < 5)  return "card--froid";
    return "card--normal";
  }

  /**
   * Met à jour les 2 cartes capteurs.
   * @param {Array<{ nom, current, min, max, timestamp }>} capteurs
   */
  render(capteurs) {
    for (const c of capteurs) {
      const el = document.getElementById(`capteur-${c.nom}`);
      if (!el) continue;

      el.className = `capteur-card ${this._couleur(c.current)}`;

      el.querySelector(".capteur-valeur").textContent = `${c.current.toFixed(1)} °C`;
      el.querySelector(".capteur-phrase").textContent  = this._phrase(c.current);
      el.querySelector(".capteur-min").textContent     = `Min : ${c.min.toFixed(1)} °C`;
      el.querySelector(".capteur-max").textContent     = `Max : ${c.max.toFixed(1)} °C`;
      el.querySelector(".capteur-heure").textContent   =
        new Date(c.timestamp).toLocaleTimeString("fr-FR");
    }
  }
}
