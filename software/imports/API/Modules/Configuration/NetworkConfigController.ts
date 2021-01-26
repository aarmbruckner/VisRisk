import NetworkConfigModel from "../../Models/ModelTemplates/Configuration/NetworkConfig/NetworkConfigModel";

export default class NetworkConfigController  {
        
    private convertConfigJSONModelToClassModel(networkConfigJSONModel : any)
    {
        if(!networkConfigJSONModel)
            return null;
        let networkConfigModel = new NetworkConfigModel(null);
        networkConfigModel.LoadFromJSONModel(networkConfigJSONModel);
        return networkConfigModel;   
    }

    private convertStorageJSONModelToClassModel(networkConfigJSONModel : any)
    {
        if(!networkConfigJSONModel)
            return null;
        let networkConfigModel = new NetworkConfigModel(null);
        networkConfigModel.LoadFromJSONModel(networkConfigJSONModel);
        return networkConfigModel;   
    }

    public GetDefaultConfig()
    {
        let networkConfigJSONString = localStorage.getItem("networkConfig");
        let networkConfigModel = null;
        if(typeof networkConfigJSONString == "undefined" || networkConfigJSONString == null || !networkConfigJSONString)
        {
            let networkConfigJSONModel = Meteor.settings.public.defaultGraphConfigurations.networkConfig;
            networkConfigModel = this.convertConfigJSONModelToClassModel(networkConfigJSONModel);
        }
        else
        {
            let networkConfigJSONModel = JSON.parse(networkConfigJSONString)
            networkConfigModel = this.convertStorageJSONModelToClassModel(networkConfigJSONModel);
        }
 
        return networkConfigModel;
    }
    
    public SaveConfig(networkConfigModel:NetworkConfigModel)
    {
        let networkConfigJSONString = JSON.stringify(networkConfigModel);
        localStorage.setItem("networkConfig", networkConfigJSONString);
        return true;
    }
 }
  