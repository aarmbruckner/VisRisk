import IJSONParseableModel from "../IJSONParseableModel";

export default class GridInfoModel  implements IJSONParseableModel {

  private posX : number;
  private posY : number;
  private gridWidth : number;
  private gridHeight : number;
  
  private horizontalLinePositions : any;
  private verticalLinePositions  : any;
  
  constructor (posX : number,posY : number, gridWidth : number,gridHeight : number, horizontalLinePositions : any, verticalLinePositions : any)
  {
    this.posX = posX;
    this.posY = posY;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.horizontalLinePositions = horizontalLinePositions;
    this.verticalLinePositions = verticalLinePositions;
  }

  LoadFromJSONModel(jsonModelS: any) {
    throw new Error("Method not implemented.");
  }
  GetJSONModel() {
    throw new Error("Method not implemented.");
  }
  
  /// <summary>
  /// GetIndexOfNextTopLine: Returns the index of the next gridline north of the given position.
  /// </summary>
  /// <param name="posY">The postion on the Y-Axis.</param>
  /// <returns>The index of the next top line. It returns -1 when the given position is not inside the grid or the next top line is the grids end.</returns>
  public GetIndexOfNextTopLine(posY : number){
    for(let i = this.horizontalLinePositions.length - 1; i >= 0; i--){
      if(parseInt(this.horizontalLinePositions[i]) <= posY){
        return i;
      }
    }
    return -1;
  }
  
  /// <summary>
  /// GetIndexNextSouthernLine: Returns the index of the next gridline south of the given position.
  /// </summary>
  /// <param name="posY">The postion on the Y-Axis.</param>
  /// <returns>The index of the next bottom line. It returns -1 when the given position is not inside the grid or the grids end.</returns>
  public GetIndexOfNextBottomLine( posY : number){
    for(let i = 0; i < this.horizontalLinePositions.length; i++){
      if(parseInt(this.horizontalLinePositions[i]) >= posY){
        return i;
      }
    }
    return this.horizontalLinePositions.length;
  }
  
  /// <summary>
  /// GetIndexOfNextLeftLine: Returns the index of the next gridline west of the given position.
  /// </summary>
  /// <param name="posX">The postion on the X-Axis.</param>
  /// <returns>The index of the next left line. It returns -1 when the given position is not inside the grid or the grids end.</returns>
  public GetIndexOfNextLeftLine(posX : number){
    for(let i = this.verticalLinePositions.length - 1; i >= 0; i--){
      if(parseInt(this.verticalLinePositions[i]) <= posX){
        return i;
      }
    }
    return -1;
  }
  
  /// <summary>
  /// GetIndexOfNextRightLine: Returns the index of the next gridline east of the given position.
  /// </summary>
  /// <param name="posX">The postion on the X-Axis.</param>
  /// <returns>The index of the next right line. It returns -1 when the given position is not inside the grid or the grids end.</returns>
  public GetIndexOfNextRightLine(posX : number){
    for(let i = 0; i < this.verticalLinePositions.length; i++){
      if(parseInt(this.verticalLinePositions[i]) >= posX){
        return i;
      }
    }
    return this.verticalLinePositions.length;
  }
  
  /// <summary>
  /// GetDistanceToNextHorizontalLine:
  /// Returns the distance to the next horizontal line below the given line index.
  /// Index -1 stands for the top line, 0 for the first line after if it exists.
  /// If the line is the bottom line 0 is returned.
  /// </summary>
  /// <param name="lineIndex">Line index in the grid.</param>
  /// <returns>Distance to next horizontal line below.</returns>
  public GetDistanceToNextHorizontalLine(lineIndex : number){
    if(lineIndex < 0){
      if(this.horizontalLinePositions.length > 0){
        return (parseInt(this.horizontalLinePositions[0])) - this.GetLimitTop();
      }else{
        return this.GetLimitBottom() - this.GetLimitTop();
      }
    }else if(lineIndex < this.horizontalLinePositions.length){
        
      if(lineIndex == this.horizontalLinePositions.length - 1){
        return this.GetLimitBottom() -parseInt(this.horizontalLinePositions[lineIndex]);
      }else{
        return parseInt(this.horizontalLinePositions[lineIndex + 1]) - parseInt(this.horizontalLinePositions[lineIndex]);
      }
    }else{
      return 0;	
    }
  }
  
