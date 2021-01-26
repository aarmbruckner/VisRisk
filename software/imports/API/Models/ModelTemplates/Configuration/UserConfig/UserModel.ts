import LogInfoModel from "../../LogInfoModel/LogInfoModel";
import CalcConfigModel from "../CalcConfigModel";
import IJSONParseableModel from "../../IJSONParseableModel";
import { Mongo } from 'meteor/mongo';

export default  class UserModel implements IJSONParseableModel  {

    constructor()
    {
     
    }

    private username : string ;
    private email : string ;
    private password : string ;
    private profile : any;
    private _id: string ;
 
    public LoadFromJSONModel(jsonModelS : any)
    {
        this._id = jsonModelS._id;
        this.username = jsonModelS.username;
        this.email = jsonModelS.email;
        this.password = jsonModelS.password;
        this.profile = jsonModelS.profile;
    }

    public GetJSONModel()
    {
        let jsonObject = {
            _id:this._id,
            username:this.username,
            email:this.email,
            password:this.password,
            profile:this.profile
        }  

        return jsonObject;
    }

    public SetId(_id : string)
    {
        this._id = _id;
    }
    
    public GetId()
    {
        return this._id;
    }

    public SetUserName(username : string)
    {
        this.username = username;
    }
    
    public GetUserName()
    {
        return this.username;
    }

    public SetEmail(email : string)
    {
        this.email = email;
    }
    
    public GetEmail()
    {
        return this.email;
    }

    public SetPassword(password : string)
    {
        this.password = password;
    }
    
    public GetPassword()
    {
        return this.password;
    }

    public SetProfile(profile : string)
    {
        this.profile = profile;
    }
    
    public GetProfile()
    {
        return this.profile;
    }
 
}

/* export const UserModelCollection = new Mongo.Collection('UserModelCollection');
if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish("UserModelCollection", function () {
        return Meteor.users.find();
 });
 }   */
 
