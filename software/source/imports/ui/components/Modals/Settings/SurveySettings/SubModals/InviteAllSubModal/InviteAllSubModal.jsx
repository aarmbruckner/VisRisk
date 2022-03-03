import React, { Component } from 'react';
import {Input,Label,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
 

const T = i18n.createComponent();

class InviteAllSubModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
        modalOpen: props.modalOpen,
        customTextParticipant:"",
        surveyParamsParticipant: ""
    }
  }
 
  componentWillReceiveProps(nextProps)
  {
    this.setState({
        modalOpen: nextProps.modalOpen 
      /*   customTextParticipant: nextProps.customTextParticipant,
        surveyParamsParticipant: nextProps.surveyParamsParticipant */
    })
  }

  toggleModal() {
    this.setState({
        modalOpen: !this.state.modalOpen
    });
  }

  cancelModal() {
    this.setState({
        modalOpen: false
    });
    this.props.cancelModalCallback();
  }

  submitModal() {
    this.props.submitModalCallback(this.state.customTextParticipant,this.state.surveyParamsParticipant);
  }
  
  updateCustomTextParticipant(changeEvent) {
    let customTextParticipant = changeEvent.target.value;
    this.setState({
      customTextParticipant: customTextParticipant
    }); 
  }

  updateSurveyParamsParticipant(changeEvent) {
    let surveyParamsParticipant = changeEvent.target.value;
    this.setState({
      surveyParamsParticipant: surveyParamsParticipant
    }); 
  }

  render() {
    return (

      <Modal className={"modal-xl"} size={"lg"} isOpen={this.state.modalOpen} toggle={this.state.modalOpen}>
      <ModalHeader toggle={this.state.modalOpen}><T>common.modals.surveyInvite.header</T></ModalHeader>
      <ModalBody>
        <div className="justify-content-center">
          <div className="col-md-6">
              <div className="form-group row">
                <Label><T>common.modals.surveyModal.surveyParams</T></Label>
              </div>
              <div className="form-group row">
                <Input  onChange={(event) => {this.updateSurveyParamsParticipant(event)}} type="text" defaultValue={this.state.surveyParamsParticipant}   id="surveyParamsParticipant-input" name= "surveyParamsParticipant" className="form-control dataPropertyInput" placeholder=""/>
              </div>

              <div className="form-group row">
                <Label><T>common.modals.surveyModal.customText</T></Label>
              </div>
              <div className="form-group row">
                <Input type="textarea" rows="3" onChange={(event) => {this.updateCustomTextParticipant(event)}}  defaultValue={this.state.customTextParticipant}   id="customTextParticipant-input" name= "customTextParticipant" className="form-control dataPropertyInput" placeholder=""/>
              </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick= {()  => this.submitModal()}><T>common.commonUI.OK</T></Button>
        <Button color="primary" onClick= {()  => this.cancelModal()}><T>common.commonUI.Cancel</T></Button>
      </ModalFooter>
    </Modal>
    )
  }
}

export default InviteAllSubModal;
