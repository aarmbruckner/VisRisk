import LogInfoModel from "../../LogInfoModel/LogInfoModel";
import ProviderDependencyModel from "../SurveyConfig/ProviderDependencyModel";

export default class NetworkConfigNodeModel  {
     private id: number ;
     private name : string ;
     private ownFailureProbability: number ;
     private currentFailureProbability: number ;
     private providerDependencies : Array<ProviderDependencyModel> ;
     private logInfoModel : LogInfoModel;

     constructor(id : number,   name : string,   failureProbability : number)
     {
         this.id = id;
         this.name = name;
         this.ownFailureProbability = failureProbability;
         this.currentFailureProbability = failureProbability;
         this.providerDependencies = [];
         this.logInfoModel = new LogInfoModel(name);
     }

     public LoadFromJSONModel(jsonModelS : any)
     {
        this.id = jsonModelS.id;
        this.name = jsonModelS.name;
        this.ownFailureProbability = jsonModelS.failureProbability;
        this.currentFailureProbability = jsonModelS.failureProbability;

        this.providerDependencies = [];
        if(jsonModelS.providerDependencies)
        for (const [key, provDepJSON] of Object.entries(jsonModelS.providerDependencies)) {
            let provDependency = new ProviderDependencyModel(null,null,null,null,null,null,null,null);
            provDependency.LoadFromJSONModel(provDepJSON);
            this.providerDependencies.push(provDependency);
        }
     }
     
     
     public SetLogInfoModel(logInfoModel : LogInfoModel)
     {
         this.logInfoModel = logInfoModel;
     }
     
     public GetLogInfoModel()
     {
         return this.logInfoModel;
     }

     public SetId(id : number)
     {
         this.id = id;
     }
     
     public GetId()
     {
         return this.id;
     }
     
     public SetName(name : string){
         this.name = name;
     }
     
     public GetName(){
         return this.name;
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
  