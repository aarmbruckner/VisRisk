import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {Label,Input,Button, Modal, ModalHeader, ModalBody, ModalFooter,Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
 
const T = i18n.createComponent();

class MxGraphMessageSummary extends Component {

  constructor(props) {
    super(props);

    let logText = this.calculateModArrayLogText(props.modelArray);
    this.state = {
        logText : logText,
        modelArray:props.modelArray,
        graph:props.graph
    };
     
  }

  calculateModArrayLogText(modelArray)
  {
    let logText = "";
    if(!modelArray)
        return logText;

    let sortNumber = 1;
    modelArray.forEach(model  => {
        //let sortNumber = model.value.sortNumber;
        
        let formImpStartPerc = 0;
        let formImpEndPerc = 0;
        let formLikeHStartPerc = 0;
        let formLikeHEndPerc = 0;
    
/*         formImpStartPerc = (model.GetImpactStartPercentage()*100).toFixed(5);
        formImpEndPerc = (model.GetImpactEndPercentage()*100).toFixed(5);
        formLikeHStartPerc = (model.GetLikeliHoodStartPercentage()*100).toFixed(5);
        formLikeHEndPerc = (model.GetLikeliHoodEndPercentage()*100).toFixed(5); */
        
        formImpStartPerc = (model.impactStartPercentage*100).toFixed(5);
        formImpEndPerc = (model.impactEndPercentage*100).toFixed(5);
        formLikeHStartPerc = (model.likeliHoodStartPercentage*100).toFixed(5);
        formLikeHEndPerc = (model.likeliHoodEndPercentage*100).toFixed(5);

        let modelText = sortNumber+" - "+i18n.getTranslation("common.log.logMessageSummary.impactFrom")+" "
        +formImpStartPerc+"% "+i18n.getTranslation("common.log.logMessageSummary.to")+" "+formImpEndPerc+"% || "

        +i18n.getTranslation("common.log.logMessageSummary.likehoodFrom")+" "+formLikeHStartPerc+"% "
        +i18n.getTranslation("common.log.logMessageSummary.to")+" "+formLikeHEndPerc+"% ";
        logText = logText + modelText+" \n";
        sortNumber++;
    });
    return logText;
  }

  componentDidMount() {
  
  } 

  componentWillReceiveProps(nextProps){

    let logText = this.calculateModArrayLogText(nextProps.modelArray);
    this.setState({
        modelArray: nextProps.modelArray,
        graph:nextProps.graph,
        logText:logText
    });  
    
  }
 
  render() {
    return (
        <div className=""  >
            <Input readOnly type="textarea" name="text" id="mxGraphMessageSummary" className="mxGraphMessageSummary"  value = {this.state.logText} />
        </div>
    )
  }
}
export default withTracker(() => {
  return {
  };
})(MxGraphMessageSummary);
 