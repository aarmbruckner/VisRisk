import IStorageHandler from "../../imports/API/Modules/StorageHandling/IStorageHandler";
import StorageHandlerFactory from "../../imports/API/Modules/StorageHandling/StorageHandlerFactory";
import i18n from 'meteor/universe:i18n';

declare var storageHandlerInstance:IStorageHandler;
declare var  window: any;

class ClientContainerBuilder  {
  updateCountdownTimeout :any;
  nextRetry : any;
  firstConnection: any;
 

  constructor() {
    this.nextRetry = new ReactiveVar(0);
  }

  BuildContainer(params)
  {
    this.applyIEFixes();
    this.setUpStorageHandler();
    this.applySubscriptions();
    this.applyConnectionObserve();
    this.applyGlobalFunctions();
    this.makeGlobalEventListeners();
  }

  makeGlobalEventListeners()
  {
    Accounts.onResetPasswordLink(function(token, done) {
      Accounts.callLoginMethod({
        methodName: 'WebLogin',
        methodArguments: [
          {
            logintoken: token
          },
        ],
        userCallback: (response) => {
          let userId= Meteor.userId();
          Session.set('userId', userId);
          Meteor.call('AccountController.Methods.GetUserName',{user:userId}, (error,username) => {
            Session.set('username', username);
          });

          Meteor.setTimeout(() =>
          {
            i18n.setLocale(Meteor.settings.public.localisation.i18nLanguage);
            if(!userId ||  (response && response.userOutPut))
            {
              if(response && response.userOutPut)
              {
                alert(response.userOutPut);
              }
              else
              {
                alert(i18n.getTranslation("common.loginPage.loginFailed"));
              }
              
            }
            else{
              this.props.history.push('/dashboard');
            }
            
          }, 100); 
        }
      });  
    });
  
  }
 
  setUpStorageHandler()
  {
    storageHandlerInstance = StorageHandlerFactory.GetStorageHandler();
  }

  applySubscriptions()
  {
    Meteor.subscribe('SurveyModelCollection'); 
    Meteor.subscribe('UserModelCollection'); 
  }

  applyGlobalFunctions()
  {
    window.FindReact = function(dom) {
      let key = Object.keys(dom).find(key=>key.startsWith("__reactInternalInstance$"));
      let internalInstance = dom[key];
      if (internalInstance == null) return null;

      if (internalInstance.return) { // react 16+
          return internalInstance._debugOwner
              ? internalInstance._debugOwner.stateNode
              : internalInstance.return.stateNode;
      } else { // react <16
          return internalInstance._currentElement._owner._instance;
      }
    }

    var ReactDOM = require('react-dom');
    (function () {
        var _render = ReactDOM.render;
        ReactDOM.render = function () {
            return arguments[1].react = _render.apply(this, arguments);
        };
    })();

    window.GetUrlParameter = function(sParam){
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };
 
  }

  applyConnectionObserve()
  {
     
    this.firstConnection = true;
    Tracker.autorun(() => {
      if (Meteor.status().status === 'waiting') {
        this.updateCountdownTimeout = Meteor.setInterval(() => {
          this.nextRetry.set(Math.round((Meteor.status().retryTime - (new Date()).getTime()) / 1000));
        }, 1000);
      } else {
        this.nextRetry.set(0);
        Meteor.clearInterval(this.updateCountdownTimeout);
      }
  
      if (!Meteor.status().connected && Meteor.status().status !== 'offline' && Meteor.status().retryCount > 0) {
        console.log("Connection to server has been LOST!  status: "+Meteor.status().status);
        //Meteor.reconnect();
      } else {
        console.log("Connection to server has been RESTORED! status: "+Meteor.status().status);
        // put subscription logic here
      }
    });
  
    Meteor.connection._stream.on('reset', function () {
      console.log("connection reset");
      if(this.firstConnection === false)
      {
    /*     if(Meteor.settings.public.remoteData.reloadPageAfterConnectionReset && Meteor.settings.public.remoteData.reloadPageAfterConnectionReset === true)
        {
          //DDP.connect("ws://127.0.0.1:61234/api/v1/ddp")
          console.log("performing page reload after connection reset");
          window.location.reload();
        }
        else
        { */
          console.log("performing hard meteor reconnect!");
          Meteor.reconnect();
      // }
      }
      this.firstConnection = false;
    });
 
  
  }
 
  applyIEFixes()
  {
    //fix for object.entries support in IE and edge <14
    if (!Object.entries)
    Object.entries = function( obj ){
      var ownProps = Object.keys( obj ),
          i = ownProps.length,
          resArray = new Array(i); // preallocate the Array
      while (i--)
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
  
      return resArray;
    };
  }

}

export default ClientContainerBuilder;