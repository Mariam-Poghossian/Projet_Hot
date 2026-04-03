class AlertModel {
  static check(capteurExt, capteurInt) {
    const alertes = [];

    if (capteurExt.valeur > 35) alertes.push({ type: 'danger',  msg: 'Hot Hot Hot !' });
    if (capteurExt.valeur < 0)  alertes.push({ type: 'danger',  msg: 'Banquise en vue !' });

    if (capteurInt.valeur > 50)      alertes.push({ type: 'danger',  msg: 'Appelez les pompiers ou arrêtez votre barbecue !' });
    else if (capteurInt.valeur > 22) alertes.push({ type: 'warning', msg: 'Baissez le chauffage !' });

    if (capteurInt.valeur < 0)       alertes.push({ type: 'danger',  msg: 'Canalisations gelées, appelez SOS plombier et mettez un bonnet !' });
    else if (capteurInt.valeur < 12) alertes.push({ type: 'warning', msg: 'Montez le chauffage ou mettez un gros pull !' });

    return alertes;
  }
}