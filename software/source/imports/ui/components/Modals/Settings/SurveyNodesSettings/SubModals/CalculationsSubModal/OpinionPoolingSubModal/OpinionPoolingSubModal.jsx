import React, { Component } from 'react';
import {Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

class OpinionPoolingSubModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      calcConfigModel:props.calcConfigModel,
      decimalPointAccuracy:props.calcConfigModel.GetDecimalPointAccuracy(),
      epsilon:props.calcConfigModel.GetEpsilon(),
    };
  }
 
  componentWillReceiveProps(nextProps)
  {
    this.setState({
      calcConfigModel:nextProps.calcConfigModel,
      decimalPointAccuracy:nextProps.calcConfigModel.GetDecimalPointAccuracy(),
      epsilon:nextProps.calcConfigModel.GetEpsilon()
    });
  }

  updateDecimalPointAccuracy = (changeEvent)  => {
    let decimalPointAccuracy = parseFloat(changeEvent.target.value);

    let calcConfigModel = this.state.calcConfigModel;
    calcConfigModel.SetDecimalPointAccuracy(decimalPointAccuracy);
    this.setState({
      decimalPointAccuracy:decimalPointAccuracy,
      calcConfigModel:calcConfigModel
    });

    this.props.calcConfigModelChangedCallback(calcConfigModel);
  }

  updateEpsilon = (changeEvent)  => {
    let epsilon = parseFloat(changeEvent.target.value);

    let calcConfigModel = this.state.calcConfigModel;
    calcConfigModel.SetEpsilon(epsilon);
    this.setState({
      epsilon:epsilon,
      calcConfigModel:calcConfigModel
    });
    
    this.props.calcConfigModelChangedCallback(calcConfigModel);
  }

 
  render() {
    return (
      <div>
        <div className="form-group row justify-content-center">
          <div className="col-md-12">
            <Label><strong><T>common.modals.opinionModal.header</T></strong></Label>
          </div>
        </div>
        <div className="form-group row justify-content-center">
          <div className="col-md-2">
            <Label><T>common.modals.opinionModal.decimalPointAccuracy</T></Label>
          </div>
          <div className="col-md-1">
            <input  onChange={(event) => {this.updateDecimalPointAccuracy(event)}} type="text" defaultValue={this.state.decimalPointAccuracy}   id="decimalPointAccuracy-input" name= "decimalPointAccuracy" className="form-control dataPropertyInput" placeholder=""/>
          </div>
          <div className="col-md-2">
            <Label><T>common.modals.opinionModal.decimalRange</T></Label>
          </div>
          <div className="col-md-7"/>
        </div>
        <div className="form-group row justify-content-center">
          <div className="col-md-2">
            <Label><T>common.modals.opinionModal.Epsilon</T></Label>
          </div>
          <div className="col-md-1">
            <input type="text"  onChange={(event) => {this.updateEpsilon(event)}}  defaultValue={this.state.epsilon}   id="decimalPointAccuracy-input" name= "decimalPointAccuracy" className="form-control dataPropertyInput" placeholder=""/>
          </div>
          <div className="col-md-2">
            <Label><T>common.modals.opinionModal.epsilonRange</T></Label>
          </div>
          <div className="col-md-7"/>
        </div>
      </div>
    )
  }
}

export default OpinionPoolingSubModal;
