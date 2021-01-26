import React, { Component } from 'react';
import {FormGroup,Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import { Meteor } from 'meteor/meteor';
import UserModel  from '../../../API/Models/ModelTemplates/Configuration/UserConfig/UserModel';
const T = i18n.createComponent();
import UserSettingsModal from '../Modals/Settings/UserSettings/UserSettingsModal';

class SurveyEditorDetails extends Component {

  constructor(props) {
    super(props);
 
    let username = null;
    let userdescription = null;
    let useremail = null;
    let userpassword = null;
    let selectedUserRole = "userRole";

    if(props.selectedUser)
    {
      username = props.selectedUser.username;
      userdescription = props.selectedUser.profile.userdescription;
      useremail = props.selectedUser.emails[0].address;
      userpassword = props.selectedUser.userpassword;

      if(props.selectedUser.roles.includes("admin"))
        selectedUserRole = "adminRole";
    }

    this.state = {
      selectedUser:props.selectedUser,
      username:username,
      settingsModalOpen:false,
      userdescription:userdescription,
      useremail:useremail,
      userpassword:userpassword,
      selectedUserRole:selectedUserRole
    };
  }


  componentWillReceiveProps(nextProps){

    this.setState({
        userDict:nextProps.userDict
    }); 

    if(nextProps.selectedUser)
    {
      let selectedUserRole = "userRole";
      if(nextProps.selectedUser.roles.includes("admin"))
        selectedUserRole = "adminRole";

      this.setState({
        selectedUser:nextProps.selectedUser,
        username:nextProps.selectedUser.username,
        userdescription:nextProps.selectedUser.profile.userdescription,
        selectedUserRole:selectedUserRole
      }); 

      $("#userName-input").val(nextProps.selectedUser.username);
      $("#userDescription-input").val(nextProps.selectedUser.profile.userdescription);
      $("#userEmail-input").val(nextProps.selectedUser.emails[0].address);
      $("#userPassword-input").val(nextProps.selectedUser.userpassword);
    }
  }
 
  updateUserDescription = (changeEvent)  => {

    let selectedUser = this.state.selectedUser;
    if(!selectedUser)
      selectedUser = new UserModel(null);  

    selectedUser.profile.userdescription = changeEvent.target.value;
    this.setState({
        userdescription:changeEvent.target.value,
        selectedUser:selectedUser
    });
    this.props.setSelectedUserCallback(selectedUser); 
  }

  updateUserName = (changeEvent)  => {
    let selectedUser = this.state.selectedUser;
    if(!selectedUser)
      selectedUser = new UserModel(null);  
    selectedUser.username = changeEvent.target.value;

    this.setState({
      username:changeEvent.target.value,
      selectedUser:selectedUser
    });
    this.props.setSelectedUserCallback(selectedUser); 
  }

  updateUserEmail = (changeEvent)  => {
    let selectedUser = this.state.selectedUser;
    if(!selectedUser)
      selectedUser = new UserModel(null);  
    selectedUser.emails[0].address = changeEvent.target.value;

    this.setState({
      useremail:changeEvent.target.value,
      selectedUser:selectedUser
    });
    this.props.setSelectedUserCallback(selectedUser); 
  }

  updateUserPassword= (changeEvent)  => {
    let selectedUser = this.state.selectedUser;
    if(!selectedUser)
      selectedUser = new UserModel(null);  
    selectedUser.userpassword = changeEvent.target.value;

    this.setState({
      userpassword:changeEvent.target.value,
      selectedUser:selectedUser
    });
    this.props.setSelectedUserCallback(selectedUser); 
  }

  showAdvancedOptions = (changeEvent)  => {

  }

  changeUserRole =  (changeEvent)  => {
    let selectedUserRole = changeEvent.target.value;
    let rolesArray = ['loggedin','guest'];

    switch(selectedUserRole)
    {
      case "adminRole":
          rolesArray = ['admin','loggedin','guest'];
        break;
      case "userRole":
        break;
    }

    let selectedUser = this.state.selectedUser;
    if(!selectedUser)
      selectedUser = new UserModel(null);  

    selectedUser.roles = rolesArray; 
    this.setState({
      selectedUserRole:selectedUserRole,
      selectedUser:selectedUser
    });
    this.props.setSelectedUserCallback(selectedUser); 
  }

  showUserSettingsModal()
  {
    this.setState({
      settingsModalOpen: true
    });
  }

  submitModalCallback(selectedUser)
  {
    this.setState({
      selectedUser:selectedUser,
      settingsModalOpen: false
    });
    this.props.setSelectedUserCallback(selectedUser); 
  }

  cancelModalCallback(selectedUser)
  {
    this.setState({
      settingsModalOpen: false
    });
  }

  render() {
    return (
      <div>
         <UserSettingsModal selectedUser = {this.state.selectedUser} submitModalCallback = {(selectedUser)  => this.submitModalCallback(selectedUser)} cancelModalCallback = {(selectedUser)  => this.cancelModalCallback(selectedUser)} modalOpen = {this.state.settingsModalOpen}/>
          <div className="form-group row justify-content-left">
            <div className="col-md-3">
              <Label><T>common.modals.userEditor.userDetails.userName</T></Label>
            </div>
            <div className="col-md-5">
              <Input  onChange={(event) => {this.updateUserName(event)}} type="text" defaultValue={this.state.username}   id="userName-input" name= "userName" className="form-control dataPropertyInput left" placeholder=""/>
            </div>
          </div>

          <div className="form-group row justify-content-left">
            <div className="col-md-3">
              <Label><T>common.modals.userEditor.userDetails.userDescription</T></Label>
            </div>
            <div className="col-md-8">
              <Input  onChange={(event) => {this.updateUserDescription(event)}} type="textarea" defaultValue={this.state.userdescription}  rows="4" cols="50"  id="userDescription-input" name= "userDescription" className="form-control dataPropertyInput left" placeholder=""/>
            </div>
          </div>

          <div className="form-group row justify-content-left">
            <div className="col-md-3">
              <Label><T>common.modals.userEditor.userDetails.userEmail</T></Label>
            </div>
            <div className="col-md-8">
              <Input  onChange={(event) => {this.updateUserEmail(event)}} type="text" defaultValue={this.state.useremail}  rows="4" cols="50"  id="userEmail-input" name= "userEmail" className="form-control dataPropertyInput left" placeholder=""/>
            </div>
          </div>

          <div className="form-group row justify-content-left">
            <div className="col-md-3">
              <Label><T>common.modals.userEditor.userDetails.userPassword</T></Label>
            </div>
            <div className="col-md-8">
              <Input onChange={(event) => {this.updateUserPassword(event)}} type="password" defaultValue={this.state.userpassword}  rows="4" cols="50"  id="userPassword-input" name= "userPassword" className="form-control dataPropertyInput left" placeholder=""/>
            </div>
          </div>

          <div className="form-group row justify-content-left">
            <div className="col-md-3">
               <Button onClick= {()  => this.showUserSettingsModal()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.modals.userEditor.userDetails.advancedOptions</T></Button>
            </div>
          </div>

          <div className="form-group row justify-content-left">
            <div className="col-md-3">
              <Label><T>common.modals.userEditor.userDetails.userRoles</T></Label>
            </div>
            <div className="col-md-8">
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="userRolesRadio" value="adminRole" checked={this.state.selectedUserRole === "adminRole"} onChange={(event) => {this.changeUserRole(event)}}  /* onChange={() => {this.changeUserRole(this)}} */ />{' '}
                    <T>common.modals.userEditor.userDetails.adminRole</T>
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="userRolesRadio" value="userRole" checked={this.state.selectedUserRole === "userRole"} onChange={(event) => {this.changeUserRole(event)}}  /* onChange={() => {this.changeUserRole(this)}}  *//>{' '}
                    <T>common.modals.userEditor.userDetails.userRole</T>
                  </Label>
                </FormGroup>
            </div>
          </div>
        
      </div>
    )
  }
}

export default SurveyEditorDetails;
