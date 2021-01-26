import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import i18n from 'meteor/universe:i18n';
import { Meteor } from 'meteor/meteor';
const T = i18n.createComponent();

class Sidebar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      logAccess:false,
      poolAccess:false,
      surveyEditorAccess:false,
      userEditorAccess:false
    };
 
    this.updateAccess();
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
    this.updateAccess();
  }

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }

  render() {
    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            <li className="nav-item header">
                <NavLink to={'/dashboard'} className="nav-link" activeClassName="active"><i className="icon-menu"></i>  <T>common.sidebar.menu</T> </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to={'/dashboard'} className="nav-link" activeClassName="active"><i className="icon-chart nav-icon"></i> <T>common.sidebar.dashboard</T></NavLink>
            </li>

             
            {this.state.logAccess === true ? (
                <li className="nav-item">
                  <NavLink to={'/log'} className="nav-link" activeClassName="active"><i className="icon-notebook nav-icon"></i> <T>common.sidebar.log</T></NavLink>
                </li>
              ) : (
                 ""
            )}
 
            {this.state.poolAccess === true ? (
                <li className="nav-item">
                  <NavLink to={'/pool'} className="nav-link" activeClassName="active"><i className="icon-link nav-icon"></i> <T>common.sidebar.pool</T></NavLink>
                </li>
              ) : (
                 ""
            )}

            {this.state.surveyEditorAccess === true ? (
                <li className="nav-item">
                       <NavLink to={'/surveyeditor'} className="nav-link" activeClassName="active"><i className="icon-options nav-icon"></i> <T>common.sidebar.surveyEditor</T></NavLink>
                </li>
              ) : (
                 ""
            )}

            {this.state.userEditorAccess === true ? (
                <li className="nav-item">
                   <NavLink to={'/usereditor'} className="nav-link" activeClassName="active"><i className="icon-people nav-icon"></i> <T>common.sidebar.userEditor</T></NavLink>
                </li>
              ) : (
                 ""
            )}

          </ul>
        </nav>
      </div>
    )
  }
}

export default Sidebar;
