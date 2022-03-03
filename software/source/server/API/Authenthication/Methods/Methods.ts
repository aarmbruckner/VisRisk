 
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

//import { ServerSession } from 'erasaur:server-session';

declare var logger: any;
declare var AuthenthicationHandlerInstance: any;

Meteor.methods({
    'AccountController.Methods.WebLogoutCurrentUser' () {
        let logoutResult = "error during WebLogout";
        try {

            let clientMeteorUser = Meteor.user();
            if(!clientMeteorUser)
            return null;

            let username = clientMeteorUser.username;
            let logintoken = clientMeteorUser.profile.logintoken;
            logger.info("trying to log out user username: "+username+" logintoken: "+logintoken);
        
            Meteor.users.update({  username: username}, {$set : { "services.resume.loginTokens" : [],"profile.logintoken": "" }}, {multi:true});
            return true;

        } catch (error) {
            let errorOutPut = "error during WebLogout: "+error.message+" "+error.stack;
            logger.error(errorOutPut);
            return errorOutPut;
        
        } 
        return logoutResult;  
    },
    'AccountController.Methods.GetUserInRole' (params) {
        let userInRole = Roles.userIsInRole(params.user, params.role,params.scope);
        return userInRole;  
    },
    'AccountController.Methods.GetUserRoles' (params) {
        let userRoles = Roles.getRolesForUser(params.user);
        return userRoles;  
    },
    'AccountController.Methods.GetUserName' (params) {
        let dbUser =  Meteor.users.findOne(
            {"_id":params.user}
        );
        let username = "";
        if(dbUser)
            username = dbUser.username;
        return username;  
    },
    'AccountController.Methods.ResetPassword' (params) {
        AuthenthicationHandlerInstance.ResetPassword(params.usernameEmail);
 
    },

    WebLogin(options)
    {
        let loginAttempt = false;
        try {
            // return AuthenthicationHandlerInstance.WebLogin(username,password,options.urlloginToken,this.connection.clientAddress,clientMeteorUser);

            let username = options.username;
            let password = options.password;
            let surveyId = options.surveyId;
            let logintoken = options.logintoken;
            
            let clientAddress = "clientAddress not found"
            if(this.connection)
                clientAddress = this.connection.clientAddress;
   
           const currentUser =  Meteor.users.findOne({"username":username}); 
           if (!currentUser || typeof currentUser == "undefined") {
            logger.info("user not found while login: "+username+" clientAddress: "+clientAddress);
            return false;
           }

           let tokenValid = false;
           
           if(options.logintoken)
           {
            let hashedToken = Accounts._hashLoginToken(logintoken);
            logger.info("loginToken "+logintoken+ " hashedToken: "+hashedToken+" username: "+username);
            if(currentUser && currentUser.services &&  currentUser.services.resume && currentUser.services.resume.loginTokens 
                && currentUser.services.resume.loginTokens.length>0)
              {
            
                for(let storedToken of currentUser.services.resume.loginTokens)
                {
                    if(storedToken.hashedToken == hashedToken || storedToken.hashedToken == logintoken || storedToken.hashedToken == logintoken+"=")
                    {
                       tokenValid = true;
                       logger.info("user with valid token found, trying to login: "+username+" clientAddress: "+clientAddress);
                    }
                }
                
              }

              if(tokenValid==false)
              {
                logger.info("user with invald token found, trying to login with password: "+username+" clientAddress: "+clientAddress);
              }
           }  

           if(tokenValid != true)
           {
            if(!password)
                return false;

            const checkPassword = Accounts._checkPassword(currentUser,password);
            if (checkPassword.error) {
             logger.info("user login failed because of wrong password username: "+username+" clientAddress: "+clientAddress);
             return false;
            }
           }
          
           loginAttempt =  Accounts._attemptLogin(this, 'login', '', {
                type: 'WebLogin',
                userId: currentUser._id
            }); 
            logger.info("user login attempt username: "+username+" loginResult: "+loginAttempt+" clientAddress: "+clientAddress);
            return loginAttempt; 
        } 
        catch (error) {
            let errorOutPut = "error during WebLogin Method: "+error.message+" "+error.stack;
            logger.error(errorOutPut);

            return i18n.getTranslation("common.loginPage.loginFailed");
        } 
        return loginAttempt;  
    } 
 
});  

Accounts.validateLoginAttempt(function (options) {

    if(options.methodName === "login")
    {
        if (options.type === 'WebLogin') {
            return true;
        }
        if(options.type === 'password')
        {
            return true;
        }
        if(options.type === 'resume')
        {
            return true;
        }
        if(options.type === 'TokenLogin')
        {
            return true;
        }
    }

    if (options.error) {
        console.log('login error: ' + options.error);
    }

});