import CalcConfigModel from "../../Models/ModelTemplates/Configuration/CalcConfigModel";

export default class CalcConfigController  {
        
    private convertConfigJSONModelToClassModel(calcConfigJSONModel : any)
    {
        if(!calcConfigJSONModel)
            return null;
        let calConfigModel = new CalcConfigModel(
            calcConfigJSONModel.opinionPooling.decimalPointAccuracy,
            calcConfigJSONModel.opinionPooling.epsilon,
            calcConfigJSONModel.dataCorrection.pX,
            calcConfigJSONModel.dataCorrection.pY,
            calcConfigJSONModel.dataCorrection.manualDeltaEnabled,
            calcConfigJSONModel.dataCorrection.deltaXLow,
            calcConfigJSONModel.dataCorrection.deltaXHigh,
            calcConfigJSONModel.dataCorrection.deltaYLow,
            calcConfigJSONModel.dataCorrection.deltaYHigh
            );
        return calConfigModel;   
    }
 
    public GetDefaultConfig()
    {
        let calcConfigJSONModel = Meteor.settings.public.defaultGraphConfigurations.calcConfig;
        let calConfigModel = this.convertConfigJSONModelToClassModel(calcConfigJSONModel);

 
        return calConfigModel;
    }
 
 }
  