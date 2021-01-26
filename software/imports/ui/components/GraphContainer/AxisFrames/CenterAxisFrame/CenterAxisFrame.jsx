import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import GraphEventHandler from  "../../../../../API/Modules/MxGraph/Eventhandling/GraphEventHandler";

const T = i18n.createComponent();

class CenterAxisFrame extends Component {

  constructor(props) {
    super(props);
    this.graphEventHandler = new GraphEventHandler();
 
    this.state = {
      graph:this.props.graph,
      selectedSurvey:this.props.selectedSurvey,
      selectedSurveyNode:this.props.selectedSurveyNode,
      xAxisGridLinesVisible :0,
      yAxisGridLinesVisible :0 ,
      currentVotes:0,
      logAccess:false,
      poolAccess:false,
      surveyEditorAccess:false,
      userEditorAccess:false
    };
 
    this.updateAccess();
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
      this.setState({ selectedSurveyNode: nextProps.selectedSurveyNode });
    }
    this.setState({ currentVotes: 0 });
  }

  xAxisGridLineAdd()
  {
    try{
      if(this.state.xAxisGridLinesVisible<this.state.selectedSurveyNode.gridConfigModel.xAxisModel.borders.length)
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
      if(this.state.yAxisGridLinesVisible<this.state.selectedSurveyNode.gridConfigModel.yAxisModel.borders.length)
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

  async saveVoteToLog()
  {
    let saveSuccess = await this.graphEventHandler.SaveGraphToLog(this.state.selectedSurvey,this.state.selectedSurveyNode,this.state.graph);

    let currentVotes = this.state.currentVotes;
    if(saveSuccess===true)
    { 
      currentVotes = currentVotes+1;
      this.setState({ currentVotes: currentVotes });
    }

    if(parseInt(this.state.selectedSurveyNode.numberOfVotes) > 0 && currentVotes >= parseInt(this.state.selectedSurveyNode.numberOfVotes))
    {

      let nextSurveyNode =  this.graphEventHandler.GetNextSurveyNode(this.state.selectedSurvey,this.state.selectedSurveyNode);
      this.graphEventHandler.ClearGraph(this.state.graph);

      if(nextSurveyNode._id == this.state.selectedSurveyNode._id)
      {
        alert(i18n.getTranslation("common.log.surveyFinished"));

        if(!this.state.surveyEditorAccess)
        {
          Meteor.logout(function(){ 
            i18n.setLocale(Meteor.settings.public.localisation.i18nLanguage);
            location.reload();
          });
        }

      }
      else
      {
        this.props.setSelectedSurveyNodeCallback(nextSurveyNode);
      }
    
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
              <div className="col-md-3 ">
                <a >{this.state.yAxisGridLinesVisible}/{this.state.selectedSurveyNode.gridConfigModel.yAxisModel.borders.length} </a>
              </div>
              <div className="col-md-3 centerFrameItemLeft">
                <button onClick= {()  => this.yAxisGridLineRemove()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.graphContainer.centerAxisFrame.minus</T></button>
              </div>
              <div className="col-md-3 centerFrameItemLeft">
                <button onClick= {()  => this.yAxisGridLineAdd()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.graphContainer.centerAxisFrame.plus</T></button>
              </div>
              <div className="col-md-3 centerFrameItemLeft">
                <button onClick= {()  => this.axisGridLineReset(this.state.graph)} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.graphContainer.centerAxisFrame.reset</T></button>
              </div>
            </div>

            <div className="form-group row justify-content-center">
              <div className="col-md-3 ">
                <button  onClick= {()  => this.graphEventHandler.ClearGraph(this.state.graph)} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.graphContainer.centerAxisFrame.clear</T></button>
              </div>
              <div className="col-md-6 centerFrameItemLeft">

               
                {this.state.surveyEditorAccess === true ? (
                   <button  onClick= {()  => this.graphEventHandler.ClearLogOfSurveyNode(this.state.selectedSurvey,this.state.selectedSurveyNode)} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.graphContainer.centerAxisFrame.clearLog</T></button>
                    ) : (
                      ""
                  )}
              
              </div>
              <div className="col-md-3 centerFrameItemLeft">
                <button onClick= {()  => this.xAxisGridLineAdd()} type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.graphContainer.centerAxisFrame.plus</T></button>
              </div>
            </div>

            <div className="form-group row justify-content-center">
              <div className="col-md-3  ">
                  <button  onClick= {()  => this.saveVoteToLog()}  type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.graphContainer.centerAxisFrame.save</T></button>
                </div>
                <div className="col-md-6 centerFrameItemLeft">
                  <a ></a>
                </div>
                <div className="col-md-3 centerFrameItemLeft">
                  <button  onClick= {()  => this.xAxisGridLineRemove()}  type="button" className="btn btn-outline-secondary w-100 standardElement"><T>common.graphContainer.centerAxisFrame.minus</T></button>
              </div>
            </div>

            <div className="form-group row justify-content-center">
              <div className="col-md-9 ">
              </div>
              <div className="col-md-3 centerFrameItemLeft">
                <a >{this.state.xAxisGridLinesVisible}/{this.state.selectedSurveyNode.gridConfigModel.xAxisModel.borders.length} </a>
              </div>
            </div>
        </div>
    )
  }
}
export default CenterAxisFrame;
 