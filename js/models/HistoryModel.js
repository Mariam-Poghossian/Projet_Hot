class HistoryModel {
    constructor(){
        this.data = {
            ext: {min: Infinity, max: -Infinity},
            int: {min: Infinity, max: -Infinity}
        };
    }
    update(capteurExt, capteurInt){
        this.data.ext.min=Math.min(this.data.ext.min, capteurExt);
        this.data.ext.max=Math.max(this.data.ext.max, capteurExt);
        this.data.int.min=Math.min(this.data.int.min, capteurInt);
        this.data.int.max=Math.max(this.data.int.max, capteurInt); 
    }
    getSummary(){
        return this.data;
    }
    reset(){
        this.data={
            ext: {min: Infinity, max: -Infinity},
            int: {min: Infinity, max: -Infinity}
        }
    }
}