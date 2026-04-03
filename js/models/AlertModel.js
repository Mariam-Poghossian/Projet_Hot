class AlertModel {
  /**
   * @param {{ nom: string, valeur: number }} capteurExt
   * @param {{ nom: string, valeur: number }} capteurInt
   * @returns {Array<{ type: 'danger'|'warning', msg: string }>}
   */
  static check(capteurExt, capteurInt) {
    const alertes = [];
    const ext = capteurExt.valeur;
    const int = capteurInt.valeur;

    if (ext > 35) alertes.push({ type: "danger",  msg: "Hot Hot Hot !" });
    if (ext < 0)  alertes.push({ type: "danger",  msg: "Banquise en vue !" });
    if (int > 50) alertes.push({ type: "danger",  msg: "Appelez les pompiers ou arrêtez votre barbecue !" });
    if (int < 0)  alertes.push({ type: "danger",  msg: "Canalisations gelées, appelez SOS plombier et mettez un bonnet !" });
    if (int > 22) alertes.push({ type: "warning", msg: "Baissez le chauffage !" });
    if (int < 12) alertes.push({ type: "warning", msg: "Montez le chauffage ou mettez un gros pull !" });

    return alertes;
  }
}