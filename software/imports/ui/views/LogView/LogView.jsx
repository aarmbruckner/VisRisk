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

var cloneDeep = require('lodash.clonedeep');
const T = i18n.createComponent();

class LogView extends Component {


  constructor(props) {
    super(props);
  
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
 
    let logInfoModel = selectedSurveyNode.logInfoModel;

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
      radioLogCleaned:false,

      logGraphModel:null
    };
 
  }


  componentDidMount() {
 
    
  } 


 
  restoreDefaultState()
  {
    
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
      let logInfoModel = selectedSurveyNode.logInfoModel;
      this.setState({
         selectedSurveyNode: nextProps.selectedSurveyNode ,
         logInfoModel : logInfoModel
        });
    }
  }

 
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
    this.setState({
      logInfoModel:logInfoModel
    });
  }
 
  render() {
    return (
        <div className="container-fluid seamless" style={{overflow: 'hidden' }} >
            <div className="form-group row dashboardTopMenu Log">
              <header className="app-header navbar logView">
                <div className="logSurveySelector">
                    <SurveySelectorList  setSelectedSurveyCallback={(selectedSurvey)  => this.setSelectedSurveyCallback(selectedSurvey)}  setSurveyNodeDictCallback={(selectedSurveyNodeDict)  => this.setSurveyNodeDictCallback(selectedSurveyNodeDict)} setSelectedSurveyNodeCallback={(selectedSurveyNode)  => this.setSelectedSurveyNodeCallback(selectedSurveyNode)} />
                </div>
                <div className="logSurveyOptions" >
                  <ul className="nav navbar-nav d-md-down-none right">
                    <li className="nav-item px-3 ">
                      <div className="col-md-12">
                        <div className="radio radioContainer">
                          <label htmlFor="radio1">
                            <input className="radioInput" type="radio" id="radioLogUnCleaned" name="radioLogCleanRadioB" value={false} checked={this.state.radioLogCleaned === false}  onChange={this.handleLogCleanedOptionChange.bind(this)}/><T>common.topMenu.uncleaned</T>
                          </label>
                        </div>
                        <div className="radio radioContainer">
                          <label htmlFor="radio2">
                            <input className="radioInput" type="radio" id="radioLogCleaned" name="radioLogCleanRadioB" value={true} checked={this.state.radioLogCleaned === true}   onChange={this.handleLogCleanedOptionChange.bind(this)} /><T>common.topMenu.cleaned</T>
                          </label>
                        </div>
                        </div>
                    </li>
                    <li className="nav-item px-3 ">
                      <button type="button" className="btn btn-outline-secondary"><T>common.topMenu.revertToOrigin</T></button>
                    </li>
                    <li className="nav-item px-3 ">
                      <button type="button" className="btn btn-outline-secondary"><T>common.topMenu.saveChanges</T></button>
                    </li>
                    <li className="nav-item px-3 ">
                      <button onClick={this.handlePoolClick.bind(this)} type="button" className="btn btn-outline-secondary"><T>common.topMenu.pool</T></button>
                    </li>
                  </ul>
                </div>
              </header>
            </div>
            <div className="form-group row dashboardTop Log" id="dashboardTop">
              <div className="col-md-2">
                <YAxisFrame axisModel ={this.state.yAxisModel} graph={this.state.logGraphModel} setGraphCallback={this.setGraphCallback} />
              </div>
              <div className="col-md-10 fillHeight logGrid">
                <InnerGraphContainer /*  graph={this.state.logGraphModel} */ model={this.state.logInfoModel.logGraphModelElements}  setGraphCallback={this.setGraphCallback}/>
              </div>
            </div>
            <div className="form-group row dashboardBottom Log" id="dashboardBottomLog">
              <div className="col-md-2">
              </div>
              <div className="col-md-10">
                <XAxisFrame  axisModel ={this.state.xAxisModel}  modelArray={this.state.logInfoModel.logGraphModelElements} autoScaleHeight = {false} graph={this.state.logGraphModel} setGraphCallback={this.setGraphCallback}/>
              </div>
            </div>
            <div className="form-group row" id="MxGraphMessageSummaryRow" className="MxGraphMessageSummaryRow">
              <MxGraphMessageSummary modelArray={this.state.logInfoModel.logGraphModelElements} graph={this.state.logGraphModel} />
            </div>
        </div>
    )
  }
}
export default withTracker(() => {
  return {
  };
})(LogView);
 