  /// <summary>
  /// GetDistanceToNextVerticalLine:
  /// Returns the distance to the next vertical line to the right of the given line index.
  /// Index -1 stands for the leftmost line, 0 for the first line after if it exists.
  /// If the line is the rightmost line 0 is returned.
  /// </summary>
  /// <param name="lineIndex">Line index in the grid.</param>
  /// <returns>Distance to next vertical line to the right.</returns>
  public GetDistanceToNextVerticalLine(lineIndex : number){
    if(lineIndex < 0){
      if(this.verticalLinePositions.length > 0){
        return (parseInt(this.verticalLinePositions[0])) - this.GetLimitLeft();
      }else{
        return this.GetLimitRight() - this.GetLimitLeft();
      }
    }else if(lineIndex < this.verticalLinePositions.length){
        
      if(lineIndex == this.verticalLinePositions.length - 1){
        return this.GetLimitRight() - parseInt(this.verticalLinePositions[lineIndex]);
      }else{
        return parseInt(this.verticalLinePositions[lineIndex + 1]) - parseInt(this.verticalLinePositions[lineIndex]);
      }
    }else{
      return 0;	
    }
  }
  
  /// <summary>
  /// GetDistanceToPrevHorizontalLine:
  /// Returns the distance to the previous horizontal line above the given line index.
  /// Index -1 stands for the bottom line, 0 for the first line after if it exists.
  /// If the line is the top line 0 is returned.
  /// </summary>
  /// <param name="lineIndex">Line index in the grid.</param>
  /// <returns>Distance to previous horizontal line above.</returns>
  public GetDistanceToPrevHorizontalLine(lineIndex : number){
    if(lineIndex < 0){
      return 0;
    }else if(lineIndex < this.horizontalLinePositions.length){
        
      if(lineIndex == 0){
        return parseInt(this.horizontalLinePositions[lineIndex]) - parseInt(this.GetLimitTop());
      }else{
        return parseInt(this.horizontalLinePositions[lineIndex]) - parseInt(this.horizontalLinePositions[lineIndex - 1]);
      }
    }else{
      if(this.horizontalLinePositions.length > 0){
        return this.GetLimitBottom() - (parseInt (this.horizontalLinePositions[this.horizontalLinePositions.length -1]));
      }else{
        return this.GetLimitBottom() - this.GetLimitTop();
      }	
    }
  }
  
  /// <summary>
  /// GetDistanceToNextVerticalLine:
  /// Returns the distance to the next vertical line to the left of the given line index.
  /// Index -1 stands for the rightmost line, 0 for the first line after if it exists.
  /// If the line is the leftmost line 0 is returned.
  /// </summary>
  /// <param name="lineIndex">Line index in the grid.</param>
  /// <returns>Distance to previous vertical line to the left.</returns>
  public GetDistanceToPrevVerticalLine(lineIndex : number){
    if(lineIndex < 0){
      return 0;
    }else if(lineIndex < this.verticalLinePositions.length){
        
      if(lineIndex == 0){
        return parseInt(this.verticalLinePositions[lineIndex]) - parseInt(this.GetLimitLeft());
      }else{
        return parseInt(this.verticalLinePositions[lineIndex]) - parseInt(this.verticalLinePositions[lineIndex - 1]);
      }
    }else{
      if(this.verticalLinePositions.length > 0){
        return this.GetLimitRight() - (parseInt(this.verticalLinePositions[this.verticalLinePositions.length -1]));
      }else{
        return this.GetLimitRight() - this.GetLimitLeft();
      }	
    }
  }
  
  /// <summary>
  /// GetPosOfHorziontalLine:
  /// Returns the vertical position of a horizontal line in the grid.
  /// </summary>
  /// <param name="lineIndex">Index of the line.</param>
  /// <returns></returns>
  public GetPosOfHorziontalLine(lineIndex : number){
    if(lineIndex < 0){
      return this.GetLimitTop();
    }else if( lineIndex >= this.horizontalLinePositions.length){
      return this.GetLimitBottom();
    }else{
      return parseInt(this.horizontalLinePositions[lineIndex]);
    }

  }
  
  /// <summary>
  /// GetPosOfVerticalLine:
  /// Returns the horizontal position of a vertical line in the grid.
  /// </summary>
  /// <param name="lineIndex">Index of the line.</param>
  /// <returns></returns>
  public GetPosOfVerticalLine(lineIndex : number){
    if(lineIndex < 0){
      return this.GetLimitLeft();
    }else if( lineIndex >= this.verticalLinePositions.length){
      return this.GetLimitRight();
    }else{
      return parseInt(this.verticalLinePositions[lineIndex]);
    }

  }
  public GetLimitTop(){
    return this.posY;
  }
  
  public GetLimitBottom(){
    return this.posY + this.gridHeight;
  }
  
  public GetLimitLeft(){
    return this.posX;
  }
  
  public GetLimitRight(){
    return this.posX + this.gridWidth;
  }
  
  public GetGridWidth(){
    return this.gridWidth;
  }
  
  public GetGridHeight(){
    return this.gridHeight;
  }
  
  public GetHorizontalLinePositions(){
    return this.horizontalLinePositions;
  }
  
  public GetVerticalLinePositions(){
    return this.verticalLinePositions;
  }
}