import IStorageHandler from "./IStorageHandler";
import GraphEventHandler from "../MxGraph/Eventhandling/GraphEventHandler";
import Calculator from "../Calculator/Calculator";
import SurveyNodeModel from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyNodeModel";

import SurveyListModel from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyListModel";
import SurveyListConfigController from "../Configuration/SurveyListConfigController";
import { SurveyModelCollection } from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel";
import UserModel, { UserModelCollection } from "../../Models/ModelTemplates/Configuration/UserConfig/UserModel";
import SurveyModel from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel";
import SurveyProgressModel from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyProgressModel";

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

    public GetAllSurveys(userId)
    {
        let surveys =  [];

        if(userId)
        {
            let dbUser =  Meteor.users.findOne(
                {"_id":userId}
            );
            let userRoles = Roles.getRolesForUser(dbUser);
            if(userRoles.includes("admin"))
            {
                surveys =  SurveyModelCollection.find(
                    {}, { sort: [['name', 'asc']]}
                ).fetch();
            }
            else
            {
                let  allSurveys =  SurveyModelCollection.find(
                    {}, { sort: [['name', 'asc']]}
                ).fetch();

                allSurveys.map((survey)  => {
                    if(survey.participants.includes(userId) || survey.administrators.includes(userId))
                    {
                        surveys.push(survey);
                    }
                });
 
            }
        }
        else
        {
            surveys =  SurveyModelCollection.find().fetch();
        }

        let castSurveys = [];
        for(let survey of surveys)
        {
            let castSurvey = new SurveyModel();
            castSurvey.LoadFromJSONModel(survey);
            castSurveys.push(castSurvey);
        }
     
        return castSurveys;
    }

    public GetAllSurveysAsDict(userId)
    {
        let surveyDict  = this.GetAllSurveys(userId);
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
        let users = Meteor.users.find({"profile.allowedParticipantSurveys":surveyId }).fetch();
        return users;

    }

    public async SetSurveyProgressOfUser(userId,surveyId,userProgress)
    {
        let survey =  SurveyModelCollection.findOne({"_id":surveyId});
        if(!survey)
            return false;

        let castSurvey = null;
        if(survey)
        {
            castSurvey = new SurveyModel();
            castSurvey.LoadFromJSONModel(survey);
        }

        let lastSurveyNodeId = null;
        if(!castSurvey.surveyProgress)
        {
            castSurvey.surveyProgress = new Map<string,SurveyProgressModel>(); 
        }
 
        castSurvey.surveyProgress.set(userId,userProgress);

        await this.SaveSurvey(castSurvey);
        return true;
    }

    public async SetLastSurveyNodeOfUser(userId,surveyId,surveyNodeId)
    {
        let survey =  SurveyModelCollection.findOne({"_id":surveyId});
        if(!survey)
            return false;

        let castSurvey = null;
        if(survey)
        {
            castSurvey = new SurveyModel();
            castSurvey.LoadFromJSONModel(survey);
        }

        if(!castSurvey.surveyProgress)
        {
            castSurvey.surveyProgress = new Map<string,SurveyProgressModel>(); 
        }

        let userProgress = new SurveyProgressModel(userId,surveyNodeId,userId,0);
        castSurvey.surveyProgress.set(userId,userProgress);

        await this.SaveSurvey(castSurvey);
        return true;
    }

    public GeSurveyProgressOfUser(userId,surveyId)
    {
        let survey = SurveyModelCollection.findOne({"_id":surveyId});
      
        let castSurvey = null;
        if(survey)
        {
          castSurvey = new SurveyModel();
          castSurvey.LoadFromJSONModel(survey);
        }
        else
        {
          return null;
        }

        let userProgress =  null;
        if(castSurvey && castSurvey.surveyProgress)
        {
           userProgress = castSurvey.surveyProgress.get(userId);
        }
        return userProgress;
    }

    public GetLastSurveyNodeOfUser(userId,surveyId)
    {
      let survey = SurveyModelCollection.findOne({"_id":surveyId});
      
      let castSurvey = null;
      if(survey)
      {
        castSurvey = new SurveyModel();
        castSurvey.LoadFromJSONModel(survey);
      }
      else
      {
        return null;
      }

      let lastSurveyNodeId = null;

      if(castSurvey && castSurvey.surveyProgress)
      {
        let userProgress = castSurvey.surveyProgress.get(userId);
        if(userProgress)
            lastSurveyNodeId = userProgress.lastSurveyNodeId;
      }

      let lastSurveyNode = null;
 
      if(lastSurveyNodeId || lastSurveyNodeId>= 0)
      {
        castSurvey.surveyNodes.forEach((surveyNode) => {
            if(surveyNode._id == lastSurveyNodeId)
            {
                lastSurveyNode =  surveyNode;
            }
        })
      }

      return lastSurveyNode;
    }

    public GetNextSurveyNodeOfUser(userId,surveyId) 
    {
        let lastSurveyNode = this.GetLastSurveyNodeOfUser(userId,surveyId);
 
        let survey = SurveyModelCollection.findOne({"_id":surveyId});
      
        let castSurvey = null;
        if(survey)
        {
          castSurvey = new SurveyModel();
          castSurvey.LoadFromJSONModel(survey);
        }

        if(!castSurvey)
        {
            return null;
        }
        let surveyNodes = Array.from(castSurvey.surveyNodes.values());
        if(!surveyNodes || surveyNodes.length <=0)
        {
            return null;
        }

        let nextSurveyNode = null;
        if(lastSurveyNode)
        {
          let index = 0;
          let lastSurveyNodeIndex = -1;
          let nextSurveyNodeIndex = -1;
          castSurvey.surveyNodes.forEach((surveyNode) => {
              if(lastSurveyNodeIndex >= 0 && nextSurveyNodeIndex <0)
              {
                nextSurveyNodeIndex = index;
              }
              if(surveyNode._id == lastSurveyNode._id)
              {
                lastSurveyNodeIndex = index;
              }
              index++;
          });

          if(nextSurveyNodeIndex >= 0)
          {
            nextSurveyNode = surveyNodes[nextSurveyNodeIndex];
          }
        }
        else
        {
            nextSurveyNode = surveyNodes[0];
        }

        let dbUser =  Meteor.users.findOne(
            {"_id":userId}
        );
        let userRoles = Roles.getRolesForUser(dbUser);
        if(userRoles.includes("admin"))
        {
            nextSurveyNode = surveyNodes[0];
        }

        return nextSurveyNode;
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

    GetAllUsersExclUsersOfSurvey(survey:SurveyModel)
    {
        let users =  Meteor.users.find().fetch();
        let filteredUsers = [];
        if(survey)
        {
            let participants = Meteor.users.find({"profile.allowedParticipantSurveys":survey._id }).fetch();
            let admins =  Meteor.users.find({"profile.allowedAdminSurveys": survey._id  }).fetch();

            for (let user of users) {
                let userFound = false;
                for (let participant of participants) {
                    if(participant._id==user._id)
                    {
                        userFound= true;
                        break;
                    }
                }
    
                if(userFound!= true)
                {
                    for (let admin of admins) {
                        if(admin._id==user._id)
                        {
                            userFound= true;
                            break;
                        }
                    }
                }
                if(userFound==false)
                {
                    filteredUsers.push(user);
                }
            }
        }
    
        return filteredUsers;
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

    public GetDefaultSurvey(userId)
    {

        let survey = null;
        
        if(!userId)
        {
            survey = SurveyModelCollection.findOne(
                {}, { sort: [['name', 'asc']]}
            );
        }
        else
        {
            let allSurveys = this.GetAllSurveys(userId);
            if(allSurveys && allSurveys.length>0)
            {
                survey = allSurveys[0];
            }
        }

        let castSurvey =  null;
        if(survey)
        {
            castSurvey = new SurveyModel();
            castSurvey.LoadFromJSONModel(survey);
        }
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
        let response =   await Meteor.callPromise('UserModel.Methods.Save',user);
        return response;
    }

    public async CreateUserByEmail(surveyId,email,userName, isAdmin){
        let user =   await Meteor.callPromise('UserModel.Methods.CreateUserByEmail',surveyId,email,userName,isAdmin);
        return user;
    }

    public async InviteAllUsersToSurvey(surveyId,customText,surveyParams)
    {
        let allAvailableUsers = this.GetAllUsers();
        

        for await (let availUser of allAvailableUsers) {
            let user =   await Meteor.callPromise('UserModel.Methods.InviteUserToSurvey',surveyId,availUser.username,false);
        }

        //let response =   await Meteor.callPromise('UserModel.Methods.InviteAllUsersToSurvey',surveyId,customText,surveyParams);
        return true;
    }

    public async InviteUserToSurvey(surveyId,userName, isAdmin){
        let user =   await Meteor.callPromise('UserModel.Methods.InviteUserToSurvey',surveyId,userName,isAdmin);
        return user;
    }

    public async ResetUserProgress(userId,surveyId){
        this.SetLastSurveyNodeOfUser(userId,surveyId,null);

        //user =   await Meteor.callPromise('UserModel.Methods.ResetUserProgress',surveyId,user);
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
    
    public async GetLoginToken(user,insertWhenExisting)
    {
        let loginToken = await Meteor.callPromise('UserModel.Methods.GetLoginToken',user,insertWhenExisting);
        return loginToken;
    }

    public async InsertLoginTokenToUser(user,stampedLoginToken,insertWhenExisting)
    {
        let returnValue =   await Meteor.callPromise('UserModel.Methods.InsertLoginTokenToUser',user,stampedLoginToken,insertWhenExisting);
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