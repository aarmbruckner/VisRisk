import React  from 'react';
import i18n from 'meteor/universe:i18n';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import { createBrowserHistory } from 'history';
import { Session } from 'meteor/session';
// Containers
import Full from '../imports/ui/containers/Full';
// Views
import Login from '../imports/ui/views/Pages/Login/';
import Register from '../imports/ui/views/Pages/Register/';
import Page404 from '../imports/ui/views/Pages/Page404/';
import Page500 from '../imports/ui/views/Pages/Page500/';
import ClientContainerBuilder from './Container/ClientContainerBuilder';
import requireAuth from './requireAuth';
import Dashboard from '../imports/ui/views/Dashboard/Dashboard';
import { Accounts } from 'meteor/accounts-base';
import StorageHandlerFactory from '../imports/API/Modules/StorageHandling/StorageHandlerFactory';

const history = createBrowserHistory();
const storageHandlerInstance = null;

Meteor.startup(() => {
  let x = Meteor.absoluteUrl();
  //bugfix for localhost bug in meteor.absoluteurl
  let origin = location.origin;

  //Meteor.subscribe('SurveyModelCollection'); 
 
  // options
  let hostURL = Meteor.settings.public.appInfo.httpsServerUrl;
  if (location.protocol !== "https:") {
    hostURL =  Meteor.settings.public.appInfo.serverUrl;
  }

  hostURL = hostURL.replace(/\/?$/, '/');

  i18n.setOptions({
    hostUrl:hostURL
  });
  
  i18n.onChangeLocale( async () => {

    let userId = Session.get('userId');
    let userRoles =  await Meteor.callPromise('AccountController.Methods.GetUserRoles',{user:userId});

    if(!userRoles)
      userRoles = [];
      
    render(
 
      <Router history={history}>
        <Switch>
        {/*   <Route exact path="/login" name="Login Page" component={Full}/> */}
          <Route exact path="/register" name="Register Page" component={Register}/>
          <Route exact path="/404" name="Page 404" component={Page404}/>
          <Route exact path="/500" name="Page 500" component={Page500}/>
 

                <Route path="/login" name="Login Page" render={() => (
                      Session.get('userId') && Roles.userIsInRole(Session.get('userId'), ['loggedin']) ? (
                        <Redirect to="/dashboard"/>
                        ) : (
                        <Route  component={Full} />
                      )
                )}/>  

                <Route path="/resetpassword" name="Login Page" render={() => (
                        <Route  component={Full} />
                )}/>  

 
                <Route path="/dashboard" name="Dashboard" render={() => (
                      Session.get('userId') && Roles.userIsInRole(Session.get('userId'), ['loggedin']) ? (
                        <Route  component={Full} />
                        ) : (
                        <Redirect to="/login"/>
                      )
                )}/>  
                
                <Route  path="/log" name="Dashboard" render={() => (
                  userRoles.includes("admin") ? (
                  <Route  component={Full} />
                  ) : (
                  <Redirect to="/dashboard"/>
                )  )}/>

                <Route  path="/pool" name="Dashboard" render={() => (
                  userRoles.includes("admin") ? (
                  <Route  component={Full} />
                  ) : (
                  <Redirect to="/dashboard"/>
                )  )}/>

                <Route  path="/surveyeditor" name="Dashboard" render={() => (
                  userRoles.includes("admin") ? (
                  <Route  component={Full} />
                  ) : (
                  <Redirect to="/dashboard"/>
                )  )}/>

                <Route  path="/usereditor" name="Dashboard" render={() => (
                  userRoles.includes("admin") ? (
                  <Route  component={Full} />
                  ) : (
                  <Redirect to="/dashboard"/>
                )  )}/>

                <Route  path="/" name="Dashboard" render={() => (
                  userRoles.includes("loggedin") ? (
                  <Route  component={Full} />
                  ) : (
                  <Redirect to="/login"/>
                )  )}/>

          <Route path="/" name="Home" render={() => (
            Session.get('userId') && Roles.userIsInRole(Session.get('userId'), ['loggedin']) ? (
              <Route  component={Full} />
              ) : (
              <Redirect to="/login"/>
            )
          )}/>  
        </Switch>
      </Router>,
 
      document.getElementById('root'));
  }); 
  
  let containerBuilder = new ClientContainerBuilder();
  containerBuilder.BuildContainer();
  
  let logintoken = window.GetUrlParameter('logintoken');
  if(!logintoken)
  {
    logintoken =  window.GetUrlParameter('loginToken');
  }
  Session.set('logintoken', logintoken);

  let surveyId = window.GetUrlParameter('surveyId');
  if(!surveyId)
  {
    surveyId =  window.GetUrlParameter('surveyid');
  }
  Session.set('surveyId', surveyId);

  let username = window.GetUrlParameter('username');
  if(!username)
  {
    username =  window.GetUrlParameter('userName');
  }
  if(username)
  {
    Session.set('username', username);
  }

  let surveyparams = window.GetUrlParameter('surveyparams');
  if(!surveyparams)
  {
    surveyparams =  window.GetUrlParameter('surveyParams');
  }

  if(surveyparams)
  {
    Session.set('surveyparams', surveyparams);
  }
  

  if(logintoken)
  {
 
    Accounts.callLoginMethod({
      methodName: 'WebLogin',
      methodArguments: [
        {
          username: username,
          surveyId:surveyId,
          logintoken: logintoken
        },
      ],
      userCallback: (response) => {
        let userId= Meteor.userId();
        Session.set('userId', userId);
        
        let  storageHandlerInstance = StorageHandlerFactory.GetStorageHandler();
        
        let selectedSurvey = storageHandlerInstance.GetDefaultSurvey(userId);
        if(selectedSurvey)
        {
          let userProgress = storageHandlerInstance.GeSurveyProgressOfUser(userId,selectedSurvey._id);   

          if(userProgress)
          {
            loginCount = 0;
            if(userProgress.loginCount)
              loginCount = parseInt(userProgress.loginCount);
              
            loginCount = loginCount +1;
            userProgress.loginCount = loginCount;
          }
          storageHandlerInstance.SetSurveyProgressOfUser(userId,selectedSurvey._id,userProgress);   
        }
       
        

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
  }
  else{
    Session.set('userId', Meteor.userId());
    Meteor.call('AccountController.Methods.GetUserName',{user: Meteor.userId()}, (error,username) => {
      Session.set('username', username);
    });
    
    let localeSet = Session.get('localeSet');
    if(!localeSet || localeSet == false)
    {
      Meteor.setTimeout(() =>
      {
        i18n.setLocale(Meteor.settings.public.localisation.i18nLanguage);
        Session.set('localeSet', true);
      }, 100); 
    }

  }
  
});
