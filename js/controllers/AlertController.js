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
    // 1. Mise à jour historique min/max
    this.historyModel.update(capteurExt.valeur, capteurInt.valeur);

    // 2. Détection des alertes
    const alertes = AlertModel.check(capteurExt, capteurInt);

    if (alertes.length > 0) {
      // 3a. Affichage dans le panneau + toast
      this.alertView.afficher(alertes);

      // 3b. Notification système cliquable
      this.notificationView.notifier(alertes);
    }

    // 4. Synthèse journalière (toujours rafraîchie)
    this.alertView.renderSynthese(this.historyModel.getSummary());
  }
}