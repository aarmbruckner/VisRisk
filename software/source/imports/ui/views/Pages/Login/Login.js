import React, { Component } from 'react';
import i18n from 'meteor/universe:i18n';
import { Session } from 'meteor/session';
 
const T = i18n.createComponent();

class Login extends Component {


  commitLogin() {
 
    let username = $("#UserName").val();
    let password = $("#Password").val();

    //let httpsStatus = isHTTPS();

    Accounts.callLoginMethod({
      methodName: 'WebLogin',
      methodArguments: [
        {
          username: username,
          password: password
        },
      ],
      userCallback: (response) => {
        let userId= Meteor.userId();
        Session.set('userId', userId);
        Meteor.call('AccountController.Methods.GetUserName',{user:userId}, (error,username) => {
          Session.set('username', username);
        });

        Meteor.setTimeout(() =>
        {
          i18n.setLocale(Meteor.settings.public.localisation.i18nLanguage);
          Session.set('localeSet', true);
          if(!userId ||  (response && response.userOutPut))
          {
            if(response && response.userOutPut)
            {
              alert(response.userOutPut);
            }
            else
            {
              alert(i18n.getTranslation("common.loginPage.loginFailed"));
            }
            
          }
          else{
            this.props.history.push('/dashboard');
          }
          
        }, 500); 
      }
    });
  }

  resetPasswordClick() {
    this.props.history.push('/resetpassword');
  }

  handleKeyPress(context,target) {
    if(target.charCode==13){
      context.commitLogin();
    } 
   }
  

  render() {
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card-group mb-0">
                <div className="card p-4">
                  <div className="card-block">
                    <h1>{i18n.getTranslation("common.loginPage.login")}</h1>
                    <div className="input-group mb-3">
                      <span className="input-group-addon"><i className="icon-user"></i></span>
                      <input id="UserName" type="text" className="form-control" placeholder={i18n.getTranslation("common.loginPage.username")}/>
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-addon"><i className="icon-lock"></i></span>
                      <input  onKeyPress={(target) => this.handleKeyPress(this,target)} id="Password" type="password" className="form-control" placeholder={i18n.getTranslation("common.loginPage.password")}/>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <button type="button" onClick={() => this.commitLogin(this)} className="btn btn-primary px-4">{i18n.getTranslation("common.loginPage.login")}</button>
                      </div>
                      <div className="col-6 text-right">
                        <p   onClick={() => this.resetPasswordClick(this)}   className="passwordResetLink">{i18n.getTranslation("common.loginPage.forgotPassword")}</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                      </div> 
                    </div>
                    <div className="row">
                    </div>
                  </div>
                </div>
              {/*   <div className="card card-inverse card-primary py-5 d-md-down-none" style={{ width: 44 + '%', display:"none" }}>
                  <div className="card-block text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                      <button type="button" className="btn btn-primary active mt-3">Register Now!</button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
