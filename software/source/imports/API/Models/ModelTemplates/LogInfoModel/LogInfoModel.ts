import RectangleInfoModel from "../RectangleInfoModel/RectangleInfoModel";
import GridInfoModel from "../GridInfoModel/GridInfoModel";
import IJSONParseableModel from "../IJSONParseableModel";
import GraphElementModel from "../GraphElementModel/GraphElementModel";

export default class LogInfoModel implements IJSONParseableModel {
	private nodeName : string;
	private gridInfo : GridInfoModel;
	private manualDeltaEnabled : boolean;
	private originRectInfos : Array<RectangleInfoModel>;
	private editableRectInfos : Array<RectangleInfoModel>;
	private summaryRectangle : RectangleInfoModel;
	private logGraphModelElements : any;

	constructor(nodeName : string)
	{
		this.nodeName = nodeName;
		this.originRectInfos = new  Array<RectangleInfoModel>();
		this.editableRectInfos = new  Array<RectangleInfoModel>();

		this.logGraphModelElements = [];
	}

	public LoadFromJSONModel(jsonModelS : any)
	{
		this.nodeName = jsonModelS._id;
		this.manualDeltaEnabled = jsonModelS._id;
		this.logGraphModelElements = jsonModelS.logGraphModelElements;

		if(jsonModelS.gridInfo)
		{
			let gridInfo = new GridInfoModel(null,null,null,null,null,null); 
			gridInfo.LoadFromJSONModel(jsonModelS.gridInfo);
			this.gridInfo = gridInfo;
		}

		if(jsonModelS.originRectInfos)
			for (let originRectInfoJSon of jsonModelS.originRectInfos) 
			{
				let originRectInfo = new RectangleInfoModel(null,null,null,null,null,null);
				originRectInfo.LoadFromJSONModel(originRectInfoJSon);
				this.originRectInfos.push(originRectInfo);
			}

		if(jsonModelS.editableRectInfos)
			for (let editableRectInfoJSon of jsonModelS.editableRectInfos) 
			{
				let editableRectInfos = new RectangleInfoModel(null,null,null,null,null,null);
				editableRectInfos.LoadFromJSONModel(editableRectInfoJSon);
				this.editableRectInfos.push(editableRectInfos);
			}

		if(jsonModelS.summaryRectangle)
		{
			let summaryRectangle = new RectangleInfoModel(null,null,null,null,null,null); 
			summaryRectangle.LoadFromJSONModel(jsonModelS.summaryRectangle);
			this.summaryRectangle = summaryRectangle;
		}
	 
	  
	}
	
	public GetJSONModel(basicModel)
	{
		let jsonObject = {
			nodeName:this.nodeName,
			manualDeltaEnabled:this.manualDeltaEnabled,
			gridInfo:null,
			summaryRectangle:null,
			editableRectInfos:null,
			originRectInfos:null,
			logGraphModel:this.logGraphModel,
			logGraphModelElements:null
		}  
 
	
	   if(this.logGraphModelElements)
	   {
		   if(!basicModel === true)
		   {
			jsonObject.logGraphModelElements = this.logGraphModelElements;
		   }
		   else
		   {
			let newLogGraphElements = [];
			for (let logGraphElementSource of this.logGraphModelElements) {
				let logGraphElementJSON = new GraphElementModel();
				logGraphElementJSON.LoadFromJSONModel(logGraphElementSource);
				logGraphElementJSON = logGraphElementJSON.GetJSONModel(basicModel);

				newLogGraphElements.push(logGraphElementJSON);
			};
			jsonObject.logGraphModelElements = newLogGraphElements;
		   }

	   }
		
	   if(this.gridInfo)
	   {
		   jsonObject.gridInfo = this.gridInfo.GetJSONModel(basicModel);
	   }

	   if(this.summaryRectangle)
	   {
		   jsonObject.summaryRectangle = this.summaryRectangle.GetJSONModel(basicModel);
	   }

	   if(this.originRectInfos)
	   {
		   let newOriginRectInfos= [];
		   for (let originRectInfo of this.originRectInfos) {
			newOriginRectInfos.push(originRectInfo.GetJSONModel(basicModel));
		   };
		   jsonObject.originRectInfos  = newOriginRectInfos;
	   } 

	   if(this.editableRectInfos)
	   {
		   let newEditableRectInfos = [];
		   for (let originRectInfo of this.editableRectInfos) {
			newEditableRectInfos.push(originRectInfo.GetJSONModel(basicModel));
		   };
		   jsonObject.editableRectInfos  = newEditableRectInfos;
	   } 

	   return jsonObject;
	}

	
	public SetManualDeltaEnabled(manualDeltaEnabled  : boolean){
		this.manualDeltaEnabled = manualDeltaEnabled;
	}
	
