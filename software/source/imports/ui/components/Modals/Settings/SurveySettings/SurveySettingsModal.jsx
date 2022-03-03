import React, { Component } from 'react';
import {Input, Label,TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col,Button, Modal, ModalHeader, ModalBody, ModalFooter,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import classnames from 'classnames';
import StorageHandlerFactory from '../../../../../API/Modules/StorageHandling/StorageHandlerFactory';
import UserEditorTable from '../../../UserEditorTable/UserEditorTable';
import UserHandler from '../../../../../API/Modules/UserHandling/UserHandler';
import CommonSubModal from '../SurveySettings/SubModals/CommonSubModal/';
import InviteAllSubModal from '../SurveySettings/SubModals/InviteAllSubModal/';
import { SurveyModelCollection } from '../../../../../API/Models/ModelTemplates/Configuration/SurveyConfig/SurveyModel';
const T = i18n.createComponent();
var cloneDeep = require('lodash.clonedeep');

class SurveySettingsModal extends Component {

    constructor(props) {
        super(props);

        this.toggleTab = this.toggleTab.bind(this);
        this.storageHandlerInstance = StorageHandlerFactory.GetStorageHandler();
        this.userHandler = new UserHandler();
        
        let participantDict  = new Map ();
        let allUsersDict =  new Map ();
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
          allUsersDict = this.GetAllUsersAsDict(props.selectedSurvey);
        }

        this.state = {
            participantDict:participantDict,
            administratorDict:administratorDict,
            allUsersDict:allUsersDict,
            selectedParticipant:selectedParticipant,
            selectedAdministrator:selectedAdministrator,
            oldSelectedParticipant:cloneDeep(selectedParticipant),
            oldSelectedAdministrator:cloneDeep(selectedAdministrator),
            participantEmail:participantEmail,
            administratorEmail:administratorEmail,
            participantUserName:participantUserName,
            administratorUserName:administratorUserName,
            modalOpen: props.modalOpen,
            inviteAllModalOpen:false,
            selectedSurvey:props.selectedSurvey,
            activeTab :"common",
            surveyParamsParticipant:"",
            surveyParamsAdmin:"",
            allUsersChecked:true,
            customTextParticipant:i18n.getTranslation("common.mails.defaultLoginTokenEmailText"),
            customTextAdmin:i18n.getTranslation("common.mails.defaultLoginTokenEmailText")
        };
    
    }

    toggleTab(tabId) {
      this.setState({
        activeTab: tabId
      });
    }

    GetAllParticipantsAsDict(survey)
    {
    
      let participants = new Map ();
      
      if(survey)
        participants = this.storageHandlerInstance.GetAllParticipantsOfSurvey(survey._id);

      if(participants && (participants.size >0 || participants.length>0))
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

    
    checkAllUsers= (changeEvent)  => {
      let allUsersChecked =  (changeEvent.target.checked===true) ;
      
      this.setState({
        allUsersChecked:allUsersChecked
      });
      
      let allUsersDict = null;
      if(allUsersChecked == true)
      {
        allUsersDict = this.GetAllUsersAsDict(this.state.selectedSurvey,false);
      }
      else
      {
        allUsersDict = this.GetAllUsersAsDict(this.state.selectedSurvey,true);
      }
      this.setState({
        allUsersDict: allUsersDict
      });
    }


    cancelInviteAllModalCallback = ()  => {
      this.setState({
        inviteAllModalOpen: false
      });
    }

    GetAllAdministratorsAsDict(survey)
    {
      let admins = new Map ();

      if(survey)
        admins = this.storageHandlerInstance.GetAllAdministratorsOfSurvey(survey._id);

      if(admins && (admins.size >0 || admins.length>0))
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

    GetAllUsersAsDict(survey,exclExistSurvMembers)
    {
        let users = new Map ();
        
        if(survey && exclExistSurvMembers) 
        {
          users = this.storageHandlerInstance.GetAllUsersExclUsersOfSurvey(survey);
        }
        else
        {
          users = this.storageHandlerInstance.GetAllUsers();
        }
    
        if(users && (users.size >0 || users.length >0))
        {
          users = new Map(
            users.map(x => [x._id, x])
          );
        }   
        else
        {
          users = new Map ();
        }
        return users;
    }

    

    componentWillReceiveProps(nextProps)
    {

      let participantDict = this.GetAllParticipantsAsDict(nextProps.selectedSurvey);
      let administratorDict = this.GetAllAdministratorsAsDict(nextProps.selectedSurvey);
      this.setState({
          modalOpen: nextProps.modalOpen,
          selectedSurvey:nextProps.selectedSurvey,
          administratorDict:administratorDict,
          participantDict:participantDict
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
    
    
    async resetParticipantProgress(user) {
      if(!this.state.selectedSurvey)
        return;
      user = await this.userHandler.ResetUserProgress(user._id,this.state.selectedSurvey._id);

      let participantDict = this.state.participantDict;
      participantDict.set(user._id,user);

      this.setState({
        participantDict: participantDict,
        selectedParticipant: user
      }); 
    }

    async deleteParticipant(user) {
      if(!this.state.selectedSurvey)
        return;
      user = await this.userHandler.RemoveParticipantFromSurvey(this.state.selectedSurvey._id,user);

      let participantDict = this.state.participantDict;
      participantDict.delete(user._id);

      this.setState({
        participantDict: participantDict,
        selectedParticipant: user
      }); 
    }


    updateSelectedSurveyCallback(selectedSurvey)
    {
      this.setState({
        selectedSurvey: selectedSurvey
      }); 
    }
    
    async  deleteAdministrator(user) {
      if(!this.state.selectedSurvey)
        return;
      user = await this.userHandler.RemoveAdminFromSurvey(this.state.selectedSurvey._id,user);

      let administratorDict = this.state.administratorDict;
      administratorDict.delete(user._id);

      this.setState({
        administratorDict: administratorDict,
        selectedAdministrator: user
      }); 
    }

    setSelectedParticipant(selectedUser,edit) {
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

    setSelectedAdministrator(selectedUser,edit) {
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

    async inviteAllUsers() {
     /*  this.setState({
        inviteAllModalOpen: true
      }); 
    */
      this.InviteAllUsersToSurvey(this.state.selectedSurvey,null,null);
    }

    submitInviteAllSubModal= (customTextParticipant,surveyParamsParticipant)  => {
      this.setState({
        customTextParticipant: customTextParticipant,
        surveyParamsParticipant:surveyParamsParticipant
      }); 
      this.InviteAllUsersToSurvey(this.state.selectedSurvey,customTextParticipant,surveyParamsParticipant);
    }


    async inviteParticipant(selectedUser) {
      await this.InviteUserToSurvey(this.state.selectedSurvey,selectedUser.username,false,this.state.customTextParticipant,this.state.surveyParamsParticipant);
    }

    async inviteAdministrator(selectedUser) {
      await this.InviteUserToSurvey(this.state.selectedSurvey,selectedUser.username,true,this.state.customTextParticipant,this.state.surveyParamsParticipant);
    }

    async resetAdministratorProgress(user) {
      if(!this.state.selectedSurvey)
        return;
      user = await this.userHandler.ResetUserProgress(user._id,this.state.selectedSurvey._id);

      let administratorDict = this.state.administratorDict;
      administratorDict.set(user._id,user);

      this.setState({
        administratorDict: administratorDict,
        selectedAdministrator: user
      }); 
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
    
    updateSurveyParamsParticipant(changeEvent) {
      let surveyParamsParticipant = changeEvent.target.value;
      this.setState({
        surveyParamsParticipant: surveyParamsParticipant
      }); 
    }

    updateCustomTextParticipant(changeEvent) {
      let customTextParticipant = changeEvent.target.value;
      this.setState({
        customTextParticipant: customTextParticipant
      }); 
    }
    
    async CreateAdminByEmail( ) {
      await this.CreateUserByEmail(this.state.selectedSurvey,this.state.administratorEmail,this.state.administratorUserName,true,this.state.customTextAdmin,this.state.surveyParamsAdmin);
    }

    async CreateParticipantByEmail( ) {
      await this.CreateUserByEmail(this.state.selectedSurvey,this.state.participantEmail,this.state.participantUserName,false,this.state.customTextParticipant,this.state.surveyParamsParticipant);
    }

    async CreateUserByEmail(selectedSurvey,email,userName,isAdmin,customText,surveyParams)
    {
      let selectedUser = null;
      if(!this.state.selectedSurvey)
        return;
      selectedUser = await this.userHandler.CreateUserByEmail(selectedSurvey._id,email,userName,isAdmin,surveyParams);
 
      selectedSurvey =  SurveyModelCollection.findOne(
        {_id:selectedSurvey._id}
      );

      this.setState({
        selectedSurvey: selectedSurvey
      }); 

      if(selectedUser != null && !selectedUser.error &&  selectedUser.name != "MongoError")
      {
        let stampedLoginToken =  await this.storageHandlerInstance.GetLoginToken(selectedUser,true);

        if(stampedLoginToken && stampedLoginToken.token)
        {
          await this.storageHandlerInstance.InsertLoginTokenToUser(selectedUser,stampedLoginToken,true);
          this.setState({
            loginToken: stampedLoginToken.token
          });
          selectedUser =  Meteor.users.findOne(
            {"_id":selectedUser._id}
          );
        }

        if(!selectedUser || !stampedLoginToken || !stampedLoginToken.token || !selectedSurvey)
        {
          alert(i18n.getTranslation("common.exceptions.mailSendError"));
          return;
        }
    
        let response = await this.userHandler.SendLoginTokenByEmail(selectedUser,stampedLoginToken.token,selectedSurvey,customText,surveyParams);
        if(response != true)
        {
          alert(i18n.getTranslation("common.exceptions.mailSendError"));
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
      else
      {
        alert(i18n.getTranslation("common.exceptions.userCreationError"));
      }
    }

    async InviteAllUsersToSurvey(selectedSurvey,customText,surveyParams)
    {
      if(!this.state.selectedSurvey)
        return;

      await this.userHandler.InviteAllUsersToSurvey(selectedSurvey._id,customText,surveyParams);
      selectedSurvey =  SurveyModelCollection.findOne(
        {_id:selectedSurvey._id}
      );

      let participantDict = this.GetAllParticipantsAsDict(selectedSurvey);

      this.setState({
        selectedSurvey: selectedSurvey,
        participantDict:participantDict
        
      }); 

    }

    async InviteUserToSurvey(selectedSurvey,userName,isAdmin,customText,surveyParams)
    {
      let selectedUser = null;

      selectedUser = await this.userHandler.InviteUserToSurvey(selectedSurvey._id,userName,isAdmin,surveyParams);
 
      selectedSurvey =  SurveyModelCollection.findOne(
        {_id:selectedSurvey._id}
      );

      this.setState({
        selectedSurvey: selectedSurvey
      }); 

      if(selectedUser != null && !selectedUser.error &&  selectedUser.name != "MongoError")
      {
        let stampedLoginToken =  await this.storageHandlerInstance.GetLoginToken(selectedUser,true);

        if(stampedLoginToken && stampedLoginToken.token)
        {
          await this.storageHandlerInstance.InsertLoginTokenToUser(selectedUser,stampedLoginToken,true);
          this.setState({
            loginToken: stampedLoginToken.token
          });
          selectedUser =  Meteor.users.findOne(
            {"_id":selectedUser._id}
          );
        }

        if(!selectedUser || !stampedLoginToken || !stampedLoginToken.token || !selectedSurvey)
        {
          alert(i18n.getTranslation("common.exceptions.userUpdateError"));
          return;
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
      else
      {
        alert(i18n.getTranslation("common.exceptions.userUpdateError"));
      }
    }

  
  render() {
    return (
      <Modal className={"modal-xl"} size={"lg"} isOpen={this.state.modalOpen} toggle={this.state.modalOpen}>
        <ModalHeader toggle={this.state.modalOpen}><T>common.modals.settings.header</T></ModalHeader>
        <ModalBody>
          <Nav tabs>
          <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "common" })}
                onClick={() => { this.toggleTab("common"); }}
              >
              <T>common.modals.settings.commonHeader</T>
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab  === "usersEmail" })}
                onClick={() => { this.toggleTab("usersEmail"); }}
              >
              <T>common.modals.settings.usersEmailHeader</T>
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab  === "usersExisting" })}
                onClick={() => { this.toggleTab("usersExisting"); }}
              >
              <T>common.modals.settings.usersExistingHeader</T>
              </NavLink>
            </NavItem>
            

          </Nav>
          <TabContent activeTab={this.state.activeTab}>

            <TabPane tabId="common">
              <CommonSubModal updateSelectedSurveyCallback =  {(selectedSurvey)  => this.updateSelectedSurveyCallback(selectedSurvey)}  selectedSurvey = {this.state.selectedSurvey}  />
            </TabPane>

            <TabPane tabId="usersEmail">
              <div className="form-group row ">
                <div className="col-md-1">
                  <Label><T>common.modals.surveyModal.participants</T></Label>
                </div>
                <div className="col-md-6">
                    
                </div>
              </div>

              <div className="form-group row">
                <div className="col-md-6">
                    <UserEditorTable inviteAllUsersCallback = {()  => this.inviteAllUsers()}   showUserId={true} showUserDesc = {true} resetUserProgressCallback = {(user)  => this.resetParticipantProgress(user)} selectedSurvey = {this.state.selectedSurvey} deleteUserCallback =  {(user)  => this.deleteParticipant(user)}  setSelectedUserCallback =  {(user)  => this.setSelectedParticipant(user,false)} selectedUser = {this.state.selectedParticipant}  userDict = {this.state.participantDict}/>
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
                  </div>
                  <div className="form-group row">
                      <div className="col-md-2 justify-content-center">
                        <Label><T>common.modals.surveyModal.surveyParams</T></Label>
                      </div>
                      <div className="col-md-4 justify-content-center">
                          <input  onChange={(event) => {this.updateSurveyParamsParticipant(event)}} type="text" defaultValue={this.state.surveyParamsParticipant}   id="administratorUserName-input" name= "administratorUserName" className="form-control dataPropertyInput" placeholder=""/>
                      </div>
                  </div>
                  <div className="form-group row">
                      <div className="col-md-2 justify-content-center">
                        <Label><T>common.modals.surveyModal.customText</T></Label>
                      </div>
                      <div className="col-md-4 justify-content-center">
                          <Input type="textarea" rows="3" onChange={(event) => {this.updateCustomTextParticipant(event)}}  defaultValue={this.state.customTextParticipant}   id="administratorUserName-input" name= "administratorUserName" className="form-control dataPropertyInput" placeholder=""/>
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
                    <UserEditorTable inviteAllUsersCallback = {()  => this.inviteAllUsers()}  showUserId={true}  showUserDesc = {true} resetUserProgressCallback = {(user)  => this.resetAdministratorProgress(user)} selectedSurvey = {this.state.selectedSurvey} deleteUserCallback =  {(user)  => this.deleteAdministrator(user)}  setSelectedUserCallback =  {(user)  => this.setSelectedAdministrator(user,false)} selectedUser = {this.state.selectedAdministrator}  userDict = {this.state.administratorDict}/>
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
                  </div>
                  <div className="form-group row">
                      <div className="col-md-2 justify-content-center">
                        <Label><T>common.modals.surveyModal.surveyParams</T></Label>
                      </div>
                      <div className="col-md-4 justify-content-center">
                          <input  onChange={(event) => {this.updateSurveyParamsAdmin(event)}} type="text" defaultValue={this.state.surveyParamsAdmin}   id="administratorUserName-input" name= "administratorUserName" className="form-control dataPropertyInput" placeholder=""/>
                      </div>
                  </div>
                  <div className="form-group row">
                      <div className="col-md-2 justify-content-center">
                        <Label><T>common.modals.surveyModal.customText</T></Label>
                      </div>
                      <div className="col-md-4 justify-content-center">
                        <Input   type="textarea" rows="3" onChange={(event) => {this.updateCustomTextAdmin(event)}}   defaultValue={this.state.customTextAdmin}   id="administratorUserName-input" name= "administratorUserName" className="form-control dataPropertyInput" placeholder=""/>
                      </div>
                      <div className="col-md-4 justify-content-center">
                        <Button color="primary" onClick= {()  => this.CreateAdminByEmail()}><T>common.modals.surveyModal.inviteEmailAdministrator</T></Button>
                      </div>
                  </div>
                </div>
              </div>
            </TabPane>

            <TabPane tabId="usersExisting">
              <div className="form-group row">
                <div className="col-md-5">
                  <div className="form-group row ">
                    <div className="col-md-2">
                      <Label><T>common.modals.surveyModal.participants</T></Label>
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-12">
                        <UserEditorTable inviteAllUsersCallback = {()  => this.inviteAllUsers()}  showUserId={false}  showLoginToken = {true}  showUserDesc = {false} resetUserProgressCallback = {(user)  => this.resetParticipantProgress(user)} selectedSurvey = {this.state.selectedSurvey} deleteUserCallback =  {(user)  => this.deleteParticipant(user)}  setSelectedUserCallback =  {(user)  => this.setSelectedParticipant(user,false)} selectedUser = {this.state.selectedParticipant}  userDict = {this.state.participantDict}/>
                    </div>
                  </div>

                  <div className="form-group row  ">
                    <div className="col-md-2">
                      <Label><T>common.modals.surveyModal.administrators</T></Label>
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-12">
                        <UserEditorTable inviteAllUsersCallback = {()  => this.inviteAllUsers()}  showUserId={false} showLoginToken = {true}  showUserDesc = {false} resetUserProgressCallback = {(user)  => this.resetAdministratorProgress(user)} selectedSurvey = {this.state.selectedSurvey} deleteUserCallback =  {(user)  => this.deleteAdministrator(user)}  setSelectedUserCallback =  {(user)  => this.setSelectedAdministrator(user,false)} selectedUser = {this.state.selectedAdministrator}  userDict = {this.state.administratorDict}/>
                    </div>
                  </div>
                </div>
                <div className="col-md-7">

                  <div className="form-group row ">
                    <div className="col-md-2">
                      <Label><T>common.modals.surveyModal.allUsers</T></Label>
                    </div>
                    <div className="col-md-1">
                      <Input type="checkbox" onChange={(event) => {this.checkAllUsers(event)}}  checked={this.state.allUsersChecked}   id="checkAllUsers-input" name= "checkAllUsers" className="form-control dataPropertyInput" placeholder=""/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-12">
                        <UserEditorTable inviteAllUsersCallback = {()  => this.inviteAllUsers()}  showUserId={false} showUserDesc = {false} inviteParticipantCallback =  {(user)  => this.inviteParticipant(user)}  inviteAdminCallback =  {(user)  => this.inviteAdministrator(user)} addPartButton = {true} addAdminButton = {true} hideDelete = {true}   userDict = {this.state.allUsersDict}/>
                    </div>
                  </div>
                </div>
              </div>

            </TabPane>
           
          </TabContent>

         

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick= {()  => this.submitModal()}><T>common.commonUI.OK</T></Button>
          <Button color="primary" onClick= {()  => this.cancelModal()}><T>common.commonUI.Cancel</T></Button>
        </ModalFooter>
        <InviteAllSubModal  surveyParamsParticipant = {this.state.surveyParamsParticipant} customTextParticipant = {this.state.customTextParticipant} submitModalCallback = {(customTextParticipant,surveyParamsParticipant)  => this.submitInviteAllSubModal(customTextParticipant,surveyParamsParticipant)} cancelModalCallback = {()  => this.cancelInviteAllModalCallback()} modalOpen = {this.state.inviteAllModalOpen}/>
      </Modal>
    )
  }
}

export default SurveySettingsModal;
