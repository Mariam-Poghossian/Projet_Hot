class HistoryModel {
  constructor() {
    this._data = {
      ext: { min: Infinity, max: -Infinity },
      int: { min: Infinity, max: -Infinity }
    };
  }

  /**
   * @param {number} valeurExt
   * @param {number} valeurInt
   */
  update(valeurExt, valeurInt) {
    this._data.ext.min = Math.min(this._data.ext.min, valeurExt);
    this._data.ext.max = Math.max(this._data.ext.max, valeurExt);
    this._data.int.min = Math.min(this._data.int.min, valeurInt);
    this._data.int.max = Math.max(this._data.int.max, valeurInt);
  }

  /** @returns {{ ext: {min:number, max:number}, int: {min:number, max:number} }} */
  getSummary() {
    return this._data;
  }

  reset() {
    this._data = {
      ext: { min: Infinity, max: -Infinity },
      int: { min: Infinity, max: -Infinity }
    };
  }
}