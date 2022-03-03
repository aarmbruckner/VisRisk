import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import GridAxisModel from '../../../../../API/Models/ModelTemplates/GridAxisModel/GridAxisModel';

const T = i18n.createComponent();

class YAxisFrame extends Component {


  constructor(props) {
    super(props);

    let axisModel = props.axisModel;
    axisModel = this.makeAxisModelSafe(axisModel);

    this.state = {
      axisModel:axisModel,
      selectedSurveyNode:props.selectedSurveyNode
    };
  }

  makeAxisModelSafe(axisModel)
  {
    if(!axisModel)
      axisModel = new GridAxisModel(" ",[],[],0);

    if(!axisModel.axisName)
    {
      axisModel.axisName = "";
    }

    if(!axisModel.levels)
    {
      axisModel.levels = [];
    }

    return axisModel;
  }

  componentDidMount() {
 
    $(".yAxisPercent").width($("#impactDescriptionContainer").width());
    $(".impactLevelOuterContainer").width($("#impactDescriptionContainer").width());
    $(".impactLevelMiddleContainer").width($("#impactDescriptionContainer").width());
    $(".impactLevelInnerContainer").width($("#impactDescriptionContainer").width());
 
    this.updateColorSteps();
  } 

  componentWillReceiveProps(nextProps){

    let axisModel = nextProps.axisModel;
    axisModel = this.makeAxisModelSafe(axisModel);

    this.setState({
      selectedSurveyNode:nextProps.selectedSurveyNode,
      axisModel:axisModel
    });
    this.updateColorSteps(nextProps.selectedSurveyNode);
  }
 
  updateColorSteps(selectedSurveyNode)
  {
    if(!selectedSurveyNode)
    {
      selectedSurveyNode = this.state.selectedSurveyNode;
    }

    let colorStep1 = Meteor.settings.public.defaultGraphConfigurations.gridConfig.colorStops[0];
    let colorStep2 = Meteor.settings.public.defaultGraphConfigurations.gridConfig.colorStops[1];

    if(selectedSurveyNode && selectedSurveyNode.gridConfigModel.colorStops  && selectedSurveyNode.gridConfigModel.colorStops.length > 1 )
    {
      colorStep1 = selectedSurveyNode.gridConfigModel.colorStops[0];
      colorStep2 = selectedSurveyNode.gridConfigModel.colorStops[1];
    }
    $('.riskImpactColorGradientVert').css({
      background: "linear-gradient(360deg, "+colorStep1+" 0%, "+colorStep2+" 100%)" 
    });
  }

  render() {
    return (
        <div className="container-fluid seamless" style={{overflow: 'visible' }} >
           <div id="impactHeaderBackground" className="form-group row h-100 impactHeaderBackground">
              <div className="impHeadOutContainer col-md-2  my-auto justify-content-center">
                <div className="impactHeaderContainer justify-content-center">
                        <div className="impactHeader justify-content-center">  
                          {this.state.axisModel.axisName} 
                      </div>
                </div>
              </div>
              <div className="col-md-10 riskImpactColorGradientVert">
                <div id="impactDescriptionContainer" className="row h-100 justify-content-center impactDescriptionContainer">
                  {
                    this.state.axisModel.levels.slice(0).reverse().map((level,index)=> (
                      <div className="col-md-12 impactDescColumn ">
                         <div className = "impactLevelOuterContainer">
                          <div className = "impactLevelMiddleContainer">
                            <div className = "impactLevelInnerContainer">
                              <div className="form-group row justify-content-center centerText md-12">
                                <a className="axisLevelName" >{level.name} </a>
                              </div>
                              <div className="form-group row justify-content-center centerText md-12">
                                <a className="impactText">{level.description}</a>
                              </div>
                            </div>
                          </div>
                        </div>
 
                        {index < this.state.axisModel.borders.length ? (
                          <div className="impactLevelOuterContainer">
                            <p  className="yAxisSepContainer row h-100" />
                            <hr id={"yAxisSeparator-"+(this.state.axisModel.borders.length-index-1).toString()} style={{visibility: 'hidden' }} className="yAxisSeparator diagramSeparator" /> 
                            <p id={"yAxisPercent-"+(this.state.axisModel.borders.length-index-1).toString()}  style={{visibility: 'hidden' }} className="yAxisPercent  justify-content-center impactDescriptionContainer yAxisPercentText">{this.state.axisModel.borders[this.state.axisModel.borders.length-index-1].description}</p>  
                          </div>
                        ) : (
                          <div/>
                        )}
 
                      </div>
                    ))
                  }
                </div>
              </div>
            </div> 
        </div>
    )
  }
}
export default YAxisFrame;
 