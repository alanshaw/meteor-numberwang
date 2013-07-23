Meteor.startup(function () {
  
  // Subscribe to the count
  Meteor.subscribe('count')
  
})

Template.counter.count = function () {
  return Count.findOne().val.toString(2).split("") // TODO: Custom radix?
}