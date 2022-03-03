import React, { Component } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import DefaultHeader from '../../components/Header/DefaultHeader/';
import DashboardHeader from '../../components/Header/DashboardHeader/';

import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Footer from '../../components/Footer/';
import Dashboard from '../../views/Dashboard/';
import LogView from '../../views/LogView/';
import PoolView from '../../views/PoolView/';
import SurveyEditor from '../../views/SurveyEditor/';
import UserEditor from '../../views/UserEditor/';
import Charts from '../../views/Charts/';
import Widgets from '../../views/Widgets/';
import Buttons from '../../views/Components/Buttons/';
import Cards from '../../views/Components/Cards/';
import Forms from '../../views/Components/Forms/';
import Modals from '../../views/Components/Modals/';
import SocialButtons from '../../views/Components/SocialButtons/';
import Switches from '../../views/Components/Switches/';
import Tables from '../../views/Components/Tables/';
import Tabs from '../../views/Components/Tabs/';
import FontAwesome from '../../views/Icons/FontAwesome/';
import SimpleLineIcons from '../../views/Icons/SimpleLineIcons/';
import Login from '../../views/Pages/Login/Login';
import ResetPassword from '../../views/Pages/ResetPassword/ResetPassword';


class Full extends Component {
  render() {
    return (
      <div className="app">
      {/*   <Switch>
          <Route path="/dashboard" name="Dashboard">
            <DashboardHeader />
          </Route>
          <Route path="/" name="Dashboard">
            <DashboardHeader />
          </Route>
          <Route>
            <DefaultHeader />
          </Route>
        </Switch> */}
        <DefaultHeader />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb/>
            <div  className="mainContainer">
              <Switch>
                <Route path="/resetpassword" name="Reset Password" component={ResetPassword}/>
                <Route path="/login" name="Login Page" component={Login}/>
                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                <Route path="/log" name="LogView" component={LogView}/>
                <Route path="/pool" name="PoolView" component={PoolView}/>
                <Route path="/surveyeditor" name="SurveyEditor" component={SurveyEditor}/>
                <Route path="/usereditor" name="UserEditor" component={UserEditor}/>
                <Route path="/components/buttons" name="Buttons" component={Buttons}/>
                <Route path="/components/cards" name="Cards" component={Cards}/>
                <Route path="/components/forms" name="Forms" component={Forms}/>
                <Route path="/components/modals" name="Modals" component={Modals}/>
                <Route path="/components/social-buttons" name="Social Buttons" component={SocialButtons}/>
                <Route path="/components/switches" name="Swithces" component={Switches}/>
                <Route path="/components/tables" name="Tables" component={Tables}/>
                <Route path="/components/tabs" name="Tabs" component={Tabs}/>
                <Route path="/icons/font-awesome" name="Font Awesome" component={FontAwesome}/>
                <Route path="/icons/simple-line-icons" name="Simple Line Icons" component={SimpleLineIcons}/>
                <Route path="/widgets" name="Widgets" component={Widgets}/>
                <Route path="/charts" name="Charts" component={Charts}/>
                <Route path="/" name="Dashboard" component={Dashboard}/>
              </Switch>
            </div>
          </main>
     
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
