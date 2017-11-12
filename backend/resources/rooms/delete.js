cancelUnless(isRoot || internal, "not authorized.", 403)

var room = ctx.url.split('/')[1]

dpd.messages.get({room:room})
.then(function(messages){
    Promise.all(messages.map(function(message){
        console.log('-+-', message.id)
        return  dpd.messages.del(message.id)
                .catch(function(e){ console.log(message, e)})
    }))

}, console.log)
