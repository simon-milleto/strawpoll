import { Meteor } from 'meteor/meteor';
import {Strawpolls} from './../imports/api/strawpolls';
import { Cookies } from 'meteor/ostrio:cookies';

Meteor.startup(() => {
  const cookies = new Cookies();
});

Meteor.methods({

  incVoteStrawpoll: function(id, name) {

    Strawpolls.update(
      { _id: id, "options.name": name},
      {$inc: { "options.$.vote": 1 }}
    );
  }
});

Meteor.methods({

  sortedByVote: function(id, sort) {
    console.log('test');
    let list = Strawpolls.aggregate([
      { $match: {
        _id : id
      }},
      {$unwind: '$options'},
      {$sort: {'options.vote': sort}},
      {$group: {_id: id, 'options': {$push: '$options'}, 'title': {$first: '$title'}}}
    ]);
    return list[0];
  }
});
