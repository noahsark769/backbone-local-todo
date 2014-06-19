var todo = todo || {};

(function () {
    var store = new Backbone.LocalStorage("items");
    /**
     * We have only one model, an Item which represents a todo list item.
     */
    var Item = Backbone.Model.extend({
        defaults: {
         name: ""
        },
        localStorage: store
    });

    /**
     * Every item has a View, which keeps one item (a Model) internally and
     * knows how to render it, here with an "li" tag.
     */
    var ItemView = Backbone.View.extend({
        tagName: "li",
        className: "item",
        render: function () {
            console.log("Rendering a model with name: " + this.model.get("name") + "!");
            this.$el.html(this.model.get("name"));
            return this.$el;
        }
    });

    /**
     * Basically, a collection just stores some list of models and knows how to
     * access them in some way. Usually, the collection would know to fetch the
     * models using a GET request to some server, but here we use local storage
     * instead.
     */
    var Items = Backbone.Collection.extend({
        model: Item,
        localStorage: store
    });

    var ItemListView = Backbone.View.extend({
        el: ".todo-items",
        events: {
            "click .js-add": "addItem"
        },
        render: function () {
            var _this = this;
            var items = new Items();
            this.$(".item").remove();
            items.fetch({
                success: function (data) {
                    data.models.forEach(function (item) {
                        _this.$el.append(new ItemView({model: item}).render());
                    });
                }
            });
        },
        addItem: function () {
            console.log("calling additem");
            var name = this.$(".js-name").val();
            var item = new Item({name: name});
            item.save();
            this.render();
        }
    });

    todo.start = function () {
        var itemListView = new ItemListView();
        itemListView.render();
    };
})();