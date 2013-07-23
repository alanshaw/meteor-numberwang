Meteor.startup(function () {
  if (!Count.findOne()) {
    Count.create({val: 0, updated: Date.now()})
  }
})