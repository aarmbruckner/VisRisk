export default class BorderModel  {
  private value : string;
  private description : string;
  private index : number;

  constructor(value : string, description : string,index:number)
  {
    this.value = value;
    this.description = description;
    this.index = index;
  }
  
  public GetValue(){
    return this.value;
  }
  
  public GetDescription(){
    return this.description;
  }
  
  public SetDescription(description : string){
    this.description = description;
  }

  public GetIndex(){
    return this.index;
  }
  
  public SetIndex(index : number){
    this.index = index;
  }
}