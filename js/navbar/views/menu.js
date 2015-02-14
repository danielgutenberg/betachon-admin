var Backbone = require('backbone'),
    _ = require('underscore'),
    navbar = require('templates/navbar/menu.hbs')

module.exports = Backbone.View.extend({
    template: navbar,
    rightView: null,
    events : {
        'click a' : 'setStatus',
    },
    initialize: function(opts) {
        this.render()
    },
    render: function() {
        this.$el.html(this.template())
    },
    setStatus: function(ev) {
        this.$el.find('li').removeClass('selected');
        $(ev.target).parent('a').parent('li').addClass('selected');
    }
    
})
