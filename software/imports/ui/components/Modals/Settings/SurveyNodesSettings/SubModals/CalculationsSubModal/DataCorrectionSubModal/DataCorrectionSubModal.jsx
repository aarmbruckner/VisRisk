import React, { Component } from 'react';
import {Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

class DataCorrectionSubModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      calcConfigModel:props.calcConfigModel,
      pX:props.calcConfigModel.GetPX(),
      pY:props.calcConfigModel.GetPY(),
      deltaXLow:props.calcConfigModel.GetDeltaXLow(),
      deltaXHigh:props.calcConfigModel.GetDeltaXHigh(),
      deltaYLow:props.calcConfigModel.GetDeltaYLow(),
      deltaYHigh:props.calcConfigModel.GetDeltaYHigh(),
      enableManualDelta:props.calcConfigModel.GetEnableManualDelta()
    };
  }
 
  componentWillReceiveProps(nextProps)
  {
    this.setState({
      calcConfigModel:nextProps.calcConfigModel,
      pX:nextProps.calcConfigModel.GetPX(),
      pY:nextProps.calcConfigModel.GetPY(),
      deltaXLow:nextProps.calcConfigModel.GetDeltaXLow(),
      deltaXHigh:nextProps.calcConfigModel.GetDeltaXHigh(),
      deltaYLow:nextProps.calcConfigModel.GetDeltaYLow(),
      deltaYHigh:nextProps.calcConfigModel.GetDeltaYHigh(),
      enableManualDelta:nextProps.calcConfigModel.GetEnableManualDelta()
    });
  }

  updatePercentageX = (changeEvent)  => {
    let pX = parseFloat(changeEvent.target.value);
    let calcConfigModel = this.state.calcConfigModel;
    calcConfigModel.SetPX(pX);
    this.setState({
      pX:pX,
      calcConfigModel:calcConfigModel
    });
    this.props.calcConfigModelChangedCallback(calcConfigModel);
  }

  updatePercentageY = (changeEvent)  => {
    let pY = parseFloat(changeEvent.target.value);
    let calcConfigModel = this.state.calcConfigModel;
    calcConfigModel.SetPY(pY);
    this.setState({
      pY:pY,
      calcConfigModel:calcConfigModel
    });
    this.props.calcConfigModelChangedCallback(calcConfigModel);
  }

  updateDeltaXLow = (changeEvent)  => {
    let deltaXLow = parseFloat(changeEvent.target.value);
    let calcConfigModel = this.state.calcConfigModel;
    calcConfigModel.SetDeltaXLow(deltaXLow);
    this.setState({
      deltaXLow:deltaXLow,
      calcConfigModel:calcConfigModel
    });
    this.props.calcConfigModelChangedCallback(calcConfigModel);
  }

  updateDeltaXHigh= (changeEvent)  => {
    let deltaXHigh = parseFloat(changeEvent.target.value);
    let calcConfigModel = this.state.calcConfigModel;
    calcConfigModel.SetDeltaXHigh(deltaXHigh);
    this.setState({
      deltaXHigh:deltaXHigh,
      calcConfigModel:calcConfigModel
    });
    this.props.calcConfigModelChangedCallback(calcConfigModel);
  }

  updateDeltaYLow = (changeEvent)  => {
    let deltaYLow = parseFloat(changeEvent.target.value);
    let calcConfigModel = this.state.calcConfigModel;
    calcConfigModel.SetDeltaYLow(deltaYLow);
    this.setState({
      deltaYLow:deltaYLow,
      calcConfigModel:calcConfigModel
    });
    this.props.calcConfigModelChangedCallback(calcConfigModel);
  }

  updateDeltaYHigh= (changeEvent)  => {
    let deltaYHigh = parseFloat(changeEvent.target.value);
    let calcConfigModel = this.state.calcConfigModel;
    calcConfigModel.SetDeltaYHigh(deltaYHigh);
    this.setState({
      deltaYHigh:deltaYHigh,
      calcConfigModel:calcConfigModel
    });
    this.props.calcConfigModelChangedCallback(calcConfigModel);
  }

  updateEnableManualDelta= (changeEvent)  => {
    let enableManualDelta =  (changeEvent.target.checked===true) ;
    let calcConfigModel = this.state.calcConfigModel;
    calcConfigModel.SetEnableManualDelta(enableManualDelta);
    this.setState({
      enableManualDelta:enableManualDelta,
      calcConfigModel:calcConfigModel
    });
    this.props.calcConfigModelChangedCallback(calcConfigModel);
  }
 
  render() {
    return (
      <div>
          <div className="form-group row justify-content-center">
            <div className="col-md-12">
              <Label><strong><T>common.modals.dataCorrectionModal.header</T></strong></Label>
            </div>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-2">
              <Label><T>common.modals.dataCorrectionModal.percentageX</T></Label>
            </div>
            <div className="col-md-1">
              <input  onChange={(event) => {this.updatePercentageX(event)}} type="text" defaultValue={this.state.pX}   id="pX-input" name= "pX" className="form-control dataPropertyInput" placeholder=""/>
            </div>
            <div className="col-md-2">
              <Label><T>common.modals.dataCorrectionModal.percentageXRange</T></Label>
            </div>
            <div className="col-md-7"/>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-2">
              <Label><T>common.modals.dataCorrectionModal.percentageY</T></Label>
            </div>
            <div className="col-md-1">
              <input  onChange={(event) => {this.updatePercentageY(event)}} type="text" defaultValue={this.state.pY}   id="pY-input" name= "pY" className="form-control dataPropertyInput" placeholder=""/>
            </div>
            <div className="col-md-2">
              <Label><T>common.modals.dataCorrectionModal.percentageYRange</T></Label>
            </div>
            <div className="col-md-7"/>
          </div>
          <div className="form-group row">
            <div className="col-md-2">
              <Label>
                <T>common.modals.dataCorrectionModal.enableManualDelta</T>
              </Label>
            </div>
            <div className="col-md-1">
              <Input type="checkbox" onChange={(event) => {this.updateEnableManualDelta(event)}}  checked={this.state.enableManualDelta}   id="enableManualDelta-input" name= "enableManualDelta" className="form-control dataPropertyInput" placeholder=""/>
            </div>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-2">
              <Label><T>common.modals.dataCorrectionModal.deltaXLow</T></Label>
            </div>
            <div className="col-md-1">
              <input  onChange={(event) => {this.updateDeltaXLow(event)}} type="text" defaultValue={this.state.deltaXLow}   id="deltaXLow-input" name= "deltaXLow" className="form-control dataPropertyInput" placeholder=""/>
            </div>
            <div className="col-md-2">
              <Label><T>common.modals.dataCorrectionModal.deltaXLowRange</T></Label>
            </div>
            <div className="col-md-7"/>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-2">
              <Label><T>common.modals.dataCorrectionModal.deltaXHigh</T></Label>
            </div>
            <div className="col-md-1">
              <input  onChange={(event) => {this.updateDeltaXHigh(event)}} type="text" defaultValue={this.state.deltaXHigh}   id="deltaXHigh-input" name= "deltaXHigh" className="form-control dataPropertyInput" placeholder=""/>
            </div>
            <div className="col-md-2">
              <Label><T>common.modals.dataCorrectionModal.deltaXHighRange</T></Label>
            </div>
            <div className="col-md-7"/>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-2">
              <Label><T>common.modals.dataCorrectionModal.deltaYLow</T></Label>
            </div>
            <div className="col-md-1">
              <input  onChange={(event) => {this.updateDeltaYLow(event)}} type="text" defaultValue={this.state.deltaYLow}   id="deltaYLow-input" name= "deltaYLow" className="form-control dataPropertyInput" placeholder=""/>
            </div>
            <div className="col-md-2">
              <Label><T>common.modals.dataCorrectionModal.deltaYLowRange</T></Label>
            </div>
            <div className="col-md-7"/>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-2">
              <Label><T>common.modals.dataCorrectionModal.deltaYHigh</T></Label>
            </div>
            <div className="col-md-1">
              <input  onChange={(event) => {this.updateDeltaYHigh(event)}} type="text" defaultValue={this.state.deltaYHigh}   id="deltaYHigh-input" name= "deltaYHigh" className="form-control dataPropertyInput" placeholder=""/>
            </div>
            <div className="col-md-2">
              <Label><T>common.modals.dataCorrectionModal.deltaYHighRange</T></Label>
            </div>
            <div className="col-md-7"/>
          </div>
      </div>
    )
  }
}

export default DataCorrectionSubModal;
