import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
 
const T = i18n.createComponent();

class SurveyCompleted extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
 
    };
     
  }

   

  componentDidMount() {
  
  } 

  componentWillReceiveProps(nextProps){

 
    
  }
 
  render() {
    return (
        <div className="surveyMessageContainer"  >
            <T>common.modals.surveyModal.surveyAlreadyCompleted</T>
        </div>
    )
  }
}
export default withTracker(() => {
  return {
  };
})(SurveyCompleted);
 