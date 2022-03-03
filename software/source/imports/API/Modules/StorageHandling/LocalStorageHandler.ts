import IStorageHandler from "./IStorageHandler";
import GraphEventHandler from "../MxGraph/Eventhandling/GraphEventHandler";
import Calculator from "../Calculator/Calculator";
import SurveyNodeModel from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyNodeModel";
import SurveyModel from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel";
import SurveyListModel from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyListModel";
import SurveyListConfigController from "../Configuration/SurveyListConfigController";
 

declare var localStorage: any;

export default class LocalStorageHandler implements IStorageHandler{
    
    public SaveGraphJsonToLog(survey,surveyNode,graphJson)
    {
        let graphLogJSON = localStorage.getItem("graphLogJSON");
        let graphLog = [];
        if(graphLogJSON)
            graphLog = JSON.parse(graphLogJSON);

        if(!graphLog || !Array.isArray(graphLog))
        {
            graphLog = [];
            //return;
        }
        graphLog.push(jsonStr);

        graphLogJSON = JSON.stringify(graphLog);
        localStorage.setItem("graphLogJSON", graphLogJSON);
        return true;
    }
    
    public GetAllSurveys()
    {
        let surveyConfigJSONString = localStorage.getItem("surveyConfig");
        let surveyListModel = null;

        let surveyListConfigController = new  SurveyListConfigController();
        if(typeof surveyConfigJSONString == "undefined" || surveyConfigJSONString == null || !surveyConfigJSONString)
        {
            let surveyConfigJSONModel = Meteor.settings.public.defaultGraphConfigurations.surveyConfig;
            surveyListModel = surveyListConfigController.convertConfigJSONModelToClassModel(surveyConfigJSONModel);
        }
        else
        {
            let surveyConfigJSONModel = JSON.parse(surveyConfigJSONString)
            surveyListModel = surveyListConfigController.convertStorageJSONModelToClassModel(surveyConfigJSONModel);
        }
 
        return surveyListModel;
    }

    public GetDefaultSurvey(userId)
    {
        let surveyListModel = this.GetAllSurveys();
        let defaultSurvey = surveyListModel.GetDefaultSurvey();
        return defaultSurvey;
    }
    
    public SaveSurveyConfig(surveyListModel:SurveyListModel)
    {
        let surveyConfigJSONString = JSON.stringify(surveyListModel);
        localStorage.setItem("surveyConfig", surveyConfigJSONString);
        return true;
    }

    public GetLogGraphsJSON()
    {
        let graphLogJSON = localStorage.getItem("graphLogJSON");
        return graphLogJSON;
    }
 
    public SaveSurvey(survey:SurveyModel)
    {

    }
 
    public GetCombinedLogModel()
    {
        let graphJSONArray = this.GetLogModels();
        let graphArray = [];
        if (typeof graphJSONArray.forEach !== "undefined") { 
            graphJSONArray.forEach(graphJSONArray => {
                let graph = JSON.parse(graphJSONArray);
                graphArray = graphArray.concat(graph);
            });
        }
        return graphArray;
    }

    public GetLogModels()
    {
        let logGraphS = storageHandlerInstance.GetLogGraphsJSON();
        let graphLogArray = [];
        if(logGraphS)
            graphLogArray = JSON.parse(logGraphS);

        return graphLogArray;
    }

    public SetLog(logString:string)
    {
        localStorage.setItem("graphLogJSON", logString);
        return true;
    }

}