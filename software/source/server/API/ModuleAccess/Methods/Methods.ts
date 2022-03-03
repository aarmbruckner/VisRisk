import { Meteor } from 'meteor/meteor';
declare var ModuleAccessInstance: any;

Meteor.methods({

    'ModuleAccess.Methods.HasModuleAccess' (params) {

        try{  
            //this.unblock();
            return ModuleAccessInstance.HasModuleAccess(params.moduleName,params);
        }
        catch(error)
        {
            return error;
        }
      
    } 
      
});
