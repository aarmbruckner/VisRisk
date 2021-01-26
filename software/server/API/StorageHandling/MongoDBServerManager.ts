import SimpleSchema from 'simpl-schema';
import { ProcessViewModel } from '../ProcessViewModel.js';

import { Meteor } from 'meteor/meteor';
import RESTTransmitHandler from '../../../../../../server/API/REST/RESTTransmitHandler.js';
import i18n from 'meteor/universe:i18n';
import { SurveyModelCollection } from '../../../imports/API/Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel.js';
import { Logger } from 'meteor/ostrio:logger';
import MiscUtils from '../../../imports/API/Modules/Utilities/MiscUtils.js';
 
declare var logger: any;
Meteor.methods({
  'SurveyModel.Methods.Save' (jsonSurvey) {
    try{  

        logger.info("starting SurveyModel.Methods.Save");

          let dbSurvey =  SurveyModelCollection.findOne(
            {_id:jsonSurvey._id}, { sort: [['_id', 'asc']]}
          );
 
          if(!dbSurvey)
          {
 
            delete jsonSurvey._id;
            return  SurveyModelCollection.insert(
              jsonSurvey
            );
            
          }
          else
          {
            
          SurveyModelCollection.update({_id:jsonSurvey._id}, {$set:jsonSurvey});
          return jsonSurvey._id;
        }
 
    }
    catch(error)
    {
        let errorOutPut = "error during SurveyModel.Methods.Save: "+error.message+" "+error.stack;
        logger.error(errorOutPut);

        return error;
    }
  },
  'SurveyModel.Methods.Delete' (survey) {
    try{  
        SurveyModelCollection.remove(
          {_id:survey._id}
        );
        return true;
    }
    catch(error)
    {
        return error;
    }
  },
  'SurveyModel.Methods.GetAll' () {
    try{  
        let surveys =  SurveyModelCollection.find().fetch();
        return surveys;
    }
    catch(error)
    {
        return error;
    }
  } ,
  'UserModel.Methods.GetLoginToken' (user) {
    try{  
      const stampedLoginToken = Accounts._generateStampedLoginToken();
      logger.info(" UserModel.Methods.GetLoginToken: user._id:"+user._id+" stampedLoginToken: "+stampedLoginToken);
      return stampedLoginToken;
    }
    catch(error)
    {
        return error;
    }
  },
  'UserModel.Methods.InsertLoginTokenToUser' (user,stampedLoginToken) {
    try{  

/*       let dbUser =  Meteor.users.findOne(
        {_id:user._id}, { sort: [['_id', 'asc']]}
      );

      if(dbUser && dbUser.services &&  dbUser.services.resume && dbUser.services.loginTokens 
        && dbUser.services.loginTokens.length>0)
      {
        Meteor.users.update({_id:dbUser._id}, {$set:
          {
            'services.loginTokens':[]
          }});
      } */
      logger.info(" Accounts._insertLoginToken: user._id:"+user._id+" stampedLoginToken: "+stampedLoginToken);
      Accounts._insertLoginToken(user._id, stampedLoginToken);
      return true;
    }
    catch(error)
    {
        return error;
    }
  },
  'UserModel.Methods.Delete' (user) {
    try{

        if(!user || !user._id)
          return false;

        Meteor.users.remove(
          {_id:user._id}
        );
 
        let adminSurveys =  SurveyModelCollection.find({"administrators": user._id }).fetch();
        if(adminSurveys)
        {
          for(let adminSurvey of adminSurveys)
          {
  
            let administrators = adminSurvey.administrators;
  
            for( let i = 0; i < administrators.length; i++){ 
              if (administrators[i] === user._id) { 
              administrators.splice(i, 1); 
              }
            }
  
            SurveyModelCollection.update({_id:adminSurvey._id}, {$set:
              {
              'administrators': administrators
              }});
  
          }
        }

        logger.info("UserModel.Methods.Delete: user._id "+user._id);
        let participantSurveys =  SurveyModelCollection.find({"participants": user._id }).fetch();
        logger.info("UserModel.Methods.Delete:participantSurveys "+participantSurveys.length);

        if(participantSurveys)
        {
          for(let participantSurvey of participantSurveys)
          {
  
            let participants = participantSurvey.participants;
  
            for( let i = 0; i < participants.length; i++){ 
              if (participants[i] === user._id) { 
                participants.splice(i, 1); 
              }
            }
  
            SurveyModelCollection.update({_id:participantSurvey._id}, {$set:
              {
              'participants': participants
              }});
          }
        }
        

        return true;
    }
    catch(error)
    {
        return error;
    }
  },
  'UserModel.Methods.CreateUserByEmail' (surveyId,email,userName,isAdmin) {
    try{  
      
        if(!surveyId || !email)
        {
          logger.info("UserModel.Methods.CreateUserByEmail surveyId or Email not set: surveyId "+surveyId+" email"+email);
          return false;
        }

        let allowedAdminSurveys =  [];
        let allowedParticipantSurveys = [];

        let dbUser =  Meteor.users.findOne(
          {"emails.address":email}, { sort: [['_id', 'asc']]}
        );

        if(dbUser)
        {
          allowedAdminSurveys = dbUser.profile.allowedAdminSurveys;
          allowedParticipantSurveys = dbUser.profile.allowedParticipantSurveys;

          if(isAdmin === true)
          { 
            if(!allowedAdminSurveys.includes(surveyId))
            {
              allowedAdminSurveys.push(surveyId);
            }
          }
          else{
            if(!allowedParticipantSurveys.includes(surveyId))
            {
              allowedParticipantSurveys.push(surveyId);
            }
          }

          Meteor.users.update({_id:dbUser._id}, {$set:
            {
              'profile.allowedAdminSurveys': allowedAdminSurveys,
              'profile.allowedParticipantSurveys': allowedParticipantSurveys
            }});

          if(typeof userName != undefined && userName)
          {
            Meteor.users.update({_id:dbUser._id}, {$set:
              {
                'username': userName
              }});
          }

        }

        if(!dbUser)
        {

          if(typeof userName == undefined || !userName)
          {
            userName = email.split("@");
            userName = userName[0];
            userName = userName+"_rand_"+MiscUtils.MakeId(5);
          }

          logger.info("UserModel.Methods.CreateUserByEmail Accounts.createUser: username: "+userName+" email: "+email);

          let dbUserId = Accounts.createUser({
            username: userName,
            email : email,
            password : MiscUtils.MakeId(30),
            profile  : {
              "allowedAdminSurveys":allowedAdminSurveys,
              "allowedParticipantSurveys":allowedParticipantSurveys
            }
          });

          dbUser =  Meteor.users.findOne(
            {"_id":dbUserId}, { sort: [['_id', 'asc']]}
          );

          let roles = ['loggedin','guest'];
          if(isAdmin){
            roles =  ['admin','loggedin','guest'];
          }

          Roles.addUsersToRoles(dbUserId,roles);

        }

        if(dbUser)
        {
          let survey = SurveyModelCollection.findOne(
            {"_id":surveyId}, { sort: [['_id', 'asc']]}
          );

          if(!survey.administrators)
          {
            survey.administrators = [];
          }

          if(!survey.participants)
          {
            survey.participants = [];
          }

          let administrators = survey.administrators;
          let participants = survey.participants;

        

          if(isAdmin === true && administrators)
          { 
            if(!administrators.includes(dbUser._id))
            {
              administrators.push(dbUser._id);
            }
          }
          else{
            if(!participants.includes(dbUser._id) && participants)
            {
              participants.push(dbUser._id);
            }
          }

          SurveyModelCollection.update({_id:surveyId}, {$set:
          {
            'administrators': administrators,
            'participants': participants
          }});
        }
        return dbUser;
    }
    catch(error)
    {
      let errorOutPut = "error during UserModel.Methods.CreateUserByEmail: "+error.message+" "+error.stack;
      logger.error(errorOutPut);
      return error;
    }
  },
 
  'UserModel.Methods.RemoveUserFromSurvey' (surveyId,user,isAdmin) {
    try{  
      
        if(!surveyId || !user)
        {
          logger.info("UserModel.Methods.RemoveUserFromSurvey surveyId or user not set: surveyId "+surveyId+" user"+user);
          return false;
        }

        let allowedAdminSurveys =  [];
        let allowedParticipantSurveys = [];

        let dbUser =  Meteor.users.findOne(
          {"_id":user._id}, { sort: [['_id', 'asc']]}
        );

        if(dbUser)
        {
          allowedAdminSurveys = dbUser.profile.allowedAdminSurveys;
          allowedParticipantSurveys = dbUser.profile.allowedParticipantSurveys;

          if(isAdmin === true)
          { 
            for( let i = 0; i < allowedAdminSurveys.length; i++){ 
              if ( allowedAdminSurveys[i] === surveyId) { 
                allowedAdminSurveys.splice(i, 1); 
              }
            }
          }
          else{
            for( let i = 0; i < allowedParticipantSurveys.length; i++){ 
              if ( allowedParticipantSurveys[i] === surveyId) { 
                allowedParticipantSurveys.splice(i, 1); 
              }
            }
          }

          Meteor.users.update({_id:dbUser._id}, {$set:
            {
              'profile.allowedAdminSurveys': allowedAdminSurveys,
              'profile.allowedParticipantSurveys': allowedParticipantSurveys
            }});
        }

        

        if(dbUser)
        {
          let survey = SurveyModelCollection.findOne(
            {"_id":surveyId}, { sort: [['_id', 'asc']]}
          );

          
          if(!survey.administrators)
          {
            survey.administrators = [];
          }

          if(!survey.participants)
          {
            survey.participants = [];
          }
          
          let administrators = survey.administrators;
          let participants = survey.participants;
          
          if(isAdmin === true)
          { 
            for( let i = 0; i < administrators.length; i++){ 
              if (administrators[i] === dbUser._id) { 
                administrators.splice(i, 1); 
              }
            }
          }
          else{
            for( let i = 0; i < participants.length; i++){ 
              if (participants[i] === dbUser._id) { 
                participants.splice(i, 1); 
              }
            }
          }

          SurveyModelCollection.update({_id:surveyId}, {$set:
          {
            'administrators': administrators,
            'participants': participants
          }});
        }
        return dbUser;
    }
    catch(error)
    {
      let errorOutPut = "error during UserModel.Methods.CreateUserByEmail: "+error.message+" "+error.stack;
      logger.error(errorOutPut);
      return error;
    }
  },

  'UserModel.Methods.Save' (clientUser) {
    try{  

        logger.info("starting UserModel.Methods.Save");

        let dbUser = null;
        if(clientUser._id)
          dbUser =  Meteor.users.findOne(
            {_id:clientUser._id}, { sort: [['_id', 'asc']]}
          );
 
        if(!dbUser)
        {

          let dbUserId = Accounts.createUser({
            username: clientUser.username,
            email : clientUser.emails[0].address,
            password : clientUser.userpassword,
            profile  : {
                //publicly visible fields like firstname goes here
            }
          });
          Roles.addUsersToRoles(dbUserId, clientUser.roles);
          
        }
        else
        {
            
          Meteor.users.update({_id:dbUser._id}, {$set:
          {
            'username': clientUser.username,
            'email' : clientUser.emails[0].address,
            'emails[0].address' : clientUser.emails[0].address,
            'profile': clientUser.profile,
            'roles':clientUser.roles
          }});

          if(clientUser.userpassword)
          {
            Accounts.setPassword(dbUser._id,clientUser.userpassword);
          }
          return dbUser._id;
        }
 
    }
    catch(error)
    {
        let errorOutPut = "error during UserModel.Methods.Save: "+error.message+" "+error.stack;
        logger.error(errorOutPut);

        return error;
    }
  }
});  
    
 
  