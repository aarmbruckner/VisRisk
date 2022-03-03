import React, { Component } from 'react';
import {Nav,Navbar, UncontrolledButtonDropdown,NavbarBrand,NavbarToggler,Collapse,UncontrolledDropdown,DropdownToggle,DropdownMenu,NavDropdown,NavDropDownItem, NavItem, NavLink, Dropdown, DropdownItem } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import HTMLUtilities from '../../../../API/Modules/Utilities/HTMLUtilities';

const T = i18n.createComponent();

class Header extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    let uniqueID = Meteor.userId(); 
    let username = "";
    if(uniqueID)
    {
      username = Meteor.users.findOne({_id: uniqueID}).username;
    }

    this.state = {
      dropdownOpen: false,
      username:username
    };
  }

  componentWillReceiveProps(nextProps){
    
    let uniqueID = Meteor.userId(); 
    let username = "";
    if(uniqueID)
    {
      username = Meteor.users.findOne({_id: uniqueID}).username;
    }

    this.setState({
      username: username 
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  logoutUser() {

   /*  Meteor.logout(function(){ 
      i18n.setLocale(Meteor.settings.public.localisation.i18nLanguage);
      window.location = Meteor.settings.public.appInfo.serverUrl;
    }); */
    {
    Meteor.logout(() => { 
      i18n.setLocale(Meteor.settings.public.localisation.i18nLanguage);

      let logOutURL = HTMLUtilities.GetLogOutURL();
      if(logOutURL)
      {
        window.location = logOutURL;
      }
      else
      {
        location.reload();
      }
    });

  }
  

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }
 

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  render() {
    return (
      <div>
        <header className="app-header navbar">
          <button className="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" onClick={this.mobileSidebarToggle}>&#9776;</button>
          <a className="navbar-brand" href="#">
            <img className="navbar-brand-full" src={Meteor.settings.public.logo.logoLocation} width={Meteor.settings.public.logo.logoWidth} height={Meteor.settings.public.logo.logoHeight} alt="Logo"></img>
          </a>
          <ul className="nav navbar-nav d-md-down-none">
            <li className="nav-item">
              <button className="nav-link navbar-toggler sidebar-toggler" type="button" onClick={this.sidebarToggle}>&#9776;</button>
            </li>
          </ul>
          
          <ul className="nav navbar-nav ml-auto">
            <li className="nav-item d-md-down-none">
              </li>
  
            <li className="nav-item userHeader">
                <Dropdown
                  isOpen={this.state.dropdownOpen}
                  toggle={this.toggle}
                >
                <DropdownToggle tag="div">
                <button onClick={this.toggle} className="nav-link dropdown-toggle" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
                    <i className="icon-user headerUser"></i>
                    <span className="d-md-down-none">{this.state.username ?  this.state.username : i18n.getTranslation("common.header.username")}</span>
                </button>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-right">
                    <DropdownItem  onClick={this.logoutUser}><i className="fa fa-lock"></i><T>common.header.logout</T></DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </li>
      
          </ul>
        </header>
      </div>
    )
  }
}

export default Header;
