class HistoryView {
  constructor(historyModel) {
    this._model     = historyModel;
    this._chart     = null;
    this._sortOrder = 'asc';

    this._elMinInt = document.querySelector('#capteur-int-min');
    this._elMaxInt = document.querySelector('#capteur-int-max');
    this._elMinExt = document.querySelector('#capteur-ext-min');
    this._elMaxExt = document.querySelector('#capteur-ext-max');
    this._elCanvas = document.querySelector('#history-chart');

    this._initFilters();
    this._initChart();
  }

  _initFilters() {
    const sortSel   = document.querySelector('#sort-select');
    const periodSel = document.querySelector('#period-select');

    if (sortSel) {
      sortSel.addEventListener('change', () => {
        this._sortOrder = sortSel.value;
        this.render();
      });
    }

    if (periodSel) {
      periodSel.addEventListener('change', () => this.render());
    }
  }

  _initChart() {
    if (!this._elCanvas) return;

    this._chart = new Chart(this._elCanvas, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Intérieur',
            data: [],
            borderColor: '#bd6693',
            backgroundColor: 'rgba(244,114,182,0.08)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
            fill: true
          },
          {
            label: 'Extérieur',
            data: [],
            borderColor: '#39734a',
            backgroundColor: 'rgba(96,165,250,0.08)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400, easing: 'easeInOutQuart' },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label} : ${ctx.raw.toFixed(1)} °C`
            }
          }
        },
        scales: {
          x: {
            ticks: { maxTicksLimit: 10, maxRotation: 30, font: { size: 11 }, color: '#9e8fa5' },
            grid: { color: 'rgba(243,213,232,0.5)' }
          },
          y: {
            ticks: { callback: v => v.toFixed(1) + ' °C', font: { size: 11 }, color: '#9e8fa5' },
            grid: { color: 'rgba(243,213,232,0.5)' }
          }
        }
      }
    });
  }

  _getFilteredData() {
    const periodSel = document.querySelector('#period-select');
    const period    = periodSel ? periodSel.value : 'all';

    let data = [...this._model.getRecords()];

    if (period === 'yesterday') {
      const yStart = new Date(); yStart.setHours(0, 0, 0, 0); yStart.setDate(yStart.getDate() - 1);
      const yEnd   = new Date(yStart); yEnd.setHours(23, 59, 59, 999);
      data = data.filter(r => r.ts >= yStart.getTime() && r.ts <= yEnd.getTime());
    } else if (period === 'week') {
      data = data.filter(r => r.ts >= Date.now() - 7 * 86400000);
    }

    data.sort((a, b) => a.ts - b.ts);
    return data;
  }

  _updateStats(summary) {
    if (this._elMinInt) this._elMinInt.textContent =
      summary.int.min === Infinity    ? '--' : summary.int.min.toFixed(1) + ' °C';
    if (this._elMaxInt) this._elMaxInt.textContent =
      summary.int.max === -Infinity   ? '--' : summary.int.max.toFixed(1) + ' °C';
    if (this._elMinExt) this._elMinExt.textContent =
      summary.ext.min === Infinity    ? '--' : summary.ext.min.toFixed(1) + ' °C';
    if (this._elMaxExt) this._elMaxExt.textContent =
      summary.ext.max === -Infinity   ? '--' : summary.ext.max.toFixed(1) + ' °C';
  }

  _updateChart(data) {
    if (!this._chart) return;

    const MAX_POINTS = 20;
    const windowed   = data.slice(-MAX_POINTS);

    this._chart.data.labels           = windowed.map(r =>
      new Date(r.ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    );
    this._chart.data.datasets[0].data = windowed.map(r => r.interieur);
    this._chart.data.datasets[1].data = windowed.map(r => r.exterieur);
    this._chart.update('active');
  }

  _updateTable(data) {
    const tbody = document.querySelector('#history-tbody');
    if (!tbody) return;

    tbody.innerHTML = data.slice(0, 50).map(r => `
      <tr>
        <td>${new Date(r.ts).toLocaleDateString('fr-FR')}</td>
        <td>${new Date(r.ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
        <td>${r.interieur.toFixed(1)} °C</td>
        <td>${r.exterieur.toFixed(1)} °C</td>
      </tr>
    `).join('');
  }

  render() {
    this._updateStats(this._model.getSummary());
    const data      = this._getFilteredData();
    const tableData = this._sortOrder === 'desc' ? [...data].reverse() : data;
    this._updateChart(data);
    this._updateTable(tableData);
  }
}