import { Meteor } from 'meteor/meteor';
import { BrowserPolicy } from 'meteor/browser-policy-common';
import ServerContainerBuilder from './Container/ServerContainerBuilder.js';
import  cors  from 'cors';

logger = null;
LogFile = null;
AuthenthicationHandlerInstance = null;
ExportManagerInstance = null;
ModuleAccessInstance = null;

Meteor.startup(() => {


  let httpPort = 3000;
  let httpsPort = 443;

  BrowserPolicy.content.allowScriptOrigin(Meteor.settings.public.appInfo.serverUrl);   
  BrowserPolicy.content.allowScriptOrigin(Meteor.settings.public.appInfo.httpsServerUrl);    
  BrowserPolicy.content.allowScriptOrigin("http://meteor.local");  

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

 