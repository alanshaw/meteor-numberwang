Meteor.startup(function () {
  // Subscribe to the counts
  Meteor.subscribe("count")
  Meteor.subscribe("result")
})

function getCount (cid) {
  var count = Count.findOne({cid: cid})
  return count ? count.val : ""
}

Template.c0counter.count = function () { return getCount(0) }
Template.c1counter.count = function () { return getCount(1) }

Template.result.result = function () {
  var result = Result.findOne()
  
  return Result.findOne()
}