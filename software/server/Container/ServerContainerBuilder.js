 import i18n from 'meteor/universe:i18n';
import { Logger } from 'meteor/ostrio:logger';
import { LoggerFile } from 'meteor/ostrio:loggerfile';

import { Accounts } from 'meteor/accounts-base';
import SurveyModel, {SurveyModelCollection } from '../../imports/API/Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel';
import UserModel, {UserModelCollection } from '../../imports/API/Models/ModelTemplates/Configuration/UserConfig/UserModel';
import AuthenthicationHandler from '../API/Authenthication/server/AuthenthicationHandler';
import ModuleAccess from '../API/ModuleAccess/ModuleAccess';
 

class ServerContainerBuilder  {
 
  constructor() {
 
  }

  BuildContainer(params)
  {  
    try{
 
     Meteor.publish("UserModelCollection", function () {
            return Meteor.users.find();
     });
 
      this.buildLoggerEnviroment();
      logger.info("started logging!");
      this.buildAuthenticationEnviroment(new AuthenthicationHandler());
      this.buildModuleAccessEnviroment(new ModuleAccess());
      this.buildUserStatusLog();
      this.buildLocalisation();
      this.seedUsers();

    }
    catch (e)
    {
      logger.error("error while building container: ", e);
      throw e;
    }
    
  }

  buildAuthenticationEnviroment(authenthicationHandler)
  {
    AuthenthicationHandlerInstance = authenthicationHandler;
  }
 

  buildUserStatusLog()
  {
    UserStatus.events.on("connectionLogout", function(fields) {
      logger.info("new client connected: ipAddr:"+fields.ipAddr);
    });
    UserStatus.events.on("connectionLogin", function(fields) {
      logger.info("client disconnected: ipAddr:"+fields.ipAddr);
    });
  }

  buildModuleAccessEnviroment(moduleAccess)
  {
    ModuleAccessInstance = moduleAccess//new ModuleAccess();
  }
 

  buildLocalisation()
  {
    i18n.setLocale(Meteor.settings.public.localisation.i18nLanguage);
  }

  seedUsers()
  {

    let adminUserId = null;
    
    if(!Meteor.users.findOne({username: "admin"}))
    {
      adminUserId = Accounts.createUser({
        username: "admin",
        email : "admin@admin.com",
        password : "admin",
        profile  : {
            //publicly visible fields like firstname goes here
        }
      });
    }
    else
    {
      adminUserId = Meteor.users.findOne({username: "admin"})._id;
    }
    Roles.addUsersToRoles(adminUserId, ['admin','loggedin','guest']);
   
    let servicePersonalUserId = null;
    if(!Meteor.users.findOne({username: "testuser"}))
    {
      servicePersonalUserId = Accounts.createUser({
        username: "testuser",
        email : "testuser@testuser.com",
        password : "testuser",
        profile  : {
            //publicly visible fields like firstname goes here
        }
      });
    } 
    else
    {
      servicePersonalUserId = Meteor.users.findOne({username: "testuser"})._id;
    } //X
    Roles.addUsersToRoles(servicePersonalUserId, ['loggedin','guest']);
  }


  buildLoggerEnviroment()
  {
    logger = new Logger();
    LogFile = new LoggerFile(logger, {
        fileNameFormat(time) {
          // Create log-files daily
          return (time.getDate()) + "-" + (time.getMonth() + 1) + "-" + (time.getFullYear())+".log";
        },
        format(time, level, message, data, userId) {
          // Omit Date and hours from messages
          return "[" + level + "] | " + (time.getDate())  +" "+ (time.getHours())+":"+ (time.getMinutes()) + ":" + (time.getSeconds()) + " | \"" + message + "\" | User: " + userId + "\r\n";
        },
        path: Meteor.settings.public.logging.logFileDirectory // Use absolute storage path
      }); 
    // Enable LoggerFile with default settings
    LogFile.enable();

    //log all meteor errors
    const originalMeteorDebug = Meteor._debug;
      Meteor._debug = (message, stack) => {
        const error = new Error(message);
        error.stack = stack;

        logger.error('Meteor Error! message: '+message+ " stackTrace: " +stack, error);
        return originalMeteorDebug.apply(this, arguments);
    };

    //Meteor.log.file.path = '/another/path';

    /* const bound = Meteor.bindEnvironment((callback) => {callback();});
    process.on('uncaughtException', function (err) {
    bound(() => {
        logger.error("Server Crashed!", err);
        console.error(err.stack);
        process.exit(7);
    });
    }; */
  }


}

export default ServerContainerBuilder;