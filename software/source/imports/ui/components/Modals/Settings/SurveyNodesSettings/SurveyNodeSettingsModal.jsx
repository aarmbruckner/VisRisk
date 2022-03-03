import React, { Component } from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col,Button, Modal, ModalHeader, ModalBody, ModalFooter,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import classnames from 'classnames';
//import CalculationsSubModal from './SubModals/CalculationsSubModal/CalculationsSubModal';
import GridSubModal from './SubModals/GridSubModal/GridSubModal';
import CalcConfigController from '../../../../../API/Modules/Configuration/CalcConfigController';
import GridConfigController from '../../../../../API/Modules/Configuration/GridConfigController';
import CalculationsSubModal from './SubModals/CalculationsSubModal';

 

const T = i18n.createComponent();

class SurveyNodeSettingsModal extends Component {

  constructor(props) {
    super(props);

    this.toggleTab = this.toggleTab.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.calcConfigController = new CalcConfigController();
    this.gridConfigController = new GridConfigController();


    let calcConfigModel = this.calcConfigController.GetDefaultConfig();
    let gridConfigModel = this.gridConfigController.GetDefaultConfig();

    if(props.selectedSurveyNode)
    {
      if(props.selectedSurveyNode.calcConfigModel)
      {
        calcConfigModel = props.selectedSurveyNode.calcConfigModel;
      }

      if(props.selectedSurveyNode.gridConfigModel)
      {
        gridConfigModel = props.selectedSurveyNode.gridConfigModel;
      }
    }

    this.state = {
      calcConfigModel:calcConfigModel,
      gridConfigModel:gridConfigModel,
      modalOpen: props.modalOpen,
      selectedSurveyNode:props.selectedSurveyNode,
      activeTab :"grid"
    };
 
  }
 
  componentWillReceiveProps(nextProps)
  {
    let calcConfigModel = this.calcConfigController.GetDefaultConfig();
    let gridConfigModel = this.gridConfigController.GetDefaultConfig();

    if(nextProps.selectedSurveyNode)
    {
      if(nextProps.selectedSurveyNode.calcConfigModel)
      {
        calcConfigModel = nextProps.selectedSurveyNode.calcConfigModel;
      }

      if(nextProps.selectedSurveyNode.gridConfigModel)
      {
        gridConfigModel = nextProps.selectedSurveyNode.gridConfigModel;
      }
    }
     
    
    this.setState({
      calcConfigModel:calcConfigModel,
      gridConfigModel:gridConfigModel,
      modalOpen: nextProps.modalOpen,
      selectedSurveyNode:nextProps.selectedSurveyNode
    });
  }

  toggleModal() {
    this.setState({
        modalOpen: !this.state.modalOpen
    });
  }

  toggleTab(tabId) {
    this.setState({
      activeTab: tabId
    });
  }
 
  cancelModal() {
      this.setState({
        modalOpen: false
    });
    let selectedSurveyNode = this.state.selectedSurveyNode;
    this.props.cancelModalCallback(selectedSurveyNode);
  }

  submitModal() {
 
    let selectedSurveyNode = this.state.selectedSurveyNode;
    selectedSurveyNode.SetCalcConfigModel(this.state.calcConfigModel);
    selectedSurveyNode.SetGridConfigModel(this.state.gridConfigModel);
    this.setState({
        modalOpen: false
    });
    this.props.submitModalCallback(selectedSurveyNode);
  }

  
  calcConfigModelChangedCallback = (calcConfigModel) => {
    this.setState({
      calcConfigModel: calcConfigModel
    }); 
  }

  gridConfigModelChangedCallback = (gridConfigModel) => {
    this.setState({
      gridConfigModel: gridConfigModel
    }); 
  }

  render() {
    return (
      <Modal className={"modal-xl"} size={"lg"} isOpen={this.state.modalOpen} toggle={this.state.modalOpen}>
        <ModalHeader toggle={this.state.modalOpen}><T>common.modals.settings.header</T></ModalHeader>
        <ModalBody>
          <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab  === "grid" })}
              onClick={() => { this.toggleTab("grid"); }}
            >
            <T>common.modals.settings.GridHeader</T>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "calculations" })}
              onClick={() => { this.toggleTab("calculations"); }}
            >
            <T>common.modals.settings.CalculationsHeader</T>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="grid">
            <GridSubModal gridConfigModelChangedCallback={this.gridConfigModelChangedCallback} gridConfigModel = {this.state.gridConfigModel}/>
          </TabPane>
          <TabPane tabId="calculations">
            <CalculationsSubModal calcConfigModelChangedCallback={this.calcConfigModelChangedCallback} calcConfigModel = {this.state.calcConfigModel}/>
          </TabPane>
        </TabContent>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick= {()  => this.submitModal()}><T>common.commonUI.OK</T></Button>
          <Button color="primary" onClick= {()  => this.cancelModal()}><T>common.commonUI.Cancel</T></Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default SurveyNodeSettingsModal;
