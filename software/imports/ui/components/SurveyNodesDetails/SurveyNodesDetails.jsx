import React, { Component } from 'react';
import {Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import { Meteor } from 'meteor/meteor';
import SurveyNodeModel from '../../../API/Models/ModelTemplates/Configuration/SurveyConfig/SurveyNodeModel';
const T = i18n.createComponent();
import _uniqueId from 'lodash/uniqueId';
import SurveyNodeSettingsModal from '../Modals/Settings/SurveyNodesSettings/SurveyNodeSettingsModal';

class SurveyNodesDetails extends Component {

  constructor(props) {
    super(props);
 
    let surveyNodesDisabled = true;
    if(props.selectedSurvey)
      surveyNodesDisabled = false;

    this.state = {
      selectedSurvey:props.selectedSurvey,
      surveyName:null,
      surveyDescription:null,
      numberOfVotes:1,
      settingsModalOpen:false,
      disabled:surveyNodesDisabled
    };
  }

  componentDidMount()
  {
    
  }
 
  componentWillReceiveProps(nextProps){

    this.setState({
      surveyNodeDict:nextProps.surveyNodeDict
    }); 

    if(nextProps.selectedSurvey)
    {
    
      this.setState({
        selectedSurvey:nextProps.selectedSurvey,
        disabled:false
      }); 
    }
    else
    {
      this.setState({
        disabled:true
      }); 
    }

    if(nextProps.selectedSurveyNode)
    {
      this.setState({
        selectedSurveyNode:nextProps.selectedSurveyNode,
        surveyNodeName:nextProps.selectedSurveyNode.name,
        numberOfVotes:nextProps.selectedSurveyNode.numberOfVotes,
        surveyNodeDescription:nextProps.selectedSurveyNode.description
      }); 


      $("#surveyNodeName-input").val(nextProps.selectedSurveyNode.name);
      $("#surveyNodeDescription-input").val(nextProps.selectedSurveyNode.description);
      $("#numberOfVotes-input").val(nextProps.selectedSurveyNode.numberOfVotes);
    }
  }
  
  updateSurveyNodeDescription = (changeEvent)  => {
    let selectedSurveyNode = this.state.selectedSurveyNode;
    if(!selectedSurveyNode)
      selectedSurveyNode =  new SurveyNodeModel(null,null,null,null,1);

    selectedSurveyNode.description = changeEvent.target.value;
    this.setState({
      surveyNodeDescription:changeEvent.target.value,
      selectedSurveyNode:selectedSurveyNode
    });
    this.props.setSelectedSurveyNodeCallback(selectedSurveyNode); 
  }

  
  updateNumberOfVotes = (changeEvent)  => {
    let selectedSurveyNode = this.state.selectedSurveyNode;
    if(!selectedSurveyNode)
      selectedSurveyNode =  new SurveyNodeModel(null,null,null,null,1);
    selectedSurveyNode.numberOfVotes = parseInt(changeEvent.target.value);

    this.setState({
      numberOfVotes:parseInt(changeEvent.target.value),
      selectedSurveyNode:selectedSurveyNode
    });
    this.props.setSelectedSurveyNodeCallback(selectedSurveyNode); 
  }

  updateSurveyNodeName = (changeEvent)  => {
    let selectedSurveyNode = this.state.selectedSurveyNode;
    if(!selectedSurveyNode)
      selectedSurveyNode =  new SurveyNodeModel(null,null,null,null,1);
    selectedSurveyNode.name = changeEvent.target.value;

    this.setState({
      surveyNodeName:changeEvent.target.value,
      selectedSurveyNode:selectedSurveyNode
    });
    this.props.setSelectedSurveyNodeCallback(selectedSurveyNode); 
  }

  showAdvancedOptions = (changeEvent)  => {
  }

  showSurveyNodeSettingsModal()
  {
    this.setState({
      settingsModalOpen: true
    });
  }

  submitModalCallback(selectedSurveyNode)
  {
    this.setState({
      selectedSurveyNode:selectedSurveyNode,
      settingsModalOpen: false
    });
    this.props.setSelectedSurveyNodeCallback(selectedSurveyNode); 
  }

  cancelModalCallback(selectedSurveyNode)
  {
    this.setState({
      settingsModalOpen: false
    });
  }


  render() {
    return (
      <div disabled={this.state.disabled}  >
          <SurveyNodeSettingsModal selectedSurveyNode = {this.state.selectedSurveyNode} submitModalCallback = {(selectedSurveyNode)  => this.submitModalCallback(selectedSurveyNode)} cancelModalCallback = {(selectedSurveyNode)  => this.cancelModalCallback(selectedSurveyNode)} modalOpen = {this.state.settingsModalOpen}/>
          <div className="form-group row justify-content-left">
            <div className="col-md-3">
              <Label><T>common.modals.surveyEditor.surveyNodeDetails.surveyName</T></Label>
            </div>
            <div className="col-md-5">
              <Input  onChange={(event) => {this.updateSurveyNodeName(event)}} type="text" defaultValue={this.state.surveyNodeName}   id="surveyNodeName-input" name= "surveyName" className="form-control dataPropertyInput left" placeholder=""/>
            </div>
          </div>

          <div className="form-group row justify-content-left">
            <div className="col-md-3">
              <Label><T>common.modals.surveyEditor.surveyNodeDetails.surveyDescription</T></Label>
            </div>
            <div className="col-md-8">
              <Input  onChange={(event) => {this.updateSurveyNodeDescription(event)}} type="textarea" defaultValue={this.state.surveyNodeDescription}  rows="4" cols="50"  id="surveyNodeDescription-input" name= "surveyNodeDescription" className="form-control dataPropertyInput left" placeholder=""/>
            </div>
          </div>

          <div className="form-group row justify-content-left">
            <div className="col-md-3">
              <Label><T>common.modals.surveyEditor.surveyNodeDetails.numberOfVotes</T></Label>
            </div>
            <div className="col-md-8">
              <Input  onChange={(event) => {this.updateNumberOfVotes(event)}} type="text" defaultValue={this.state.numberOfVotes}   id="numberOfVotes-input" name= "numberOfVotes" className="form-control dataPropertyInput left" placeholder=""/>
            </div>
          </div>
          

          <div className="form-group row justify-content-left">
            <div className="col-md-3">
               <Button onClick= {()  => this.showSurveyNodeSettingsModal()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.modals.surveyEditor.surveyNodeDetails.advancedOptions</T></Button>
            </div>
          </div>
      </div>
    )
  }
}

export default SurveyNodesDetails;
