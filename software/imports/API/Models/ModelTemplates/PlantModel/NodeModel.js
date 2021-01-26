import SimpleSchema from './node_modules/simpl-schema';
import { Factory } from './node_modules/meteor/dburles:factory';
import { faker } from './node_modules/meteor/dfischer:faker';
import { ProcessViewElementModel } from '../ProcessViewElementModel/ProcessViewElementModel.js';

class PlantModelCollection extends Mongo.Collection {
 
}


export const PlantModel = new PlantModelCollection('PlantModel');

 
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('PlantModel', function PlantModelPublication() {
    return PlantModel.find();
  });
}

/* if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('PlantModel', function PlantModelPublication() {
    return PlantModel.find();
  });
} */

 
// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
PlantModel.publicFields = {
  shortName: 1,
  longName: 1
};

PlantModel.searchFields = {
  shortName: 1,
  longName: 1
};


Factory.define('plantModel',PlantModel, {
  createdAt: () => new Date(),
  longName: "",
  shortName: ""
});

