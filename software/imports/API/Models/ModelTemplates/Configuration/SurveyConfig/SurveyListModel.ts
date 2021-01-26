import SurveyModel from "./SurveyModel";


export default class SurveyListModel  {
    private surveyDict : Map<number,SurveyModel>;



    
    constructor(surveys : any)
    {
        this.surveyDict = surveys;
    }
    
    public LoadFromJSONModel(jsonModelS : any)
    {
        this.surveyDict = new Map<number,SurveyModel>();
        if(jsonModelS)
            for (const [key, nodeJSON] of Object.entries(jsonModelS)) {
                let survey = new SurveyModel(null);
                survey.LoadFromJSONModel(nodeJSON);

                this.surveyDict.set(survey.GetId(),survey);
        };
    }

    public GetDefaultSurvey()
    {
      let defaultSurvey = null;
      if(this.surveyDict && this.surveyDict.size>0)
      {
        defaultSurvey = (this.surveyDict.values().next().value);
      }
      return defaultSurvey;
    }

    public SetSurveyDict( surveys : Map<number,SurveyModel> )
    {
        this.surveyDict = surveys;
    }
    
    public GetSurveyDict()
    {
        return this.surveyDict;
    }
    
}
 