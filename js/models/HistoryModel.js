class HistoryModel {
  constructor() {
    this._records = []; // { ts, interieur, exterieur }
    this._data = {
      ext: { min: Infinity, max: -Infinity },
      int: { min: Infinity, max: -Infinity }
    };
  }

  update(valeurExt, valeurInt) {
    this._data.ext.min = Math.min(this._data.ext.min, valeurExt);
    this._data.ext.max = Math.max(this._data.ext.max, valeurExt);
    this._data.int.min = Math.min(this._data.int.min, valeurInt);
    this._data.int.max = Math.max(this._data.int.max, valeurInt);

    this._records.push({
      ts: Date.now(),
      interieur: valeurInt,
      exterieur: valeurExt
    });

    // Garde seulement les 24h glissantes (pour ne pas saturer la mémoire)
    const cutoff = Date.now() - 24 * 3600 * 1000;
    this._records = this._records.filter(r => r.ts >= cutoff);
  }

  getSummary() {
    return this._data;
  }

  getRecords() {
    return this._records;
  }

  reset() {
    this._records = [];
    this._data = {
      ext: { min: Infinity, max: -Infinity },
      int: { min: Infinity, max: -Infinity }
    };
  }
}