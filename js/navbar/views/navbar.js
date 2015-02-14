var Backbone = require('backbone'),
    _ = require('underscore'),
    title = require('templates/navbar/navbar.hbs'),
    MenuView = require('js/navbar/views/menu.js'),
    LoggedInView = require('js/navbar/views/loggedIn.js')
    


module.exports = Backbone.View.extend({
    el: 'body',
    template: title,
    rightView: null,
    initialize: function(opts) {
        this.user = opts.user
        this.render()
        this.listenTo(this.user, 'change:loggedIn', this.menu)
    },
    render: function() {
        this.$el.html(this.template())
        this.menu()
    },
    menu: function() {
        if (this.menuView) {
            this.menuView.remove()
        }
        
        if (this.loggedInView) {
            this.loggedInView.remove()
        }
        
        if (this.user.get('loggedIn')) {
            this.menuView = new MenuView()
            this.$('ul').append(this.menuView.$el)
            this.loggedInView = new LoggedInView()
            this.$('.meta').append(this.loggedInView.$el)
        }
    }
})
