import LocalStorageHandler from "./LocalStorageHandler";
import MongoDBStorageHandler from "./MongoDBStorageHandler";

export default class StorageHandlerFactory {
    public static GetStorageHandler()
    {
        let storageProviderOption = Meteor.settings.public.storage.storageProvider;
        if(storageProviderOption.toUpperCase()==="LOCALSTORAGE")
        {
            return new LocalStorageHandler();
        }
        return new MongoDBStorageHandler();
    }
}