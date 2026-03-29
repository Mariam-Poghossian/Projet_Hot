class App {
  constructor() {
    this._initOnglets();
    this._initMVC();
  }

  _initOnglets() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
      });
    });
  }

  _initMVC() {
    const dashboardView   = new DashboardView();
    const alertView       = new AlertView();
    const historyModel    = new HistoryModel();
    const alertController = new AlertController(alertView, historyModel);
    const wsController    = new WebSocketController(dashboardView, alertController);
    new AuthController(); 
  }
}

document.addEventListener('DOMContentLoaded', () => new App());