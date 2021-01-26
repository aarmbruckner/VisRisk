import { Meteor } from 'meteor/meteor';


  
import { BrowserPolicy } from 'meteor/browser-policy-common';
import ServerContainerBuilder from './Container/ServerContainerBuilder.js';
import  cors  from 'cors';


logger = null;
LogFile = null;
AuthenthicationHandlerInstance = null;
ModuleAccessInstance = null;

Meteor.startup(() => {


  let httpPort = 3000;
  let httpsPort = 443;

/*   if(Meteor.settings.public.appInfo.serverUrl)
  {
    httpPort = Meteor.settings.public.appInfo.serverUrl;
  }

  if(Meteor.settings.public.appInfo.httpsServerUrl)
  {
    httpsPort = Meteor.settings.public.appInfo.httpsServerUrl;
  } */

/*   BrowserPolicy.content.allowScriptOrigin('http://localhost:'+httpPort);  
  BrowserPolicy.content.allowScriptOrigin('https://localhost:'+httpsPort);   */

  BrowserPolicy.content.allowScriptOrigin(Meteor.settings.public.appInfo.serverUrl);   
  BrowserPolicy.content.allowScriptOrigin(Meteor.settings.public.appInfo.httpsServerUrl);    
  BrowserPolicy.content.allowScriptOrigin("http://meteor.local");  

/*   BrowserPolicy.content.allowOriginForAll('http://localhost:'+httpPort);  
  BrowserPolicy.content.allowOriginForAll('https://localhost:'+httpPort);  

  BrowserPolicy.content.allowOriginForAll('http://localhost:'+httpsPort);  
  BrowserPolicy.content.allowOriginForAll('https://localhost:'+httpsPort);  */

  BrowserPolicy.content.allowOriginForAll(Meteor.settings.public.appInfo.serverUrl);   
  BrowserPolicy.content.allowOriginForAll(Meteor.settings.public.appInfo.httpsServerUrl);   

  BrowserPolicy.content.allowOriginForAll("http://meteor.local"); 
  BrowserPolicy.content.allowOriginForAll("https://meteor.local");   


  BrowserPolicy.framing.allowAll();
  BrowserPolicy.content.allowInlineScripts();
  BrowserPolicy.content.allowEval();
  BrowserPolicy.content.allowInlineStyles();
  BrowserPolicy.content.allowFontDataUrl();
  WebApp.rawConnectHandlers.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
  }); 
 
  let containerBuilder = new ServerContainerBuilder();
  containerBuilder.BuildContainer();
  logger.info("Starting Meteor");
 
});

 