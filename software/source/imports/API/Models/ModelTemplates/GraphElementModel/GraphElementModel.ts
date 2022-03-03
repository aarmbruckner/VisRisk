import RectangleInfoModel from "../RectangleInfoModel/RectangleInfoModel";
import GridInfoModel from "../GridInfoModel/GridInfoModel";
import IJSONParseableModel from "../IJSONParseableModel";
import ElementGeometryModel from "./ElementGeometryModel";

export default class GraphElementModel implements IJSONParseableModel {
	private geometry : any;
	private heightPercentage : number;
	private widthPercentage : number;
	private impactEndPercentage : number;
	private impactStartPercentage : number;
	private likeliHoodEndPercentage : number;
	private likeliHoodStartPercentage : number;
    private value: any;

    private user;
    private timeSpentInMS;

	constructor()
	{

	}

	public LoadFromJSONModel(jsonModelS : any)
	{
		this.geometry = jsonModelS.geometry;
		this.heightPercentage = jsonModelS.heightPercentage;
		this.widthPercentage = jsonModelS.widthPercentage;
        this.impactEndPercentage = jsonModelS.impactEndPercentage;
		this.impactStartPercentage = jsonModelS.impactStartPercentage;
		this.likeliHoodEndPercentage = jsonModelS.likeliHoodEndPercentage;
        this.likeliHoodStartPercentage = jsonModelS.likeliHoodStartPercentage;  
	}
	
	public GetJSONModel(basicModel)
	{
		let jsonObject = {
			heightPercentage:this.heightPercentage,
			widthPercentage:this.widthPercentage,
			impactEndPercentage:this.impactEndPercentage,
			impactStartPercentage:this.impactStartPercentage,
			likeliHoodEndPercentage:this.likeliHoodEndPercentage,
			likeliHoodStartPercentage:this.likeliHoodStartPercentage,
            geometry:null
		}  
 
	   if(this.geometry)
	   {
		   
            let geometry = new ElementGeometryModel(); 
            geometry.LoadFromJSONModel(this.geometry);
            jsonObject.geometry = geometry.GetJSONModel(geometry);
	   } 

	   return jsonObject;
	}
}