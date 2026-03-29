class AlertController {
  constructor(alertView, historyModel) {
    this.alertView    = alertView;
    this.historyModel = historyModel;
  }

  analyse(capteurExt, capteurInt) {
    this.historyModel.update(capteurExt, capteurInt);

    const alertes = AlertModel.check(capteurExt, capteurInt);
    if (alertes.length > 0) {
      this.alertView.afficher(alertes);
    }
  }
}