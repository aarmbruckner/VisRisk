import GridConfigModel from "../../Models/ModelTemplates/Configuration/GridConfigModel";
import LevelModel from "../../Models/ModelTemplates/LevelModel/LevelModel";
import BorderModel from "../../Models/ModelTemplates/BorderModel/BorderModel";
import GridAxisModel from "../../Models/ModelTemplates/GridAxisModel/GridAxisModel";

export default class GridConfigController  {
        
    private convertConfigJSONModelToClassModel(gridConfigJSONModel : any)
    {
        if(!gridConfigJSONModel)
            return null;

        //xAxisName : string, yAxisName : string, xLevel : any, yLevel : any, xBorders : any, yBorders : any

        let xLevels = [];
        let yLevels = [];

        let currentLevel = null;
        let index = 1;

        while(typeof currentLevel != "undefined")
        {
            currentLevel = gridConfigJSONModel.xAxis["level"+index];
            if(typeof currentLevel != "undefined")
            {
                currentLevel = new LevelModel(currentLevel.name,currentLevel.description);
                xLevels.push(currentLevel);
            }
            index++;
        }

        currentLevel = null;
        index = 1;
        while(typeof currentLevel != "undefined")
        {
            currentLevel = gridConfigJSONModel.xAxis["level"+index];
            if(typeof currentLevel != "undefined")
            {
                currentLevel = new LevelModel(currentLevel.name,currentLevel.description);
                yLevels.push(currentLevel);
            }
            index++;
        }

        let currentBorder= null;
        let xBorders = [];
        index = 1;
        while(typeof currentBorder != "undefined")
        {
            currentBorder = gridConfigJSONModel.yAxis["border"+index];
            if(typeof currentBorder != "undefined")
            {
                currentBorder = new BorderModel(currentBorder.value,currentBorder.description,index);
                xBorders.push(currentBorder);
            }
            index++;
        }
 
        currentBorder= null;
        let yBorders = [];
        index = 1;
        while(typeof currentBorder != "undefined")
        {
            currentBorder = gridConfigJSONModel.yAxis["border"+index];
            if(typeof currentBorder != "undefined")
            {
                currentBorder = new BorderModel(currentBorder.value,currentBorder.description,index);
                yBorders.push(currentBorder);
            }
            index++;
        }
 
        let xAxisModel = new GridAxisModel(gridConfigJSONModel.xAxis.name,xLevels,xBorders,0);
        let yAxisModel = new GridAxisModel(gridConfigJSONModel.yAxis.name,yLevels,yBorders,0);

        let gridConfigModel = new GridConfigModel(
            xAxisModel,yAxisModel
        );
        return gridConfigModel;   
    }


    public GetDefaultConfig()
    {
        let gridConfigJSONModel = Meteor.settings.public.defaultGraphConfigurations.gridConfig;
        let gridConfigModel = this.convertConfigJSONModelToClassModel(gridConfigJSONModel);
 
        return gridConfigModel;
    }
    
 
 }
  