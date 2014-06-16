var todo = todo || {};

(function () {
	var Item = Backbone.Model.extend({

	});

	var Items = Backbone.Collection.extend({
		model: Item,
		localStorage: new Backbone.LocalStorage("items")
	});

	var ItemListView = Backbone.View.extend({
		el: ".todo-items",
		render: function () {
			var items = new Items();
			this.$el.html("yolo");
		}
	});

	todo.start = function () {
		var itemListView = new ItemListView();
		itemListView.render();
	};
})();