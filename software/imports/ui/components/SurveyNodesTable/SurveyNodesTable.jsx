import React, { Component } from 'react';
import {Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import { Meteor } from 'meteor/meteor';
import { Table } from 'reactstrap';
const T = i18n.createComponent();

class SurveyNodesTable extends Component {

  constructor(props) {
    super(props);

      this.state = {
        surveyNodeDict:props.surveyNodeDict,
        selectedSurvey:props.selectedSurvey,
        selectedSurveyNode:{}
      };
  
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      surveyNodeDict:nextProps.surveyNodeDict
    }); 

    if(nextProps.selectedSurvey)
    {
      this.setState({
        selectedSurvey:nextProps.selectedSurvey
      }); 
    }
  }

  setSelectedSurveyNode(surveyNode){
    this.setState({
      selectedSurveyNode:surveyNode
    }); 
    this.props.setSelectedSurveyNodeCallback(surveyNode);
  }

  setSelectedSurvey(survey){
    this.setState({
      selectedSurvey:survey
    }); 
    this.props.setSelectedSurveyCallback(survey);
  }

  deleteSurveyNode(surveyNode){
    this.props.deleteSurveyNodeCallback(surveyNode);
  }
 
  moveSurveyNodeUp(surveyNode){
 
    let oldSurveyNodeDict = this.state.surveyNodeDict;

    let currentIndex = 0;
    let foundIndex = -1;
    let newIndex = 0;

    let surveyNodesArray = Array.from(oldSurveyNodeDict.values());

    surveyNodesArray.forEach(oldSurveyNode => {
       if(oldSurveyNode._id == surveyNode._id)
       {
        foundIndex = currentIndex;
        if(currentIndex>0)
        {
          newIndex = currentIndex-1;
        }
       
       }
       currentIndex++;
    });

    if(foundIndex>0)
    {
      surveyNodesArray.splice(newIndex, 0, surveyNode);
      surveyNodesArray.splice(foundIndex+1, 1);
    }
 
    let newSurveyNodeDict = new Map(
      surveyNodesArray.map(x => [x._id, x])
    );
 
    this.props.setSurveyNodeDictCallback(newSurveyNodeDict);
  }

  moveSurveyNodeDown(surveyNode){
       let oldSurveyNodeDict = this.state.surveyNodeDict;

    let currentIndex = 0;
    let foundIndex = -1;
    let newIndex = 0;

    let surveyNodesArray = Array.from(oldSurveyNodeDict.values());

    surveyNodesArray.forEach(oldSurveyNode => {
       if(oldSurveyNode._id == surveyNode._id)
       {
        foundIndex = currentIndex;
        if(currentIndex<surveyNodesArray.length)
        {
          newIndex = currentIndex+2;
        }
       
       }
       currentIndex++;
    });

    surveyNodesArray.splice(newIndex, 0, surveyNode);
    surveyNodesArray.splice(foundIndex, 1);

    /* if(newIndex <surveyNodesArray.length)
    {
      surveyNodesArray.splice(newIndex, 0, surveyNode);
      surveyNodesArray.splice(foundIndex-1, 1);
    }
    else
    {
      surveyNodesArray.splice(newIndex, 0, surveyNode);
      surveyNodesArray.push(surveyNode);
    } */
 
    let newSurveyNodeDict = new Map(
      surveyNodesArray.map(x => [x._id, x])
    );
 
    this.props.setSurveyNodeDictCallback(newSurveyNodeDict);
  }

  render() {
    return (
      <div>
          <Table hover>
            <thead>
              <tr>
                <th><T>common.modals.surveyEditor.surveyNodeTable.surveyNodeNumber</T></th>
                <th><T>common.modals.surveyEditor.surveyNodeTable.surveyNodeId</T></th>
                <th><T>common.modals.surveyEditor.surveyNodeTable.surveyNodeName</T></th>
                <th><T>common.modals.surveyEditor.surveyNodeTable.surveyNodeDescription</T></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                Array.from(this.state.surveyNodeDict.values()).map((surveyNode,itemC)=> (
                  <tr key={surveyNode._id} onClick={() => { this.setSelectedSurveyNode(surveyNode)}}  className={this.state.selectedSurveyNode._id === surveyNode._id ? "tableRowSelected" : ""}>
                    <td scope="row" onClick={() => { this.setSelectedSurveyNode(surveyNode)}}>{itemC+1}</td>
                    <td scope="row" onClick={() => { this.setSelectedSurveyNode(surveyNode)}} >{surveyNode._id}</td>
                    <td onClick={() => { this.setSelectedSurveyNode(surveyNode)}}>{surveyNode.name}</td>
                    <td onClick={() => { this.setSelectedSurveyNode(surveyNode)}}>{surveyNode.description}</td>
                    <td className="noPadding faContainer"> <Button onClick= {()  => this.moveSurveyNodeUp(surveyNode)} type="button" className="btn btn-outline-secondary noPadding noBorder faLgContainer inline"><i class="inline fa fa-arrow-up fa-lg mt-4 faLgContainer"></i></Button> </td>
                    <td className="noPadding faContainer"> <Button onClick= {()  => this.moveSurveyNodeDown(surveyNode)} type="button" className="btn btn-outline-secondary noPadding noBorder faLgContainer inline"><i class="inline fa fa-arrow-down fa-lg mt-4 faLgContainer"></i></Button> </td>
                    <td className="noPadding faContainer"><Button onClick= {()  => this.deleteSurveyNode(surveyNode)} type="button" className="btn btn-outline-secondary noPadding noBorder standardElement"><i class="inline fa fa-trash fa-lg mt-4 faLgContainer"></i></Button>  </td>
                  </tr>
                ))
              } 
            </tbody>
        </Table>
      </div>
    )
  }
}

export default SurveyNodesTable;
