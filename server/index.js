Meteor.startup(function () {
  if (!Count.findOne()) {
    Count.insert({val: 0, updated: Date.now()})
  }
})

Meteor.publish('count', function () {
  return Count.find()
})