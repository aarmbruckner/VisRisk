export default class ProviderDependencyModel  {
    private _id: string ;
    private name : string ;
    private timeLimitLow: number ;
    private timeLimitMedium: number ;
    
    private timeUnitLow: string ;
    private timeUnitMedium: string ;

    private probabilityLow: number ;
    private probabilityMedium: number ;
    private probabilityHigh: number ;

    constructor(_id : string, timeLimitLow : number,   timelimitMedium : number,   timeUnitLow : string,   timeUnitMedium : string,   probabilityLow : number,   probabilityMedium : number,   probabilityHigh : number)
    {
        this._id = _id;
        this.timeLimitLow = timeLimitLow;
        this.timeLimitMedium = timelimitMedium;
        this.timeUnitLow = timeUnitLow;
        this.timeUnitMedium = timeUnitMedium;
        this.probabilityLow = probabilityLow;
        this.probabilityMedium = probabilityMedium;
        this.probabilityHigh = probabilityHigh;
    }

    public LoadFromJSONModel(jsonModelS : any)
    {
        this._id = jsonModelS._id;
        this.timeLimitLow = jsonModelS.timeLimitLow.duration;
        this.timeUnitLow = jsonModelS.timeLimitLow.unit;

        this.timeLimitMedium= jsonModelS.timeLimitMedium.duration;
        this.timeUnitMedium = jsonModelS.timeLimitMedium.unit;
 
        this.probabilityLow= jsonModelS.probabilityLow.value;
        this.probabilityMedium= jsonModelS.probabilityMedium.value;
        this.probabilityHigh= jsonModelS.probabilityHigh.value;
    }
    
    public GetProviderID(){
        return this._id;
    }
    
    public SetTimeLimitLow(timeLimit : number){
        this.timeLimitLow = timeLimit;
    }
    
    public GetTimeLimitLow(){
        return this.timeLimitLow;
    }
    
    public SetTimeLimitMedium(timeLimit : number){
        this.timeLimitMedium = timeLimit;
    }
    
    public GetTimeLimitMedium(){
        return this.timeLimitMedium;
    }
    
    public SetTimeUnitLow(unit : string){
        this.timeUnitLow = unit;
    }
    
    public GetTimeUnitLow(){
        return this.timeUnitLow;
    }
    
    public SetTimeUnitMedium(unit : string){
        this.timeUnitMedium = unit;
    }
    
    public GetTimeUnitMedium(){
        return this.timeUnitMedium;
    }
    
    public SetProbabilityLow(probability : number){
        this.probabilityLow = probability;
    }
    
    public GetProbabilityLow(){
        return this.probabilityLow;
    }
    
    public SetProbabilityMedium(probability : number){
        this.probabilityMedium = probability;
    }
    
    public GetProbabilityMedium(){
        return this.probabilityMedium;
    }
    
    public SetProbabilityHigh(probability : number){
        this.probabilityHigh = probability;
    }
    
    public GetProbabilityHigh(){
        return this.probabilityHigh;
    }
    
}
 