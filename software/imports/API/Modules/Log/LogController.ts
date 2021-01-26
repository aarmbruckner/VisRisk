import Calculator from "../Calculator/Calculator";
import RectangleInfoModel from "../../Models/ModelTemplates/RectangleInfoModel/RectangleInfoModel";
import LogInfoModel from "../../Models/ModelTemplates/LogInfoModel/LogInfoModel";
import TypeScriptHelper from "../Utilities/TypeScriptHelper";
import CalcConfigController from "../Configuration/CalcConfigController";
import GridInfoModel from "../../Models/ModelTemplates/GridInfoModel/GridInfoModel";
import CalcConfigModel from "../../Models/ModelTemplates/Configuration/CalcConfigModel";

export default class LogController{
    private isSaved : boolean;
 
 
    private nodeDict : Record<string, LogInfoModel>;
    //private calcConfig : CalcConfigModel;  

    private CleanCurrentLogData(isCleaned,originalInfo,graphWidth:number,graphHeight:number){
        if(isCleaned)
            return;
 
        let finishedInfo : LogInfoModel;
        let calcConfigController = new CalcConfigController();
        let calcConfigModel : CalcConfigModel = calcConfigController.GetDefaultConfig();
        if(calcConfigModel.GetEnableManualDelta() === true){ //MANUAL:
            finishedInfo = Calculator.CleanDataWithDelta(originalInfo,calcConfigModel.GetPX(), calcConfigModel.GetPY(), 
                                        calcConfigModel.GetDeltaXLow(), calcConfigModel.GetDeltaXHigh(), calcConfigModel.GetDeltaYLow(), calcConfigModel.GetDeltaYHigh(),graphWidth,graphHeight);
            
            //check if data is out of range:
            let gridInfo : GridInfoModel= finishedInfo.GetGridInfo();
            let rectanglesOutOfRange : Array<string> = new Array<string>();
            finishedInfo.GetEditableRectInfos().forEach(rectInfo => {
                if(rectInfo.GetPosX() < 0 || rectInfo.GetPosY() < 0 || 
                    rectInfo.GetPosX() + rectInfo.GetWidth() > gridInfo.GetGridWidth() || 
                    rectInfo.GetPosY() + rectInfo.GetHeight() > gridInfo.GetGridHeight()){
                    rectanglesOutOfRange.push(rectInfo.GetDescription());
                }
            });
            
            //Pop warning dialouge if data is out of range:
            if(rectanglesOutOfRange.length > 0){
                let count = " rectangle";
                if(rectanglesOutOfRange.length > 1){
                    count = count + "s";
                }
                let msg : string = rectanglesOutOfRange.length + count + " will be out of range after cleaning:\n";
                rectanglesOutOfRange.forEach(rectangle => {
                    msg = msg + " - "+ rectangle + "\n";
                });
 
                msg = msg + "Clean data anyway?";
 
            }else{
                /* this.logTab.ClearLog();
                this.logTab.AddRectangleEntries(info.GetEditableRectInfos(), info.GetGridInfo()); */
                isCleaned = true;
            }
            
        }else{ //AUTO:
            finishedInfo = Calculator.CleanData(/* this.nodeDict[currDisplayedNode] */originalInfo, calcConfigModel.GetPX(), calcConfigModel.GetPY(),graphWidth,graphHeight);
       /*      this.logTab.ClearLog();
            this.logTab.AddRectangleEntries(info.GetEditableRectInfos(), info.GetGridInfo()); */
            isCleaned = true;
        }
        return finishedInfo;
    }
}