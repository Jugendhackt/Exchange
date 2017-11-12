var Resource  = require('deployd/lib/resource'),
    Script    = require('deployd/lib/script'),
    util      = require('util'),
    path      = require('path')

function Rooms() {
  Resource.apply(this, arguments)
}

util.inherits(Rooms, Resource)

Rooms.label = "Rooms"
Rooms.events = ["get", "put", "post", "delete"]
Rooms.dashboard = {
    path: path.join(__dirname, 'dashboard')
  , pages: ['Events', 'Rooms']
  , scripts: [
      '/js/lib/jquery-ui-1.8.22.custom.min.js'
    , '/js/lib/knockout-2.1.0.js'
    , '/js/lib/knockout.mapping.js'
    , '/js/util/knockout-util.js'
    , '/js/util/key-constants.js'
    , '/js/util.js'
  ]
}



module.exports = Rooms;

Rooms.prototype.clientGeneration = true

Rooms.prototype.handle = function (ctx, next) {
  var parts = ctx.url.split('/').filter(function(p) { return p; })

  var result = {}

  var domain = {
      url: ctx.url
    , parts: parts
    , query: ctx.query
    , body: ctx.body
    , 'this': result
    , setResult: function(val) {
      result = val
    }
  };

  if (ctx.method === "POST" && this.events.post) {
    this.events.post.run(ctx, domain, function(err) {
      ctx.done(err, result)
    });
  } else if (ctx.method === "GET" && this.events.get) {
    this.events.get.run(ctx, domain, function(err) {
      ctx.done(err, result)
    });
  }else if (ctx.method === "PUT" && this.events.put) {
    this.events.put.run(ctx, domain, function(err) {
      ctx.done(err, result)
    });
  }else if (ctx.method === "DELETE" && this.events.delete) {
    this.events.delete.run(ctx, domain, function(err) {
      ctx.done(err, result)
    });
  } else {
    next()
  }

  
};