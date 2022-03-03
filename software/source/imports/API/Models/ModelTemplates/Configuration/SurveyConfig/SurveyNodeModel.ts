import CalcConfigController from "../../../../Modules/Configuration/CalcConfigController";
import GridConfigController from "../../../../Modules/Configuration/GridConfigController";
import GridInfoModel from "../../GridInfoModel/GridInfoModel";
import IJSONParseableModel from "../../IJSONParseableModel";
import LogInfoModel from "../../LogInfoModel/LogInfoModel";
import RectangleInfoModel from "../../RectangleInfoModel/RectangleInfoModel";
import CalcConfigModel from "../CalcConfigModel";
import GridConfigModel from "../GridConfigModel";
import ProviderDependencyModel from "./ProviderDependencyModel";

export default class SurveyNodeModel  implements IJSONParseableModel{
     private _id: string ;
     private name : string ;
     private description : string ;
     private ownFailureProbability: number ;
     private currentFailureProbability: number ;
     private maxNumberOfVotes: number ;
     private providerDependencies : Array<ProviderDependencyModel> ;
     private logInfoModel : LogInfoModel;
     private calcConfigModel: CalcConfigModel;
     private gridConfigModel: GridConfigModel;
     private gridInfoModel: GridInfoModel;
     private estimationRectangle : RectangleInfoModel;
     private currentGraphModelElements : any;
     private pooledGraphModelElements : any;

     constructor(_id : number,   name : string,  description : string,  failureProbability : number,maxNumberOfVotes:number)
     {
         this._id = _id;
         this.name = name;
         this.description = description;
         this.ownFailureProbability = failureProbability;
         this.currentFailureProbability = failureProbability;
         this.maxNumberOfVotes = maxNumberOfVotes;
         this.providerDependencies = [];
         this.logInfoModel = new LogInfoModel(name);

         let calcConfigController = new CalcConfigController();
         let gridConfigController = new GridConfigController();

         this.calcConfigModel = calcConfigController.GetDefaultConfig();
         this.gridConfigModel = gridConfigController.GetDefaultConfig();
         this.currentGraphModelElements = null;
         this.pooledGraphModelElements = null;
         //this.calcConfigModel = new CalcConfigModel(null,null,null,null,null,null,null,null,null);
     }

     public LoadFromJSONModel(jsonModelS : any)
     {
        this._id = jsonModelS._id;
        this.name = jsonModelS.name;
        this.description = jsonModelS.description;
        this.maxNumberOfVotes = jsonModelS.maxNumberOfVotes;
        this.ownFailureProbability = jsonModelS.ownFailureProbability;
        this.currentFailureProbability = jsonModelS.currentFailureProbability;
        this.currentGraphModelElements = jsonModelS.currentGraphModelElements;
        this.pooledGraphModelElements = jsonModelS.pooledGraphModelElements;
        this.providerDependencies = [];
 
        if(jsonModelS.logInfoModel)
        {
            let logInfoModel = new LogInfoModel(null); 
            logInfoModel.LoadFromJSONModel(jsonModelS.logInfoModel);
            this.logInfoModel = logInfoModel;
        }

        if(jsonModelS.gridInfoModel)
        {
            let gridInfoModel = new GridInfoModel(null,null,null,null,null,null); 
            gridInfoModel.LoadFromJSONModel(jsonModelS.gridInfoModel);
            this.gridInfoModel = gridInfoModel;
        }

        //let calcConfigModel = new CalcConfigModel(null,null,null,null,null,null,null,null,null); 
        let calcConfigController = new CalcConfigController();
        let calcConfigModel = calcConfigController.GetDefaultConfig();
        if(jsonModelS.calcConfigModel)
        {
            calcConfigModel.LoadFromJSONModel(jsonModelS.calcConfigModel);
            this.calcConfigModel = calcConfigModel;
        }else{
            this.calcConfigModel = calcConfigModel;
        }

        if(jsonModelS.gridConfigModel)
        {
            let gridConfigModel = new GridConfigModel(null,null,null,null,null,null); 
            gridConfigModel.LoadFromJSONModel(jsonModelS.gridConfigModel);
            this.gridConfigModel = gridConfigModel;
        }

        if(jsonModelS.estimationRectangle)
		{
			let estimationRectangle = new RectangleInfoModel(null,null,null,null,null,null); 
			estimationRectangle.LoadFromJSONModel(jsonModelS.estimationRectangle);
			this.estimationRectangle = estimationRectangle;
		}

        if(jsonModelS.providerDependencies)
        {
            jsonModelS.providerDependencies.forEach((provDepJSON)  => {
                let provDependency = new ProviderDependencyModel(null,null,null,null,null,null,null,null);
                    provDependency.LoadFromJSONModel(provDepJSON);
                    this.providerDependencies.push(provDependency);
            })
        }
           
           
     }
     
