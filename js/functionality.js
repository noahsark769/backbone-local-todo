var todo = todo || {};

(function () {
    var _renderAsync = function(templateName, data, success) {
        $.get("partials/" + templateName + ".tmpl", function (templateString) {
            var rendered = _.template(templateString, data);
            success(rendered);
        });
    };

    var _store = new Backbone.LocalStorage("items");
    /**
     * We have only one model, an Item which represents a todo list item.
     */
    var Item = Backbone.Model.extend({
        defaults: {
         name: ""
        },
        localStorage: _store
    });

    var ItemView = Backbone.View.extend({
        tagName: "li",
        className: "item",
        events: {
            "click .js-destroy": "destroy"
        },
        initialize: function () {
            console.log("initializing an itemview: " + this.model.toJSON());
            this.listenTo(this.model, "destroy", this.remove);
        },
        render: function () {
            console.log("rendering an item view: " + this.model.toJSON());
            this.$el.html("<span class='item-name'>" + this.model.get("name") + "</span><span class='destroy js-destroy'>done</span>")
            return this.$el;
        },
        destroy: function() {
            console.log("bulldozin");
            this.model.destroy();
        }
    });

    /**
     * Basically, a collection just stores some list of models and knows how to
     * access them in some way. Usually, the collection would know to fetch the
     * models using a GET request to some server, but here we use local storage
     * instead.
     */
    var ItemCollection = Backbone.Collection.extend({
        model: Item,
        localStorage: _store
    });
    var Items = new ItemCollection();

    var AddItemView = Backbone.View.extend({
        el: ".add",
        events: {
            "click .js-add": "addItem",
            "keypress .js-name": "addItemIfEnter"
        },
        initialize: function () {
            this.$input = this.$(".js-name");
        },
        addItem: function () {
            console.log("addItem clicked in add item view");
            var name = this.$input.val();
            Items.create({name: name});
            this.$input.val("");
        },
        addItemIfEnter: function (e) {
            if (e.keyCode == 13) {
                this.addItem();
                this.$input.focus();
            }
        }
    });

    var ItemListView = Backbone.View.extend({
        el: ".todo-items",
        events: {
            "click .js-add": "addItem",
            "keypress .js-name": "addIfEnter"
        },
        initialize: function () {
            Items.fetch();
            Items.on("add", this.render, this);
            Items.on("remove", this.render, this);
        },
        render: function () {
            var _this = this;
            this.$el.empty();
            Items.forEach(function(model) {
                var view = new ItemView({model: model});
                _this.$el.append(view.render());
            });
        }
        // addIfEnter: function (e) {
        //     if (e.keyCode == 13) {
        //         this.addItem();
        //         this.$input.focus();
        //     }
        // }
    });

    todo.start = function () {
        var itemListView = new ItemListView();
        var addItemView = new AddItemView();
        itemListView.render();
    };
})();