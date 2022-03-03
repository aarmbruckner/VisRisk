import React, { Component } from 'react';
import {Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import XAxisFrame from '../../components/GraphContainer/AxisFrames/XAxisFrame/';
import YAxisFrame from '../../components/GraphContainer/AxisFrames/YAxisFrame/';
import CenterAxisFrame from '../../components/GraphContainer/AxisFrames/CenterAxisFrame/';
import InnerGraphContainer from '../../components/GraphContainer/InnerGraphContainer/';

import i18n from 'meteor/universe:i18n';
import SurveyListConfigController from '../../../API/Modules/Configuration/SurveyListConfigController';
import StorageHandlerFactory from '../../../API/Modules/StorageHandling/StorageHandlerFactory';
import SurveySelectorList from '../../components/SurveySelectorList';
import DiagramControls from '../../components/DiagramControls/DiagramControls';
import SurveyNodeSettingsModal from '../../components/Modals/Settings/SurveyNodesSettings/SurveyNodeSettingsModal'; 

import NoSurveysFound from '../../components/GraphContainer/NoSurveysFound/NoSurveysFound';
import SurveyCompleted from '../../components/GraphContainer/SurveyCompleted/SurveyCompleted';

 
var cloneDeep = require('lodash.clonedeep');

const T = i18n.createComponent();

class Dashboard extends Component {

 
  constructor(props) {
    super(props);

    this.storageHandlerInstance = StorageHandlerFactory.GetStorageHandler();
    let surveyDict  = this.storageHandlerInstance.GetAllSurveysAsDict(Meteor.userId());
    let selectedSurvey = null;
 
    let surveyNodeDict = new Map ();
    let selectedSurveyNode = null;
    let noDataFound = false;
    let surveyCompleted = false;

    if(surveyDict  && surveyDict.size>0)
    {
      let surveyId = Session.get('surveyId');
      if(surveyId)
      {
        selectedSurvey = cloneDeep(this.storageHandlerInstance.GetSurveyById(surveyId));
        if(!selectedSurvey)
        {
          selectedSurvey = cloneDeep(this.storageHandlerInstance.GetDefaultSurvey(Meteor.userId()));
        }
      }
      else{
        selectedSurvey = cloneDeep(this.storageHandlerInstance.GetDefaultSurvey(Meteor.userId()));
      }
     

      if(selectedSurvey)
        surveyNodeDict = selectedSurvey.GetSurveyNodeDict();

      let surveyNodes = Array.from(surveyNodeDict.values());
      if(surveyNodes.length>0)
      {
        let nextSurveyNode = this.storageHandlerInstance.GetNextSurveyNodeOfUser(Meteor.userId(),selectedSurvey._id); 

        if(!nextSurveyNode)
        {
          surveyCompleted = true;
        }
        else{
          selectedSurveyNode = nextSurveyNode;
        }
        
      }
    } 
    else{
      noDataFound = true;
    }

    selectedSurveyNode = cloneDeep(selectedSurveyNode);
    
    let xAxisModel = null;
    let yAxisModel = null;
    
    if(selectedSurveyNode)
    {
      if(selectedSurveyNode.gridConfigModel)
      {
        xAxisModel = selectedSurveyNode.gridConfigModel.xAxisModel;
        yAxisModel = selectedSurveyNode.gridConfigModel.yAxisModel;
      }

    }
    
    if(selectedSurvey)
      Session.set('surveyId', selectedSurvey._id);
    this.state = {
      xAxisModel:xAxisModel,
      yAxisModel:yAxisModel,
      graph : null,
      surveyDict:surveyDict,
      surveyEditorAccess:false,
      oldSelectedSurvey:cloneDeep(selectedSurvey),
      oldSelectedSurveyNode:cloneDeep(selectedSurveyNode),
      selectedSurvey:cloneDeep(selectedSurvey),
      surveyNodeDict:surveyNodeDict,
      selectedSurveyNode:selectedSurveyNode,
      surveyCompleted:surveyCompleted
    };

    this.updateAccess();
  }

  
  updateAccess()
  {
    let userId = Session.get('userId');
 
    {Meteor.call('AccountController.Methods.GetUserRoles',{user:userId}, (error, userRoles) => {

      if(userRoles && userRoles.includes("admin"))
      {
        this.setState({
          surveyEditorAccess: true
        });
      }
  
    })};
  }

  componentDidMount() {

    let centerAxisBottom = $("#centerAxisBottom").first();
    let impactHeaderBackground =  $("#impactHeaderBackground").first();
    let dashboardBottom  =  $(".dashboardBottom").first();
    let graphContainer =  $(".graph-container").first();
    let bottomHeight =  centerAxisBottom.outerHeight();
 
    let mainContainer = $(".mainContainer").first();


    let centerAxisBottomOuterHeight = centerAxisBottom.outerHeight();
    let height = mainContainer.height()-centerAxisBottomOuterHeight;
    $(".dashboardTop").height(height);
 

    $("#hiddenCanvas").width(height);
    $("#hiddenCanvas").height(height); 

    $("#diagramGrid").width(height);
    $("#diagramGrid").height(height); 
    $('#diagramGrid').css({"min-width":height+"px"});
    $('#diagramGrid').css({"max-width":height+"px"});
    
    $(".likeliHoodDescriptionContainer").height(bottomHeight);
    $('.likeliHoodDescriptionContainer').css({"maxHeight":bottomHeight});

    if(!this.state.selectedSurveyNode)
    {
      $(".dashboardInnerContainer").css("pointer-events", "none");
    }
    else
    {
      $('.dashboardInnerContainer').removeAttr('"pointer-events');
    }

    let impactHeaderBackgroundWidth = impactHeaderBackground.width();
 

    $("#centerAxisBottom").width(impactHeaderBackgroundWidth);  
    $('#centerAxisBottom').css('max-width',impactHeaderBackgroundWidth+'px');
    $('#centerAxisBottom').css('min-width',impactHeaderBackgroundWidth+'px');
    $('#centerAxisBottom').css('margin-left','15px');
 
    let xAxisBottomWidth = dashboardBottom.width()-(impactHeaderBackgroundWidth+15);
 

    let graphContainerWidth = graphContainer.width();
 
    $(".xAxisBottom").width(graphContainerWidth);  
    $('.xAxisBottom').css('max-width',graphContainerWidth+'px');
    $('.xAxisBottom').css('min-width',graphContainerWidth+'px');

    let likeliHoodDescriptionContainerHeight = $("#likeliHoodDescriptionContainer").height();
    let likeliHoodHeaderOuterContainerHeight =  $("#likeliHoodHeaderOuterContainer").height();
    let likeliHoodAxisLevelsContainerHeight =  $("#likeliHoodAxisLevelsContainer").height();
    let likeliHoodHeaderContainerHeight = likeliHoodDescriptionContainerHeight-likeliHoodHeaderOuterContainerHeight-likeliHoodAxisLevelsContainerHeight;
 
    $("#likeliHoodHeaderContainer").height(likeliHoodHeaderContainerHeight);
  } 
 
  componentWillReceiveProps(nextProps){

    let xAxisModel = null;
    let yAxisModel = null;
    
    if(nextProps.selectedSurveyNode)
    {
      this.setState({ selectedSurveyNode: nextProps.selectedSurveyNode });
      xAxisModel = selectedSurveyNode.gridConfigModel.xAxisModel;
      yAxisModel = selectedSurveyNode.gridConfigModel.yAxisModel;

      this.setState({ 
        xAxisModel:xAxisModel,
        yAxisModel:yAxisModel
      });
    }

    if(nextProps.graph)
    {
      this.setState({ graph: nextProps.graph });
    }
    if(nextProps.surveyDict)
    {
      this.setState({ surveyDict: nextProps.surveyDict });
    }
    if(nextProps.surveyNodeDict)
    {
      this.setState({ surveyNodeDict: nextProps.surveyNodeDict });
    }
    if(nextProps.selectedSurvey)
    {
      this.setState({ selectedSurvey: nextProps.selectedSurvey });
      if(nextProps.selectedSurvey)
        Session.set('surveyId', nextProps.selectedSurvey._id);
    }

  }
 
  setGraphCallback = (graph) => {
    this.setState({
      graph: graph
    }); 
  }


  setSelectedSurveyCallback(selectedSurvey,edit){
     this.setState({
      selectedSurvey: cloneDeep(selectedSurvey)
    });  
  }

  setSurveyNodeDictCallback(surveyNodeDict,edit){
    if(edit!=true)
    {
      this.setState({
        surveyNodeDict:surveyNodeDict
      }); 
    }
  } 

  setSelectedSurveyNodeCallback(surveyNode,edit){
    if(edit!=true)
    {
 
      this.setState({
        selectedSurveyNode:surveyNode
      }); 

      let xAxisModel = null;
      let yAxisModel = null;
      
      if(surveyNode && surveyNode.gridConfigModel)
      {
        xAxisModel = surveyNode.gridConfigModel.xAxisModel;
        yAxisModel = surveyNode.gridConfigModel.yAxisModel;
      }
  
      this.setState({ 
        xAxisModel:xAxisModel,
        yAxisModel:yAxisModel
      });

      if(!surveyNode)
      {
        $(".dashboardInnerContainer").css("pointer-events", "none");
      }
      else
      {
        $('.dashboardInnerContainer').removeAttr('"pointer-events');
      }
  
    }
  } 

  render() {
    return ( 
        <div className="container-fluid seamless dashboardOuterContainer" style={{overflow: 'hidden' }} >

            {this.state.surveyEditorAccess != true && this.state.surveyCompleted === true ? (
                 <SurveyCompleted/>
            ) : (


               <div>
                  {!this.state.selectedSurveyNode ? (
                    <NoSurveysFound/>
                  ) : (
                    <div>
                        <div className="form-group row dashboardTop dashboardInnerContainer" id="dashboardTop">
                          <div className="col-md yAxisContainer">
                            <YAxisFrame axisModel ={this.state.yAxisModel} graph={this.state.graph} selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode} setGraphCallback={this.setGraphCallback} />
                          </div>
                          <div className="col-md fillHeight  diagramGrid" id="diagramGrid">
                            <InnerGraphContainer editable={true} graph={this.state.graph}  selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode} setGraphCallback={this.setGraphCallback}/>
                          </div>
                          <div className="col-md fillHeight diagramControls"  id="diagramControls">
                            <DiagramControls isDashboard={true}  graph={this.state.graph} selectedSurveyNode = {this.state.selectedSurveyNode} setSelectedSurveyCallback={(selectedSurvey)  => this.setSelectedSurveyCallback(selectedSurvey)}  setSurveyNodeDictCallback={(surveyNodeDict)  => this.setSurveyNodeDictCallback(surveyNodeDict)} setSelectedSurveyNodeCallback={(selectedSurveyNode)  => this.setSelectedSurveyNodeCallback(selectedSurveyNode)} />
                          </div>
                        </div>
                        <div className="form-group row dashboardBottom dashboardInnerContainer">
                          <div id="centerAxisBottom" className="col-md centerAxisBottom">
                            <CenterAxisFrame graph={this.state.graph} selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode} setGraphCallback={this.setGraphCallback} setSelectedSurveyNodeCallback={(selectedSurveyNode)  => this.setSelectedSurveyNodeCallback(selectedSurveyNode)}/>
                          </div>
                          <div className="col-md-10 xAxisBottom">
                            <XAxisFrame axisModel ={this.state.xAxisModel}  graph={this.state.graph} selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode}  autoScaleHeight = {true} setGraphCallback={this.setGraphCallback}/>
                          </div>
                        </div>
                    </div>)}
             </div> 

          )}
                      
        </div>
    )
  }
}
export default withTracker(() => {
  return {
  };
})(Dashboard);
 