var Backbone = require('backbone'),
    Body = require('templates/body.hbs')

module.exports = Backbone.View.extend({
    el: 'body',
    currentView: null,
    initialize: function() {
        this.render()
    },
    render: function() {
        this.$el.append(Body())
        this.mainpage = this.$('.mainContent')
    },
    set: function(view) {
        if (this.currentView) {
            this.currentView.remove()
            window.scrollTo(0, 0)
        }

        this.currentView = view
        this.mainpage.html(this.currentView.$el)
    },
})
