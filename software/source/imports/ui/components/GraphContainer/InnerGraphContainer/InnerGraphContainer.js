import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import MxGraphContainer from '../../mxGraph/MxGraphContainer';
import i18n from 'meteor/universe:i18n';

class InnerGraphContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      graph:this.props.graph,
      model:this.props.model,
      selectedSurveyNode:this.props.selectedSurveyNode
    };
  }

  componentDidMount() {

  } 

  componentWillReceiveProps(nextProps){
    //this.setState({ graph:  nextProps.graph });
    let model = nextProps.model;
    if(!model || !Array.isArray(model))
    {
      model = [];
    }
    this.setState({
      model:model,
      selectedSurveyNode:nextProps.selectedSurveyNode
    });
  }
 
  render() {
    return (
      <div className="fillHeight">
        {this.state.selectedSurveyNode ? (
                <MxGraphContainer selectedSurveyNode ={this.state.selectedSurveyNode} model = {this.state.model} setGraphCallback={this.props.setGraphCallback} editable={this.props.editable}/>
          ) : (
            <div className="noSurveyDataAvailableCont">
                <span className="noSurveyDataAvailable">{i18n.getTranslation("common.modals.surveyEditor.noDataAvailable")}</span>
            </div>
        )}
      </div>
    )
  }
}
export default InnerGraphContainer;