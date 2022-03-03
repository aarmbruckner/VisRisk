import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'meteor/universe:i18n';

var CryptoJS = require("crypto-js");
declare var Meteor: any;
declare var logger: any;

class AuthenthicationHandler {
  

    constructor() {
        
    }

    public ResetPassword(usernameEmail)
    {

        let currentUser = Accounts.findUserByEmail(usernameEmail);
        if(!currentUser)
        {
            currentUser = Accounts.findUserByUsername(usernameEmail);
        }

        if(currentUser)
        {
            Accounts.sendResetPasswordEmail(currentUser._id);
        }
        //emailAddress = selectedUser.emails[0].address;
    }

}

export default AuthenthicationHandler;