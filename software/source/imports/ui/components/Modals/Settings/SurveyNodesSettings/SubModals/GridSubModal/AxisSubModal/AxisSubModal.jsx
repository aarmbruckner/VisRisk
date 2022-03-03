import React, { Component } from 'react';
import {Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import _uniqueId from 'lodash/uniqueId';
import LevelModel from '../../../../../../../../API/Models/ModelTemplates/LevelModel/LevelModel';
import BorderModel from '../../../../../../../../API/Models/ModelTemplates/BorderModel/BorderModel';

const T = i18n.createComponent();

class AxisSubModal extends Component {

  constructor(props) {
    super(props);

    let axisName = "";
    let levels = [];
    let borders = [];
    let activeBordersCount = 0;
    let bordersEnabled = false;

    let axisUniqueId = _.uniqueId('axis_'+ props.axisHeader+"_");

    if(props.axisModel)
    {
      axisName = props.axisModel.axisName;
      levels = props.axisModel.levels;
      borders = props.axisModel.borders;
      activeBordersCount = props.axisModel.activeBordersCount;
      bordersEnabled = props.axisModel.bordersEnabled;
    }

    this.state = {
      bordersEnabled:bordersEnabled,
      axisHeader: props.axisHeader,
      axisModel: props.axisModel,
      axisName : axisName,
      levels: levels,
      borders :borders,
      activeBordersCount:activeBordersCount,
      subLevelName:"",
      subLevelDescription:"",
      borderText:"",
      axisUniqueId:axisUniqueId,
      selectedLevel : null,
      selectedBorder:null
    };
  }

  componentWillReceiveProps(nextProps)
  {
    if(nextProps.axisHeader)
    {
      this.setState({
        axisHeader: nextProps.axisHeader
      });
    }

    if(nextProps.axisModel)
    {
        this.setState({
          axisModel: nextProps.axisModel
        });

        let axisName = "";
        let levels = [];
        let borders = [];
        let activeBordersCount = 0;
    
        axisName = nextProps.axisModel.axisName;
        levels = nextProps.axisModel.levels;
        borders = nextProps.axisModel.borders;
        activeBordersCount = nextProps.axisModel.activeBordersCount;

        this.setState({
          bordersEnabled:nextProps.axisModel.bordersEnabled,
          axisHeader: nextProps.axisHeader,
          axisModel: nextProps.axisModel,
          axisName : axisName,
          levels: levels,
          borders :borders,
          activeBordersCount:activeBordersCount,
          subLevelName:"",
          subLevelDescription:"",
          borderText:"",
          selectedLevel: null,
          selectedBorder:null
        });
    }
  }

  updateAxisName = (changeEvent)  => {
    let axisName =  changeEvent.target.value ;
    let axisModel = this.state.axisModel;
    axisModel.axisName = axisName;
    this.setState({
      axisName:axisName,
      axisModel:axisModel
    });
    this.props.updateAxisModelCallback(axisModel);
  }

  
  updateSubLevelName = (changeEvent)  => {
    let subLevelName =  changeEvent.target.value ;
 
    this.setState({
      subLevelName:subLevelName
    });
  }
  

  updateSubLevelDescription = (changeEvent)  => {
    let subLevelDescription =  changeEvent.target.value ;
 
    this.setState({
      subLevelDescription:subLevelDescription
    });

    let selectList = document.getElementById(this.state.axisUniqueId+"levelSelect");
    let selectOptions = selectList.getElementsByTagName('option');

    for (let i = 0; i < selectOptions.length; i++) {
      let opt = selectOptions[i];

      if (opt.selected) {
        let levels = this.state.levels;
        let currentLevel = levels[i];
        currentLevel.description = subLevelDescription;
        levels[i] =  currentLevel;
        let axisModel = this.state.axisModel;
        axisModel.levels = levels;
        this.setState({
          axisModel:axisModel,
          levels:levels
        });
        this.props.updateAxisModelCallback(axisModel);
      }
    }
    
  }
  

  updateBorderText = (changeEvent)  => {
    let borderText =  changeEvent.target.value ;
 
    this.setState({
      borderText:borderText
    });

    let selectList = document.getElementById(this.state.axisUniqueId+"borderSelect");
    let selectOptions = selectList.getElementsByTagName('option');
    
    for (let i = 0; i < selectOptions.length; i++) {

      let opt = selectOptions[i];

      if (opt.selected) {
        let borders = this.state.borders;
        let currentBorder = borders[i];
        currentBorder.description = borderText;
        currentBorder.value = parseFloat(borderText);
        borders[i] =  currentBorder;
        let axisModel = this.state.axisModel;
        axisModel.borders = borders;
        this.setState({
          axisModel:axisModel,
          borders:borders
        });
        this.props.updateAxisModelCallback(axisModel);
      }
    }
  }

  matchBordersToLevels(levels)
  {
    let borders = this.state.borders;
    
    if(borders.length == (levels.length-1))
      return borders;
    
    
    if(borders.length < (levels.length-1))
    {

      let addCount = (levels.length-1)-borders.length;
      for(let i=1; i <= addCount;i++)
      {
        borders.push(new BorderModel(0,i18n.getTranslation("common.modals.axisModal.defaultBorder"),borders.length+i));
      }
    }
    else
    {
      let removeCount = borders.length-(levels.length-1);
      for(let i=1; i <= removeCount;i++)
      {
        borders.pop();
      }
    }

    return borders;
  }
  
  addSubLevel = (changeEvent)  => {
    let subLevelName = this.state.subLevelName;

    if(!subLevelName)
      return;
 
    for(let subLevel of this.state.levels)
    {
      if(subLevel.name == subLevelName)
        return;
    }

    let description = this.state.subLevelDescription;
    if(!description || description.length == 0)
      description = " ";

    let newLevel = new LevelModel(subLevelName,description);
    let levels = this.state.levels;
    levels.push(newLevel);

    let axisModel = this.state.axisModel;
    let borders = this.matchBordersToLevels(levels);
    axisModel.levels = levels;
    axisModel.borders = borders;
    this.setState({
      axisModel:axisModel,
      levels:levels,
      borders:borders,
      subLevelName:"",
      subLevelDescription:""
    });
    this.props.updateAxisModelCallback(axisModel);
  }

  removeSubLevel = (changeEvent)  => {
    let selectedLevel = this.state.selectedLevel;

    if(selectedLevel)
    {
      let newLevels = [];
      let levels = this.state.levels;
      for(let subLevel of levels)
      {
        if(subLevel.name != selectedLevel.name)
          newLevels.push(subLevel);
      }

      let axisModel = this.state.axisModel;
      let borders = this.matchBordersToLevels(newLevels);
      axisModel.levels = newLevels;
      axisModel.borders = borders;
      this.setState({
        axisModel:axisModel,
        levels:newLevels,
        borders:borders
      });
      this.props.updateAxisModelCallback(axisModel);
    }
  }

  borderUp = (changeEvent)  => {
    let selectList = document.getElementById(this.state.axisUniqueId+"borderSelect");
    let selectOptions = selectList.getElementsByTagName('option');
    let borders = this.state.borders;

    for (let i = 0; i < selectOptions.length; i++) {
      let opt = selectOptions[i];

      if (opt.selected) {
        let currentBorder = borders.splice(i, 1)[0];
        borders.splice(i-1, 0, currentBorder);
      }
    }

    let axisModel = this.state.axisModel;
    axisModel.borders = borders;
    this.setState({
      axisModel:axisModel,
      borders:borders
    });
    this.props.updateAxisModelCallback(axisModel);
  }
  
  borderDown = (changeEvent)  => {
    let selectList = document.getElementById(this.state.axisUniqueId+"borderSelect");
    let selectOptions = selectList.getElementsByTagName('option');

    let borders = this.state.borders;

    for (let i = selectOptions.length - 2; i >= 0; i--) {
      let opt = selectOptions[i];
      if (opt.selected) {
        let currentBorder = borders.splice(i, 1)[0];
        borders.splice(i+1, 0, currentBorder);
      }
    }

    let axisModel = this.state.axisModel;
    axisModel.borders = borders;
    this.setState({
      axisModel:axisModel,
      borders:borders
    });
    this.props.updateAxisModelCallback(axisModel);
  }
  
  levelUp = (changeEvent)  => {
    let selectList = document.getElementById(this.state.axisUniqueId+"levelSelect");
    let selectOptions = selectList.getElementsByTagName('option');
    let levels = this.state.levels;

    for (let i = 0; i < selectOptions.length; i++) {
      let opt = selectOptions[i];

      if (opt.selected) {
        let currentBorder = levels.splice(i, 1)[0];
        levels.splice(i-1, 0, currentBorder);
      }
    }

    let axisModel = this.state.axisModel;
    axisModel.levels = levels;
    this.setState({
      axisModel:axisModel,
      levels:levels
    });
    this.props.updateAxisModelCallback(axisModel);
  }
  
  levelDown = (changeEvent)  => {
    let selectList = document.getElementById(this.state.axisUniqueId+"levelSelect");
    let selectOptions = selectList.getElementsByTagName('option');

    let levels = this.state.levels;

    for (let i = selectOptions.length - 2; i >= 0; i--) {
      let opt = selectOptions[i];
      if (opt.selected) {
        let currentBorder = levels.splice(i, 1)[0];
        levels.splice(i+1, 0, currentBorder);
      }
    }
 
    let axisModel = this.state.axisModel;
    axisModel.levels = levels;
    this.setState({
      axisModel:axisModel,
      levels:levels
    });
    this.props.updateAxisModelCallback(axisModel);
  }

  selectLevel = (changeEvent,obj) => {
    let levelName =  changeEvent.target.value ;

    let levels = this.state.levels;
    for(let subLevel of levels)
    {
      if(subLevel.name == levelName)
      {
        this.setState({
          selectedLevel:subLevel,
          subLevelDescription:subLevel.description
        });
        $("#"+this.state.axisUniqueId+"subLevelDescription-input").val(subLevel.description);
        return;
      }
    }

  }

  selectBorder = (changeEvent) => {
    let borderIndex = parseInt(changeEvent.target.value);
    let borders = this.state.borders;
 
    for(let border of borders)
    {
      if(border.index == borderIndex)
      {
        this.setState({
          selectedBorder:border,
          borderText:border.description
        });
        $("#"+this.state.axisUniqueId+"borderText-input").val(border.description);
        return;
      }
    }
  
  }

  toggleBordersEnabled = (changeEvent) => {

    let bordersEnabled = this.state.bordersEnabled;
    bordersEnabled = !bordersEnabled;

    let axisModel = this.state.axisModel;
    axisModel.bordersEnabled = bordersEnabled;
    this.setState({
      axisModel:axisModel,
      bordersEnabled:bordersEnabled
    });
    this.props.updateAxisModelCallback(axisModel);
  }

  toggleBorders = (changeEvent) => {

    let activeBordersCount = this.state.activeBordersCount;
    if(activeBordersCount == 0)
    {
      activeBordersCount = this.state.borders.length;
    }
    else
    {
      activeBordersCount = 0;
    }
    let axisModel = this.state.axisModel;
    axisModel.activeBordersCount = activeBordersCount;
    this.setState({
      axisModel:axisModel,
      activeBordersCount:activeBordersCount
    });
    this.props.updateAxisModelCallback(axisModel);
  }

  render() {
    return (
      <div>
          <div className="form-group row justify-content-center">
            <div className="axisHeader col-md-12"><strong>{this.state.axisHeader}</strong></div>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-12"></div>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-3">
              <Label><T>common.modals.axisModal.Name</T></Label>
            </div>
            <div className="col-md-6">
              <input onChange={(event) => {this.updateAxisName(event)}} type="text" defaultValue={this.state.axisName} id={this.state.axisUniqueId+"axisName-input"} name= "axisName" className="form-control dataPropertyInput" placeholder=""/>
            </div>
            <div className="col-md-3">
            </div>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-12"></div>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-3">
              <Label><T>common.modals.axisModal.AddSubLevel</T></Label>
            </div>
            <div className="col-md-6">
              <input onChange={(event) => {this.updateSubLevelName(event)}} type="text" defaultValue={this.state.subLevelName}  id={this.state.axisUniqueId+"subLevelName-input"}   name= "subLevelName" className="form-control dataPropertyInput" placeholder=""/>
            </div>
            <div className="col-md-1 ">
              <div className="form-group row">
                <Button  className="w-100" color="primary" onClick={(event) => {this.addSubLevel(event)}}><T>common.modals.axisModal.add</T></Button>
              </div>
            </div>
            <div className="col-md-2">
            </div>
            <div className="col-md-12">
            </div>
            <div className="col-md-3">
              <Label><T>common.modals.axisModal.Description</T></Label>
            </div>
            <div className="col-md-6">
              <input onChange={(event) => {this.updateSubLevelDescription(event)}} type="textarea" defaultValue={this.state.subLevelDescription}   id={this.state.axisUniqueId+"subLevelDescription-input"}  name= "subLevelDescription" className="form-control dataPropertyInput" placeholder=""/>
            </div>
            <div className="col-md-3">
            </div>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-3">
              <Label><T>common.modals.axisModal.SubLevels</T></Label>
            </div>
            <div className="col-md-6">
              <Input type="select" name="selectMulti"  id={this.state.axisUniqueId+"levelSelect"} multiple>
                {
                  this.state.levels.map(level=> (
                    <option  onClick={(event,obj) => {this.selectLevel(event,obj)}} value = {level.name} /* onClick={this.setSelectedSurveyNodeEvent} */ > {level.name}</option>
                  ))
                }
              </Input>
            </div>
            <div className="col-md-1">
              <div className="form-group row  justify-content-center">
                <Button className="w-100" color="primary" onClick={(event) => {this.levelUp(event)}}><T>common.modals.axisModal.up</T></Button>
              </div>
              <div className="form-group row  justify-content-center">
                <Button className="w-100" color="primary" onClick={(event) => {this.levelDown(event)}}><T>common.modals.axisModal.down</T></Button>
              </div>
            </div>
            <div className="col-md-2"></div>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-3">
            </div>
            <div className="col-md-5">
            </div>
            <div className="col-md-2">
              <div className="form-group row">
               <Button color="primary"  className="w-100" onClick={(event) => {this.removeSubLevel(event)}}><T>common.modals.axisModal.remove</T></Button>
              </div>
            </div>
            <div className="col-md-2"></div>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-3">
              <div className="form-group row">
                <Label><T>common.modals.axisModal.Borders</T></Label>
              </div>
              <div className="form-group row">
                <Label check>
                  <Input type="checkbox" checked={this.state.activeBordersCount >0 ? true : false } onClick={(event) => {this.toggleBorders(event)}} />{' '}
                  <T>common.modals.axisModal.enable</T>
                </Label>
              </div>
              <div className="form-group row">
                <Label><T>common.modals.axisModal.BordersEnabled</T></Label>
              </div>
              <div className="form-group row">
                <Label check>
                  <Input type="checkbox" checked={this.state.bordersEnabled >0 ? true : false } onClick={(event) => {this.toggleBordersEnabled(event)}} />{' '}
                  <T>common.modals.axisModal.enable</T>
                </Label>
              </div>
            </div>
            <div className="col-md-6">
              <Input type="select" name="selectMulti" id={this.state.axisUniqueId+"borderSelect"} multiple>
                {
                  this.state.borders.map(border=> (
                    <option  onClick={(event) => {this.selectBorder(event)}} value = {border.index} /* onClick={this.setSelectedSurveyNodeEvent} */ > {border.description}</option>
                  ))
                }
              </Input>
            </div>
            <div className="col-md-1">
              <div className="form-group row  justify-content-center">
                <Button className="w-100" color="primary" onClick={(event) => {this.borderUp(event)}}><T>common.modals.axisModal.up</T></Button>
              </div>
              <div className="form-group row  justify-content-center">
                <Button className="w-100" color="primary" onClick={(event) => {this.borderDown(event)}}><T>common.modals.axisModal.down</T></Button>
              </div>
            </div>
            <div className="col-md-2"></div>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-3">
              <Label><T>common.modals.axisModal.Text</T></Label>
            </div>
            <div className="col-md-6">
              <input onChange={(event) => {this.updateBorderText(event)}} type="text" defaultValue={this.state.borderText}  id={this.state.axisUniqueId+"borderText-input"}   name= "borderText" className="form-control dataPropertyInput" placeholder=""/>
            </div>
            <div className="col-md-3">
            </div>
          </div>
      </div>
    )
  }
}

export default AxisSubModal;
