import React, { Component } from 'react';
import {Label,TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col,Button, Modal, ModalHeader, ModalBody, ModalFooter,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import classnames from 'classnames';
import StorageHandlerFactory from '../../../../../API/Modules/StorageHandling/StorageHandlerFactory';
import UserEditorTable from '../../../UserEditorTable/UserEditorTable';
import UserHandler from '../../../../../API/Modules/UserHandling/UserHandler';

const T = i18n.createComponent();
var cloneDeep = require('lodash.clonedeep');

class SurveySettingsModal extends Component {

    constructor(props) {
        super(props);

        this.storageHandlerInstance = StorageHandlerFactory.GetStorageHandler();
        this.userHandler = new UserHandler();
        
        let participantDict  = new Map ();
        let administratorDict  = new Map ();
        let selectedParticipant = null;
        let selectedAdministrator = null;
        let participantEmail = null;
        let administratorEmail = null;

        let participantUserName = null;
        let administratorUserName = null;

        if(props.selectedSurvey)
        {
          participantDict = this.GetAllParticipantsAsDict(props.selectedSurvey);
          administratorDict = this.GetAllAdministratorsAsDict(props.selectedSurvey);
        }

        this.state = {
            participantDict:participantDict,
            administratorDict:administratorDict,
            selectedParticipant:selectedParticipant,
            selectedAdministrator:selectedAdministrator,
            oldSelectedParticipant:cloneDeep(selectedParticipant),
            oldSelectedAdministrator:cloneDeep(selectedAdministrator),
            participantEmail:participantEmail,
            administratorEmail:administratorEmail,
            participantUserName:participantUserName,
            administratorUserName:administratorUserName,
            modalOpen: props.modalOpen,
            selectedSurvey:props.selectedSurvey
        };
    
    }

    GetAllParticipantsAsDict(survey)
    {
        let participants = this.storageHandlerInstance.GetAllParticipantsOfSurvey(survey._id);
 
        if(participants)
        {
          participants = new Map(
            participants.map(x => [x._id, x])
          );
        }   
        else
        {
          participants = new Map ();
        }
        return participants;
    }

    GetAllAdministratorsAsDict(survey)
    {
        let admins = this.storageHandlerInstance.GetAllAdministratorsOfSurvey(survey._id);
 
        if(admins)
        {
          admins = new Map(
            admins.map(x => [x._id, x])
          );
        }   
        else
        {
          admins = new Map ();
        }
        return admins;
    }
    

 

 
    componentWillReceiveProps(nextProps)
    {
        this.setState({
            modalOpen: nextProps.modalOpen,
            selectedSurvey:nextProps.selectedSurvey
        });
    }

    toggleModal() {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    }

    toggleTab(tabId) {
        this.setState({
        activeTab: tabId
        });
    }
    
    cancelModal() {
        this.setState({
            modalOpen: false
        });
        let selectedSurvey = this.state.selectedSurvey;
        this.props.cancelModalCallback(selectedSurvey);
    }

    submitModal() {
        let selectedSurvey = this.state.selectedSurvey;
        this.props.submitModalCallback(selectedSurvey);
    }
    
    async deleteParticipant(user) {
      user = await this.userHandler.RemoveParticipantFromSurvey(this.state.selectedSurvey._id,user);

      let participantDict = this.state.participantDict;
      participantDict.delete(user._id);

      this.setState({
        participantDict: participantDict,
        selectedParticipant: user
      }); 
    }

    
    async  deleteAdministrator(user) {

      user = await this.userHandler.RemoveAdminFromSurvey(this.state.selectedSurvey._id,user);

      let administratorDict = this.state.administratorDict;
      administratorDict.delete(user._id);

      this.setState({
        administratorDict: administratorDict,
        selectedAdministrator: user
      }); 
    }

    setSelectedParticipant(selectedUser) {
      this.setState({
        selectedParticipant: cloneDeep(selectedUser)
      }); 
  
      if(edit==false)
      {
        this.setState({
          oldSelectedParticipant: cloneDeep(selectedUser)
        }); 
      }
    }

    updateParticipantEmail(changeEvent) {
      let email = changeEvent.target.value;
      this.setState({
        participantEmail: email
      }); 
    }

    setSelectedAdministrator(selectedUser) {
      this.setState({
        selectedAdministrator: cloneDeep(selectedUser)
      }); 
  
      if(edit==false)
      {
        this.setState({
          oldSelectedAdministrator: cloneDeep(selectedUser)
        }); 
      }
    }

    updateAdministratorEmail(changeEvent) {
      let email = changeEvent.target.value;
      this.setState({
        administratorEmail: email
      }); 
    }

    updateParticipantUserName(changeEvent) {
      let participantUserName = changeEvent.target.value;
      this.setState({
        participantUserName: participantUserName
      }); 
    }

    updateAdministratorUserName(changeEvent) {
      let administratorUserName = changeEvent.target.value;
      this.setState({
        administratorUserName: administratorUserName
      }); 
    }

    async CreateAdminByEmail( ) {
      await this.CreateUserByEmail(this.state.selectedSurvey,this.state.administratorEmail,this.state.administratorUserName,true);
    }

    async CreateParticipantByEmail( ) {
      await this.CreateUserByEmail(this.state.selectedSurvey,this.state.participantEmail,this.state.participantUserName,false);
    }

    async CreateUserByEmail(selectedSurvey,email,userName,isAdmin)
    {
      let selectedUser = null;
      selectedUser = await this.userHandler.CreateUserByEmail(selectedSurvey._id,email,userName,isAdmin);
 
   
      if(selectedUser != null && !selectedUser.error)
      {
        let stampedLoginToken =  await this.storageHandlerInstance.GetLoginToken(selectedUser);

        if(!selectedUser || !stampedLoginToken || !stampedLoginToken.token || !this.state.selectedSurvey)
        {
          alert(i18n.getTranslation("common.exceptions.mailSendError"));
          return;
        }
    
        let response = await this.userHandler.SendLoginTokenByEmail(selectedUser,stampedLoginToken.token,selectedSurvey.name);
        if(response != true)
        {
          alert(i18n.getTranslation("common.exceptions.mailSendError"+" : "+response));
        }

        if(isAdmin===true)
        {
          let administratorDict = this.state.administratorDict;
          administratorDict.set(selectedUser._id,selectedUser);
    
          this.setState({
            administratorDict: administratorDict,
            selectedAdministrator: selectedUser
          }); 
  
        }
        else
        {
          let participantDict = this.state.participantDict;
          participantDict.set(selectedUser._id,selectedUser);
    
          this.setState({
            participantDict: participantDict,
            selectedParticipant: selectedUser
          }); 
        }
  

      }
    }

  
  render() {
    return (
      <Modal className={"modal-xl"} size={"lg"} isOpen={this.state.modalOpen} toggle={this.state.modalOpen}>
        <ModalHeader toggle={this.state.modalOpen}><T>common.modals.settings.header</T></ModalHeader>
        <ModalBody>
          <div className="form-group row ">
            <div className="col-md-1">
              <Label><T>common.modals.surveyModal.participants</T></Label>
            </div>
            <div className="col-md-6">
                
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-6">
                <UserEditorTable deleteUserCallback =  {(user)  => this.deleteParticipant(user)}  setSelectedUserCallback =  {(user)  => this.setSelectedParticipant(user,false)} selectedUser = {this.state.selectedParticipant}  userDict = {this.state.participantDict}/>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <div className="col-md-2 justify-content-center">
                  <Label><T>common.modals.surveyModal.email</T></Label>
                </div>
                <div className="col-md-4 justify-content-center">
                    <input  onChange={(event) => {this.updateParticipantEmail(event)}} type="text" defaultValue={this.state.participantEmail}   id="participantEmail-input" name= "participantEmail" className="form-control dataPropertyInput" placeholder=""/>
                </div>
                <div className="col-md-4 justify-content-center"> </div>   
              </div>
              <div className="form-group row">
                  <div className="col-md-2 justify-content-center">
                    <Label><T>common.modals.surveyModal.username</T></Label>
                  </div>
                  <div className="col-md-4 justify-content-center">
                      <input  onChange={(event) => {this.updateParticipantUserName(event)}} type="text" defaultValue={this.state.participantUserName}   id="participantUserName-input" name= "participantUserName" className="form-control dataPropertyInput" placeholder=""/>
                  </div>
                  <div className="col-md-4 justify-content-center">
                      <Button color="primary" onClick= {()  => this.CreateParticipantByEmail()}><T>common.modals.surveyModal.inviteEmailParticipant</T></Button>
                  </div>
              </div>
            </div>
          </div>

          <div className="form-group row  ">
            <div className="col-md-1">
              <Label><T>common.modals.surveyModal.administrators</T></Label>
            </div>
            <div className="col-md-6">
                
            </div>

          </div>

          <div className="form-group row">
            <div className="col-md-6">
                <UserEditorTable deleteUserCallback =  {(user)  => this.deleteAdministrator(user)}  setSelectedUserCallback =  {(user)  => this.setSelectedAdministrator(user,false)} selectedUser = {this.state.selectedAdministrator}  userDict = {this.state.administratorDict}/>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <div className="col-md-2 justify-content-center">
                  <Label><T>common.modals.surveyModal.email</T></Label>
                </div>
                <div className="col-md-4 justify-content-center">
                    <input  onChange={(event) => {this.updateAdministratorEmail(event)}} type="text" defaultValue={this.state.administratorEmail}   id="administratorEmail-input" name= "administratorEmail" className="form-control dataPropertyInput" placeholder=""/>
                </div>
                <div className="col-md-4 justify-content-center"> </div>   
              </div>
              <div className="form-group row">
                  <div className="col-md-2 justify-content-center">
                    <Label><T>common.modals.surveyModal.username</T></Label>
                  </div>
                  <div className="col-md-4 justify-content-center">
                      <input  onChange={(event) => {this.updateAdministratorUserName(event)}} type="text" defaultValue={this.state.administratorUserName}   id="administratorUserName-input" name= "administratorUserName" className="form-control dataPropertyInput" placeholder=""/>
                  </div>
                  <div className="col-md-4 justify-content-center">
                      <Button color="primary" onClick= {()  => this.CreateAdminByEmail()}><T>common.modals.surveyModal.inviteEmailAdministrator</T></Button>
                  </div>
              </div>
            </div>
          </div>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick= {()  => this.submitModal()}><T>common.commonUI.OK</T></Button>
          <Button color="primary" onClick= {()  => this.cancelModal()}><T>common.commonUI.Cancel</T></Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default SurveySettingsModal;
