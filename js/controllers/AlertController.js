/**
 * AlertController
 * Orchestre : analyse des données → alertes → vue alertes + notifications système.
 */
class AlertController {
  /**
   * @param {AlertView}        alertView
   * @param {HistoryModel}     historyModel
   * @param {NotificationView} notificationView
   */
  constructor(alertView, historyModel, notificationView) {
    this.alertView        = alertView;
    this.historyModel     = historyModel;
    this.notificationView = notificationView;
  }

  /**
   * @param {{ nom: string, valeur: number }} capteurExt
   * @param {{ nom: string, valeur: number }} capteurInt
   */
  analyse(capteurExt, capteurInt) {

    this.historyModel.update(capteurExt.valeur, capteurInt.valeur);

    const alertes = AlertModel.check(capteurExt, capteurInt);

    if (alertes.length > 0) {

      this.alertView.afficher(alertes);

      this.notificationView.notifier(alertes);
    }

    this.alertView.renderSynthese(this.historyModel.getSummary());
  }
}