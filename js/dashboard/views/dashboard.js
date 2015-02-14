var Backbone = require('backbone'),
    _ = require('underscore'),
    Template = require('templates/dashboard.hbs')

module.exports = Backbone.View.extend({
    template: Template,
    initialize: function() {
        this.render()
    },
    render: function() {
        this.$el.html(this.template())
    }
})