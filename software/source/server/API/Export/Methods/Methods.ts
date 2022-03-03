import SimpleSchema from 'simpl-schema';
import { ProcessViewModel } from '../ProcessViewModel.js';

import { Meteor } from 'meteor/meteor';
import RESTTransmitHandler from '../../../../../../server/API/REST/RESTTransmitHandler.js';
import i18n from 'meteor/universe:i18n';
import { SurveyModelCollection } from '../../../imports/API/Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel.js';
import { Logger } from 'meteor/ostrio:logger';
import MiscUtils from '../../../imports/API/Modules/Utilities/MiscUtils.js';
 
declare var logger: any;

declare var ExportManagerInstance: any;

Meteor.methods({
  'ExportManager.Methods.ExportSurveyAsCSV' (surevyModel) {
    try{  
      return ExportManagerInstance.ExportSurveyAsCSV(surevyModel);
    }
    catch(error)
    {
        let errorOutPut = "error during ExportManager.Methods.ExportCSV: "+error.message+" "+error.stack;
        logger.error(errorOutPut);

        return error;
    }
  },
  'ExportManager.Methods.ExportSurveyAsJSON' (surevyModel) {
    try{  
      return ExportManagerInstance.ExportSurveyAsJSON(surevyModel);
    }
    catch(error)
    {
        let errorOutPut = "error during ExportManager.Methods.ExportSurveyAsJSON: "+error.message+" "+error.stack;
        logger.error(errorOutPut);

        return error;
    }
  },
  'ExportManager.Methods.ExportSurveyNodeAsCSV' (surevyModel) {
    try{  
      return ExportManagerInstance.ExportSurveyNodeAsCSV(surevyModel);
    }
    catch(error)
    {
        let errorOutPut = "error during ExportManager.Methods.ExportSurveyNodeAsCSV: "+error.message+" "+error.stack;
        logger.error(errorOutPut);

        return error;
    }
  },
  'ExportManager.Methods.ExportSurveyNodeAsJSON' (surevyModel) {
    try{  
      ExportManagerInstance.ExportSurveyNodeAsJSON(surevyModel);
    }
    catch(error)
    {
        let errorOutPut = "error during ExportManager.Methods.ExportSurveyNodeAsJSON: "+error.message+" "+error.stack;
        logger.error(errorOutPut);

        return error;
    }
  }   

});  
    
 
  