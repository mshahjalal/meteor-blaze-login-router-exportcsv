import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import moment from 'moment';

import './signin.html';

Template.signin.helpers({
  currentUser() {
    return Meteor.user();
  },
  isAdminUser() {
    return !!Roles.userIsInRole(Meteor.userId(), "admin");
  }
});

Template.signin.events({
  'submit .user-login-js'(event) {
    event.preventDefault();

    const target = event.target;
    const email = target.email.value;
    const password = target.password.value;
    
    let errorMessage = '';

    if(email && !validateEmailAddress(email)) errorMessage = 'Your email address is invalid <br />';
    else if(!email) errorMessage = 'Please enter your email address <br />';

    if(!password) errorMessage += 'Please enter your password';

    let errorMessageTarget = $(target).find(".error-message");

    if(errorMessage){
        errorMessageShowOrHide(errorMessageTarget, errorMessage);
        return false;
    }

    Meteor.loginWithPassword(email, password, function(error){
        
        if(error) errorMessageShowOrHide(errorMessageTarget, (error.reason || ''));
        else FlowRouter.go("/admin");
        
    });
  },
  'click .logout': function(event){
        event.preventDefault();

        Meteor.logout();
        FlowRouter.go('/signin');
    },
    'click .export-users-csv-js'(event) {

        Meteor.call('export-users-csv', (error, csvContent) => {
            if (error) {
                console.error(error.error);
            } else {
            
                let blob = new Blob([csvContent]),
                a = window.document.createElement("a");
                a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
                a.download = "f02-users-"+moment.utc().format("YYYY-MM-DD")+"-1529.csv";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

            }
        });
    },
});

let errorMessageShowOrHide = (target, errorMessage = '') => {
    if(errorMessage){
        target.html(errorMessage);
        target.show();
    }else target.hide();
};

const validateEmailAddress = (email) => {
    let reqEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reqEx.test(email);
};