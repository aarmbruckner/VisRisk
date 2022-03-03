import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import XAxisFrame from '../../components/GraphContainer/AxisFrames/XAxisFrame/XAxisFrame';
import YAxisFrame from '../../components/GraphContainer/AxisFrames/YAxisFrame/YAxisFrame';
import MxGraphUtilities from '../../../API/Modules/MxGraph/Extensions/MxGraphUtilities';
import InnerGraphContainer from '../../components/GraphContainer/InnerGraphContainer/InnerGraphContainer';
import i18n from 'meteor/universe:i18n';
import MxGraphMessageSummary from '../../components/GraphContainer/MxGraphMessageSummary/MxGraphMessageSummary';
import GraphEventHandler from '../../../API/Modules/MxGraph/Eventhandling/GraphEventHandler';
import SurveySelectorList from '../../components/SurveySelectorList/SurveySelectorList';
import StorageHandlerFactory from '../../../API/Modules/StorageHandling/StorageHandlerFactory';
import DiagramControls from '../../components/DiagramControls/DiagramControls';
const T = i18n.createComponent();
var cloneDeep = require('lodash.clonedeep');

class PoolView extends Component {

  constructor(props) {
    super(props);

    this.graphEventHandler = new GraphEventHandler();
    this.storageHandlerInstance = StorageHandlerFactory.GetStorageHandler();
    let surveyDict  = this.storageHandlerInstance.GetAllSurveysAsDict(Meteor.userId());
    let selectedSurvey = null;
 
    let surveyNodeDict = new Map ();
    let selectedSurveyNode = null;
    if(surveyDict  && (surveyDict.size>0 || surveyDict.length >0))
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
    let pooledGraphModelElements = null;

    if(selectedSurveyNode)
    {
      if(selectedSurveyNode.gridConfigModel)
      {
        xAxisModel = selectedSurveyNode.gridConfigModel.xAxisModel;
        yAxisModel = selectedSurveyNode.gridConfigModel.yAxisModel;
      }
      pooledGraphModelElements = selectedSurveyNode.GetPooledGraphModelElements();
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

      pooledGraphModelElements:pooledGraphModelElements
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
  
 /*  componentWillReceiveProps(nextProps){

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
      let pooledGraphModelElements = selectedSurveyNode.GetPooledGraphModelElements();
      this.setState({
         selectedSurveyNode: nextProps.selectedSurveyNode ,
         pooledGraphModelElements : pooledGraphModelElements
        });
    }
  } */
 
  setGraphCallback = (graph) => {
    if(!this.state.selectedSurveyNode)
      return;
    let poolGraph = this.graphEventHandler.GetPoolGraph(this.state.selectedSurveyNode,graph);
    let eventHandler = new GraphEventHandler();

    let poolModel = eventHandler.GetGraphModelElements(poolGraph);
    this.setState({
      graph: poolGraph,
      pooledGraphModelElements:poolModel
    });  
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
  let graph = this.state.graph;
  graph.getModel().clear();
  let poolGraph = this.graphEventHandler.GetPoolGraph(surveyNode,this.state.graph);
  let eventHandler = new GraphEventHandler();
  let poolModel = eventHandler.GetGraphModelElements(poolGraph); 
  //let pooledGraphModelElements = surveyNode.GetPooledGraphModelElements();
  this.setState({
    graph: poolGraph,
    pooledGraphModelElements:poolModel
  });
} 
 
  render() {
    return (
      <div className="container-fluid seamless" style={{overflow: 'hidden' }} >
        <div className="container-fluid seamless dashboardOuterContainer" style={{overflow: 'hidden' }} >
          <div className="form-group row dashboardTop dashboardInnerContainer" id="dashboardTop">
            <div className="col-md yAxisContainer">
              <YAxisFrame axisModel ={this.state.yAxisModel} graph={this.state.graph} selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode} setGraphCallback={this.setGraphCallback} />
            </div>
            <div className="col-md fillHeight  diagramGrid" id="diagramGrid">
              <InnerGraphContainer editable={false} graph={this.state.graph}   model={this.state.pooledGraphModelElements} selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode} setGraphCallback={this.setGraphCallback}/>
            </div>
            <div className="col-md fillHeight diagramControls"  id="diagramControls">
                <DiagramControls isPool={true}  graph={this.state.graph} selectedSurveyNode = {this.state.selectedSurveyNode} setSelectedSurveyCallback={(selectedSurvey)  => this.setSelectedSurveyCallback(selectedSurvey)}  setSurveyNodeDictCallback={(surveyNodeDict)  => this.setSurveyNodeDictCallback(surveyNodeDict)} setSelectedSurveyNodeCallback={(selectedSurveyNode)  => this.setSelectedSurveyNodeCallback(selectedSurveyNode)} />  
                <div className="form-group row" id="MxGraphMessageSummaryRow" className="MxGraphMessageSummaryRow">
                  <MxGraphMessageSummary modelArray={this.state.pooledGraphModelElements} graph={this.state.graph} />
                </div>
            </div>   
          </div>
          <div className="form-group row dashboardBottom dashboardInnerContainer">
            <div id="centerAxisBottom" className="col-md centerAxisBottom">
            </div>
            <div className="col-md-10 xAxisBottom">
              <XAxisFrame axisModel ={this.state.xAxisModel}  graph={this.state.graph} selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode}  autoScaleHeight = {true} setGraphCallback={this.setGraphCallback}/>
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
})(PoolView);
 