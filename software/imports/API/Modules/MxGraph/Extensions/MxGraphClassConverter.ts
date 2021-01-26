import { Rect } from "gojs";
import RectangleInfoModel from "../../../Models/ModelTemplates/RectangleInfoModel/RectangleInfoModel";

export default class MxGraphClassConverter {
   
    constructor() {
     
    }

    public static RectangleInfoToMxGraphNode(rectangleInfo)
    {
        let mxGraphRectangle = rectangleInfo.GetMxGraphModel();
        if(!mxGraphRectangle)
        {
            mxGraphRectangle = {
                "heightPercentage": rectangleInfo.heightPercentage,
                "widthPercentage":rectangleInfo.widthPercentage,
                "impactEndPercentage":rectangleInfo.impactEndPercentage,
                "impactStartPercentage":rectangleInfo.impactStartPercentage,
                "likeliHoodEndPercentage":rectangleInfo.likeliHoodEndPercentage,
                "likeliHoodStartPercentage":rectangleInfo.likeliHoodStartPercentage,
                "value":
                {
                    "sortNumber":rectangleInfo.description
                },
                "geometry":
                {
                    x:rectangleInfo.posX,
                    y:rectangleInfo.posY,
                    width:rectangleInfo.width,
                    height:rectangleInfo.height
                }
            }
        }
        return mxGraphRectangle;
    }

    public static RectangleInfoArrayToMxGraphNodeArray(rectangleInfoArray)
    {
        let modelArray = [];
        rectangleInfoArray.forEach(rectangleInfo => {
            let mxGraphRectangle = MxGraphClassConverter.RectangleInfoToMxGraphNode(rectangleInfo);
            modelArray.push(mxGraphRectangle);
        });
        return modelArray;
    }


    public static MxGraphNodeArrayToRectangleInfoArray(modelArray,graphWidth,graphHeight)
    {
        let rectangleInfoArray = [];
        modelArray.forEach(mxGraphRectangle => {
            let rectangleInfo = MxGraphClassConverter.MxGraphNodeToRectangleInfo(mxGraphRectangle,graphWidth,graphHeight);
            rectangleInfoArray.push(rectangleInfo);
        });
        return rectangleInfoArray;
    }

    public static MxGraphNodeToRectangleInfo(mxGraphRectangle,graphWidth:number,graphHeight:number)
    {
      let rectangleInfo : RectangleInfoModel = new RectangleInfoModel(mxGraphRectangle.geometry.x,mxGraphRectangle.geometry.y,
        mxGraphRectangle.geometry.width,
        mxGraphRectangle.geometry.height,graphWidth,graphHeight);
      rectangleInfo.SetValue(mxGraphRectangle.value);
      rectangleInfo.SetMxGraphModel(mxGraphRectangle);
      rectangleInfo.SetDescription(mxGraphRectangle.id);
      return rectangleInfo;
    }
 
  }