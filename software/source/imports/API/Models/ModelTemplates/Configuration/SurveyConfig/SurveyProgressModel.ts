import IJSONParseableModel from "../../IJSONParseableModel";


export default class SurveyProgressModel  implements IJSONParseableModel{
     private lastSurveyNodeId: string ;
     private userId : string ;
     private loginCount : number ;
     private _id: string ;

     constructor(_id : string,   lastSurveyNodeId : string,  userId : string,loginCount:number)
     {
         this._id = _id;
         this.userId = userId;
         this.lastSurveyNodeId = lastSurveyNodeId;
         this.loginCount = loginCount;
     }

     public LoadFromJSONModel(jsonModelS : any)
     {
        this._id = jsonModelS._id;
        this.userId = jsonModelS.userId;
        this.lastSurveyNodeId = jsonModelS.lastSurveyNodeId;
        this.loginCount = jsonModelS.loginCount;
  
     }
     
     public GetJSONModel(basicModel)
     {
         let jsonObject = {
             _id:this._id,
             userId:this.userId,
             lastSurveyNodeId:this.lastSurveyNodeId,
             loginCount:this.loginCount
         }  

        return jsonObject;
     }
     
     public SetLoginCount(loginCount : number)
     {
        this.loginCount = loginCount;
     }
     
     public GetLoginCount()
     {
        return this.loginCount;
     }

     public SetId(_id : string)
     {
        this._id = _id;
     }
     
     public GetId()
     {
        return this._id;
     }
     
     public SetUserId(userId : string){
        this.userId = userId;
     }
     
     public GetUserId(){
        return this.userId;
     }

    public SetLastSurveyNodeId(lastSurveyNodeId : string){
        this.lastSurveyNodeId = lastSurveyNodeId;
    }

    public GetLastSurveyNodeId(){
        return this.lastSurveyNodeId;
    }
  
 }
  