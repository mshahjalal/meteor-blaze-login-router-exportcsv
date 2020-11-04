// Methods related to users

import { Meteor } from 'meteor/meteor';
import Papa from 'papaparse';
import _ from 'lodash';
import moment from 'moment';

Meteor.methods({
  'export-users-csv'() {
    let users = Meteor.users.find({}).fetch(),
    fields = [
			"User Created Date",
			"Name",
			"Email",
			"Phone",
      "City",
      "State"			
    ],
    data = [];		

		_.each(users, function(user) {
			data.push([
        moment.utc(user.profile.createdAt).format("DD/MM/YYYY"),        
        user.profile.name,
				user.emails[0].address,
				user.profile.phone,
        user.profile.city,
        user.profile.state
			]);
		});

    let csvData = {
      "fields": fields,
      "data": data
    };

    return Papa.unparse(csvData, 
    {
      header: true,
      skipEmptyLines: true,
    });
  }
});
