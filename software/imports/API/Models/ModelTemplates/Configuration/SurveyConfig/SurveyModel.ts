import LogInfoModel from "../../LogInfoModel/LogInfoModel";
import CalcConfigModel from "../CalcConfigModel";
import SurveyNodeModel from "./SurveyNodeModel";
import IJSONParseableModel from "../../IJSONParseableModel";
import { Mongo } from 'meteor/mongo';


export default  class SurveyModel implements IJSONParseableModel  {

    constructor()
    {
     
    }

    private administrators : any;
    private participants : any;
    private surveyNodes : Map<number,SurveyNodeModel>;
    private name : string ;
    private description : string ;
    private _id: string ;
 
   
    public LoadFromJSONModel(jsonModelS : any)
    {
        this.administrators = [];
        this.participants = [];
        this.surveyNodes = new Map<number,SurveyNodeModel>();
        this._id = jsonModelS._id;
        this.name = jsonModelS.name;
        this.description = jsonModelS.description;

        if(jsonModelS.surveyNodes)
        {

        
            jsonModelS.surveyNodes.forEach((surveyNodeJSON) => {
                let surveyNode = new SurveyNodeModel(null,null,null,null,1);
                surveyNode.LoadFromJSONModel(surveyNodeJSON);
                this.surveyNodes.set(surveyNode.GetId(),surveyNode);
            })
 
           
        }
    }

    public GetJSONModel()
    {
        let jsonObject = {
            _id:this._id,
            description:this.description,
            name:this.name,
            surveyNodes:[],
            administrators:[],
            participants:[]
        }  

        if(this.surveyNodes)
        {
            let newSurveyNodes = [];
          /*   for (const [key, surveyNode] of Object.entries(this.surveyNodes)) {
                newSurveyNodes.push(surveyNode.GetJSONModel());
            }; */

            Array.from(this.surveyNodes.values()).map(surveyNode=> {
                newSurveyNodes.push(surveyNode.GetJSONModel());
            });
            jsonObject.surveyNodes  =newSurveyNodes;
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

    public SetDescription(description : string){
        this.description = description;
    }
    
    public GetDescription(){
        return this.description;
    }
    
    public SetName(name : string){
        this.name = name;
    }
    
    public GetName(){
        return this.name;
    }

    public SetParticipants( participants)
    {
        this.participants = participants;
    }
    
    public GetParticipants()
    {
        return this.participants;
    } 

    public SetAdministrators( administrators)
    {
        this.administrators = administrators;
    }
    
    public GetAdministrators()
    {
        return this.administrators;
    } 

    public SetSurveyNodeDict( nodes : Map<number,SurveyNodeModel> )
    {
        this.surveyNodes = nodes;
    }
    
    public GetSurveyNodeDict()
    {
        return this.surveyNodes;
    }
    
    
}

export const SurveyModelCollection = new Mongo.Collection('SurveyModelCollection');
if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('SurveyModelCollection', function publication() {
      return SurveyModelCollection.find();
    });
 }
 
