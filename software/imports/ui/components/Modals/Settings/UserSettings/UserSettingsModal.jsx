import React, { Component } from 'react';
import {Label,TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col,Button, Modal, ModalHeader, ModalBody, ModalFooter,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import classnames from 'classnames';
import StorageHandlerFactory from '../../../../../API/Modules/StorageHandling/StorageHandlerFactory';
import UserHandler from '../../../../../API/Modules/UserHandling/UserHandler';

const T = i18n.createComponent();

class UserSettingsModal extends Component {

  constructor(props) {
    super(props);

    this.storageHandlerInstance = StorageHandlerFactory.GetStorageHandler();
    this.userHandler = new UserHandler();

    let logintoken = "";
    if(props.selectedUser && props.selectedUser.services &&  props.selectedUser.services.resume && props.selectedUser.services.resume.loginTokens 
      && props.selectedUser.services.resume.loginTokens.length>0)
    {
      logintoken = props.selectedUser.services.resume.loginTokens[0].hashedToken;
    }

    this.state = {
      modalOpen: props.modalOpen,
      selectedUser:props.selectedUser,
      logintoken:logintoken
    };
 
  }
 
  componentWillReceiveProps(nextProps)
  {
    let logintoken = "";
    if(nextProps.selectedUser && nextProps.selectedUser.services &&  nextProps.selectedUser.services.resume && nextProps.selectedUser.services.resume.loginTokens 
      && nextProps.selectedUser.services.resume.loginTokens.length>0)
    {
      logintoken = nextProps.selectedUser.services.resume.loginTokens[0].hashedToken;
    }

    this.setState({
      modalOpen: nextProps.modalOpen,
      selectedUser:nextProps.selectedUser,
      logintoken:logintoken
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
    let selectedUser = this.state.selectedUser;
    this.props.cancelModalCallback(selectedUser);
  }

  submitModal() {
    let selectedUser = this.state.selectedUser;
    this.props.submitModalCallback(selectedUser);
  }

  async generateLoginToken() {

    let stampedLoginToken =  await this.storageHandlerInstance.GetLoginToken(this.state.selectedUser);

    if(stampedLoginToken && stampedLoginToken.token)
    {
      await this.storageHandlerInstance.InsertLoginTokenToUser(this.state.selectedUser,stampedLoginToken);
      this.setState({
        loginToken: stampedLoginToken.token
      });
    }

  }

  async sendTokenViaEmail() {
 
    let selectedUser = this.state.selectedUser;
    if(!selectedUser || !this.state.logintoken)
    {
      alert(i18n.getTranslation("common.exceptions.mailSendError"));
      return;
    }

    let response = await this.userHandler.SendLoginTokenByEmail(selectedUser,this.state.logintoken);
    if(response != true)
    {
      alert(i18n.getTranslation("common.exceptions.mailSendError"+" : "+response));
    }
  }

  render() {
    return (
      <Modal className={"modal-xl"} size={"lg"} isOpen={this.state.modalOpen} toggle={this.state.modalOpen}>
        <ModalHeader toggle={this.state.modalOpen}><T>common.modals.settings.header</T></ModalHeader>
        <ModalBody>
          <div className="form-group row justify-content-center">
            <div className="col-md-2">
              <Label><T>common.modals.userModal.loginToken</T></Label>
            </div>
            <div className="col-md-2">
              <Button color="primary" onClick= {()  => this.generateLoginToken()}><T>common.modals.userModal.generateToken</T></Button>
            </div>
            <div className="col-md-2">
              <Button color="primary" onClick= {()  => this.sendTokenViaEmail()}><T>common.modals.userModal.sendToken</T></Button>
            </div>
           {/*  <div className="col-md-6">
              <input  disabled={true} value={this.state.logintoken} className="form-control dataPropertyInput" placeholder=""/>
            </div> */}
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

export default UserSettingsModal;
