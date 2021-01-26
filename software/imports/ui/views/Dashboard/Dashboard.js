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
import SurveyNodeSettingsModal from '../../components/Modals/Settings/SurveyNodesSettings/SurveyNodeSettingsModal'; 
 
var cloneDeep = require('lodash.clonedeep');

const T = i18n.createComponent();

class Dashboard extends Component {

 
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
        selectedSurveyNode = surveyNodes[0] ;
      }
    } 

    selectedSurveyNode = cloneDeep(selectedSurveyNode);
    
    let xAxisModel = null;
    let yAxisModel = null;
    
    if(selectedSurveyNode)
    {
      xAxisModel = selectedSurveyNode.gridConfigModel.xAxisModel;
      yAxisModel = selectedSurveyNode.gridConfigModel.yAxisModel;
    }

    this.state = {
      xAxisModel:xAxisModel,
      yAxisModel:yAxisModel,
      graph : null,
      surveyDict:surveyDict,
      oldSelectedSurvey:cloneDeep(selectedSurvey),
      oldSelectedSurveyNode:cloneDeep(selectedSurveyNode),
      selectedSurvey:cloneDeep(selectedSurvey),
      surveyNodeDict:surveyNodeDict,
      selectedSurveyNode:selectedSurveyNode
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
      this.setState({ selectedSurveyNode: nextProps.selectedSurveyNode });
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
    }
  } 

  render() {
    return ( 
        <div className="container-fluid seamless" style={{overflow: 'hidden' }} >
            <div className="form-group row dashboardTopMenu">
              <header className="app-header navbar dashboard">
                <SurveySelectorList  selectedSurveyNode = {this.state.selectedSurveyNode} setSelectedSurveyCallback={(selectedSurvey)  => this.setSelectedSurveyCallback(selectedSurvey)}  setSurveyNodeDictCallback={(surveyNodeDict)  => this.setSurveyNodeDictCallback(surveyNodeDict)} setSelectedSurveyNodeCallback={(selectedSurveyNode)  => this.setSelectedSurveyNodeCallback(selectedSurveyNode)} />
              </header>
            </div>
            <div className="form-group row dashboardTop" id="dashboardTop">
              <div className="col-md-2">
                <YAxisFrame axisModel ={this.state.yAxisModel} graph={this.state.graph} selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode} setGraphCallback={this.setGraphCallback} />
              </div>
              <div className="col-md-10 fillHeight diagramGrid" id="diagramGrid">
                <InnerGraphContainer graph={this.state.graph}  selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode} setGraphCallback={this.setGraphCallback}/>
              </div>
            </div>
            <div className="form-group row dashboardBottom">
              <div className="col-md-2 centerAxisBottom">
                <CenterAxisFrame graph={this.state.graph} selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode} setGraphCallback={this.setGraphCallback} setSelectedSurveyNodeCallback={(selectedSurveyNode)  => this.setSelectedSurveyNodeCallback(selectedSurveyNode)}/>
              </div>
              <div className="col-md-10 xAxisBottom">
                <XAxisFrame axisModel ={this.state.xAxisModel}  graph={this.state.graph} selectedSurvey={this.state.selectedSurvey} selectedSurveyNode={this.state.selectedSurveyNode}  autoScaleHeight = {true} setGraphCallback={this.setGraphCallback}/>
              </div>
            </div>
        </div>
    )
  }
}
export default withTracker(() => {
  return {
  };
})(Dashboard);
 