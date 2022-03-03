import IJSONParseableModel from "../IJSONParseableModel";

export default class CalcConfigModel implements IJSONParseableModel {
   //params for opinion pooling:
    private decimalPointAccuracy : number ;
    private epsilon : number ;
    
    //params for data cleaning:
    private pX: number ;
    private pY : number ;
    private deltaXLow : number ;
    private deltaXHigh : number ;
    private deltaYLow : number ;
    private deltaYHigh : number ;
    
    private manualDeltaEnabled : boolean ;
    
    constructor(decimalPointAccuracy : number, epsilon : number, pX : number, pY : number,manualDeltaEnabled : boolean, deltaXLow : number, deltaXHigh : number, deltaYLow : number, deltaYHigh : number)
    {
        this.decimalPointAccuracy = decimalPointAccuracy;
        this.epsilon = epsilon;
        this.pX = pX;
        this.pY = pY;
        this.manualDeltaEnabled = manualDeltaEnabled;
        this.deltaXLow = deltaXLow;
        this.deltaXHigh = deltaXHigh;
        this.deltaYLow = deltaYLow;
        this.deltaYHigh = deltaYHigh;
    }

    LoadFromJSONModel(jsonModel: any) {
      /*   JSON.stringify(
            jsonModelS,
            (key, value) => {this[key]=value}
        ); */
        for (const property in jsonModel) {
            this[property]= jsonModel[property];
          }
    }

    GetJSONModel(basicModel) {
      let jsonS = JSON.stringify(this);
      let jsonO = JSON.parse(jsonS);
      return jsonO;
    }

    
    public SetDecimalPointAccuracy(accuracy : number)
    {
        this.decimalPointAccuracy = accuracy;
    }
    
    public GetDecimalPointAccuracy()
    {
        return this.decimalPointAccuracy;
    }
    
    public SetEpsilon(epsilon : number){
        this.epsilon = epsilon;
    }
    
    public GetEpsilon(){
        return this.epsilon;
    }
    
    public SetPX(pX : number){
        this.pX = pX;
    }
    
    public GetPX(){
        return this.pX;
    }
    
    public SetPY(pY : number){
        this.pY = pY;
    }
    
    public GetPY(){
        return this.pY;
    }
    
    public SetEnableManualDelta(enable : number){
        this.manualDeltaEnabled = enable;
    }
    
    public GetEnableManualDelta(){
        return this.manualDeltaEnabled;
    }
    
    public SetDeltaXLow(deltaXLow : number){
        this.deltaXLow = deltaXLow;
    }
    
    public GetDeltaXLow(){
        return this.deltaXLow;
    }
    
    public SetDeltaXHigh(deltaXHigh : number){
        this.deltaXHigh = deltaXHigh;
    }
    
    public GetDeltaXHigh(){
        return this.deltaXHigh;
    }
    
    public SetDeltaYLow(deltaYLow : number){
        this.deltaYLow = deltaYLow;
    }
    
    public GetDeltaYLow(){
        return this.deltaYLow;
    }
    
    public SetDeltaYHigh(deltaYHigh : number){
        this.deltaYHigh = deltaYHigh;
    }
    
    public GetDeltaYHigh(){
        return this.deltaYHigh;
    }
}
 