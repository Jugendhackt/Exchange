(function(){

	dpd(Context.resourceId).get()
	.then(function(rooms){
		rooms.forEach(function(room){
			var list_item = $('<li class = "component-item"><div class="component-item-header clearfix"><span class ="name"></span><div class = "pull-right"><span class ="message-count"></span><button class ="btn confirm">confirm deletion</button><button class ="btn cancel">cancel</button><a href="#" class ="delete" title="delete"><i class="icon-white icon-trash"></i></a></div></div></li>')

			list_item.find('.name').append(room.name)
			list_item.find('.message-count').append(room.message_count)
			

			list_item.find('.delete').on('click', function(){
				list_item.addClass('confirm-deletion')

			})

			list_item.find('.cancel').on('click', function(){
				list_item.removeClass('confirm-deletion')

			})

			list_item.find('.confirm').on('click', function(){
				console.log('delete me')
				
				dpd(Context.resourceId).del(room.name)
				.then(function(){
					list_item.remove()
				})
			})

			$('#item-list').append(list_item)
		})
	})
	

})()