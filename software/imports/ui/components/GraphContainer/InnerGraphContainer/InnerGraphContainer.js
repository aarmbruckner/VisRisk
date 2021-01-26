import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Dropdown, DropdownMenu, DropdownItem, Progress } from 'reactstrap';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import MxGraphContainer from '../../mxGraph/MxGraphContainer';

class InnerGraphContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      graph:this.props.graph,
      model:this.props.model
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
    this.setState({ model:  model });
  }
 
  render() {
    return (
      <div className="fillHeight">
        <MxGraphContainer /*  graph = {this.state.graph} */ model = {this.state.model} setGraphCallback={this.props.setGraphCallback}/>
      </div>
    )
  }
}
export default InnerGraphContainer;