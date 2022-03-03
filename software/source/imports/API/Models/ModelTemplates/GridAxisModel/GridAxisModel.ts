import BorderModel from "../BorderModel/BorderModel";
import LevelModel from "../LevelModel/LevelModel";

export default class GridAxisModel  {
  private axisName : string;
  private levels :  LevelModel[];
  private borders : BorderModel[];
  private activeBordersCount : number;

  constructor(axisName : string, levels : LevelModel[], borders:BorderModel[] ,activeBordersCount:number)
  {
    this.axisName = axisName;
    this.levels = levels;
    this.borders = borders;
    this.activeBordersCount = activeBordersCount;
  }
  
  public GetActiveBordersCount(){
    return this.activeBordersCount;
  }

  public SetActiveBordersCount(activeBordersCount:number)
  {
    this.activeBordersCount = activeBordersCount;
  }

  public GetAxisName(){
    return this.axisName;
  }

  public SetAxisName(axisName:string)
  {
    this.axisName = axisName;
  }

  public GetLevels(){
    return this.levels;
  }

  public SetLevels(levels:any)
  {
    this.levels = levels;
  }

  public GetBorders(){
    return this.borders;
  }

  public SetBorders(borders:any)
  {
    this.borders = borders;
  }
/* 
  public AddLevel(levelName :string, description : string)
  {
        let exists : boolean = false;
        
        this.levels.forEach(level => {
            if (level.GetAxisName().Equals(levelName)) {
                exists = true;
            }
        });
        
        if (!exists) {
            this.levels.Add(new LevelModel(levelName, description));
            if(this.levels.length > 1){
                this.borders.Add("border "+ this.activeBordersCount);
                this.borders++;	
            }
        }
    }
    
    public SetXBorders(borders : Array<string>)
    {
        this.activeBordersCount = 1;
        this.borders =  new Array<string>();
        if (this.borders.length >= this.levels.length - 1) {
            for (let i = 0; i < this.levels.length - 1; i++) {
                this.borders.Add(this.borders[i]);
            }
        } else {
            let diff : number = (this.borders.length -1) - this.borders.length;
            this.borders.forEach(border => {
                this.borders.Add(border);
            });
            for(let i = 0; i < diff; i++){
                this.borders.Add("border "+ this.activeBordersCount);
                this.activeBordersCount++;
            }
        }
    }
    
    public RemoveLevel(levelName : string)
    {
        let levelToRemove : LevelModel= null;
        let levelIndex  : number = -1;
 
        this.levels.forEach(level => {
            if (level.GetName().Equals(levelName)) {
                levelToRemove = level;
                levelIndex = this.levels.IndexOf(levelToRemove);
            }
        });
        //remove level:
        this.levels.Remove(levelToRemove);
        
        //remove level border:
        if(levelIndex >= 0 && levelIndex <= this.borders.length){
            if(levelIndex == this.borders.length){
                levelIndex = this.borders.length - 1;
            }
            this.borders.Remove(this.borders[levelIndex]);
        }
    } */
    
 
}