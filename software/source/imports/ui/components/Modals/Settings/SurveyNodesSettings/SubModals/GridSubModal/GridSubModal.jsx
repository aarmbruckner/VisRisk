import React, { Component } from 'react';
import {Label,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';

import AxisSubModal from './AxisSubModal';
const T = i18n.createComponent();

class GridSubModal extends Component {

  constructor(props) {
    super(props);
 
    let colorStops = props.gridConfigModel.colorStops;
    
    let colorStop1 = Meteor.settings.public.defaultGraphConfigurations.gridConfig.colorStops[0];
    let colorStop2 = Meteor.settings.public.defaultGraphConfigurations.gridConfig.colorStops[1];
    let riskRectangleColor = Meteor.settings.public.defaultGraphConfigurations.gridConfig.riskRectangleColor;
    
    if(colorStops && colorStops.length > 1)
    {
      colorStop1 = props.gridConfigModel.colorStops[0];
      colorStop2 = props.gridConfigModel.colorStops[1];
    }

    if(props.gridConfigModel.riskRectangleColor)
    {
      riskRectangleColor = props.gridConfigModel.riskRectangleColor;
    }
 
    let colorStop1UniqueId = _.uniqueId('colorStop1_');
    let colorStop2UniqueId = _.uniqueId('colorStop2_');
    let riskRectangleColorUniqueId = _.uniqueId('riskRectangleColor_');
 

    this.state = {
      gridConfigModel: props.gridConfigModel,
      xAxisModel:props.gridConfigModel.xAxisModel,
      yAxisModel:props.gridConfigModel.yAxisModel,
      colorStop1UniqueId:colorStop1UniqueId,
      colorStop2UniqueId:colorStop2UniqueId,
      riskRectangleColor:riskRectangleColor,
      riskRectangleColorUniqueId:riskRectangleColorUniqueId,
      colorStop1:colorStop1,
      colorStop2:colorStop2
    }
  }
 
  componentWillReceiveProps(nextProps)
  {
    this.setState({
      gridConfigModel: nextProps.gridConfigModel,
      xAxisModel:nextProps.gridConfigModel.xAxisModel,
      yAxisModel:nextProps.gridConfigModel.yAxisModel
    });

    if(nextProps.gridConfigModel && nextProps.gridConfigModel.riskRectangleColor)
    {
      this.setState({
        riskRectangleColor:  nextProps.gridConfigModel.riskRectangleColor
      });
    }

    let colorStops = nextProps.gridConfigModel.colorStops;
    if(colorStops && colorStops.length > 1)
    {
      let colorStop1 = colorStops[0];
      let colorStop2 = colorStops[1];

      this.setState({
        colorStop1:colorStop1,
        colorStop2:colorStop2
      });
    }
 
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

  updateColorStop1 = (changeEvent)  => {
    let gridConfigModel = this.state.gridConfigModel;

    let colorStops = gridConfigModel.colorStops;

    if(colorStops && colorStops.length > 1)
    {
      colorStops[0] = changeEvent.target.value;
    }
    else
    {
      colorStops=[];
      colorStops.push(changeEvent.target.value);
      colorStops.push(this.state.colorStop2);
    }

    gridConfigModel.colorStops = colorStops;
    this.setState({
      colorStop1:changeEvent.target.value
    });
    this.props.gridConfigModelChangedCallback(gridConfigModel);
  }

  updateColorStop2 = (changeEvent)  => {
    let gridConfigModel = this.state.gridConfigModel;

    let colorStops = gridConfigModel.colorStops;
    if(colorStops && colorStops.length > 1)
    {
      colorStops[1] = changeEvent.target.value;
    }
    else
    {
      colorStops=[];
      colorStops.push(this.state.colorStop1);
      colorStops.push(changeEvent.target.value);
    }

    gridConfigModel.colorStops = colorStops;
    this.setState({
      colorStop2:changeEvent.target.value
    });
    this.props.gridConfigModelChangedCallback(gridConfigModel);
  }

  updateRiskRectangleColor = (changeEvent)  => {
    let gridConfigModel = this.state.gridConfigModel;

    gridConfigModel.riskRectangleColor = changeEvent.target.value;
    this.setState({
      riskRectangleColor:changeEvent.target.value
    });
    this.props.gridConfigModelChangedCallback(gridConfigModel);
  }


  render() {
    return (
      <div>
         <div className="form-group row justify-content-center">
          <div className="col-md-6">
            <div className="form-group row justify-content-center">
              <div className="col-md-3">
                <Label><T>common.modals.gridModal.colorStops</T></Label>
              </div>
              <div className="col-md-6">
              </div>
              <div className="col-md-3">
              </div>
            </div>

            <div className="form-group row justify-content-center">
              <div className="col-md-3">
                <Label><T>common.modals.gridModal.colorStop1</T></Label>
              </div>
              <div className="col-md-6">
                <input onChange={(event) => {this.updateColorStop1(event)}} type="text" defaultValue={this.state.colorStop1} id={this.state.colorStop1UniqueId+"colorStop1-input"} name= "colorStop1" className="form-control dataPropertyInput" placeholder=""/>
              </div>
              <div className="col-md-3">
              </div>
            </div>

            <div className="form-group row justify-content-center">
              <div className="col-md-3">
                <Label><T>common.modals.gridModal.colorStop2</T></Label>
              </div>
              <div className="col-md-6">
                <input onChange={(event) => {this.updateColorStop2(event)}} type="text" defaultValue={this.state.colorStop2} id={this.state.colorStop2UniqueId+"colorStop2-input"} name= "colorStop2" className="form-control dataPropertyInput" placeholder=""/>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group row justify-content-center">
              <div className="col-md-3">
                <Label><T>common.modals.gridModal.rectangleOptions</T></Label>
              </div>
              <div className="col-md-6">
              </div>
              <div className="col-md-3">
              </div>
            </div>

            <div className="form-group row justify-content-center">
              <div className="col-md-3">
                <Label><T>common.modals.gridModal.riskRectangleColor</T></Label>
              </div>
              <div className="col-md-6">
                <input onChange={(event) => {this.updateRiskRectangleColor(event)}} type="text" defaultValue={this.state.riskRectangleColor} id={this.state.riskRectangleColorUniqueId+"riskRectangleColor-input"} name= "riskRectangleColor" className="form-control dataPropertyInput" placeholder=""/>
              </div>
              <div className="col-md-3">
              </div>
            </div>

          </div>
        </div>

        <div className="form-group row justify-content-center">
          <div className="col-md-6">
            <AxisSubModal axisModel = {this.state.xAxisModel} updateAxisModelCallback =  {(xAxisModel)  => this.updateXAxisModelCallback(xAxisModel)}  axisHeader={i18n.getTranslation("common.modals.gridModal.xAxisHeader")} />
          </div>
          <div className="col-md-6">
            <AxisSubModal axisModel = {this.state.yAxisModel} updateAxisModelCallback =  {(yAxisModel)  => this.updateYAxisModelCallback(yAxisModel)} axisHeader={i18n.getTranslation("common.modals.gridModal.yAxisHeader")} />
          </div>
        </div>
      </div>
    )
  }
}

export default GridSubModal;
