import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'meteor/universe:i18n';

var CryptoJS = require("crypto-js");
declare var Meteor: any;
declare var logger: any;

class AuthenthicationHandler {
  

    constructor() {
        
    }

    /* public WebLogin(username,password,urlloginToken,clientAddress,clientMeteorUser)
    {
        
        try {
            if(!username && !password && !urlloginToken)
            {
                logger.error("error while login: no login info provided");
                return false;
            }
   
            const currentUser =  Meteor.users.findOne({"username":username});
            if (!currentUser || typeof currentUser == "undefined") {
                logger.error("error while login: no user found");
                return false;
            }

            const checkPassword = Accounts._checkPassword(currentUser,password);
            if (checkPassword.error) {
                logger.error("error while login: password incorrect");
                return false;
            }  
            logger.error("currentUser"+currentUser._id);
            let success = Accounts._attemptLogin(currentUser, 'login', '', {
                type: 'WebLogin',
                userId: currentUser._id
            });   
            logger.info("user login attempt username: "+username+" loginResult: "+success);
            return success
          
          } catch (error) {
            let errorOutPut = "error during WebLogin: "+error.message+" "+error.stack;
            logger.error(errorOutPut);
            return false
        } 
    } */
   
/*     public WebLogout(clientMeteorUser,clientAddress)
    {

        if(!clientMeteorUser)
            return null;

        let username = clientMeteorUser.username;
        let urlloginToken = clientMeteorUser.profile.urlloginToken;
        logger.info("trying to log out user username: "+username+" urlloginToken: "+urlloginToken);
       
        Meteor.users.update({  username: username}, {$set : { "services.resume.loginTokens" : [],"profile.urlloginToken": "" }}, {multi:true});
        return true;
    }  */

   /*  private translateLoginErrorMessage(loginErrorMessage)
    {
        let translatedMessage = loginErrorMessage;
        switch(loginErrorMessage)
        {
            case "LMS_PIN_WRONG":
            case "LMS_PASSWORD_WRONG":
                translatedMessage =  i18n.getTranslation("common.loginPage.loginFailed")+": "+i18n.getTranslation("common.loginPage.wrongPassword");
                break;
            case "LMS_LOGGED_OFF":
                    translatedMessage =  i18n.getTranslation("common.loginPage.loginFailed")+": "+i18n.getTranslation("common.loginPage.sessionLoggedOff");
                break;
            case "LMS_FORBIDDEN":
                translatedMessage = i18n.getTranslation("common.loginPage.loginFailed");
            break;
                
            default:  
                translatedMessage = loginErrorMessage;        
        }
        if(loginErrorMessage && loginErrorMessage.includes("ECONNREFUSED"))
        {
            translatedMessage = i18n.getTranslation("common.loginPage.loginFailed")+": "+i18n.getTranslation("common.loginPage.connectionRefused");
        }
        if(loginErrorMessage && loginErrorMessage.includes("ETIMEDOUT"))
        {
            translatedMessage = i18n.getTranslation("common.loginPage.loginFailed")+": "+i18n.getTranslation("common.loginPage.connectionTimeOut");
        }
        if(loginErrorMessage && loginErrorMessage.includes("failed [403]"))
        {
            translatedMessage = i18n.getTranslation("common.loginPage.loginFailed")+": "+i18n.getTranslation("common.loginPage.accessDenied");
        }
        if(loginErrorMessage && loginErrorMessage.includes("failed [403]"))
        {
            translatedMessage = i18n.getTranslation("common.loginPage.loginFailed")+": "+i18n.getTranslation("common.loginPage.accessDenied");
        }
        
        return translatedMessage;
    }
 */

}

export default AuthenthicationHandler;