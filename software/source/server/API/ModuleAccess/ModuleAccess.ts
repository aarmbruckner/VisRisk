import IModuleAccess from '../ModuleAccess/Definition/IModuleAccess.js';
 
declare var Meteor: any;
 
class ModuleAccess implements IModuleAccess {

    constructor( ) {
 
    }

    HasModuleAccess(moduleName:any,params:any) {
        let moduleAccessValue = Meteor.settings.public.moduleAccess[moduleName];
        if(moduleAccessValue === true)
            return true;
        else
            return false;
    }
}

export default ModuleAccess;