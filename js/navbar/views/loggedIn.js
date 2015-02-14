var Backbone = require('backbone'),
    _ = require('underscore'),
    navbar = require('templates/navbar/loggedIn.hbs')

module.exports = Backbone.View.extend({
    template: navbar,
    rightView: null,
    initialize: function(opts) {
        this.render()
    },
    render: function() {
        this.$el.html(this.template())
    }
    
})