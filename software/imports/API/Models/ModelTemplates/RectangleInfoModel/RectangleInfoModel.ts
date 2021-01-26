import IJSONParseableModel from "../IJSONParseableModel";

 
export default class RectangleInfoModel implements IJSONParseableModel{

    private mxGraphModel : any; //left
    private value : any;  

    //the index of the closest left and right vertical gridlines the rectangle is in between
    private gridLineIndexX1 : number; //left
    private gridLineIndexX2 : number; //right
    
    //the index of the closest top and bottom horizontal gridlines the rectangle is in between
    private gridLineIndexY1 : number; //top
    private gridLineIndexY2 : number ; //bottom
    
    //the distance to the next right neighbour line of X1:
    private distanceFromLineX1ToNextVerticalLine: number ;
    
    //the index of the next lower neighbour line of Y1:
    private distanceFromLineY1ToNextHorizontalLine : number ;
    
    //the distance to the next left neighbour line of X2:
    private distanceFromLineX2ToPrevVerticalLine : number ;
    
    //the index of the next upper neighbour line of Y2:
    private distanceFromLineY2ToPrevHorizontalLine : number;
    
    //rectangle offset top and left from surrounding area:
    private offsetLeft : number; //distance from line x1 to pos X of rectangle
    private offsetTop : number; // distance from line y1 to pos Y of rectangle
    private offsetRight : number ; //distance from line x2 to pos X + width of rectangle
    private offsetBottom : number; // distance from line y2 to pos Y + height of rectangle
    
    //rectangle data:
    private posX : number ;
    private posY : number ;
    private width: number ;
    private height : number;
    
    //labels:
    private timeStamp : string;
    private description: string; 

     //rectangle data:
     private widthPercentage : number ;
     private heightPercentage : number ;
     private likeliHoodStartPercentage: number ;
     private likeliHoodEndPercentage : number;
     private impactStartPercentage: number ;
     private impactEndPercentage : number;
    
    constructor(posX,posY,width,height,graphWidth,graphHeight) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;

        this.widthPercentage = parseFloat((this.width / graphWidth).toFixed(5));
        this.heightPercentage = parseFloat((this.height / graphHeight).toFixed(5));

        this.likeliHoodStartPercentage = parseFloat((this.posX / graphWidth).toFixed(5));
        this.likeliHoodEndPercentage = parseFloat(((this.posX+this.width) / graphWidth).toFixed(5));

