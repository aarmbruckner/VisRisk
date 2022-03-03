import IJSONParseableModel from "../IJSONParseableModel";
import GridAxisModel from "../GridAxisModel/GridAxisModel";

export default class GridConfigModel implements IJSONParseableModel {

    private xAxisModel :GridAxisModel;
    private yAxisModel :GridAxisModel;
    private colorStops : any;
    private riskRectangleColor : any;
 
    constructor (xAxisModel : GridAxisModel, yAxisModel : GridAxisModel)
    {
        this.xAxisModel = xAxisModel;
        this.yAxisModel = yAxisModel;
    }

    LoadFromJSONModel(jsonModel: any) {
        for (const property in jsonModel) {
            this[property]= jsonModel[property];
        }
    }

    GetJSONModel(basicModel) {
        return JSON.parse(JSON.stringify(this));
    }

    public GetXAxisModel(){
        return this.xAxisModel;
    }
    
    public SetXAxisModel(xAxisModel:GridAxisModel)
    {
        this.xAxisModel = xAxisModel;
    }

    public GetYAxisModel(){
        return this.yAxisModel;
    }
    
    public SetYAxisModel(yAxisModel:GridAxisModel)
    {
        this.yAxisModel = yAxisModel;
    }
    
 
}
 