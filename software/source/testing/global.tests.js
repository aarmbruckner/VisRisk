import ServerContainerBuilder from '../server/Container/ServerContainerBuilder.js';
import { Meteor } from 'meteor/meteor';
import '../settings.json';
import { expect } from 'chai';

import mlog from 'mocha-logger';

logger = null;
LogFile = null;
AuthenthicationHandlerInstance = null;
ExportManagerInstance = null;
ModuleAccessInstance = null;

if (Meteor.isServer) {

    function resetDatabase(){
    }

    function setUpContainer(){
        let serverContainerBuilder = new ServerContainerBuilder();
        serverContainerBuilder.BuildContainer(); 
    }

    before(function() {
        resetDatabase();
        setUpContainer();
    });

} 