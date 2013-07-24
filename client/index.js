Meteor.startup(function () {
  // Subscribe to the count
  Meteor.subscribe("count")
  
  document.getElementById("inc").addEventListener("click", function () {
    var count = Count.findOne()
    if (!count) return;
    Count.update(count._id, {$inc: {val: 1}}, function (er) {
      if (er) console.log(er)
    })
  })
})

Template.counter.count = function () {
  var count = Count.findOne()
  return count ? count.val.toString(2) : ""
}