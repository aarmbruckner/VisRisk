import IStorageHandler from "./IStorageHandler";
import GraphEventHandler from "../MxGraph/Eventhandling/GraphEventHandler";
import Calculator from "../Calculator/Calculator";
import SurveyNodeModel from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyNodeModel";

import SurveyListModel from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyListModel";
import SurveyListConfigController from "../Configuration/SurveyListConfigController";
import { SurveyModelCollection } from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel";
import UserModel, { UserModelCollection } from "../../Models/ModelTemplates/Configuration/UserConfig/UserModel";
import SurveyModel from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel";

export default class MongoDBStorageHandler implements IStorageHandler{
    
    public GetSurveyById(_id)
    {
        let survey =  SurveyModelCollection.findOne({"_id":_id});
        let castSurvey = null;
        if(survey)
        {
            castSurvey = new SurveyModel();
            castSurvey.LoadFromJSONModel(survey);
        }
     
        return castSurvey;
    }

    public GetAllSurveys()
    {
        let surveys =  SurveyModelCollection.find().fetch();
        let castSurveys = [];
        for(let survey of surveys)
        {
            let castSurvey = new SurveyModel();
            castSurvey.LoadFromJSONModel(survey);
            castSurveys.push(castSurvey);
        }
     
        return castSurveys;
    }

    public GetAllSurveysAsDict()
    {
        let surveyDict  = this.GetAllSurveys();
        if(surveyDict)
        {
          surveyDict = new Map(
            surveyDict.map(x => [x._id, x])
          );
        }   
        else
        {
          surveyDict = new Map ();
        }
        return surveyDict;
    }
    

    public GetAllParticipantsOfSurvey(surveyId)
    {
        let users =  Meteor.users.find({"profile.allowedParticipantSurveys":surveyId }).fetch();
        return users;

    }

    public GetAllAdministratorsOfSurvey(surveyId)
    {
        let users =  Meteor.users.find({"profile.allowedAdminSurveys": surveyId }).fetch();
        return users;
    }
    
    public GetAllUsers()
    {
 
/*         Meteor.subscribe('UserModelCollection'); 
        let users =  UserModelCollection.find().fetch(); */
        let users =  Meteor.users.find().fetch();
        /* let castSurveys = [];
        for(let survey of surveys)
        {
            let castSurvey = new SurveyModel();
            castSurvey.LoadFromJSONModel(survey);
            castSurveys.push(castSurvey);
        } */
     
        return users;
    }

    public GetAllUsersAsDict()
    {
        let usersDict  = this.GetAllUsers();
        if(usersDict)
        {
            usersDict = new Map(
            usersDict.map(x => [x._id, x])
          );
        }   
        else
        {
          surveyDict = new Map ();
        }
        return usersDict;
    }

    public GetDefaultSurvey()
    {
        let survey =  SurveyModelCollection.findOne(
            {}, { sort: [['_id', 'asc']]}
        );

        let castSurvey = new SurveyModel();
        castSurvey.LoadFromJSONModel(survey);
        return castSurvey;
    }

    SaveSurveyConfig(surveyListModel:SurveyListModel)
    {
        let surveyConfigJSONString = JSON.stringify(surveyListModel);
        localStorage.setItem("surveyConfig", surveyConfigJSONString);
        return true;
    }
 
 
    public async SaveSurvey(survey:SurveyModel)
    {
        let jsonSurvey = survey.GetJSONModel();
        let _id =   await Meteor.callPromise('SurveyModel.Methods.Save',jsonSurvey);
        return _id;
    }

    public async SaveUser(user:any)
    {
        let _id =   await Meteor.callPromise('UserModel.Methods.Save',user);
        return _id;
    }

    public async CreateUserByEmail(surveyId,email,userName, isAdmin){
        let user =   await Meteor.callPromise('UserModel.Methods.CreateUserByEmail',surveyId,email,userName,isAdmin);
        return user;
    }

    public async RemoveAdminFromSurvey(surveyId,user){
        user =   await Meteor.callPromise('UserModel.Methods.RemoveUserFromSurvey',surveyId,user,true);
        return user;
    }

    public async RemoveParticipantFromSurvey(surveyId,user){
        user =   await Meteor.callPromise('UserModel.Methods.RemoveUserFromSurvey',surveyId,user,false);
        return user;
    }
    
    public async GetLoginToken(user)
    {
        let loginToken =   await Meteor.callPromise('UserModel.Methods.GetLoginToken',user);
        return loginToken;
    }

    public async InsertLoginTokenToUser(user,stampedLoginToken)
    {
        let returnValue =   await Meteor.callPromise('UserModel.Methods.InsertLoginTokenToUser',user,stampedLoginToken);
        return returnValue;
    }

    public async DeleteSurvey(survey:SurveyModel)
    {
        return await Meteor.callPromise('SurveyModel.Methods.Delete',survey)
    }    

    public async DeleteUser(user:UserModel)
    {
        return await Meteor.callPromise('UserModel.Methods.Delete',user)
    }    
 
 
/*     
    public GetPoolGraph(graph)
    { 
        let logModel = this.GetCombinedLogModel();
        let graphWidth = graph.container.clientWidth;
        let graphHeight = graph.container.clientHeight;
        let poolRectInfo = Calculator.PoolOpinions(logModel,graphWidth,graphHeight);
 
        const graphEventHandler = new GraphEventHandler();
        graphEventHandler.AddNewRiskRectangle(graph,poolRectInfo.GetPosX(),poolRectInfo.GetPosY(),poolRectInfo.GetWidth(),poolRectInfo.GetHeight());
        return graph;
    }
 */
/*     public GetCombinedLogModel()
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
 */
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