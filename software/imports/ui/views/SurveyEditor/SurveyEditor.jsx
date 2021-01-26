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
import SurveyEditorTable from '../../components/SurveyEditorTable/SurveyEditorTable';
import SurveyEditorDetails from '../../components/SurveyEditorDetails/SurveyEditorDetails';
import SurveyNodesTable from '../../components/SurveyNodesTable/SurveyNodesTable';
import SurveyNodesDetails from '../../components/SurveyNodesDetails/SurveyNodesDetails';
import SurveyListConfigController from '../../../API/Modules/Configuration/SurveyListConfigController';
import StorageHandlerFactory from '../../../API/Modules/StorageHandling/StorageHandlerFactory';
import SurveyNodeModel from '../../../API/Models/ModelTemplates/Configuration/SurveyConfig/SurveyNodeModel';
import SurveyModel from '../../../API/Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel';
import _uniqueId from 'lodash/uniqueId';

var cloneDeep = require('lodash.clonedeep');

const T = i18n.createComponent();

class SurveyEditor extends Component {

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

    let surveyNodesDisabled = true;
    if(selectedSurvey)
      surveyNodesDisabled = false;

    this.state = {
      graph : null,
      surveyDict:surveyDict,
      oldSelectedSurvey:cloneDeep(selectedSurvey),
      oldSelectedSurveyNode:cloneDeep(selectedSurveyNode),
      selectedSurvey:cloneDeep(selectedSurvey),
      surveyNodeDict:surveyNodeDict,
      selectedSurveyNode:cloneDeep(selectedSurveyNode),
      surveyNodesDisabled:surveyNodesDisabled,
    };

  }

  componentDidMount() {
    this.setSelectedSurvey(this.state.selectedSurvey,false);
  } 
  
  componentWillReceiveProps(nextProps){
  
  }

  updateSurveyInDict(selectedSurvey,surveyDict)
  {
    surveyDict.set(selectedSurvey._id,selectedSurvey);
    return surveyDict;
  }

  updateSurveyNodeInDict(selectedSurvey,selectedSurveyNode,surveyNodeDict)
  {
    surveyNodeDict.set(selectedSurveyNode._id,selectedSurveyNode);
    return surveyNodeDict;
  }

  insertSurveyInDict(selectedSurvey,surveyDict)
  {
    surveyDict.set(selectedSurvey._id,selectedSurvey);
    return surveyDict;
  }

  insertSurveyNodeInDict(selectedSurvey,selectedSurveyNode,surveyNodeDict)
  {
   
    surveyNodeDict.set(selectedSurveyNode._id,selectedSurveyNode);
    return surveyNodeDict;
  }


  setSelectedSurvey = (selectedSurvey,edit) => {
    if(!selectedSurvey)
      return;

    let surveyNodeDict = selectedSurvey.GetSurveyNodeDict();

    let selectedSurveyNode = null;
    if(surveyNodeDict)
    {
      let surveyNodes = Array.from(surveyNodeDict.values());
      if(surveyNodes.length>0)
      {
        selectedSurveyNode = cloneDeep(surveyNodes[0]);
      }
    }
    else
    {
      surveyNodeDict = new Map ();
    }

    this.setState({
      selectedSurvey: cloneDeep(selectedSurvey),
      surveyNodeDict:surveyNodeDict,
      selectedSurveyNode:cloneDeep(selectedSurveyNode)
    }); 

    if(selectedSurveyNode)
    {
      this.setState({
        surveyNodesDisabled:false
      }); 
    }

    if(edit==false)
    {
      this.setState({
        oldSelectedSurvey: cloneDeep(selectedSurvey)
      }); 
    }
  }

  setSelectedSurveyNode = (selectedSurveyNode,edit) => {
    this.setState({
      selectedSurveyNode: cloneDeep(selectedSurveyNode)
    }); 

    if(selectedSurveyNode)
    {
      this.setState({
        surveyNodesDisabled:false
      }); 
    }
  
    if(edit==false)
    {
      this.setState({
        oldSelectedSurveyNode: cloneDeep(selectedSurveyNode)
      }); 
    }
  }
  


   submitNewSurvey = async () => {
    let selectedSurvey = this.state.selectedSurvey;
    if(!selectedSurvey)
      selectedSurvey = new SurveyModel(null);  


    let surveyDict = this.state.surveyDict;
    selectedSurvey = cloneDeep(selectedSurvey); 
    delete selectedSurvey.surveyNodes;
    delete selectedSurvey._id;
    
    let surveyNodeDict = new Map ();
    selectedSurvey._id = await this.storageHandlerInstance.SaveSurvey(selectedSurvey);

    surveyDict = this.insertSurveyInDict(selectedSurvey,surveyDict);

    this.setState({
      surveyDict: surveyDict,
      surveyNodeDict:surveyNodeDict,
      selectedSurvey:cloneDeep(selectedSurvey)
    }); 

  }

  submitNewSurveyNode = () => {
    let selectedSurvey = this.state.selectedSurvey;
    if(!selectedSurvey)
      selectedSurvey = new SurveyModel(null);  
    let selectedSurveyNode = this.state.selectedSurveyNode;
    if(!selectedSurveyNode)
      selectedSurveyNode =  new SurveyNodeModel(null,null,null,null,1);
    let surveyNodeDict = this.state.surveyNodeDict;

    selectedSurveyNode = cloneDeep(selectedSurveyNode); 
    
    let surveyNodes = Array.from(surveyNodeDict.values());
    let nextId = 0;

    if(surveyNodes.length>0)
    {
      
      for(let surveyNode of surveyNodes)
      {
        if(parseInt(surveyNode._id)>=nextId)
        {
          nextId = parseInt(surveyNode._id)+1;
        }
      }
    }
    
    selectedSurveyNode._id = nextId;
    surveyNodeDict = this.insertSurveyNodeInDict(selectedSurvey,selectedSurveyNode,surveyNodeDict);

    selectedSurvey.SetSurveyNodeDict(surveyNodeDict);

    this.setState({
      surveyNodeDict: surveyNodeDict,
      selectedSurvey:cloneDeep(selectedSurvey),
      selectedSurveyNode:cloneDeep(selectedSurveyNode)
    }); 

    if(selectedSurveyNode)
    {
      this.setState({
        surveyNodesDisabled:false
      }); 
    }
    this.storageHandlerInstance.SaveSurvey(selectedSurvey);
    return surveyNodeDict;
  }
  
  submitSurveyEdit = () => {
    let selectedSurvey = this.state.selectedSurvey;
    if(!selectedSurvey)
      selectedSurvey = new SurveyModel(null);  

    let surveyDict = this.state.surveyDict;
    surveyDict = this.updateSurveyInDict(selectedSurvey,surveyDict);
    
    this.storageHandlerInstance.SaveSurvey(selectedSurvey);
    this.setState({
      surveyDict: surveyDict,
      selectedSurvey:cloneDeep(selectedSurvey)
    }); 
  }

  submitSurveyNodeEdit = () => {

    let surveyNodeDict = this.state.surveyNodeDict;
    if(!surveyNodeDict || surveyNodeDict.size <= 0)
    {
      return this.submitNewSurveyNode();
    }

    let selectedSurveyNode = this.state.selectedSurveyNode;
    if(!selectedSurveyNode)
      selectedSurveyNode =  new SurveyNodeModel(null,null,null,null,1);
    
    let selectedSurvey = this.state.selectedSurvey;
    surveyNodeDict = this.updateSurveyNodeInDict(selectedSurvey,selectedSurveyNode,surveyNodeDict);
    selectedSurvey.SetSurveyNodeDict(surveyNodeDict);

    this.storageHandlerInstance.SaveSurvey(selectedSurvey);

    this.setState({
      surveyNodeDict: surveyNodeDict,
      selectedSurvey:cloneDeep(selectedSurvey),
      selectedSurveyNode:cloneDeep(selectedSurveyNode)
    }); 

    if(selectedSurveyNode)
    {
      this.setState({
        surveyNodesDisabled:false
      }); 
    }
  }

  cancelSurveyNodeEdit = (selectedSurveyNode) => {
  
    let oldSelectedSurveyNode = cloneDeep(this.state.oldSelectedSurveyNode);
    let surveyNodeDict = this.state.surveyNodeDict;
    surveyNodeDict = this.updateSurveyNodeInDict(this.state.selectedSurvey,oldSelectedSurveyNode,surveyNodeDict);
    
    this.setState({
      surveyNodeDict: surveyNodeDict,
      selectedSurveyNode:cloneDeep(oldSelectedSurveyNode)
    }); 

    if(oldSelectedSurveyNode)
    {
      this.setState({
        surveyNodesDisabled:false
      }); 
    }

  }


  cancelSurveyEdit = (selectedSurvey) => {
    if(!this.state.oldSelectedSurvey)
      return;
    let oldSelectedSurvey = cloneDeep(this.state.oldSelectedSurvey);
    let surveyDict = this.state.surveyDict;
    surveyDict = this.updateSurveyInDict(oldSelectedSurvey,surveyDict);
    
    this.setState({
      surveyDict: surveyDict,
      selectedSurvey:cloneDeep(oldSelectedSurvey)
    }); 
  }

  deleteSurvey = (survey) => {

    let surveyDict = this.state.surveyDict;
    let selectedSurvey = this.state.selectedSurvey;
    if(!selectedSurvey)
      selectedSurvey = new SurveyModel(null);  
    
    if(!surveyDict)
      return;

    surveyDict.delete(survey._id);
    let surveyNodeDict = this.state.surveyNodeDict;

    this.storageHandlerInstance.DeleteSurvey(selectedSurvey);
    if(selectedSurvey && selectedSurvey._id == survey._id)
    {
      selectedSurvey = null;
      if(this.state.surveyDict  &&  this.state.surveyDict.size>0)
      {
        let surveyList = Array.from(surveyDict.values());
        selectedSurvey = surveyList[0];
        surveyNodeDict = selectedSurvey.GetSurveyNodeDict();
      } 
      else{
        surveyNodeDict = new Map();
      }
    }
 
    this.setState({
      surveyDict: surveyDict,
      surveyNodeDict:surveyNodeDict,
      selectedSurvey:cloneDeep(selectedSurvey)
    }); 
  }


  setSurveyNodeDict = (surveyNodeDict) => {
    this.setState({
      surveyNodeDict: surveyNodeDict
    }); 
  }

  deleteSurveyNode = (selectedSurveyNode) => {
    let surveyNodeDict = this.state.surveyNodeDict;
 
    if(!selectedSurveyNode)
      selectedSurveyNode =  new SurveyNodeModel(null,null,null,null,1);
    
    if(!surveyNodeDict)
      return;

    surveyNodeDict.delete(selectedSurveyNode._id);
    
    if(selectedSurveyNode && selectedSurveyNode._id == selectedSurveyNode._id)
    {
      selectedSurveyNode = null;
    }

    let selectedSurvey = this.state.selectedSurvey;
    selectedSurvey.SetSurveyNodeDict(surveyNodeDict);
    this.storageHandlerInstance.SaveSurvey(selectedSurvey);
 
    this.setState({
      surveyNodeDict: surveyNodeDict,
      selectedSurvey:cloneDeep(selectedSurvey),
      selectedSurveyNode:cloneDeep(selectedSurveyNode)
    }); 

    if(selectedSurveyNode)
    {
      this.setState({
        surveyNodesDisabled:false
      }); 
    }
  }
 
  render() {
    return (
        <div className="container-fluid seamless" style={{overflow: 'hidden' }} >
            <div className="form-group row">
              <div className="col-md-6 headerCol">
                <Label><T>common.modals.surveyEditor.surveyHeader</T></Label>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-md-6">
                <SurveyEditorTable deleteSurveyCallback =  {(survey)  => this.deleteSurvey(survey)}  setSelectedSurveyCallback =  {(survey)  => this.setSelectedSurvey(survey,false)} selectedSurvey = {this.state.selectedSurvey}  surveyDict = {this.state.surveyDict}/>
              </div>
              <div className="col-md-5">
                <SurveyEditorDetails selectedSurvey = {this.state.selectedSurvey} setSelectedSurveyCallback =  {(survey)  => this.setSelectedSurvey(survey,true)}  surveyDict = {this.state.surveyDict}/>
              </div>
              <div className="col-md-6">
              </div>
              <div className="col-md-1">
                <Button onClick= {()  => this.submitSurveyEdit()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.commonUI.OK</T></Button>  
              </div>
              <div className="col-md-1">
                <Button onClick= {()  => this.cancelSurveyEdit()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.commonUI.Cancel</T></Button>
              </div>
              <div className="col-md-1">
                <Button onClick= {()  => this.submitNewSurvey()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.commonUI.SubmitNewItem</T></Button>  
              </div>
            </div>
             
            <div className="form-group row">
              <div className="col-md-6 headerCol">
                <Label><T>common.modals.surveyEditor.surveyNodeHeader</T></Label>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-md-6">
                <SurveyNodesTable  setSurveyNodeDictCallback =  {(surveyNodeDict)  => this.setSurveyNodeDict(surveyNodeDict)}  deleteSurveyNodeCallback =  {(surveyNode)  => this.deleteSurveyNode(surveyNode)}  selectedSurveyNode = {this.state.selectedSurveyNode}  selectedSurvey = {this.state.selectedSurvey}  setSelectedSurveyCallback =  {(survey)  => this.setSelectedSurvey(survey,false)} setSelectedSurveyNodeCallback =  {(surveyNode)  => this.setSelectedSurveyNode(surveyNode,false)}  surveyNodeDict = {this.state.surveyNodeDict}/>
              </div>
              <div className="col-md-5">
                <SurveyNodesDetails   selectedSurveyNode = {this.state.selectedSurveyNode}  selectedSurvey = {this.state.selectedSurvey} setSelectedSurveyCallback =  {(survey)  => this.setSelectedSurvey(survey,true)}  setSelectedSurveyNodeCallback =  {(surveyNode)  => this.setSelectedSurveyNode(surveyNode,true)} surveyNodeDict = {this.state.surveyNodeDict}/>
              </div>

              <div className="col-md-6">
              </div>
              
              <div className="col-md-1" disabled={this.state.surveyNodesDisabled}>
                <Button onClick= {()  => this.submitSurveyNodeEdit(this.state.surveyNode)} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.commonUI.OK</T></Button>
              </div>
              <div className="col-md-1" disabled={this.state.surveyNodesDisabled}>
                <Button onClick= {()  => this.cancelSurveyNodeEdit()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.commonUI.Cancel</T></Button>
              </div>
              <div className="col-md-1" disabled={this.state.surveyNodesDisabled}>
                <Button onClick= {()  => this.submitNewSurveyNode()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.commonUI.SubmitNewItem</T></Button>  
              </div>
            </div>
        </div>
    )
  }
}
export default withTracker(() => {
  return {
  };
})(SurveyEditor);
 