     public GetJSONModel(basicModel)
     {
         let jsonObject = {
             _id:this._id,
             name:this.name,
             description:this.description,
             maxNumberOfVotes:this.maxNumberOfVotes,
             ownFailureProbability : this.ownFailureProbability,
             currentFailureProbability : this.currentFailureProbability,
             providerDependencies:this.providerDependencies,
             logInfoModel:null,
             calcConfigModel:null,
             gridConfigModel:null,
             gridInfoModel:null,
             estimationRectangle:null,
             currentGraphModelElements:this.currentGraphModelElements
         }  

        if(this.estimationRectangle)
        {
            jsonObject.estimationRectangle = this.estimationRectangle.GetJSONModel(basicModel);
        }
         
        if(this.logInfoModel)
        {
            jsonObject.logInfoModel = this.logInfoModel.GetJSONModel(basicModel);
        }

        if(this.gridInfoModel)
        {
            jsonObject.gridInfoModel = this.gridInfoModel.GetJSONModel(basicModel);
        }

        if(this.calcConfigModel)
        {
            jsonObject.calcConfigModel = this.calcConfigModel.GetJSONModel(basicModel);
        }

        if(this.gridConfigModel)
        {
            jsonObject.gridConfigModel = this.gridConfigModel.GetJSONModel(basicModel);
        }
        return jsonObject;
     }
     
     public SetLogInfoModel(logInfoModel : LogInfoModel)
     {
        this.logInfoModel = logInfoModel;
     }
     
     public GetLogInfoModel()
     {
        return this.logInfoModel;
     }

     public SetpPooledGraphModelElements(pooledGraphModelElements : LogInfoModel)
     {
        this.pooledGraphModelElements = pooledGraphModelElements;
     }
     
     public GetPooledGraphModelElements()
     {
        return this.pooledGraphModelElements;
     }
     
     
     public SetCurrentGraphModelElements(currentGraphModelElements : any)
     {
        this.currentGraphModelElements = currentGraphModelElements;
     }
     
     public GetCurrentGraphModelElements()
     {
        return this.currentGraphModelElements;
     }


     public SetId(_id : number)
     {
        this._id = _id;
     }
     
     public GetId()
     {
        return this._id;
     }
     
     public SetName(name : string){
        this.name = name;
     }
     
     public GetName(){
        return this.name;
     }

    public SetDescription(description : string){
        this.description = description;
    }

    public GetDescription(){
        return this.description;
    }
     
    public SetmaxNumberOfVotes(maxNumberOfVotes : number){
        this.maxNumberOfVotes = maxNumberOfVotes;
    }

    public GetmaxNumberOfVotes(){
        return this.maxNumberOfVotes;
    }

     public SetOwnFailureProbability(probablility : number){
         this.ownFailureProbability = probablility;
     }
     
     public GetOwnFailureProbablility(){
         return this.ownFailureProbability;
     }
     
     public SetCurrenFailureProbability(probablility : number){
         this.currentFailureProbability = probablility;
     }
     
     public GetCurrenFailureProbability(){
         return this.currentFailureProbability;
     }
     
     public SetProviderDependencies(providerDependencies :  Array<ProviderDependencyModel>){
         this.providerDependencies = providerDependencies;
     }
     
     public GetProviderDependencies(){
         return this.providerDependencies;
     }

    public SetCalcConfigModel(calcConfigModel : CalcConfigModel )
    {
        this.calcConfigModel = calcConfigModel;
    }
    
    public GetCalcConfigModel()
    {
        return this.calcConfigModel;
    }

    public SetGridConfigModel(gridConfigModel : GridConfigModel )
    {
        this.gridConfigModel = gridConfigModel;
    }
    
    public GetGridConfigModel()
    {
        return this.gridConfigModel;
    }
     
     public AddOrReplaceProviderDependency(addDependency : ProviderDependencyModel){
        let exists : boolean = false;
        let foundDependecy : ProviderDependencyModel;

        this.providerDependencies.forEach(searchPd => {
            if(searchPd.GetProviderID() == addDependency.GetProviderID()){
                foundDependecy = searchPd;
                exists = true;
            }
        });
        
        if(exists){
            pD = addDependency;
        }else{
            this.providerDependencies.push(addDependency);
        }
     }
     
 }
  