import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'meteor/universe:i18n';

var CryptoJS = require("crypto-js");
declare var Meteor: any;
declare var logger: any;

class MailUtils {
  

    constructor() {
        
    }
 
    public static GetLoginUrlFromToken(username,logintoken)
    {
        let serverURL = Meteor.settings.public.appInfo.serverUrl;
        let loginURL = serverURL+"/?username="+username+"&logintoken="+logintoken;
        return loginURL;
    }

}

export default MailUtils;