import React, { Component } from 'react';
import i18n from 'meteor/universe:i18n';
import { Session } from 'meteor/session';
const T = i18n.createComponent();

class ResetPassword extends Component {


  resetPasswordClick() {
 
    let usernameEmail = $("#usernameEmail").val();
    Meteor.call('AccountController.Methods.ResetPassword',{usernameEmail:usernameEmail});
    alert(i18n.getTranslation("common.resetPassword.passwordReseted")); 
 
  }

  handleKeyPress(context,target) {
    if(target.charCode==13){
      context.resetPasswordClick();
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
                    <h1>{i18n.getTranslation("common.resetPassword.resetPassword")}</h1>
            
                    <div className="input-group mb-3">
                      <span className="input-group-addon"><i className="icon-user"></i></span>
                      <input id="usernameEmail" type="text" className="form-control" placeholder={i18n.getTranslation("common.resetPassword.usernameEmail")}/>
                    </div>
                   
                    <div className="row">
                      <div className="col-6">
                        <button type="button" onClick={() => this.resetPasswordClick(this)} className="btn btn-primary px-4">{i18n.getTranslation("common.resetPassword.commit")}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
