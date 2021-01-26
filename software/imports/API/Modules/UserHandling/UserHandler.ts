import IStorageHandler from "./IStorageHandler";
import UserModel from "../../Models/ModelTemplates/Configuration/UserConfig/UserModel";
import StorageHandlerFactory from '../StorageHandling/StorageHandlerFactory';
import i18n from 'meteor/universe:i18n';

var cloneDeep = require('lodash.clonedeep');

export default class UserHandler {
      
    storageHandlerInstance:any;

    constructor() {
      this.storageHandlerInstance = StorageHandlerFactory.GetStorageHandler();
    }

    UpdateUserInDict(selectedUser,userDict)
    {
      userDict.set(selectedUser._id,selectedUser);
      return userDict;  
    }
  
    InsertUserInDict(selectedUser,userDict)
    {
      userDict.set(selectedUser._id,selectedUser);
      return userDict;
    }
    
    async CreateUserByEmail(surveyId,email,username,isAdmin){
      let user = await this.storageHandlerInstance.CreateUserByEmail(surveyId,email,username,isAdmin);
      return user;
    }

    async RemoveAdminFromSurvey(surveyId,user){
      user = await this.storageHandlerInstance.RemoveAdminFromSurvey(surveyId,user,true);
      return user;
    }

    async RemoveParticipantFromSurvey(surveyId,user){
      user = await this.storageHandlerInstance.RemoveParticipantFromSurvey(surveyId,user,false);
      return user;
    }

    async SendLoginTokenByEmail(selectedUser,logintoken, surveyName, customText){
      let username = selectedUser.username;
      let emailAddress = null;
      if(selectedUser.emails && selectedUser.emails.length>0)
      {
        emailAddress = selectedUser.emails[0].address;
      }
      else{
        alert(i18n.getTranslation("common.exceptions.mailSendError"));
        return;
      }

      let from =  Meteor.settings.public.mail.tokenMailAdress;
      let subject = i18n.getTranslation("common.modals.userModal.loginTokenSubject");
      let to = username+" <"+emailAddress+">"; 
  
      let text =  i18n.getTranslation("common.mails.defaultLoginTokenEmailText");
      if(customText)
      {
        text = customText;
      }
      else
      {
        if(surveyName)
        {
          let surveyText =  i18n.getTranslation("common.mails.surveyText");
          surveyText = surveyText + surveyName;
          text = text + surveyText;
        }
      }
 
      let loginUrl = await Meteor.callPromise('MailController.Methods.GetLoginUrlFromToken',username,logintoken);
      text = text + " \n "+ loginUrl;

      let response = await Meteor.callPromise('MailController.Methods.SendEmail',to,from,subject,text);
      return response;

    }
 
    async SubmitNewUser(selectedUser,userDict){
      if(!selectedUser)
        selectedUser = new UserModel(null);  
 
      selectedUser = cloneDeep(selectedUser); 
      delete selectedUser._id;
      
      selectedUser._id = await this.storageHandlerInstance.SaveUser(selectedUser);

      userDict = this.InsertUserInDict(selectedUser,userDict);
      selectedUser = cloneDeep(selectedUser); 
 
      return {userDict:userDict,selectedUser:selectedUser};
    }

    async SubmitUserEdit  (selectedUser,userDict)   {
 
      if(!selectedUser)
        selectedUser = new UserModel(null);  

      userDict = this.UpdateUserInDict(selectedUser,userDict);
      
      await this.storageHandlerInstance.SaveUser(selectedUser);
      selectedUser = cloneDeep(selectedUser); 
      return {userDict:userDict,selectedUser:selectedUser};
 
    }

    CancelUserEdit  (selectedUser,oldSelectedUser,userDict)  {
      if(!oldSelectedUser)
        return;

      oldSelectedUser = cloneDeep(oldSelectedUser);
      userDict = this.UpdateUserInDict(oldSelectedUser,userDict);
      oldSelectedUser = cloneDeep(oldSelectedUser);
      selectedUser = cloneDeep(selectedUser); 
      return {userDict:userDict,selectedUser:selectedUser};
    }

    async DeleteUser   (user,selectedUser,userDict)  {
 
      if(!selectedUser)
        selectedUser = new UserModel(null);  
      
      if(!userDict)
        return;

      userDict.delete(user._id);

      await this.storageHandlerInstance.DeleteUser(selectedUser);
      if(selectedUser && selectedUser._id == user._id)
      {
        selectedUser = null;
        if(userDict  && userDict.size>0)
        {
          let userList = Array.from(userDict.values());
          selectedUser = userList[0];
  
        } 
      }
      if(selectedUser)
        selectedUser = cloneDeep(selectedUser); 
  
      return {userDict:userDict,selectedUser:selectedUser};
    }
}