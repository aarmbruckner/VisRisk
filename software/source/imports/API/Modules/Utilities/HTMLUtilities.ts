import i18n from 'meteor/universe:i18n';
import SurveyModel, { SurveyModelCollection } from '../../Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel';

class HTMLUtilities  {

    public static GetLogOutURL()
    {
        let surveyparams = Session.get('surveyparams');
        let surveyId = Session.get('surveyId');
        let username = Session.get('username');
        let userId = Session.get('userId');

        let selectedSurvey = SurveyModelCollection.findOne(
            {_id:surveyId}
        );

        if(!surveyId || !username || !selectedSurvey)
            return null;
        let newUrl = selectedSurvey.exitURL;

        if(surveyparams &&  selectedSurvey)
         newUrl  = HTMLUtilities.UpdateQueryString("surveyparams", surveyparams,  selectedSurvey.exitURL);

        if(username)
         newUrl  = HTMLUtilities.UpdateQueryString("username", username,  newUrl);

        if(userId)
         newUrl  = HTMLUtilities.UpdateQueryString("userId", userId,  newUrl);

        newUrl  = HTMLUtilities.UpdateQueryString("surveyId", surveyId,  newUrl);

        let castSurvey = new SurveyModel();
        castSurvey.LoadFromJSONModel(selectedSurvey);
        if(castSurvey.surveyNodes.size>=1)
        {
            let userProgress = castSurvey.surveyProgress.get(userId);
            if(userProgress)
            {
                let lastFinishedSurveyNodeId = userProgress.lastSurveyNodeId;
                let lastSurveyNode = Array.from(castSurvey.surveyNodes.values()).pop();
                if(lastFinishedSurveyNodeId == lastSurveyNode._id)
                {
                    newUrl  = HTMLUtilities.UpdateQueryString("surveyfinished", true,  newUrl);
                }
                else
                {
                    newUrl  = HTMLUtilities.UpdateQueryString("surveyfinished", false,  newUrl);
                }
            }
            else{
                newUrl  = HTMLUtilities.UpdateQueryString("surveyfinished", false,  newUrl); 
            }
        }
        
        return newUrl; 
    }

    public static ArrayBufferToBase64(buffer) {
        let binary = '';
        let bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    public static DataURItoBlob(dataURI) {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: 'application/pdf'});
        return blob;
    };

    public static UpdateQueryString(key, value, url) {
        if (!url) url = window.location.href;
    
        let updated = ''
        var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
            hash;
    
        if (re.test(url)) {
            if (typeof value !== 'undefined' && value !== null) {
                updated = url.replace(re, '$1' + key + "=" + value + '$2$3');
            } 
            else {
                hash = url.split('#');
                url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
                if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
                    url += '#' + hash[1];
                }
                updated = url;
            }
        }
        else {
            if (typeof value !== 'undefined' && value !== null) {
                var separator = url.indexOf('?') !== -1 ? '&' : '?';
                hash = url.split('#');
                url = hash[0] + separator + key + '=' + value;
                if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
                    url += '#' + hash[1];
                }
                updated = url;
            }
            else {
                updated = url;
            }
        }
        return updated;
       
    }
}

export default HTMLUtilities ;