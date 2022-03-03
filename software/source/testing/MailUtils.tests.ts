import { expect } from 'chai';
import mlog from 'mocha-logger';
import MailUtils from '../server/API/Mails/MailUtils';

let mailUtilsInstance = null;

if (Meteor.isServer) {

    beforeEach( () => {
        mailUtilsInstance = new MailUtils();
    });

    describe('MailUtils', function () {
        it('GetLoginUrlFromToken', function (done) {
            let survey = {_id:1};
            let loginURL = MailUtils.GetLoginUrlFromToken("testuser","xxxyyywwwaaabbb",survey,"aaa=a;bbb=b;ccc=c");
            expect(loginURL).to.be.not.empty;
            done();
            mlog.success('loginURL: '+loginURL+" \n");
        })
    })
} 