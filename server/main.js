var Fiber = Npm.require("fibers")

function Contestant (id, buzzerPin) {
  var buzzer = new five.Button(buzzerPin)
  
  buzzer.on("down", function () {
    // TODO: WTF is going on here, why is this listener not run in a fiber already?
    
    if (!this.wanging) return;
    
    Fiber(function () {
      var count = Count.findOne({cid: id})
      
      Count.update(count._id, {$inc: {val: 1}, $set: {updated: Date.now()}}, function (er) {
        if (er) console.error(er)
        console.log(id, "count", count.val + 1)
      })
      
    }.bind(this)).run()
    
  }.bind(this))
  
  this.id = id
  this.wanging = false
  
  console.log("Contestant %s ready", id)
}

Contestant.prototype.wang = function () {
  this.wanging = true
}

Contestant.prototype.unwang = function () {
  this.wanging = false
}

Contestant.prototype.reset = function () {
  this.unwang()
  
  var count = Count.findOne({cid: this.id})
  
  Count.update(count._id, {$set: {val: 0, updated: Date.now()}}, function (er) {
    if (er) console.error(er)
  })
}

Contestant.prototype.getCount = function () {
  var count = Count.findOne({cid: this.id})
  return count.val
}

function Host () {
  
  var host = this
    , sensor = new five.Sensor({pin: "A0", freq: 300})
    , scale = sensor.scale([0, 250])
    , norm = null
    , started = false
  
  function onRead () {
    var next = Math.round(this.scaled)
    
    //console.log("Host sensor read", next)
    
    if (norm === null) {
      console.log("Host ready")
      return norm = next
    }
    
    if (next < norm - 5 || next > norm + 5) {
      
      if (started) {
        if (host.onStop) {
          host.onStop(next)
          started = false
        }
      } else {
        if (host.onStart) {
          host.onStart(next)
          started = true
        }
      }
      
      scale.removeListener("read", onRead)
      
      // Min round time 5 seconds
      setTimeout(function () {
        scale.on("read", onRead)
      }, 5000)
    }
  }
  
  scale.on("read", onRead)
}

Meteor.startup(function () {
  
  [0, 1].forEach(function (cid) {
    var count = Count.findOne({cid: cid})
    if (!count) {
      Count.insert({cid: cid, val: 0, updated: Date.now()})
    } else {
      Count.update(count._id, {$set: {val: 0, updated: Date.now()}})
    }
  })
  
  var result = Result.findOne()
  
  if (!result) {
    Result.insert({winner: null, score: null})
  }
  
  var board = new five.Board({debug: true})
  
  board.on("ready", function () {
    
    var c0 = new Contestant(0, 2)
      , c1 = new Contestant(1, 3)
      , host = new Host()
    
    host.onStop = function () {
      Fiber(function () {
        
        c0.unwang()
        c1.unwang()
        
        var winner = c0.getCount() > c1.getCount() ? 0 : 1
          , score = c0.getCount() + ":" + c1.getCount()
        
        console.log("---")
        console.log("THATS NUMBERWANG!")
        console.log("Contestant %s WIN", winner)
        console.log(score)
        console.log("---")
        
        var result = Result.findOne()
        Result.update(result._id, {winner: winner, score: score})
        
      }).run()
    }
    
    host.onStart = function () {
      Fiber(function () {
        
        c0.reset()
        c1.reset()
        
        c0.wang()
        c1.wang()
        
        console.log("---")
        console.log("START WANGING!")
        console.log("---")
        
      }).run()
    }
  })
})

Meteor.publish('count', function () {
  return Count.find()
})

Meteor.publish('result', function () {
  return Result.find()
})