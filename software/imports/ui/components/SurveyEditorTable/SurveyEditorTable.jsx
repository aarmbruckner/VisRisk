import React, { Component } from 'react';
import {Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import { Meteor } from 'meteor/meteor';
import { Table } from 'reactstrap';
const T = i18n.createComponent();

class SurveyEditorTable extends Component {

  constructor(props) {
    super(props);

      this.state = {
        surveyDict:props.surveyDict,
        selectedSurvey:props.selectedSurvey,
      };
  
  }

  componentWillReceiveProps(nextProps){

    this.setState({
      surveyDict:nextProps.surveyDict
    }); 

    if(nextProps.selectedSurvey)
    {
      this.setState({
        selectedSurvey:nextProps.selectedSurvey
      }); 
    }
  }
 
  setSelectedSurvey(survey){
    this.setState({
      selectedSurvey:survey
    }); 
    this.props.setSelectedSurveyCallback(survey);
  }

  
  deleteSurvey(survey){
 
    this.props.deleteSurveyCallback(survey);
  }

  render() {
    return (
      <div>
          <Table hover>
            <thead>
              <tr>
                <th><T>common.modals.surveyEditor.surveyTable.surveyNumber</T></th>
                <th><T>common.modals.surveyEditor.surveyTable.surveyId</T></th>
                <th><T>common.modals.surveyEditor.surveyTable.surveyName</T></th>
                <th><T>common.modals.surveyEditor.surveyTable.surveyDescription</T></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                Array.from(this.state.surveyDict.values()).map((survey,itemC)=> (
                  <tr key={survey._id}  className={this.state.selectedSurvey._id === survey._id ? "tableRowSelected" : ""}>
                    <td onClick={() => { this.setSelectedSurvey(survey)}}>{itemC+1}</td>
                    <td onClick={() => { this.setSelectedSurvey(survey)}}>{survey._id}</td>
                    <td onClick={() => { this.setSelectedSurvey(survey)}}>{survey.name}</td>
                    <td onClick={() => { this.setSelectedSurvey(survey)}}>{survey.description}</td>
                    <td className="noPadding faContainer"><Button onClick= {()  => this.deleteSurvey(survey)} type="button" className="btn btn-outline-secondary noBorder standardElement"><i class="inline fa fa-trash fa-lg mt-4 faLgContainer"></i></Button>  </td>
                  </tr>
                ))
              }
            </tbody>
        </Table>
      </div>
    )
  }
}

export default SurveyEditorTable;
