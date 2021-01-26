import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/dburles:factory';
import { faker } from 'meteor/dfischer:faker';

class NodeModelCollection extends Mongo.Collection {
 
}

export const NodeModel = new NodeModelCollection('NodeModel');

 
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('NodeModel', function NodeModelPublication() {
    return PlantModel.find();
  });
}
 
// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
NodeModel.publicFields = {
};

NodeModel.searchFields = {
};
 

