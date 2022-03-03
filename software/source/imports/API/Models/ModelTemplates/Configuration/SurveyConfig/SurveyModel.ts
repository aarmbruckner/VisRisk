import SurveyNodeModel from "./SurveyNodeModel";
import SurveyProgressModel from "./SurveyProgressModel";
import IJSONParseableModel from "../../IJSONParseableModel";
import { Mongo } from 'meteor/mongo';


export default  class SurveyModel implements IJSONParseableModel  {

    constructor()
    {
     
    }

    private administrators : any;
    private participants : any;
    private surveyNodes : Map<number,SurveyNodeModel>;
    private surveyProgress : Map<string,SurveyProgressModel>;
    private name : string ;
    private exitURL: string;
    private description : string ;
    private _id: string ;
 
   
    public LoadFromJSONModel(jsonModelS : any)
    {
        this.administrators = [];
        this.participants = [];
        this.surveyNodes = new Map<number,SurveyNodeModel>();
        this.surveyProgress = new Map<string,SurveyProgressModel>(); 

        if(jsonModelS.participants && Array.isArray(jsonModelS.participants))
        {
            this.participants = jsonModelS.participants
        }

        if(jsonModelS.administrators && Array.isArray(jsonModelS.administrators))
        {
            this.administrators = jsonModelS.administrators;
        }

        this._id = jsonModelS._id;
        this.name = jsonModelS.name;
        this.exitURL = jsonModelS.exitURL; 
        this.description = jsonModelS.description;

        if(jsonModelS.surveyNodes)
        {
            jsonModelS.surveyNodes.forEach((surveyNodeJSON) => {
                let surveyNode = new SurveyNodeModel(null,null,null,null,1);
                surveyNode.LoadFromJSONModel(surveyNodeJSON);
                this.surveyNodes.set(surveyNode.GetId(),surveyNode);
            })
        }

        if(jsonModelS.surveyProgress)
        {
            jsonModelS.surveyProgress.forEach((surveyProgressModelJSON) => {
                let surveyProgressModel = new SurveyProgressModel(null,null,null,0);
                surveyProgressModel.LoadFromJSONModel(surveyProgressModelJSON);
                this.surveyProgress.set(surveyProgressModel.GetId(),surveyProgressModel);
            })
        }
    }

    public GetJSONModel(basicModel)
    {
        let jsonObject = {
            _id:this._id,
            exitURL:this.exitURL,
            description:this.description,
            name:this.name,
            surveyNodes:[],
            surveyProgress:[],
            administrators:this.administrators,
            participants:this.participants
        }  

        if(this.surveyNodes)
        {
            let newSurveyNodes = [];

            Array.from(this.surveyNodes.values()).map(surveyNode=> {
                newSurveyNodes.push(surveyNode.GetJSONModel(basicModel));
            });
            jsonObject.surveyNodes = newSurveyNodes;
        }

        if(this.surveyProgress)
        {
            let surveyProgress = [];

            Array.from(this.surveyProgress.values()).map(surveyProgressModel=> {
                surveyProgress.push(surveyProgressModel.GetJSONModel(basicModel));
            });
            jsonObject.surveyProgress = surveyProgress;
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

    public SetExitURL(exitURL : string){
        this.exitURL = exitURL;
    }
    
    public GetExitURL(){
        return this.exitURL;
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
 
