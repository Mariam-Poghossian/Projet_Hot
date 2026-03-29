class AlertModel {
    static check(capteursExt, capteurInt){
        const alertes = [];

        if (capteursExt>35) alertes.push({type: 'danger', msg: 'Hot Hot Hot !'})    
        if (capteurExt < 0)  alertes.push({ type: 'danger', msg: 'Banquise en vue !' });
        if (capteurInt > 50) alertes.push({ type: 'danger',  msg: 'Appelez les pompiers ou arrêtez votre barbecue !' });
        if (capteurInt > 22) alertes.push({ type: 'warning', msg: 'Baissez le chauffage !' });
        if (capteurInt < 0)  alertes.push({ type: 'danger',  msg: 'Canalisations gelées, appelez SOS plombier et mettez un bonnet!' });
        if (capteurInt < 12) alertes.push({ type: 'warning', msg: 'Montez le chauffage ou mettez un gros pull !' });

        return alertes;

    }
}
