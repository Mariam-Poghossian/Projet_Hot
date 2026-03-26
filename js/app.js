const temperatureModel = new TemperatureModel();
const historyModel     = new HistoryModel();


const dashboardView = new DashboardView();

const dataController = new WebSocketController((payload) => {
  temperatureModel.update(payload);
  historyModel.add(payload);
  const capteurs = temperatureModel.getAll();
  dashboardView.render(capteurs);
});

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});