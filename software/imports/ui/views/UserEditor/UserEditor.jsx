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
import StorageHandlerFactory from '../../../API/Modules/StorageHandling/StorageHandlerFactory';
import _uniqueId from 'lodash/uniqueId';
import UserModel from '../../../API/Models/ModelTemplates/Configuration/UserConfig/UserModel';
import UserEditorTable from '../../components/UserEditorTable/UserEditorTable';
import UserEditorDetails from '../../components/UserEditorDetails/UserEditorDetails';
import UserHandler from '../../../API/Modules/UserHandling/UserHandler';

var cloneDeep = require('lodash.clonedeep');

const T = i18n.createComponent();

class UserEditor extends Component {

  constructor(props) {
    super(props);

    this.storageHandlerInstance = StorageHandlerFactory.GetStorageHandler();
    this.userHandler = new UserHandler();
    let userDict  = this.storageHandlerInstance.GetAllUsersAsDict();
    let selectedUser = null;
 
    if(userDict  && userDict.size>0)
    {
      let userArray = Array.from(userDict.values());
      if(userArray.length>0)
      {
        selectedUser = cloneDeep(userArray[0]);
      }
    }

    this.state = {
      graph : null,
      userDict:userDict,
      oldSelectedUser:cloneDeep(selectedUser),
      selectedUser:cloneDeep(selectedUser)
    };
 
  }

  componentDidMount() {
    this.setSelectedUser(this.state.selectedUser,false);
  } 
  
  componentWillReceiveProps(nextProps){
  
  }
 
  setSelectedUser = (selectedUser,edit) => {
    this.setState({
      selectedUser: cloneDeep(selectedUser)
    }); 

    if(edit==false)
    {
      this.setState({
        oldSelectedUser: cloneDeep(selectedUser)
      }); 
    }
  }

  submitNewUser = async () => {
    let userAdd = await this.userHandler.SubmitNewUser(this.state.selectedUser,this.state.userDict);
    this.setState({
      userDict: userAdd.userDict,
      selectedUser: userAdd.selectedUser
    }); 
  }

  submitUserEdit = async () => {
    let userEdit = await this.userHandler.SubmitUserEdit(this.state.selectedUser,this.state.userDict);
    this.setState({
      userDict: userEdit.userDict,
      selectedUser: userEdit.selectedUser
    }); 
  }

  cancelUserEdit = (selectedUser) => {
    let userCancel = this.userHandler.CancelUserEdit(this.state.selectedUser,this.state.userDict);
    this.setState({
      userDict: userCancel.userDict,
      selectedUser: userCancel.selectedUser
    }); 
  }

  deleteUser = async (user) => {
    let userDelete = await this.userHandler.DeleteUser(user,this.state.selectedUser,this.state.userDict);
    this.setState({
      userDict: userDelete.userDict,
      selectedUser: userDelete.selectedUser
    }); 
  }
 
  render() {
    return (
        <div className="container-fluid seamless" style={{overflow: 'hidden' }} >
            <div className="form-group row">
              <div className="col-md-6 headerCol">
                <Label><T>common.modals.userEditor.userHeader</T></Label>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-md-6">
                <UserEditorTable deleteUserCallback =  {(user)  => this.deleteUser(user)}  setSelectedUserCallback =  {(user)  => this.setSelectedUser(user,false)} selectedUser = {this.state.selectedUser}  userDict = {this.state.userDict}/>
              </div>
              <div className="col-md-5">
                <UserEditorDetails selectedUser= {this.state.selectedUser} setSelectedUserCallback =  {(user)  => this.setSelectedUser(user,true)}  userDict = {this.state.userDict}/>
              </div>
              <div className="col-md-6">
              </div>
              <div className="col-md-1">
                <Button onClick= {()  => this.submitUserEdit()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.commonUI.OK</T></Button>  
              </div>
              <div className="col-md-1">
                <Button onClick= {()  => this.cancelUserEdit()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.commonUI.Cancel</T></Button>
              </div>
              <div className="col-md-1">
                <Button onClick= {()  => this.submitNewUser()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.commonUI.SubmitNewItem</T></Button>  
              </div>
            </div>
             
        </div>
    )
  }
}
export default withTracker(() => {
  return {
  };
})(UserEditor);
 