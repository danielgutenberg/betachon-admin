var Backbone = require('backbone'),
    _ = require('underscore'),
    Template = require('templates/clients/editClient.hbs')

module.exports = Backbone.View.extend({
    tagName: 'form',
    template: Template,
    initialize: function(opts) {
        this.client = opts.client
        this.render()
    },
    render: function() {
        var data = this.client.toJSON()
        this.$el.html(this.template(data))
        this.$el.on('submit', _.bind(this.submit, this))
    },
    submit: function(e) {
        // var formValues = {
        //     email: $('#username').val(),
        //     password: $('#password').val()
        // };
            e.preventDefault()
        
        // this.user.login(formValues)
        
    }
})