import React, { Component } from 'react';
import {FormGroup,Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import { Meteor } from 'meteor/meteor';
import UserModel  from '../../../API/Models/ModelTemplates/Configuration/UserConfig/UserModel';
const T = i18n.createComponent();
import UserSettingsModal from '../Modals/Settings/UserSettings/UserSettingsModal';
import ExportManager from '../../../API/Modules/Export/ExportManager';
import ImportManager from '../../../API/Modules/Import/ImportManager';
import { Alert } from 'antd';
import HTMLUtilities from '../../../API/Modules/Utilities/HTMLUtilities';

class UserEditorExportImport extends Component {

  constructor(props) {
    super(props);
 

    this.state = {
      importJson:""
    };
  }


  componentWillReceiveProps(nextProps){

   
  }

  updateImportJson = (changeEvent)  => {
    this.setState({
      importJson:changeEvent.target.value,
    });
   
  }

  exportUsersJson()
  {
    let exportManager = new ExportManager();

    let base64 = exportManager.ExportUsersAsJSONBase64();

    const newBlob = HTMLUtilities.DataURItoBlob(base64);
    const url = window.URL.createObjectURL(newBlob);

    
    let link = document.createElement('a');
    link.href = url;
    link.download= "users.json";
    link.click();
    setTimeout(function(){
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(url);
    }, 100);
  }
 
  async importUsersJson()
  {
    let importJson = this.state.importJson;
    let importManager = new ImportManager();

    let response = await importManager.ImportUsersJson(importJson);
    if(response.message)
    {
      alert(response.message+"\n"+response.error);
    }
    this.props.reloadUsersCallback(); 
  }

  render() {
    return (
      <div>
         
        <div className="form-group row">
            <div className="col-md-12 headerCol">
              <Label><T>common.userExportImport.exportImportHeader</T></Label>
            </div>
        </div> 
        <div className="form-group row">
          <div className="col-md-11">
              <Input onChange={(event) => {this.updateImportJson(event)}} type="textarea" defaultValue={this.state.importJson}  rows="8" cols="45"  id="importJson-input" name= "importJson" className="form-control dataPropertyInput left" placeholder=""/>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-2">
              <Button onClick= {()  => this.exportUsersJson()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.userExportImport.exportUsers</T></Button>  
          </div>
          <div className="col-md-2">
              <Button onClick= {()  => this.importUsersJson()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.userExportImport.importUsers</T></Button>  
          </div>
        </div>
        
      </div>
    )
  }
}

export default UserEditorExportImport;
