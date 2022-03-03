import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'meteor/universe:i18n';
import SurveyModel from '../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel';
import SurveyNodeModel from '../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyNodeModel';
 

var CryptoJS = require("crypto-js");
declare var Meteor: any;
declare var logger: any;

class ExportManager {
  

    constructor() {
        
    }

    public ExportSurveyAsCSV(surveyModel)
    {

        
    }

    public ExportUsersAsJSONBase64(exportBasic)
    {
      let users = Meteor.users.find().fetch();
      
      let objJsonStr = JSON.stringify(users);
      let base64 =  btoa(objJsonStr);

      return base64;
    }


    public ExportSurveyAsJSONBase64(surveyModelInput,exportBasic)
    {
      let surveyModel = new SurveyModel();
      surveyModel.LoadFromJSONModel(surveyModelInput);
      surveyModel = surveyModel.GetJSONModel(exportBasic);
      
      let objJsonStr = JSON.stringify(surveyModel);
      let base64 =  btoa(objJsonStr);

      return base64;
    }

    public ExportSurveyNodeAsJSON(surveyNodeModelJSON,exportBasic)
    {

      let surveyNodeModel = new SurveyNodeModel(null,null,null,null,null);
      surveyNodeModel.LoadFromJSONModel(surveyNodeModelJSON);
      surveyNodeModel = surveyNodeModel.GetJSONModel(exportBasic);
      
      let objJsonStr = JSON.stringify(surveyNodeModel);
      let base64 =  btoa(objJsonStr);
 
      return base64;
    }


    public ExportSurveyNodeAsCSV(surveyModel)
    {

        
    }


 
}

export default ExportManager;