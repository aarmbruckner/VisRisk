import React, { Component } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';

import AxisSubModal from './AxisSubModal';
const T = i18n.createComponent();

class GridSubModal extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      gridConfigModel: props.gridConfigModel,
      xAxisModel:props.gridConfigModel.xAxisModel,
      yAxisModel:props.gridConfigModel.yAxisModel
    }
  }
 
  componentWillReceiveProps(nextProps)
  {
    this.setState({
      gridConfigModel: nextProps.gridConfigModel,
      xAxisModel:nextProps.gridConfigModel.xAxisModel,
      yAxisModel:nextProps.gridConfigModel.yAxisModel
    })
 
  }
  
  updateXAxisModelCallback (xAxisModel)
  {
    let gridConfigModel = this.state.gridConfigModel;
    gridConfigModel.xAxisModel = xAxisModel;
    this.props.gridConfigModelChangedCallback(gridConfigModel);
  }

  updateYAxisModelCallback (yAxisModel)
  {
    let gridConfigModel = this.state.gridConfigModel;
    gridConfigModel.yAxisModel = yAxisModel;
    this.props.gridConfigModelChangedCallback(gridConfigModel);
  }

  render() {
    return (
      <div className="form-group row justify-content-center">
        <div className="col-md-6">
          <AxisSubModal axisModel = {this.state.xAxisModel} updateAxisModelCallback =  {(xAxisModel)  => this.updateXAxisModelCallback(xAxisModel)}  axisHeader={i18n.getTranslation("common.modals.gridModal.xAxisHeader")} />
        </div>
        <div className="col-md-6">
          <AxisSubModal axisModel = {this.state.yAxisModel} updateAxisModelCallback =  {(yAxisModel)  => this.updateYAxisModelCallback(yAxisModel)} axisHeader={i18n.getTranslation("common.modals.gridModal.yAxisHeader")} />
        </div>
      </div>
    )
  }
}

export default GridSubModal;
