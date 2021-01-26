import React, { Component } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import DataCorrectionSubModal from './DataCorrectionSubModal';
import OpinionPoolingSubModal from './OpinionPoolingSubModal';
 
class CalculationsSubModal extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      calcConfigModel:props.calcConfigModel
    };
  }
 
  componentWillReceiveProps(nextProps)
  {
    this.setState({
      calcConfigModel:nextProps.calcConfigModel
    });
  }
 
  render() {
    return (
      <div>
        <div className="form-group row justify-content-center">
          <div className="col-md-12">
            <DataCorrectionSubModal calcConfigModelChangedCallback = {this.props.calcConfigModelChangedCallback}  calcConfigModel={this.state.calcConfigModel} />
          </div>
        </div>
        <div className="form-group row justify-content-center">
          <div className="col-md-12">
            <OpinionPoolingSubModal calcConfigModelChangedCallback = {this.props.calcConfigModelChangedCallback}  calcConfigModel={this.state.calcConfigModel}/>
          </div>
        </div>
      </div>
    )
  }
}

export default CalculationsSubModal;
