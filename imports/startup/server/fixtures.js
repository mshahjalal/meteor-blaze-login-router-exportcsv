// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import _ from 'lodash';

Meteor.startup(() => {
  // if the users collection is empty
  createUser();  
});


let createUser = () => {
  if (Meteor.users.find().count() === 0) {
    const usersData = [
      {        
        email:"shenlee@testapp.com",
        password: "admin12",
        profile: {
          name: 'Shen lee',
          phone:'01234567890',
          city: "Dhaka",
          state: "Dhaka",
          createdAt: new Date(),
        },
        roles:['user']
      },
      {        
        email:"Allenrocky@testapp.com",
        password: "admin123",
        profile: {
          name: 'Allen Rocky',
          phone:'01234567777',
          city: "Gazipur",
          state: "Dhaka",
          createdAt: new Date(),
        },
        roles:['user']
      },
      {        
        email:"manageusers@testapp.com",
        password: "manage1234",
        profile: {
          name: 'John More',
          phone:'01234568888',
          city: "Tongi",
          state: "Dhaka",
          createdAt: new Date(),
        },
        roles:['manage-users']
      },
      {    
        email:"admin@testapp.com",
        password: "admin123456",
        profile: {
          name: 'Simon dola',
          phone:'01234569999',
          city: "Pabna",
          state: "Rajshahi",
          createdAt: new Date(),
        },
        roles:['admin']
      },
      {
        email:"ketylee@testapp.com",
        password: "admin123456",
        profile: {
          name: 'Kety lee',
          phone:'01201201201',
          city: "Dhaka",
          state: "Dhaka",
          createdAt: new Date(),
        },
        roles:['secrets']
      },
    ];
    
    usersData.forEach(user => {
        let userRoles = _.clone(user.roles);
        delete user.roles;
        let userId = Accounts.createUser(user);
        
        // email verification
        Meteor.users.update({_id: userId},
        {$set:{'emails.0.verified': true}});
      
        if (Meteor.roleAssignment.find({ 'user._id': userId }).count() === 0) {

          userRoles.forEach(function (role) {
            // Give Alice the 'admin' role
            Roles.createRole(role, {unlessExists: true});
          });

          // Need _id of existing user record so this call must come after `Accounts.createUser`.
          Roles.addUsersToRoles(userId, userRoles);
        }
      }
    );
  }
};