        this.impactStartPercentage = parseFloat((this.posY / graphHeight).toFixed(5));
        this.impactEndPercentage = parseFloat(((this.posY+this.height) / graphHeight).toFixed(5));
    }
    LoadFromJSONModel(jsonModel: any) {
       /*  JSON.stringify(
            jsonModelS,
            (key, value) => {this[key]=value}
        ); */
        for (const property in jsonModel) {
            this[property]= jsonModel[property];
        }
    }

    GetJSONModel() {
        return JSON.parse(JSON.stringify(this));
    }

    public SetImpactEndPercentage( value : any)
    {
        this.value = value;
    }
    
    public GetImpactEndPercentage()
    {
        return this.impactEndPercentage;
    }

    public SetImpactStartPercentage( value : any)
    {
        this.value = value;
    }
    
    public GetImpactStartPercentage()
    {
        return this.impactStartPercentage;
    }

    public SetLikeliHoodEndPercentage( value : any)
    {
        this.value = value;
    }
    
    public GetLikeliHoodEndPercentage()
    {
        return this.likeliHoodEndPercentage;
    }

    public SetLikeliHoodStartPercentage( value : any)
    {
        this.value = value;
    }
    
    public GetLikeliHoodStartPercentage()
    {
        return this.likeliHoodStartPercentage;
    }

    public SetHeightPercentage( value : any)
    {
        this.value = value;
    }
    
    public GetHeightPercentage()
    {
        return this.heightPercentage;
    }

    public SetWidthPercentage( value : any)
    {
        this.value = value;
    }
    
    public GetWidthPercentage()
    {
        return this.widthPercentage;
    }


    public SetValue( value : any)
    {
        this.value = value;
    }
    
    public GetValue()
    {
        return this.value;
    }

    public SetMxGraphModel( mxGraphModel : any)
    {
        this.mxGraphModel = mxGraphModel;
    }
    
    public GetMxGraphModel()
    {
        return this.mxGraphModel;
    }

    public SetGridLineIndexX1( index : number)
    {
        this.gridLineIndexX1 = index;
    }
    
    public GetGridLineIndexX1()
    {
        return this.gridLineIndexX1;
    }
    
    public SetGridLineIndexX2(index : number)
    {
        this.gridLineIndexX2 = index;
    }
    
    public GetGridLineIndexX2()
    {
        return this.gridLineIndexX2;
    }
    
    public SetGridLineIndexY1( index : number)
    {
        this.gridLineIndexY1 = index;
    }
    
    public GetGridLineIndexY1()
    {
        return this.gridLineIndexY1;
    }
    
    public SetGridLineIndexY2(index : number)
    {
        this.gridLineIndexY2 = index;
    }
    
    public GetGridLineIndexY2()
    {
        return this.gridLineIndexY2;
    }
    
    public SetDistanceFromX1ToNextVerticalLine(distance : number){
        this.distanceFromLineX1ToNextVerticalLine = distance;
    }
    
    public GetDistanceFromX1ToNextVerticalLine(){
        return this.distanceFromLineX1ToNextVerticalLine;
    }

    public SetDistanceFromY1ToNextHorizontalLine(distance : number){
        this.distanceFromLineY1ToNextHorizontalLine = distance;
    }
    
    public GetDistanceFromY1ToNextHorizontalLine(){
        return this.distanceFromLineY1ToNextHorizontalLine;
    }
    
    public SetDistanceFromX2ToPrevVerticalLine(distance : number){
        this.distanceFromLineX2ToPrevVerticalLine = distance;
    }
    
    public GetDistanceFromX2ToPrevVerticalLine(){
        return this.distanceFromLineX2ToPrevVerticalLine;
    }
    
    public SetDistanceFromY2ToPrevHorizontalLine(distance : number){
        this.distanceFromLineY2ToPrevHorizontalLine = distance;
    }
    
    public GetDistanceFromY2ToPrevHorizontalLine(){
        return this.distanceFromLineY2ToPrevHorizontalLine;
    }
    
    public SetOffsetLeft(offset : number){
        this.offsetLeft = offset;
    }
    
    public GetOffsetLeft(){
        return this.offsetLeft;
    }
    
    public SetOffsetTop(offset : number){
        this.offsetTop = offset;
    }
    
    public GetOffsetTop(){
        return this.offsetTop;
    }
    
    public SetOffsetRight(offset : number){
        this.offsetRight = offset;
    }
    
    public GetOffsetRight(){
        return this.offsetRight;
    }
    
    public SetOffsetBottom(offset : number){
        this.offsetBottom = offset;
    }
    
    public GetOffsetBottom(){
        return this.offsetBottom;
    }
    
    public SetPosX(posX : number){
        this.posX = posX;
    }
    
    public GetPosX(){
        return this.posX;
    }
    
    public SetPosY(posY : number){
        this.posY = posY;
    }
    
    public GetPosY(){
        return this.posY;
    }
    
    public SetWidth(width : number)
    {
        this.width = width;
    }
    
    public GetWidth()
    {
        return this.width;
    }
    
    public SetHeight(height : number)
    {
        this.height = height;
    }
    
    public GetHeight()
    {
        return this.height;
    }
    
    public GetMuX(){
        return this.posX + (this.width / 2);
    }
    
    public GetMuY(){
        return this.posY + (this.height / 2);
    }
    
    public GetTimeStamp(){
        return this.timeStamp;
    }
    
    public SetDescription(description : string){
        this.description = description;
    }
    
    public GetDescription(){
        return this.description;
    }
}