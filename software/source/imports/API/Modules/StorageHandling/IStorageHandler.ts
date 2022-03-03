import SurveyListModel from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyListModel";
import SurveyModel from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel";
import SurveyNodeModel from "../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyNodeModel";

export default interface IStorageHandler {
    SaveGraphJsonToLog(survey:SurveyModel,surveyNode:SurveyNodeModel,graphJson:string);
    GetLogGraphsJSON();
    GetLogModels();
    GetCombinedLogModel();
    asyncSaveSurvey(survey:SurveyModel);
    DeleteSurvey(survey:SurveyModel);
    GetDefaultSurvey(userId:string);
    GetAllSurveys(userId);
    GetAllUsers();
    GetAllUsersExclUsersOfSurvey(survey:SurveyModel);
    GetSurveyById(_id);
    GetAllSurveysAsDict(userId);
    GetAllUsersAsDict();
    SetLog(logString :string);
    SaveSurveyConfig(surveyListModel:SurveyListModel);
    SaveSurvey(survey:SurveyModel);
    SaveUser(user:any);
    GetLastSurveyNodeOfUser(userId,surveyId);
    GeSurveyProgressOfUser(userId,surveyId);
    GetNextSurveyNodeOfUser(userId,surveyId);
    SetLastSurveyNodeOfUser(userId,surveyId,surveyNodeId);
    SetSurveyProgressOfUser(userId,surveyId,userProgress);
    GetLoginToken(user:any,insertWhenExisting:boolean);
    InsertLoginTokenToUser(user:any,stamedLoginToken:string,insertWhenExisting:boolean);
    DeleteUser(user:any);
    CreateUserByEmail(surveyId,email,userName,isAdmin);
    InviteUserToSurvey(surveyId,userName,isAdmin);
    InviteAllUsersToSurvey(surveyId,customText,surveyParams);
}