import IJSONParseableModel from "../IJSONParseableModel";
import LevelModel from "../LevelModel/LevelModel";
import GridAxisModel from "../GridAxisModel/GridAxisModel";

export default class GridConfigModel implements IJSONParseableModel {

    private xAxisModel :GridAxisModel;
    private yAxisModel :GridAxisModel;
 
    
    constructor (xAxisModel : GridAxisModel, yAxisModel : GridAxisModel)
    {
        this.xAxisModel = xAxisModel;
        this.yAxisModel = yAxisModel;
    }

    LoadFromJSONModel(jsonModel: any) {
        for (const property in jsonModel) {
            this[property]= jsonModel[property];
        }
    }

    GetJSONModel() {
        return JSON.parse(JSON.stringify(this));
    }

    public GetXAxisModel(){
        return this.xAxisModel;
    }
    
    public SetXAxisModel(xAxisModel:GridAxisModel)
    {
        this.xAxisModel = xAxisModel;
    }

    
    public GetYAxisModel(){
        return this.yAxisModel;
    }
    
    public SetYAxisModel(yAxisModel:GridAxisModel)
    {
        this.yAxisModel = yAxisModel;
    }
    

   /*  private InitBorders(xBorders : any, yBorders : any)
    {
        if(xBorders && yBorders)
        {
            this.xBorders = xBorders;
            this.yBorders = yBorders;
        }
 */
        //xBorders:
     /*    this.xBordercount = 1;
        this.xBorders = new Array<string>(); */
        
       /*  if (xBorders.length >= this.xLevels.length - 1) {
            for (let i = 0; i < this.xLevels.length - 1; i++) {
                this.xBorders.Add(xBorders[i]);
            }
        } else {
            let diff = (this.xLevels.length -1) - xBorders.length;
            xBorders.forEach(border => {
                this.xBorders.Add(border);
            });
            for(let i = 0; i < diff; i++){
                this.xBorders.Add("border "+ this.xBordercount);
                this.xBordercount++;
            }
        }
        
        //yBorders:
        this.yBordercount = 1;
        this.yBorders =  new Array<string>();
        if (yBorders.length >= this.yLevels.length - 1) {
            for (let i = 0; i < this.yLevels.length - 1; i++) {
                this.yBorders.Add(yBorders[i]);
            }
        } else {
            let diff = (this.yLevels.length -1) - yBorders.length;
            yBorders.forEach(border => {
                this.yBorders.Add(border);
            });
            for(let i = 0; i < diff; i++){
                this.yBorders.Add("border "+ this.yBordercount);
                this.yBordercount++;
            }
        } */
    //}
 
        /* 
    public SetXDescription(levelName : string, description : string)
    {
        this.xLevels.forEach(level => {
            if (level.GetName().Equals(levelName)) {
                level.SetDescription(description);
            }
        });
    }
    
    public GetXDescription(levelName : string)
    {
        this.xLevels.forEach(level => {
            if (level.GetName().Equals(levelName)) {
                return level.GetDescription();
            }
        });
        
        return "";
    }
    
    public SetYDescription(levelName : string, description : string)
    {
        this.yLevels.forEach(level => {
            if (level.GetName().Equals(levelName)) {
                level.SetDescription(description);
            }
        });
    }
    
    public GetYDescription(levelName : string)
    {
        this.yLevels.forEach(level => {
            if (level.GetName().Equals(levelName)) {
                return level.GetDescription();
            }
        });
        return "";
    }
    */

  /*   public RewriteXBorder(pos : number , border : string)
    {
        
        if (pos < this.xBorders.length) {
            this.xBorders[pos] = border;
        }
    }
    
    public RewriteYBorder(pos : number, border : string)
    {
        
        if (pos < this.yBorders.length) {
            this.yBorders[pos] = border;
        }
    } */
    
   /*  
    public SetXBorders(yBorders : Array<string>)
    {
        this.xBordercount = 1;
        this.xBorders =  new Array<string>();
        if (this.xBorders.length >= this.xLevels.length - 1) {
            for (let i = 0; i < this.xLevels.length - 1; i++) {
                this.xBorders.Add(this.xBorders[i]);
            }
        } else {
            let diff : number = (this.xLevels.length -1) - this.xBorders.length;
            this.xBorders.forEach(border => {
                this.xBorders.Add(border);
            });
            for(let i = 0; i < diff; i++){
                this.xBorders.Add("border "+ this.xBordercount);
                this.xBordercount++;
            }
        }
    }
    
    public SetYBorders(yBorders : Array<string>)
    {
        this.yBordercount = 1;
        this.yBorders =  new Array<string>();
        if (yBorders.length >= this.yLevels.length - 1) {
            for (let i = 0; i < this.yLevels.length; i++) {
                this.yBorders.Add(yBorders[i]);
            }
        } else {
            let diff = (this.yLevels.length -1) - yBorders.length;
            this.xBorders.forEach(border => {
                this.yBorders.Add(border);
            });
            for(let i = 0; i < diff; i++){
                this.yBorders.Add("border "+ this.yBordercount);
                this.yBordercount++;
            }
        }
    } */
    
   /*  public SetXBordersEnabled(enable : boolean){
        this.xBordersEnabled = enable;
    }
    
    public SetYBordersEnabled(enable : boolean){
        this.yBordersEnabled = enable;
    }
    
    public IsXBordersEnabled(){
        return this.xBordersEnabled;
    }
    
    public IsYBordersEnabled(){
        return this.yBordersEnabled;
    }
    
    public GetXBorders(){
        return this.xBorders;
    }
    
    public GetYBorders(){
        return this.yBorders;
    } */
}
 