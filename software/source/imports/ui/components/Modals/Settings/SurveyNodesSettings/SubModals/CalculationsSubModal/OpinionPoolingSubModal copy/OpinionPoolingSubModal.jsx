import React, { Component } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from './node_modules/meteor/universe:i18n';

const T = i18n.createComponent();

class CalculationsSubModal extends Component {

  constructor(props) {
    super(props);
 
  }
 
  componentWillReceiveProps(nextProps)
  {
 
  }
 
  render() {
    return (
      <div>
        calc
      </div>
    )
  }
}

export default CalculationsSubModal;
