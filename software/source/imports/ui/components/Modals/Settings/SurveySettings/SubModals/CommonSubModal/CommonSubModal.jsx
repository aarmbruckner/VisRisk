import React, { Component } from 'react';
import {Label,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

class CommonSubModal extends Component {

  constructor(props) {
    super(props);
 
    let exitURLUniqueId = _.uniqueId('exitURL');

    let exitURL = null;
    if(props.selectedSurvey && props.selectedSurvey.exitURL)
    {
      exitURL = props.selectedSurvey.exitURL;
    }

    this.state = {
        selectedSurvey: props.selectedSurvey,
        exitURL: exitURL,
        exitURLUniqueId:exitURLUniqueId
    }
  }
 
  componentWillReceiveProps(nextProps)
  {
    let exitURL = null;
    if(nextProps.selectedSurvey && nextProps.selectedSurvey.exitURL)
    {
      exitURL = nextProps.selectedSurvey.exitURL;
    }
    this.setState({
        selectedSurvey: nextProps.selectedSurvey,
        exitURL: exitURL
    })
 
  }
  
  updateExitURL (changeEvent)
  {
    let selectedSurvey = this.state.selectedSurvey;
    if(selectedSurvey)
      selectedSurvey.exitURL = changeEvent.target.value;
    this.props.updateSelectedSurveyCallback(selectedSurvey);
  }

  render() {
    return (
      <div className="justify-content-center">
        <div className="col-md-6">
            <div className="form-group row">
            <Label><T>common.modals.commonModal.exitURL</T></Label>
            </div>
            <div className="form-group row">
            <input onChange={(event) => {this.updateExitURL(event)}} type="text" defaultValue={this.state.exitURL}  id={this.state.exitURLUniqueId+"-input"}   name= "exitURLText" className="form-control dataPropertyInput" placeholder=""/>
            </div>
        </div>
      </div>
    )
  }
}

export default CommonSubModal;
