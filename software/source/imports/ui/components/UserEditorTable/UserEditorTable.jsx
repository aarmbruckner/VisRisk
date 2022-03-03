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
    if(typeof this.props.setSelectedUserCallback != 'undefined' )
      this.props.setSelectedUserCallback(user);    
  }

  deleteUser(user){
    this.props.deleteUserCallback(user);
  }

  resetUserProgress(user){
    this.props.resetUserProgressCallback(user);
  }
  
  resetUserProgress(user){
    this.props.resetUserProgressCallback(user);
  }

  resetUserProgress(user){
    this.props.resetUserProgressCallback(user);
  }

  inviteAllUsers(){
    this.props.inviteAllUsersCallback();
  }

  render() {
    return (
      <div>
          <Table hover>
            <thead>
              <tr>
                <th><T>common.modals.userEditor.userTable.userNumber</T></th>
                {this.props.showUserId && (
                      <th><T>common.modals.userEditor.userTable.userId</T></th>
                  )
                }
                <th><T>common.modals.userEditor.userTable.userName</T></th>
                {this.props.showUserDesc && (
                     <th><T>common.modals.userEditor.userTable.userDescription</T></th>
                  )
                }
               
                <th><T>common.modals.userEditor.userTable.userEmail</T></th>

                {this.props.showLoginToken === true && (
                        <th><T>common.modals.userEditor.userTable.loginToken</T></th>
                    )
                }

                {this.props.resetUserProgressCallback && (
                  <th></th>
                  )
                }
                
                {(this.props.hideDelete != true) && (
                   <th></th>
                  )
                }

                {this.props.addAdminButton && (
                  <th>

                  </th>
                  )
                }

                <th></th>
                {this.props.addPartButton && (
                   <th>
                     <Button onClick= {()  => this.inviteAllUsers()} type="button" className="btn noBorder userTableBtn"><T>common.modals.userEditor.userTable.AddAllUsers</T></Button>  
                   </th>
                  )
                }
            
       
              </tr>
            </thead>
            <tbody>
              {
                Array.from(this.state.userDict.values()).map((user,itemC)=> (
                  <tr key={user._id}  className={(this.state.selectedUser && this.state.selectedUser._id === user._id) ? "tableRowSelected" : ""}>
                    <td onClick={() => { this.setselectedUser(user)}}>{itemC+1}</td>
                    {this.props.showUserId && (
                      <td onClick={() => { this.setselectedUser(user)}}>{user._id}</td>
                    )}
                    <td onClick={() => { this.setselectedUser(user)}}>{user.username}</td>

                    {this.props.showUserDesc && (
                      <td onClick={() => { this.setselectedUser(user)}}>{user.profile.userdescription}</td>
                      )
                    }
                    <td onClick={() => { this.setselectedUser(user)}}>{(user.emails && user.emails.length>0) ? user.emails[0].address : ""} </td>
                    
                    {this.props.showLoginToken ? (

                        user.profile && user.profile.stampedLoginToken   ? (
                          <input  onClick={() => { this.setselectedUser(user)}} disabled={true} value={user.profile.stampedLoginToken.token} className="form-control dataPropertyInput" placeholder=""/>
                        )
                        :
                        <td></td>

                      )
                      :
                      (
                        <td></td>
                      )
                    }

                    {this.props.resetUserProgressCallback && (
                      <td className="faContainer"><Button onClick= {()  => this.resetUserProgress(user)} type="button" className="btn noBorder btn-xs userTableBtn"><T>common.modals.userEditor.userTable.userReset</T></Button>  </td>
                      )
                    }
            
                    {(this.props.hideDelete != true) && (
                      <td className="faContainer"><Button onClick= {()  => this.deleteUser(user)} type="button" className="btn btn-outline-secondary noBorder userTableBtn"><i class="inline fa fa-trash fa-lg mt-4 faLgContainer"></i></Button>  </td>
                      )
                    }

                    {this.props.addAdminButton && (
                      <td className="faContainer"><Button onClick= {()  => this.props.inviteAdminCallback(user)} type="button" className="btn noBorder  btn-xs userTableBtn"><T>common.modals.userEditor.userTable.addAdmin</T></Button>  </td>
                      )
                    }

                    {this.props.addPartButton && (
                      <td className="faContainer"><Button onClick= {()  => this.props.inviteParticipantCallback(user)} type="button" className="btn noBorder btn-xs userTableBtn"><T>common.modals.userEditor.userTable.AddPart</T></Button>  </td>
                      )
                    }
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
