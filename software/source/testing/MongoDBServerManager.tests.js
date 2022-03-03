import { expect } from 'chai';
import mlog from 'mocha-logger';
import AuthenthicationHandler from '../server/API/Authenthication/server/AuthenthicationHandler';
import { SurveyModelCollection } from '../imports/API/Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel.js';

if (Meteor.isServer) {
    describe('MongoDBServerManager', function () {
        it('SurveyModel.Methods.GetAll Empty', function (done) {
            let surveys = SurveyModelCollection.find().fetch();
            expect(surveys).to.be.empty;
            done();
           // mlog.success('trustToken: '+trustToken+" \n");
        })
    })
} 