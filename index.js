Count = new Meteor.Collection("count")

Count.allow({
  // Allow update, but server sets the update time
  update: function (uid, doc) {
    doc.updated = Date.now()
    return true
  }
})