import IStorageHandler from "./IStorageHandler";
import UserModel from "../../Models/ModelTemplates/Configuration/UserConfig/UserModel";
import StorageHandlerFactory from '../StorageHandling/StorageHandlerFactory';
import i18n from 'meteor/universe:i18n';
import { Alert } from "antd";

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

    async InviteAllUsersToSurvey(surveyId,customText,surveyParams){
      let response = await this.storageHandlerInstance.InviteAllUsersToSurvey(surveyId,customText,surveyParams);
      return response;
    }

    async InviteUserToSurvey(surveyId,username,isAdmin){
      let user = await this.storageHandlerInstance.InviteUserToSurvey(surveyId,username,isAdmin);
      return user;
    }

    async CreateUserByEmail(surveyId,email,username,isAdmin){
      let user = await this.storageHandlerInstance.CreateUserByEmail(surveyId,email,username,isAdmin);
      return user;
    }

    async ResetUserProgress(userId,surveyId){
      let user = await this.storageHandlerInstance.ResetUserProgress(userId,surveyId);
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

    async SendLoginTokenByEmail(selectedUser,logintoken, survey, customText,surveyParams){
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
        if(survey && survey.name)
        {
          let surveyText =  i18n.getTranslation("common.mails.surveyText");
          surveyText = surveyText + survey.name;
          text = text + surveyText;
        }
      }
 
      let loginUrl = await Meteor.callPromise('MailController.Methods.GetLoginUrlFromToken',username,logintoken,survey,surveyParams);
      text = text + " \n "+ loginUrl;

      let response = await Meteor.callPromise('MailController.Methods.SendEmail',to,from,subject,text);
      return response;

    }
 
    async SubmitNewUser(selectedUser,userDict){
      if(!selectedUser)
        selectedUser = new UserModel(null);  
 
      selectedUser = cloneDeep(selectedUser); 
      delete selectedUser._id;
      
      let userAddResponse =  await this.storageHandlerInstance.SaveUser(selectedUser);
      if(userAddResponse && userAddResponse.message)
      {
        alert(i18n.getTranslation("common.exceptions.userUpdateError"));
        return;
      }
      else
      {
        selectedUser._id = userAddResponse;
      }
   

      userDict = this.InsertUserInDict(selectedUser,userDict);
      selectedUser = cloneDeep(selectedUser); 
 
      return {userDict:userDict,selectedUser:selectedUser};
    }

    async SubmitUserEdit  (selectedUser,userDict)   {
 
      if(!selectedUser)
        selectedUser = new UserModel(null);  

      userDict = this.UpdateUserInDict(selectedUser,userDict);
      
      let userSaveResponse = await this.storageHandlerInstance.SaveUser(selectedUser);
      if(userSaveResponse && userSaveResponse.message)
      {
        alert(i18n.getTranslation("common.exceptions.userUpdateError"));
        return;
      }

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