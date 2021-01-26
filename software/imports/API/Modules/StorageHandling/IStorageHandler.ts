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
    GetDefaultSurvey();
    GetAllSurveys();
    GetAllUsers();
    GetSurveyById(_id);
    GetAllSurveysAsDict();
    GetAllUsersAsDict();
    SetLog(logString :string);
    SaveSurveyConfig(surveyListModel:SurveyListModel);
    SaveSurvey(survey:SurveyModel);
    SaveUser(user:any);
    GetLoginToken(user:any);
    InsertLoginTokenToUser(user:any,stamedLoginToken:string);
    DeleteUser(user:any);
    CreateUserByEmail(surveyId,email,userName,isAdmin);
}