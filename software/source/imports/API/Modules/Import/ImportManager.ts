import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'meteor/universe:i18n';
import SurveyModel from '../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel';
import SurveyNodeModel from '../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyNodeModel';
import StorageHandlerFactory from '../StorageHandling/StorageHandlerFactory';
import i18n from 'meteor/universe:i18n';

var CryptoJS = require("crypto-js");
declare var Meteor: any;
declare var logger: any;

class ImportManager {
  

    constructor() {
        
    }

    public async ImportUsersJson(usersJson)
    {
      let response = {message:"",error:""};
      try{
        let parsedJson = JSON.parse(usersJson);
        let storageHandlerInstance = StorageHandlerFactory.GetStorageHandler();


        if(Array.isArray(parsedJson))
        {
          for(let importUser of parsedJson)
          {
            let emailAdress = importUser.email;
            if(!emailAdress)
              emailAdress = importUser.emails[0].address;
            await storageHandlerInstance.CreateUserByEmail(null,emailAdress,importUser.username,false);
          }
        }
        else{
          let emailAdress = parsedJson.email;
          if(!emailAdress)
            emailAdress = parsedJson.emails[0].address;
          await storageHandlerInstance.CreateUserByEmail(null,emailAdress,parsedJson.username,false);
        }
     
      }
      catch(error)
      {
        response.message=i18n.getTranslation("common.exceptions.importError");
        response.error=error;
      }
      return response;
    }


 
}

export default ImportManager;