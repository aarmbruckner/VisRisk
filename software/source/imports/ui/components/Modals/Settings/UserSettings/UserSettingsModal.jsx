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

    let loginToken = "";
    let loginURL = "";
    if(props.selectedUser && props.selectedUser.services &&  props.selectedUser.services.resume && props.selectedUser.services.resume.loginTokens 
      && props.selectedUser.services.resume.loginTokens.length>0)
    {
      loginToken = props.selectedUser.services.resume.loginTokens[0].hashedToken;
     
    }

    this.state = {
      modalOpen: props.modalOpen,
      selectedUser:props.selectedUser,
      loginToken:loginToken,
      loginURL:loginURL
    };
    this.updateLoginURL(props.selectedUser,loginToken);
  }

  async updateLoginURL(selectedUser,loginToken)
  {
    let loginURL = await Meteor.callPromise('MailController.Methods.GetLoginUrlFromToken',selectedUser.username,loginToken,null,null);
    this.setState({
      loginURL:loginURL
    });
  }
 
  componentWillReceiveProps(nextProps)
  {
    let loginToken = "";
    let loginURL = "";
    this.setState({
      loginURL:loginURL
    });

    if(nextProps.selectedUser && nextProps.selectedUser.services &&  nextProps.selectedUser.services.resume && nextProps.selectedUser.services.resume.loginTokens 
      && nextProps.selectedUser.services.resume.loginTokens.length>0)
    {
      loginToken = nextProps.selectedUser.services.resume.loginTokens[0].hashedToken;

      this.updateLoginURL(nextProps.selectedUser,loginToken);
    }

    this.setState({
      modalOpen: nextProps.modalOpen,
      selectedUser:nextProps.selectedUser,
      loginToken:loginToken
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

    let stampedLoginToken = await this.storageHandlerInstance.GetLoginToken(this.state.selectedUser,true);

    if(stampedLoginToken && stampedLoginToken.token)
    {
      await this.storageHandlerInstance.InsertLoginTokenToUser(this.state.selectedUser,stampedLoginToken,true);
      let loginURL = await Meteor.callPromise('MailController.Methods.GetLoginUrlFromToken',this.state.selectedUser.username,stampedLoginToken.token,null,null);

      this.setState({
        loginToken: stampedLoginToken.token,
        loginURL:loginURL
      });

      navigator.clipboard.writeText(loginURL);
    }

  }

  async sendTokenViaEmail() {
 
    let selectedUser = this.state.selectedUser;
    if(!selectedUser || !this.state.loginToken)
    {
      alert(i18n.getTranslation("common.exceptions.mailSendError"));
      return;
    }

    let response = await this.userHandler.SendLoginTokenByEmail(selectedUser,this.state.loginToken);

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
          <div className="form-group row">
            <div className="col-md-2">
              <Button color="primary" onClick= {()  => this.generateLoginToken()}><T>common.modals.userModal.generateToken</T></Button>
            </div>
            <div className="col-md-2">
              <Button color="primary" onClick= {()  => this.sendTokenViaEmail()}><T>common.modals.userModal.sendToken</T></Button>
            </div>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-4">
              <input  disabled={true} value={this.state.loginToken} className="form-control dataPropertyInput" placeholder=""/>
            </div> 
            <div className="col-md-8">
              <input  disabled={true} value={this.state.loginURL} className="form-control dataPropertyInput" placeholder=""/>
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

export default UserSettingsModal;
