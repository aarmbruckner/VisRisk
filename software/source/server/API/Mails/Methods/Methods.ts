 
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

//import { ServerSession } from 'erasaur:server-session';

declare var logger: any;
declare var AuthenthicationHandlerInstance: any;

import { Logger } from 'meteor/ostrio:logger';
import MailUtils from '../MailUtils';
declare var logger: any;

Meteor.methods({
    'MailController.Methods.SendEmail' (to, from, subject, text) {
        let mailResult = "error during SendEmail";
        try {
            // Make sure that all arguments are strings.
            //check([to, from, subject, text], [String]);

            // Let other method calls from the same client start running, without
            // waiting for the email sending to complete.
           // to = "admin <aarmbruckner@gmail.com>";

            this.unblock();
            logger.info("Sending email to: <"+to+"> from: <"+from+"> subject: <"+subject+"> ");
            Email.send({ to, from, subject, text });
             
            return true;

        } catch (error) {
            let errorOutPut = "error during SendEmail: "+error.message+" "+error.stack;
            logger.error(errorOutPut);
            return errorOutPut;
        
        } 
    },
    'MailController.Methods.GetLoginUrlFromToken' (username,logintoken,survey,surveyParams) {
        try {
            let loginUrl = MailUtils.GetLoginUrlFromToken(username,logintoken,survey,surveyParams);
            return loginUrl;

        } catch (error) {
            let errorOutPut = "error during GetLoginUrlFromToken: "+error.message+" "+error.stack;
            logger.error(errorOutPut);
            return errorOutPut;
        } 
    }
});