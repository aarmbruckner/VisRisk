export default class LevelModel  {
  private name : string;
  private description : string;
  
  constructor(name : string, description : string)
  {
    this.name = name;
    this.description = description;
  }
  
  public GetName(){
    return this.name;
  }

  public SetName(name:string)
  {
    this.name = name;
  }
  
  public GetDescription(){
    return this.description;
  }
  
  public SetDescription(description : string){
    this.description = description;
  }
} 