	public GetManualDeltaEnabled(){
		return this.manualDeltaEnabled;
	}

	public SetNodeName(nodeName  : string){
		this.nodeName = nodeName;
	}
	
	public GetNodeName(){
		return this.nodeName;
	}
	
	public SetGridInfo(gridInfo : GridInfoModel){
		this.gridInfo = gridInfo;
	}
	
	public GetGridInfo(){
		return this.gridInfo;
	}



	public SetLogGraphModelElements(logGraphModelElements : any){
		this.logGraphModelElements = logGraphModelElements;
	}
	
	public GetLogGraphModelElements(){
		return this.logGraphModelElements;
	}

	public SetOriginRectInfos(rectInfos : Array<RectangleInfoModel>){
		this.originRectInfos = rectInfos;
	}
	
	public SetEditableRectInfos(rectInfos : Array<RectangleInfoModel>){
		this.editableRectInfos = rectInfos;
	}
	
	public AddRectInfo( rectInfo : RectangleInfoModel){
		this.originRectInfos.push(rectInfo);
		this.editableRectInfos.push(rectInfo);
	}
	
	public GetOriginRectInfos(){
		return this.originRectInfos;
	}
	
	public GetEditableRectInfos(){
		return this.editableRectInfos;
	}
	
	public RevertToOriginRectInfos(graphWidth,graphHeight){
		this.editableRectInfos = new Array<RectangleInfoModel>();
		this.originRectInfos.forEach(info => {
			let rectInfo : RectangleInfoModel = new RectangleInfoModel(info.GetPosX(), info.GetPosY(), info.GetWidth(), info.GetHeight() /* info.GetTimeStamp() */,graphWidth,graphHeight);
			rectInfo.SetDescription(info.GetDescription());
			rectInfo.SetGridLineIndexX1(info.GetGridLineIndexX1());
			rectInfo.SetGridLineIndexX2(info.GetGridLineIndexX2());
			rectInfo.SetGridLineIndexY1(info.GetGridLineIndexY1());
			rectInfo.SetGridLineIndexY2(info.GetGridLineIndexY2());
			rectInfo.SetDistanceFromX1ToNextVerticalLine(info.GetDistanceFromX1ToNextVerticalLine());
			rectInfo.SetDistanceFromX2ToPrevVerticalLine(info.GetDistanceFromX2ToPrevVerticalLine());
			rectInfo.SetDistanceFromY1ToNextHorizontalLine(info.GetDistanceFromY1ToNextHorizontalLine());
			rectInfo.SetDistanceFromY2ToPrevHorizontalLine(info.GetDistanceFromY2ToPrevHorizontalLine());
			rectInfo.SetOffsetLeft(info.GetOffsetLeft());
			rectInfo.SetOffsetRight(info.GetOffsetRight());
			rectInfo.SetOffsetTop(info.GetOffsetTop());
			rectInfo.SetOffsetBottom(info.GetOffsetBottom());
 
			this.editableRectInfos.push(info);
		});

			return this.editableRectInfos;
		}
		
		public SetSummaryRectangle(summaryRectangle : RectangleInfoModel){
			this.summaryRectangle = summaryRectangle;
		}
		
		public GetSummaryRectangle(){
			return this.summaryRectangle;
		}
}