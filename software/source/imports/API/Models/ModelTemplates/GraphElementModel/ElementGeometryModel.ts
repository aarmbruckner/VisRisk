import RectangleInfoModel from "../RectangleInfoModel/RectangleInfoModel";
import GridInfoModel from "../GridInfoModel/GridInfoModel";
import IJSONParseableModel from "../IJSONParseableModel";

export default class ElementGeometryModel implements IJSONParseableModel {
	private height : number;
	private width : number;
	private x : number;
	private y : number;


	constructor()
	{

	}

	public LoadFromJSONModel(jsonModelS : any)
	{
		this.height = jsonModelS.height;
		this.width = jsonModelS.width;
		this.x = jsonModelS.x;
        this.y = jsonModelS.y;
	}
	
	public GetJSONModel(basicModel)
	{
		let jsonObject = {
			height:this.height,
			width:this.width,
			x:this.x,
			y:this.y
		}  

	   return jsonObject;
	}
}