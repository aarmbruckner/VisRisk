import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import XAxisFrame from '../../components/GraphContainer/AxisFrames/XAxisFrame/XAxisFrame';
import YAxisFrame from '../../components/GraphContainer/AxisFrames/YAxisFrame/YAxisFrame';
import MxGraphUtilities from '../../../API/Modules/MxGraph/Extensions/MxGraphUtilities';
import InnerGraphContainer from '../../components/GraphContainer/InnerGraphContainer/InnerGraphContainer';
import i18n from 'meteor/universe:i18n';
import LogInfoModel from '../../../API/Models/ModelTemplates/LogInfoModel/LogInfoModel';
import LogController from '../../../API/Modules/Log/LogController';
import MxGraphClassConverter from '../../../API/Modules/MxGraph/Extensions/MxGraphClassConverter';
import GridInfoModel from '../../../API/Models/ModelTemplates/GridInfoModel/GridInfoModel';
import MxGraphMessageSummary from '../../components/GraphContainer/MxGraphMessageSummary/MxGraphMessageSummary';
import Grid from 'antd/lib/card/Grid';
import SurveyListConfigController from '../../../API/Modules/Configuration/SurveyListConfigController';
import StorageHandlerFactory from '../../../API/Modules/StorageHandling/StorageHandlerFactory';
import SurveySelectorList from '../../components/SurveySelectorList/SurveySelectorList';
import DiagramControls from '../../components/DiagramControls/DiagramControls';
import CenterAxisFrame from '../../components/GraphContainer/AxisFrames/CenterAxisFrame/CenterAxisFrame';

var cloneDeep = require('lodash.clonedeep');
const T = i18n.createComponent();

class LogView extends Component {


