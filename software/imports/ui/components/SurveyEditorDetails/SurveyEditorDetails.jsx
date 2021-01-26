import React, { Component } from 'react';
import {Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import { Meteor } from 'meteor/meteor';
import SurveyModel  from '../../../API/Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel';
const T = i18n.createComponent();
import SurveySettingsModal from '../Modals/Settings/SurveySettings/SurveySettingsModal';

class SurveyEditorDetails extends Component {

  constructor(props) {
    super(props);
 
    let surveyName = null;
    let surveyDescription = null;

    if(props.selectedSurvey)
    {
      surveyName = props.selectedSurvey.name;
      surveyDescription = props.selectedSurvey.description;
    }

    this.state = {
      selectedSurvey:props.selectedSurvey,
      surveyName:surveyName,
      settingsModalOpen:false,
      surveyDescription:surveyDescription
    };
  }


  componentWillReceiveProps(nextProps){

    this.setState({
      surveyDict:nextProps.surveyDict
    }); 

    if(nextProps.selectedSurvey)
    {
      this.setState({
        selectedSurvey:nextProps.selectedSurvey,
        surveyName:nextProps.selectedSurvey.name,
        surveyDescription:nextProps.selectedSurvey.description
      }); 

      $("#surveyName-input").val(nextProps.selectedSurvey.name);
      $("#surveyDescription-input").val(nextProps.selectedSurvey.description);
    }
  }
 
  updateSurveyDescription = (changeEvent)  => {

    let selectedSurvey = this.state.selectedSurvey;
    if(!selectedSurvey)
      selectedSurvey = new SurveyModel(null);  

    selectedSurvey.description = changeEvent.target.value;
    this.setState({
      surveyDescription:changeEvent.target.value,
      selectedSurvey:selectedSurvey
    });
    this.props.setSelectedSurveyCallback(selectedSurvey); 
  }

  updateSurveyName = (changeEvent)  => {
   
    let selectedSurvey = this.state.selectedSurvey;
    if(!selectedSurvey)
      selectedSurvey = new SurveyModel(null);  
    selectedSurvey.name = changeEvent.target.value;

    this.setState({
      surveyName:changeEvent.target.value,
      selectedSurvey:selectedSurvey
    });
    this.props.setSelectedSurveyCallback(selectedSurvey); 
 
  }

  showAdvancedOptions = (changeEvent)  => {

  }

  showSurveySettingsModal()
  {
    this.setState({
      settingsModalOpen: true
    });
  }

  submitModalCallback(selectedSurvey)
  {
    this.setState({
      selectedSurvey:selectedSurvey,
      settingsModalOpen: false
    });
    this.props.setSelectedSurveyCallback(selectedSurvey); 
  }

  cancelModalCallback(selectedSurvey)
  {
    this.setState({
      settingsModalOpen: false
    });
  }

  render() {
    return (
      <div>
         <SurveySettingsModal selectedSurvey = {this.state.selectedSurvey} submitModalCallback = {(selectedSurvey)  => this.submitModalCallback(selectedSurvey)} cancelModalCallback = {(selectedSurvey)  => this.cancelModalCallback(selectedSurvey)} modalOpen = {this.state.settingsModalOpen}/>
          <div className="form-group row justify-content-left">
            <div className="col-md-3">
              <Label><T>common.modals.surveyEditor.surveyDetails.surveyName</T></Label>
            </div>
            <div className="col-md-5">
              <Input  onChange={(event) => {this.updateSurveyName(event)}} type="text" defaultValue={this.state.surveyName}   id="surveyName-input" name= "surveyName" className="form-control dataPropertyInput left" placeholder=""/>
            </div>
          </div>

          <div className="form-group row justify-content-left">
            <div className="col-md-3">
              <Label><T>common.modals.surveyEditor.surveyDetails.surveyDescription</T></Label>
            </div>
            <div className="col-md-8">
              <Input  onChange={(event) => {this.updateSurveyDescription(event)}} type="textarea" defaultValue={this.state.surveyDescription}  rows="4" cols="50"  id="surveyDescription-input" name= "surveyDescription" className="form-control dataPropertyInput left" placeholder=""/>
            </div>
          </div>

          <div className="form-group row justify-content-left">
            <div className="col-md-3">
              <Button onClick= {()  => this.showSurveySettingsModal()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.modals.surveyEditor.surveyDetails.advancedOptions</T></Button>
            </div>
          </div>

      </div>
    )
  }
}

export default SurveyEditorDetails;