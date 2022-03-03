import React, { Component } from 'react';
import { Label,TabContent, TabPane, Nav, NavItem, NavLink, Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import GraphEventHandler from  "../../../../../API/Modules/MxGraph/Eventhandling/GraphEventHandler";

const T = i18n.createComponent();

class CenterAxisFrame extends Component {

  constructor(props) {
    super(props);
    this.graphEventHandler = new GraphEventHandler();
 
    let selectedSurveyNode = this.props.selectedSurveyNode;

    let maxXAxisGridLinesVisible = 1;
    let maxYAxisGridLinesVisible = 1;
    if(selectedSurveyNode)
    {
      if(selectedSurveyNode.gridConfigModel)
      {
        maxXAxisGridLinesVisible = selectedSurveyNode.gridConfigModel.xAxisModel.borders.length;
        maxYAxisGridLinesVisible = selectedSurveyNode.gridConfigModel.yAxisModel.borders.length;
      }
 
    }

    this.state = {
      graph:this.props.graph,
      selectedSurvey:this.props.selectedSurvey,
      selectedSurveyNode:this.props.selectedSurveyNode,
      xAxisGridLinesVisible :0,
      yAxisGridLinesVisible :0 ,
      maxXAxisGridLinesVisible :maxXAxisGridLinesVisible,
      maxYAxisGridLinesVisible :maxYAxisGridLinesVisible ,
      logAccess:false,
      poolAccess:false,
      surveyEditorAccess:false,
      userEditorAccess:false
    };
 
    this.updateAccess();
  }

  componentDidMount() {

    this.setBorderButtons();

  }

  setBorderButtons(selectedSurveyNode)
  {
    if(!selectedSurveyNode)
      selectedSurveyNode = this.state.selectedSurveyNode;

    if(selectedSurveyNode && selectedSurveyNode.gridConfigModel)
    {
      if(selectedSurveyNode.gridConfigModel.xAxisModel)
      {
        if(selectedSurveyNode.gridConfigModel.xAxisModel.bordersEnabled != true)
        {
          $('#xAxisGridLineRemoveBtn').prop('disabled',true).css('opacity',0.5);
          $('#xAxisGridLineAddBtn').prop('disabled',true).css('opacity',0.5);
        }
      }
      if(selectedSurveyNode.gridConfigModel.yAxisModel)
      {
         if(selectedSurveyNode.gridConfigModel.yAxisModel.bordersEnabled != true)
        {
          $('#yAxisGridLineRemoveBtn').prop('disabled',true).css('opacity',0.5);
          $('#yAxisGridLineAddBtn').prop('disabled',true).css('opacity',0.5);
        }
      }
 
    }
  }

  componentWillUnmount () {
    this.axisGridLineReset(this.state.graph);
  } 
  
  updateAccess()
  {
    let userId = Session.get('userId');
 
    {Meteor.call('AccountController.Methods.GetUserRoles',{user:userId}, (error, userRoles) => {

      if(userRoles && userRoles.includes("admin"))
      {
        this.setState({
          logAccess: true,
          poolAccess: true,
          surveyEditorAccess: true,
          userEditorAccess: true
        });
      }
  
    })};
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.graph)
    {
      this.setState({ graph: nextProps.graph });
    }
    if(nextProps.selectedSurvey)
    {
      this.setState({ selectedSurvey: nextProps.selectedSurvey });
    }
    if(nextProps.selectedSurveyNode)
    {
      let maxXAxisGridLinesVisible = null;
      let maxYAxisGridLinesVisible = null;
      if(nextProps.selectedSurveyNode.gridConfigModel)
      {
        maxXAxisGridLinesVisible = nextProps.selectedSurveyNode.gridConfigModel.xAxisModel.borders.length;
        maxYAxisGridLinesVisible = nextProps.selectedSurveyNode.gridConfigModel.yAxisModel.borders.length;
      }
    
      this.setState({ 
        selectedSurveyNode: nextProps.selectedSurveyNode,
        maxXAxisGridLinesVisible:maxXAxisGridLinesVisible,
        maxYAxisGridLinesVisible:maxYAxisGridLinesVisible
      });


      this.setBorderButtons( nextProps.selectedSurveyNode);
    }

  }

  xAxisGridLineAdd()
  {
    try{
      if(this.state.xAxisGridLinesVisible<this.state.maxXAxisGridLinesVisible)
      {
        this.graphEventHandler.xAxisGridLineAdd(this.state.xAxisGridLinesVisible,this.state.selectedSurveyNode.gridConfigModel.xAxisModel.borders);
        this.setState({ xAxisGridLinesVisible: this.state.xAxisGridLinesVisible +1 });
      }
    }
    catch(exception)
    {
      alert(i18n.getTranslation("common.graphContainer.events.failure")+" \n "+exception.message); 
    }
  }

  yAxisGridLineAdd()
  {
    try{
      if(this.state.yAxisGridLinesVisible<this.state.maxYAxisGridLinesVisible)
      {
        this.graphEventHandler.yAxisGridLineAdd(this.state.yAxisGridLinesVisible);
        this.setState({ yAxisGridLinesVisible: this.state.yAxisGridLinesVisible +1 });
      }
    }
    catch(exception)
    {
      alert(i18n.getTranslation("common.graphContainer.events.failure")+" \n "+exception.message); 
    }
  }

  xAxisGridLineRemove()
  {
    try{
      if(this.state.xAxisGridLinesVisible>0)
      {
        this.graphEventHandler.xAxisGridLineRemove(this.state.xAxisGridLinesVisible);
        this.setState({ xAxisGridLinesVisible: this.state.xAxisGridLinesVisible -1 });
      }
    }
    catch(exception)
    {
      alert(i18n.getTranslation("common.graphContainer.events.failure")+" \n "+exception.message); 
    }
  }

  yAxisGridLineRemove()
  {
    try{
      if(this.state.yAxisGridLinesVisible>0)
      {
        this.graphEventHandler.yAxisGridLineRemove(this.state.yAxisGridLinesVisible);
        this.setState({ yAxisGridLinesVisible: this.state.yAxisGridLinesVisible -1 });
      }
    }
    catch(exception)
    {
      alert(i18n.getTranslation("common.graphContainer.events.failure")+" \n "+exception.message); 
    }
  }

  axisGridLineReset()
  {
    try{
      this.graphEventHandler.axisGridLineReset();
      this.setState({ 
        xAxisGridLinesVisible: 0,
        yAxisGridLinesVisible: 0
      });
    }
    catch(exception)
    {
      alert(i18n.getTranslation("common.graphContainer.events.failure")+" \n "+exception.message); 
    }
  }
 
  render() {
    return (
        <div className="container-fluid seamless" style={{overflow: 'hidden' }} >
            <div className="form-group row justify-content-center">

              <div className="col-md-5  axisDesc">
                <Label><T>common.diagramControls.yAxis</T></Label>
              </div>
              <div className="col-md-3 centerFrameItemLeft">
                <button id="yAxisGridLineRemoveBtn" onClick= {()  => this.yAxisGridLineRemove()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.graphContainer.centerAxisFrame.minus</T></button>
              </div>
              <div className="col-md-3 centerFrameItemLeft">
                <button id="yAxisGridLineAddBtn" onClick= {()  => this.yAxisGridLineAdd()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.graphContainer.centerAxisFrame.plus</T></button>
              </div>
            </div>

            <div className="form-group row justify-content-center">

              <div className="col-md-5 axisDesc">
                <Label><T>common.diagramControls.xAxis</T></Label>
              </div>
              <div className="col-md-3  centerFrameItemLeft">
                <button id="xAxisGridLineRemoveBtn" onClick= {()  => this.xAxisGridLineRemove()}  type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.graphContainer.centerAxisFrame.minus</T></button>
              </div>
              <div className="col-md-3 centerFrameItemLeft">
                <button id="xAxisGridLineAddBtn" onClick= {()  => this.xAxisGridLineAdd()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.graphContainer.centerAxisFrame.plus</T></button>
              </div>
            </div>
 
 
        </div>
    )
  }
}
export default CenterAxisFrame;
 