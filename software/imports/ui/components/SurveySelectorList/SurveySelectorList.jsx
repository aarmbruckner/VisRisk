import React, { Component } from 'react';
import {Tooltip,Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
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
import SurveyNodeModel from '../../../API/Models/ModelTemplates/Configuration/SurveyConfig/SurveyNodeModel';
import SurveyModel from '../../../API/Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel';
var cloneDeep = require('lodash.clonedeep');

const T = i18n.createComponent();

class SurveySelectorList extends Component {

 
  constructor(props) {
    super(props);

    this.storageHandlerInstance = StorageHandlerFactory.GetStorageHandler();
    this.surveyDropDownToggle = this.surveyDropDownToggle.bind(this);
    this.surveyNodeDropDownToggle = this.surveyNodeDropDownToggle.bind(this);
    
    let surveyDict  = storageHandlerInstance.GetAllSurveys();
    if(surveyDict)
    {
      surveyDict = new Map(
        surveyDict.map(x => [x._id, x])
      );
    }   
    else
    {
      surveyDict = new Map ();
    }
 
    let selectedSurvey = null;
 
    let surveyNodeDict = new Map ();
    let selectedSurveyNode = new SurveyNodeModel(null,"","",null,1);

    if(surveyDict  && surveyDict.size>0)
    {
      selectedSurvey = storageHandlerInstance.GetDefaultSurvey();
      surveyNodeDict = selectedSurvey.GetSurveyNodeDict();
      let surveyNodes = Array.from(surveyNodeDict.values());
      if(surveyNodes.length>0)
      {
        selectedSurveyNode = cloneDeep(surveyNodes[0]);
      }

    }
    if(!selectedSurvey)
    {
      selectedSurvey = new SurveyModel();
    }


    this.state = {
      surveyDescriptionToolTipOpen:false,
      surveyNodeDescriptionToolTipOpen:false,
      settingsModalOpen:false,
      surveyDropDownOpen:false,
      surveyNodeDropDownOpen:false,
      surveyDict:surveyDict,
      selectedSurvey:selectedSurvey,
      surveyNodeDict:surveyNodeDict,
      selectedSurveyNode:selectedSurveyNode,
    };
  }

  componentDidMount() {


  } 
 
  componentWillReceiveProps(nextProps){
  
    if(nextProps.selectedSurveyNode)
    {
      this.setState({
        selectedSurveyNode: nextProps.selectedSurveyNode
      });
    }
  }
 
  surveyDropDownToggle() {
    this.setState({
      surveyDropDownOpen: !this.state.surveyDropDownOpen
    });
  }

  surveyNodeDropDownToggle() {
    this.setState({
      surveyNodeDropDownOpen: !this.state.surveyNodeDropDownOpen
    });
  }

  setSelectedSurveyEvent= (changeEvent) => {
    let selectedSurveyID = changeEvent.target.value;
    let selectedSurvey = this.storageHandlerInstance.GetSurveyById(selectedSurveyID);
    this.setSelectedSurvey(selectedSurvey);
  } 

  setSelectedSurvey(selectedSurvey)  {
    let surveyNodeDict = selectedSurvey.GetSurveyNodeDict();

    let selectedSurveyNode = new SurveyNodeModel(null,"","",null,1);
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
 
    this.props.setSelectedSurveyCallback(selectedSurvey);
    this.props.setSelectedSurveyNodeCallback(selectedSurveyNode);
    this.props.setSurveyNodeDictCallback(surveyNodeDict);
  }

  setSelectedSurveyNodeEvent= (changeEvent) => {
    let selectedSurvey = this.state.selectedSurvey;
    let selectedSurveyNodeID = changeEvent.target.value;
    let selectedSurveyNode = null;

    let surveyNodeDict = selectedSurvey.GetSurveyNodeDict();
    let surveyNodes = Array.from(surveyNodeDict.values());
    if(surveyNodes.length>0)
    {
      selectedSurveyNode = cloneDeep(surveyNodes[0]);
    }

    for(let surveyNode of surveyNodes)
    {
      if(selectedSurveyNodeID == surveyNode._id)
      {
        selectedSurveyNode = surveyNode;
      }
    }

    this.setSelectedSurveyNode(selectedSurveyNode);
  }

  setSelectedSurveyNode(surveyNode){
    this.setState({
      selectedSurveyNode:surveyNode
    });

    this.props.setSelectedSurveyNodeCallback(surveyNode);
  } 

  toggleSurveyToolTip(){
    this.setState({
      surveyDescriptionToolTipOpen:!this.state.surveyDescriptionToolTipOpen
    });
  } 

  toggleSurveyNodeToolTip(){
    this.setState({
      surveyNodeDescriptionToolTipOpen:!this.state.surveyNodeDescriptionToolTipOpen
    });
  } 
  

  render() {
    return (
        <ul className="nav navbar-nav d-md-down-none left" >
            <li className="nav-item px-3 ">
                <Label><T>common.topMenu.selectSurvey</T></Label>
            </li>
            <li className="nav-item px-3 ">
                <Dropdown
                    isOpen={this.state.surveyDropDownOpen}
                    toggle={this.surveyDropDownToggle}
                    size="m"    
                    className="surveyDropDown"
                >
                    <DropdownToggle block caret>
                    <T>{this.state.selectedSurvey.name}</T> 
                    </DropdownToggle>
                    <DropdownMenu  className="surveyDropDownMenu dropdown-menu-right" >
                    {
                        Array.from(this.state.surveyDict.values()).map(survey=> (
                        <DropdownItem value = {survey._id} onClick={this.setSelectedSurveyEvent} >{survey.name}</DropdownItem>
                        ))
                    }
                    </DropdownMenu>
                </Dropdown>
            </li>
            <li className="nav-item px-3 ">
                <Label><T>common.topMenu.description</T></Label>
            </li>
            <li className="nav-item px-3 ">
                <Input  disabled={true} type="text" name="Name" id="surveyDescription" placeholder="" value={this.state.selectedSurvey.description} ></Input>
            
                <Tooltip trigger={"hover click"} autohide={false} placement="right" isOpen={this.state.surveyDescriptionToolTipOpen} target="surveyDescription" toggle={()=> this.toggleSurveyToolTip()}>
                  {this.state.selectedSurvey.description}
               </Tooltip>
            </li>
            <li className="nav-item px-3 ">
                <Label><T>common.topMenu.selectSurveyNode</T></Label>
            </li>
            <li className="nav-item px-3 ">

                  <Dropdown
                      isOpen={this.state.surveyNodeDropDownOpen}
                      toggle={this.surveyNodeDropDownToggle}
                      size="sm" 
                      className="surveyDropDown"   
                  >
                    <DropdownToggle block caret>
                    <T>{this.state.selectedSurveyNode.name}</T> 
                    </DropdownToggle>
                    <DropdownMenu  className="surveyDropDownMenu dropdown-menu-right" >
                    {
                        Array.from(this.state.surveyNodeDict.values()).map(surveyNode=> (
                        <DropdownItem value = {surveyNode._id} onClick={this.setSelectedSurveyNodeEvent} >{surveyNode.name}</DropdownItem>
                        ))
                    }
                    </DropdownMenu>
                </Dropdown>
            </li>
            <li className="nav-item px-3 ">
                <Label><T>common.topMenu.description</T></Label>
            </li>
            <li className="nav-item px-3 ">
                <Input disabled={true} type="text" name="Name" id="surveyNodeDescription" value={this.state.selectedSurveyNode.description} placeholder="" ></Input>
                <Tooltip trigger={"hover click"} autohide={false} placement="right" isOpen={this.state.surveyNodeDescriptionToolTipOpen} target="surveyNodeDescription" toggle={()=> this.toggleSurveyNodeToolTip()}>
                  {this.state.selectedSurveyNode.description}
               </Tooltip>
            </li>
        </ul>
    )
  }
}
export default withTracker(() => {
  return {
  };
})(SurveySelectorList);
 