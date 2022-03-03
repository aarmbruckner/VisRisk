import NetworkConfigNodeModel from "./NetworkConfigNodeModel";

export default class NetworkConfigModel  {
    private nodeDict : Map<number,NetworkConfigNodeModel>;
    //private nodes : Array<NetworkConfigNodeModel> ;
    
    constructor(nodes : any)
    {
        this.nodeDict = nodes;
    }
    
    public LoadFromJSONModel(jsonModelS : any)
    {
        this.nodeDict = new Map<number,NetworkConfigNodeModel>();
        if(jsonModelS.network)
        for (const [key, nodeJSON] of Object.entries(jsonModelS.network)) {
            let node = new NetworkConfigNodeModel(null,null,null);
            node.LoadFromJSONModel(nodeJSON);

            this.nodeDict.set(node.GetId(),node);
        };
    }

    public SetNodeArray( nodes : Map<number,NetworkConfigNodeModel> )
    {
        this.nodeDict = nodes;
    }
    
    public GetNodeDict()
    {
        return this.nodeDict;
    }
    
}
 