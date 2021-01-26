import React, { Component } from 'react';
import {Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import { Meteor } from 'meteor/meteor';
import { Table } from 'reactstrap';
const T = i18n.createComponent();

class UserEditorTable extends Component {

  constructor(props) {
    super(props);

      this.state = {
        userDict:props.userDict,
        selectedUser:props.selectedUser,
      };
  
  }

  componentWillReceiveProps(nextProps){

    this.setState({
      userDict:nextProps.userDict
    }); 

    if(nextProps.selectedUser)
    {
      this.setState({
        selectedUser:nextProps.selectedUser
      }); 
    }
  }
 
  setselectedUser(user){
    this.setState({
      selectedUser:user
    }); 
    this.props.setSelectedUserCallback(user);
     
  }

  
  deleteUser(user){
    this.props.deleteUserCallback(user);
  }

  render() {
    return (
      <div>
          <Table hover>
            <thead>
              <tr>
                <th><T>common.modals.userEditor.userTable.userNumber</T></th>
                <th><T>common.modals.userEditor.userTable.userId</T></th>
                <th><T>common.modals.userEditor.userTable.userName</T></th>
                <th><T>common.modals.userEditor.userTable.userDescription</T></th>
                <th><T>common.modals.userEditor.userTable.userEmail</T></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                Array.from(this.state.userDict.values()).map((user,itemC)=> (
                  <tr key={user._id}  className={(this.state.selectedUser && this.state.selectedUser._id === user._id) ? "tableRowSelected" : ""}>
                    <td onClick={() => { this.setselectedUser(user)}}>{itemC+1}</td>
                    <td onClick={() => { this.setselectedUser(user)}}>{user._id}</td>
                    <td onClick={() => { this.setselectedUser(user)}}>{user.username}</td>
                    <td onClick={() => { this.setselectedUser(user)}}>{user.profile.userdescription}</td>
                    <td onClick={() => { this.setselectedUser(user)}}>{user.emails[0].address}</td>
                    <td className="noPadding faContainer"><Button onClick= {()  => this.deleteUser(user)} type="button" className="btn btn-outline-secondary noBorder standardElement"><i class="inline fa fa-trash fa-lg mt-4 faLgContainer"></i></Button>  </td>
                  </tr>
                ))
              }
            </tbody>
        </Table>
      </div>
    )
  }
}

export default UserEditorTable;
