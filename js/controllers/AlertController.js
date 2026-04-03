class AlertController {
  /**
   * @param {AlertView}    alertView
   * @param {HistoryModel} historyModel
   */
  constructor(alertView, historyModel) {
    this.alertView    = alertView;
    this.historyModel = historyModel;
  }

  /**
   *
   * @param {{ nom: string, valeur: number }} capteurExt
   * @param {{ nom: string, valeur: number }} capteurInt
   */
  analyse(capteurExt, capteurInt) {
    this.historyModel.update(capteurExt.valeur, capteurInt.valeur);

    const alertes = AlertModel.check(capteurExt, capteurInt);
    if (alertes.length > 0) {
      this.alertView.afficher(alertes);
    }

    this.alertView.renderSynthese(this.historyModel.getSummary());
  }
}