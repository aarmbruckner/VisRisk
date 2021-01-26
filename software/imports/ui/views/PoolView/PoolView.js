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
const T = i18n.createComponent();
var cloneDeep = require('lodash.clonedeep');

class PoolView extends Component {

  constructor(props) {
    super(props);

    this.graphEventHandler = new GraphEventHandler();
    this.storageHandlerInstance = StorageHandlerFactory.GetStorageHandler();
    let surveyDict  = this.storageHandlerInstance.GetAllSurveysAsDict();
    let selectedSurvey = null;
 
    let surveyNodeDict = new Map ();
    let selectedSurveyNode = null;
    if(surveyDict  && surveyDict.size>0)
    {
      selectedSurvey = cloneDeep(this.storageHandlerInstance.GetDefaultSurvey());
      surveyNodeDict = selectedSurvey.GetSurveyNodeDict();

      let surveyNodes = Array.from(surveyNodeDict.values());
      if(surveyNodes.length>0)
      {
        selectedSurveyNode = cloneDeep(surveyNodes[0]);
      }
    }

    let xAxisModel = null;
    let yAxisModel = null;
    
    if(selectedSurveyNode)
    {
      xAxisModel = selectedSurveyNode.gridConfigModel.xAxisModel;
      yAxisModel = selectedSurveyNode.gridConfigModel.yAxisModel;
    }
 
    let pooledGraphModelElements = selectedSurveyNode.GetPooledGraphModelElements();

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
  
  } 
  
  componentWillReceiveProps(nextProps){

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
  }
 
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
            <div className="form-group row dashboardTopMenu Log">
              <header className="app-header navbar poolView">
                <SurveySelectorList  setSelectedSurveyCallback={(selectedSurvey)  => this.setSelectedSurveyCallback(selectedSurvey)}  setSurveyNodeDictCallback={(selectedSurveyNodeDict)  => this.setSurveyNodeDictCallback(selectedSurveyNodeDict)} setSelectedSurveyNodeCallback={(selectedSurveyNode)  => this.setSelectedSurveyNodeCallback(selectedSurveyNode)} />
              </header>
            </div>
            <div className="form-group row dashboardTop Log" id="dashboardTop">
              <div className="col-md-2">
                <YAxisFrame axisModel ={this.state.yAxisModel} graph={this.state.graph} setGraphCallback={this.setGraphCallback} />
              </div>
              <div className="col-md-10 fillHeight logGrid">
                <InnerGraphContainer graph={this.state.graph} model={this.state.pooledGraphModelElements}  setGraphCallback={this.setGraphCallback}/>
              </div>
            </div>
            <div className="form-group row dashboardBottom Log" id="dashboardBottomLog">
              <div className="col-md-2">
              </div>
              <div className="col-md-10">
                <XAxisFrame axisModel ={this.state.xAxisModel}  graph={this.state.graph}   autoScaleHeight = {false}  setGraphCallback={this.setGraphCallback}/>
              </div>
            </div>
            <div className="form-group row" id="MxGraphMessageSummaryRow" className="MxGraphMessageSummaryRow">
              <MxGraphMessageSummary modelArray={this.state.pooledGraphModelElements} graph={this.state.graph} />
            </div>
        </div>
    )
  }
}
export default withTracker(() => {
  return {
  };
})(PoolView);
 