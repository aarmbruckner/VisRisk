import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import GridAxisModel from '../../../../../API/Models/ModelTemplates/GridAxisModel/GridAxisModel';

const T = i18n.createComponent();

class XAxisFrame extends Component {


  constructor(props) {
    super(props);

    let axisModel = props.axisModel;
    axisModel = this.makeAxisModelSafe(axisModel);
    
    this.state = {
      autoScaleHeight:props.autoScaleHeight,
      selectedSurveyNode:props.selectedSurveyNode,
      axisModel:axisModel
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
    
   this.rescaleLikeliHoodContainers();
   this.updateColorSteps();
  } 

  componentWillReceiveProps(nextProps){

    let axisModel = nextProps.axisModel;
    axisModel = this.makeAxisModelSafe(axisModel);

    this.setState({
      axisModel:axisModel,
      selectedSurveyNode:nextProps.selectedSurveyNode,
      autoScaleHeight: nextProps.autoScaleHeight
    });
    this.updateColorSteps(nextProps.selectedSurveyNode);
  }
  
  rescaleLikeliHoodContainers()
  {
    let likeliHoodDescriptionContainerHeight = $("#likeliHoodDescriptionContainer").height();

    if(this.state.autoScaleHeight == false)
    {
 
      $('#likeliHoodHeaderOuterContainer').css({
        marginbottom: '0px'
      });

    
      $("#dashboardBottomLog").height(likeliHoodDescriptionContainerHeight);

      $('#likeliHoodHeaderOuterContainer').css({
        position: 'absolute'
      });
    }
    else
    {
      let impactHeaderBackgroundWidth = $("#impactHeaderBackground").width();
      let impactDescriptionContainerWidth = $("#impactDescriptionContainer").width();
      let descriptonHeight = impactHeaderBackgroundWidth-impactDescriptionContainerWidth;
      $("#likeliHoodHeaderOuterContainer").height(descriptonHeight);

      let currentOuterHeaderPosition = $('#likeliHoodHeaderOuterContainer').offset();
      let app_footerPosition = $('#app-footer').offset(); 
      
      $('#likeliHoodHeaderOuterContainer').css({
        position: 'absolute'
      });

      $('#likeliHoodHeaderOuterContainer').offset({
      /*   top: app_footerPosition.top-descriptonHeight, */
        left: currentOuterHeaderPosition.left 
      });
    }

    let levelCount = this.state.axisModel.levels.length;

    let widthPercentPart =  33;
    if(levelCount>0)
    {
      widthPercentPart = 100/levelCount;
    }

    $("#xAxisLevelContainer").width(widthPercentPart+"%");
 
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
    $('.riskImpactColorGradientHoriz').css({
      background: "linear-gradient(90deg, "+colorStep1+" 0%, "+colorStep2+" 100%)" 
    });
  }
 
 
  render() {
    return (
        <div id="likeliHoodDescriptionContainer" className="likeliHoodDescriptionContainer container-fluid seamless" style={{overflow: 'visible' }} >
           <div id="likeliHoodAxisLevelsContainer" className="form-group row justify-content-center likeliHoodTextContainer riskImpactColorGradientHoriz">
              {
                this.state.axisModel.levels.map((level,index)=> (
                  <div className="col-md xAxisLevelContainer xAxisLevelHeader"  id={"xAxisLevelName-"+(index).toString()} >
                    <a>{level.name} </a>
                  </div>
                ))
              }
           </div>

           <div id="likeliHoodHeaderContainer" className=" form-group row justify-content-center likeliHoodHeaderContainer likeliHoodTextContainer likelihoodForm riskImpactColorGradientHoriz">
              {
                this.state.axisModel.levels.map((level,index)=> (
                  <div className="col-md xAxisLevelContainer" id={"xAxisLevelDescription-"+(index).toString()} >
                    <a>{level.description} </a>
                  </div>
                ))
              }
           </div>

            <div id="likeliHoodHeaderOuterContainer" className=" likeliiHoodAxisDescContainer form-group row justify-content-center likeliHoodHeaderOuterContainer">
              <div className="col-md-12 likeliHoodHeaderInnerContainer">
                <div className="likeliHoodHeaderTextContainer" id="likeliHoodHeaderTextContainer">
                    <div className="likeliHoodTextContainer likeliHoodHeaderTextContainer">
                      <a > {this.state.axisModel.axisName} </a>
                    </div>
                </div>
              </div>
            </div>
        </div>
    )
  }
}
export default XAxisFrame;
 