var Backbone = require('backbone'),
    _ = require('underscore'),
    Template = require('templates/login.hbs')

module.exports = Backbone.View.extend({
    tagName: 'form',
    template: Template,
    initialize: function(opts) {
        this.user = opts.user
        this.render()
    },
    render: function() {
        this.$el.html(this.template())
        this.$el.on('submit', _.bind(this.submit, this))
    },
    submit: function(e) {
        var formValues = {
            email: $('#username').val(),
            password: $('#password').val()
        };
            e.preventDefault()
        
        this.user.login(formValues)
        
    }
})
