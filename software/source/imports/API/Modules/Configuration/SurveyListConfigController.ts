import SurveyListModel from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyListModel";


export default class SurveyListConfigController  {
        
    public convertConfigJSONModelToClassModel(surveyConfigJSONModel : any)
    {
        if(!surveyConfigJSONModel)
            return null;
        let surveyListModel = new SurveyListModel(null);
        surveyListModel.LoadFromJSONModel(surveyConfigJSONModel);
        return surveyListModel;   
    }

    public convertStorageJSONModelToClassModel(surveyConfigJSONModel : any)
    {
        if(!surveyConfigJSONModel)
            return null;
        let surveyListModel = new SurveyListModel(null);
        surveyListModel.LoadFromJSONModel(surveyConfigJSONModel);
        return surveyListModel;   
    }


 }
  