import React, { Component } from 'react';
import {Tooltip,Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import XAxisFrame from '../GraphContainer/AxisFrames/XAxisFrame/XAxisFrame';
import YAxisFrame from '../GraphContainer/AxisFrames/YAxisFrame/YAxisFrame';
import CenterAxisFrame from '../GraphContainer/AxisFrames/CenterAxisFrame/CenterAxisFrame';
import InnerGraphContainer from '../GraphContainer/InnerGraphContainer/InnerGraphContainer';

import i18n from 'meteor/universe:i18n';
import SurveyListConfigController from '../../../API/Modules/Configuration/SurveyListConfigController';

import StorageHandlerFactory from '../../../API/Modules/StorageHandling/StorageHandlerFactory';
import SurveyNodeModel from '../../../API/Models/ModelTemplates/Configuration/SurveyConfig/SurveyNodeModel';
import SurveyModel from '../../../API/Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel';
import GraphEventHandler from '../../../API/Modules/MxGraph/Eventhandling/GraphEventHandler';
import HTMLUtilities from '../../../API/Modules/Utilities/HTMLUtilities';
var cloneDeep = require('lodash.clonedeep');

const T = i18n.createComponent();

class DiagramControls extends Component {
  constructor(props) {
    super(props);
    this.graphEventHandler = new GraphEventHandler();
    this.storageHandlerInstance = StorageHandlerFactory.GetStorageHandler();
    this.surveyDropDownToggle = this.surveyDropDownToggle.bind(this);
    this.surveyNodeDropDownToggle = this.surveyNodeDropDownToggle.bind(this);
    
    let surveyDict  = storageHandlerInstance.GetAllSurveys(Meteor.userId());
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

    let selectedSurveyNodeIndex = null;
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
      else
      {
        selectedSurvey = storageHandlerInstance.GetDefaultSurvey(Meteor.userId());
      }
   
      surveyNodeDict = selectedSurvey.GetSurveyNodeDict();
      let surveyNodes = Array.from(surveyNodeDict.values());
      if(surveyNodes.length>0)
      {
        if(props.selectedSurveyNode)
        {
          selectedSurveyNode = props.selectedSurveyNode;
        }
        else
        {
          let nextSurveyNode = this.storageHandlerInstance.GetNextSurveyNodeOfUser(Meteor.userId(),selectedSurvey._id);
          if(nextSurveyNode)
          {
            selectedSurveyNode = nextSurveyNode;
          }
        }
        selectedSurveyNodeIndex = this.getSelectedNodeIndex(selectedSurveyNode,surveyNodes);
      
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
      currentVotes:0,
      graph:props.graph,
      isLog:props.isLog,
      isDashboard:props.isDashboard,
      isPool:props.isPool,
      selectedSurvey:selectedSurvey,
      surveyNodeDict:surveyNodeDict,
      selectedSurveyNodeIndex:selectedSurveyNodeIndex,
      surveyEditorAccess:false,
      selectedSurveyNode:selectedSurveyNode,
    };

    this.updateAccess();
  }

  componentDidMount() {

    let selectedSurveyNodeIndex = this.getSelectedNodeIndex(this.state.selectedSurveyNode,this.state.surveyNodeDict);
 
    this.setPageButtonsStatus(selectedSurveyNodeIndex,this.state.surveyNodeDict);
  } 

  setPageButtonsStatus(selectedSurveyNodeIndex,surveyNodes)
  {

    $('#previousSurveyNode').prop('disabled',false);
    $('#nextSurveyNode').prop('disabled',false);


    if(selectedSurveyNodeIndex == null || !surveyNodes)
    {

      $('#previousSurveyNode').prop('disabled',true).css('opacity',0.5);
      $('#nextSurveyNode').prop('disabled',true).css('opacity',0.5);

      $(".commitAnswer").html(i18n.getTranslation("common.diagramControls.commitAnswer"));
      return;
    }

    
    if(selectedSurveyNodeIndex  == 0)
    {
      $('#previousSurveyNode').prop('disabled',true).css('opacity',0.5);
    }

    if(selectedSurveyNodeIndex == surveyNodes.size-1)
    {
      $('#nextSurveyNode').prop('disabled',true).css('opacity',0.5);
      $(".commitAnswer").html(i18n.getTranslation("common.diagramControls.finishSurvey"));
    }
    else
    {
      $(".commitAnswer").html(i18n.getTranslation("common.diagramControls.commitAnswer"));
    }

    if(this.state.currentVotes  < this.state.selectedSurveyNode.maxNumberOfVotes)
    {
      $('#previousSurveyNode').prop('disabled',true).css('opacity',0.5);
      $('#nextSurveyNode').prop('disabled',true).css('opacity',0.5);
    }
 
  }
 
  componentWillReceiveProps(nextProps){
  
    if(nextProps.selectedSurveyNode)
    {
      this.setState({
        selectedSurveyNode: nextProps.selectedSurveyNode
      });
    }
    if(nextProps.graph)
    {
      this.setState({
        graph: nextProps.graph
      });
    }
    this.setState({ currentVotes: 0 });
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

    if(!selectedSurvey)
    {
      selectedSurvey = new SurveyModel();
    }
    if(!selectedSurveyNode)
    {
      selectedSurveyNode = new SurveyNodeModel(null,"","",null,1);
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

  getSelectedNodeIndex(surveyNode,surveyNodeDict)
  {
    let index = 0;
 
    for (const surveyNodeDicElement of surveyNodeDict.values()) {
      if(surveyNode._id==surveyNodeDicElement._id)
      {
       return index;
      }
      index++;
    }
 
    return index;
  }

  setSelectedSurveyNode(surveyNode){

    if(!surveyNode)
    {
      surveyNode = new SurveyNodeModel(null,"","",null,1);
    }
    this.setState({
      selectedSurveyNode:surveyNode
    });

    let selectedSurveyNodeIndex = this.getSelectedNodeIndex(surveyNode,this.state.surveyNodeDict);
    this.setState({
      selectedSurveyNodeIndex: selectedSurveyNodeIndex
    });
    this.setPageButtonsStatus(selectedSurveyNodeIndex,this.state.surveyNodeDict);
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

  
  previousSurveyNode(){
     
    if(this.state.selectedSurveyNodeIndex==0)
    {
      return;
    }

    let searchIndex = 0;
    let newSurveyNode = null;
    for(let surveyNode of this.state.surveyNodeDict.values())
    {
      if(searchIndex == this.state.selectedSurveyNodeIndex-1)
      {
        newSurveyNode = surveyNode;
      }
      searchIndex++;
    }

    this.setSelectedSurveyNode(newSurveyNode);

  } 

  nextSurveyNode(){
    if(this.state.selectedSurveyNodeIndex== this.state.surveyNodeDict.size -1)
    {
      return;
    }

    let searchIndex = 0;
    let newSurveyNode = null;
    for(let surveyNode of this.state.surveyNodeDict.values())
    {
      if(searchIndex == this.state.selectedSurveyNodeIndex+1)
      {
        newSurveyNode = surveyNode;
      }
      searchIndex++;
    }

    this.setSelectedSurveyNode(newSurveyNode);
  } 

  commitAnswer()
  {

    let currentVotes = this.state.currentVotes;
    let saveSuccess = false;
    if(currentVotes < this.state.selectedSurveyNode.maxNumberOfVotes)
    {
      saveSuccess = this.saveVoteToLog();
    }
 
  }

  async saveVoteToLog()
  {
    let saveSuccess = await this.graphEventHandler.SaveGraphToLog(this.state.selectedSurvey,this.state.selectedSurveyNode,this.state.graph);
    let currentVotes = this.state.currentVotes;
    
    if(saveSuccess===true)
    { 
      currentVotes = currentVotes+1;
      this.setState({ currentVotes: currentVotes });
      if(parseInt(this.state.selectedSurveyNode.maxNumberOfVotes) > 0 && currentVotes >= parseInt(this.state.selectedSurveyNode.maxNumberOfVotes))
      {
        let selectedSurveyNodeIndex = this.getSelectedNodeIndex(this.state.selectedSurveyNode,this.state.surveyNodeDict);
        if(selectedSurveyNodeIndex == this.state.surveyNodeDict.size -1)
        {
          alert(i18n.getTranslation("common.log.surveyFinished"));
        }

        this.storageHandlerInstance.SetLastSurveyNodeOfUser(Meteor.userId(),this.state.selectedSurvey._id,this.state.selectedSurveyNode._id);

        let nextSurveyNode = this.graphEventHandler.GetNextSurveyNode(this.state.selectedSurvey,this.state.selectedSurveyNode);
        this.setState({ currentVotes: 0 });

        this.setSelectedSurveyNode(nextSurveyNode);
        this.graphEventHandler.ClearGraph(this.state.graph);

        //this.graphEventHandler.MakeRubberBand(this.state.graph);

        if(selectedSurveyNodeIndex == this.state.surveyNodeDict.size -1)
        {
          if(!this.state.surveyEditorAccess)
          {
            Meteor.logout(() => { 
              i18n.setLocale(Meteor.settings.public.localisation.i18nLanguage);

              let logOutURL = HTMLUtilities.GetLogOutURL();
              if(logOutURL)
              {
                window.location = logOutURL;
              }
              else
              {
                location.reload();
              }
            });
          }

        }
        else
        {
          this.props.setSelectedSurveyNodeCallback(nextSurveyNode);
        }
      
      }
    }

  }

  async handleClearLogClick(e) {
    let newSurveyNode = await this.graphEventHandler.ClearLogOfSurveyNode(this.state.selectedSurvey,this.state.selectedSurveyNode);
    this.props.setSelectedSurveyNodeCallback(newSurveyNode);
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

  render() {
    return (
        <ul className="nav navbar-nav d-md-down-none left" >
            <li className="nav-item px-3 ">
                <Label><T>common.topMenu.selectSurvey</T></Label>
            </li>
            <li className="nav-item px-3 ">
                {this.state.surveyEditorAccess === true && this.state.surveyDict && this.state.surveyDict.size ? (
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
                    ) : (
                      this.state.selectedSurvey && this.state.selectedSurvey.name ? (
                        <div className="SurveyHeader">  <T>{this.state.selectedSurvey.name}</T> </div> 
           
                         ) : (
                           ""
                       ) 
                )}
            </li>
            <li className="nav-item px-3 ">
                <Label><T>common.topMenu.description</T></Label>
            </li>
            <li className="nav-item px-3 ">
                <Input  disabled={true} type="textarea" rows="5" name="Name" id="surveyDescription" placeholder="" value={this.state.selectedSurvey.description} ></Input>
            
                <Tooltip trigger={"hover click"} autohide={false} placement="right" isOpen={this.state.surveyDescriptionToolTipOpen} target="surveyDescription" toggle={()=> this.toggleSurveyToolTip()}>
                  {this.state.selectedSurvey.description}
               </Tooltip>
            </li>
            <li className="nav-item px-3 ">
                <Label><T>common.topMenu.selectSurveyNode</T></Label>
            </li>
            <li className="nav-item px-3 ">
                {this.state.surveyEditorAccess === true && this.state.surveyNodeDict.size ? (
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
 

                    ) : (
                      this.state.selectedSurveyNode ? (
                        <div className="SurveyHeader">  <T>{this.state.selectedSurveyNode.name}</T> </div>
                         ) : (
                           ""
                       ) 
                )}
            </li>
            <li className="nav-item px-3 ">
                <Label><T>common.topMenu.description</T></Label>
            </li>
            <li className="nav-item px-3 ">
                <Input disabled={true} type="textarea" rows="20" name="Name" id="surveyNodeDescription" value={this.state.selectedSurveyNode.description} placeholder="" ></Input>
                <Tooltip trigger={"hover click"} autohide={false} placement="right" isOpen={this.state.surveyNodeDescriptionToolTipOpen} target="surveyNodeDescription" toggle={()=> this.toggleSurveyNodeToolTip()}>
                  {this.state.selectedSurveyNode.description}
               </Tooltip>
            </li>
            <li className="nav-item px-3 ">
              <div className="form-group row justify-content-center"></div>
            </li>

            {this.state.isLog === true    ? (
               <div>
                <div className="form-group row justify-content-center">
                <div className="col-md-3  "> 
                  <button  onClick={this.handleClearLogClick.bind(this)}   type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.graphContainer.centerAxisFrame.clearLog</T></button>
                </div>
                </div>   
                <div className="form-group row justify-content-center">
                  <div className="col-md-3  "> 
                    <button type="button" className="btn btn-outline-secondary"><T>common.topMenu.revertToOrigin</T></button>
                  </div>
                  <div className="col-md-3  ">
                    <button type="button" className="btn btn-outline-secondary diagramCtrCentBtn"><T>common.topMenu.saveChanges</T></button>
                  </div>
                  <div className="col-md-3  ">  
                    <button onClick={this.handlePoolClick.bind(this)} type="button" className="btn btn-outline-secondary diagramCtrCentBtn"><T>common.topMenu.pool</T></button>
                  </div>   

                  <div className="col-md-3  ">
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
                  
                </div>  
                 </div>
              ) : ("")   } 

            {this.state.isDashboard === true    ? (
                <div>
                <li className="nav-item px-3 ">
                  <div className="form-group row justify-content-center">
                    <div className="col-md-4  ">
                      <button  onClick= {()  => this.previousSurveyNode()} id="previousSurveyNode"  type="button" className="previousSurveyNode btn btn-outline-secondary w-100 standardElement"><i class="inline fa fa-arrow-left fa-lg mt-4 faLgContainer"></i>  <T>common.diagramControls.previousQuestion</T></button>
                    </div>
                    <div className="col-md-4 surveyIndexIndicator">
                          {this.state.selectedSurveyNodeIndex != null   && this.state.surveyNodeDict && this.state.surveyNodeDict.size ? (
                                <div>{this.state.selectedSurveyNodeIndex+1}/{this.state.surveyNodeDict.size}</div>
                            ) : (
                              ""
                          )} 
                      
                    </div>
                    <div className="col-md-4  ">
                      <button  onClick= {()  => this.nextSurveyNode()} id="nextSurveyNode"  type="button" className="nextSurveyNode btn btn-outline-secondary w-100 standardElement"><T>common.diagramControls.nextQuestion</T>  <i class="inline fa fa-arrow-right fa-lg mt-4 faLgContainer"></i></button>                
                    </div>
                  </div>
                </li>
                <li className="nav-item px-3 ">
                  <div className="form-group row justify-content-center">
                    <div className="col-md-4  "> 
                    </div>
                    <div className="col-md-4  ">
                      <button  onClick= {()  => this.commitAnswer()}  type="button" className="commitAnswer btn btn-outline-secondary w-100 standardElement"><T>common.diagramControls.commitAnswer</T></button>                
                    </div>
                    <div className="col-md-4  ">  
                    </div>    
                  </div>   
                </li>
              </div>
            ) : ("")   } 
 
        </ul>
    )
  }
}
export default withTracker(() => {
  return {
  };
})(DiagramControls);
 