  constructor(props) {
    super(props);
  
    this.storageHandlerInstance = StorageHandlerFactory.GetStorageHandler();
    let surveyDict  = this.storageHandlerInstance.GetAllSurveysAsDict(Meteor.userId());
    let selectedSurvey = null;
 
    let surveyNodeDict = new Map ();
    let selectedSurveyNode = null;
    if(surveyDict  && (surveyDict.size>0|| surveyDict.length >0))
    {
      selectedSurvey = cloneDeep(this.storageHandlerInstance.GetDefaultSurvey(Meteor.userId()));
      surveyNodeDict = selectedSurvey.GetSurveyNodeDict();

      let surveyNodes = Array.from(surveyNodeDict.values());
      if(surveyNodes.length>0)
      {
        selectedSurveyNode = cloneDeep(surveyNodes[0]);
      }
    }

    let xAxisModel = null;
    let yAxisModel = null;
    let logInfoModel = new LogInfoModel(null);
    let logGraphModelElements = null;

    if(selectedSurveyNode)
    {
      if(selectedSurveyNode.gridConfigModel)
      {
        xAxisModel = selectedSurveyNode.gridConfigModel.xAxisModel;
        yAxisModel = selectedSurveyNode.gridConfigModel.yAxisModel;
      }
     
      logInfoModel = selectedSurveyNode.logInfoModel;

      if(selectedSurveyNode.logInfoModel)
        logGraphModelElements = selectedSurveyNode.logInfoModel.logGraphModelElements;
    }
 
    this.state = {
      xAxisModel:xAxisModel,
      yAxisModel:yAxisModel,
      surveyDict:surveyDict,
      surveyNodeDict:surveyNodeDict,

      selectedSurvey:cloneDeep(selectedSurvey),
      selectedSurveyNode:selectedSurveyNode,

      oldSelectedSurvey:cloneDeep(selectedSurvey),
      oldSelectedSurveyNode:cloneDeep(selectedSurveyNode),

      logInfoModel:logInfoModel,
      logGraphModelElements:logGraphModelElements,
      radioLogCleaned:false,

      logGraphModel:null
    };
 
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


 
  restoreDefaultState()
  {
    
  }


  /* componentWillReceiveProps(nextProps){

    let xAxisModel = null;
    let yAxisModel = null;
    
    if(selectedSurveyNode)
    {
      xAxisModel = selectedSurveyNode.gridConfigModel.xAxisModel;
      yAxisModel = selectedSurveyNode.gridConfigModel.yAxisModel;
    }

    this.setState({ 
      xAxisModel:xAxisModel,
      yAxisModel:yAxisModel
     });

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
    }
    if(nextProps.selectedSurveyNode)
    {
      let logInfoModel = selectedSurveyNode.logInfoModel;
      this.setState({
         selectedSurveyNode: nextProps.selectedSurveyNode ,
         logInfoModel : logInfoModel
        });
    }
  } */

 
  setGraphCallback = (graph) => {
 

   /*  let logModelNodeArray = storageHandlerInstance.GetCombinedLogModel();
    let surveyDict = this.state.surveyDict;
    let defaultSurvey = this.storageHandlerInstance.GetDefaultSurvey();
    let defaultSurveyNode = (defaultSurvey.GetSurveyNodeDict().values().next().value);

    if(defaultSurveyNode)
    {
      let currDisplayedNodeId = defaultSurveyNode.GetId();
      let currDisplayedNodeName = defaultSurveyNode.GetName();
      let logInfoModel = this.GetCurrentLogInfo(currDisplayedNodeName,logModelNodeArray,graph);
      defaultSurveyNode.SetLogInfoModel(logInfoModel);
      surveyDict.set(currDisplayedNodeId,defaultSurveyNode);
    }
  
 
    this.setState({
      surveyDict: surveyDict,
      graph: graph
    });  */
  }

  handlePoolClick(e) {
    window.location = Meteor.settings.public.appInfo.serverUrl+"/pool";
  }

  handleLogCleanedOptionChange (changeEvent) {
   /* 
    let cleanedValue =  changeEvent.target.value.toLowerCase() === "true";
    let logController = new LogController();
    let defaultSurvey = this.storageHandlerInstance.GetDefaultSurvey();
    let defaultSurveyNode = (defaultSurvey.GetSurveyNodeDict().values().next().value);

    let graph = this.state.graph;
    let graphWidth = null; 
    let graphHeight = null;  
    if(graph)
    {
      graphWidth = graph.container.clientWidth;
      graphHeight =  graph.container.clientHeight;
    }

    let currDisplayedNodeName = defaultSurveyNode.GetName();
    let logModelNodeArray = this.storageHandlerInstance.GetCombinedLogModel();
    let logInfoModel = this.GetCurrentLogInfo(currDisplayedNodeName,logModelNodeArray,graph);
    logInfoModel = logController.CleanCurrentLogData(this.state.radioLogCleaned,logInfoModel,graphWidth,graphHeight);
    
    let modelArray = logInfoModel.GetEditableRectInfos();
    modelArray = MxGraphClassConverter.RectangleInfoArrayToMxGraphNodeArray(modelArray);
    this.setState({
      radioLogCleaned: cleanedValue,
      modelArray:modelArray
    }); */
  }

  setSelectedSurveyCallback(selectedSurvey){
      this.setState({
      selectedSurvey: cloneDeep(selectedSurvey)
    });  
  }

  setSurveyNodeDictCallback(surveyNodeDict){
    this.setState({
      surveyNodeDict:surveyNodeDict
    });
  } 

  setSelectedSurveyNodeCallback(surveyNode){
    this.setState({
      selectedSurveyNode:surveyNode
    });
    this.selectedSurveyNodeChanged(surveyNode);
  } 

  
  selectedSurveyNodeChanged(surveyNode)
  {
    let logInfoModel = surveyNode.logInfoModel;
    let logGraphModelElements = null;
    if(surveyNode.logInfoModel.logGraphModelElements)
    {
      logGraphModelElements = surveyNode.logInfoModel.logGraphModelElements;
    }
    this.setState({
      logInfoModel:logInfoModel,
      logGraphModelElements:logGraphModelElements
    });
  }
 
  render() {
    return (
      <div className="container-fluid seamless" style={{overflow: 'hidden' }} >
        <div className="container-fluid seamless dashboardOuterContainer" style={{overflow: 'hidden' }} >
          <div className="form-group row dashboardTop dashboardInnerContainer" id="dashboardTop">
            <div className="col-md yAxisContainer">
              <YAxisFrame axisModel = {this.state.yAxisModel} graph={this.state.logGraphModel} selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode} setGraphCallback={this.setGraphCallback} />
            </div>
            <div className="col-md fillHeight  diagramGrid" id="diagramGrid">
              <InnerGraphContainer editable={false} model={this.state.logInfoModel.logGraphModelElements}   selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode} setGraphCallback={this.setGraphCallback}/>
            </div>
            <div className="col-md fillHeight diagramControls"  id="diagramControls">
                <DiagramControls isLog={true}  graph={this.state.logGraphModel} selectedSurveyNode = {this.state.selectedSurveyNode} setSelectedSurveyCallback={(selectedSurvey)  => this.setSelectedSurveyCallback(selectedSurvey)}  setSurveyNodeDictCallback={(surveyNodeDict)  => this.setSurveyNodeDictCallback(surveyNodeDict)} setSelectedSurveyNodeCallback={(selectedSurveyNode)  => this.setSelectedSurveyNodeCallback(selectedSurveyNode)} />
              <div className="form-group row" id="MxGraphMessageSummaryRow" className="MxGraphMessageSummaryRow">
                <MxGraphMessageSummary modelArray={this.state.logGraphModelElements} graph={this.state.logGraphModel} />
              </div>
            </div>
          </div>
          <div className="form-group row dashboardBottom dashboardInnerContainer">
            <div id="centerAxisBottom" className="col-md centerAxisBottom">
              <CenterAxisFrame graph={this.state.logGraphModel} selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode} setGraphCallback={this.setGraphCallback} setSelectedSurveyNodeCallback={(selectedSurveyNode)  => this.setSelectedSurveyNodeCallback(selectedSurveyNode)}/>
            </div>
            <div className="col-md-10 xAxisBottom">
              <XAxisFrame axisModel ={this.state.xAxisModel}  graph={this.state.logGraphModel} selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode}  autoScaleHeight = {true} setGraphCallback={this.setGraphCallback}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withTracker(() => {
  return {
  };
})(LogView);
 