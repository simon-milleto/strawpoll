import { Meteor } from 'meteor/meteor';
import {Strawpolls} from './../imports/api/strawpolls';

Meteor.startup(() => {

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
