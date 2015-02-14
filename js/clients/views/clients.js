var Backbone = require('backbone'),
    _ = require('underscore'),
    Template = require('templates/clients/clients.hbs'),
    TrTemplate = require('templates/clients/clientsTr.hbs')

module.exports = Backbone.View.extend({
    tagName: 'form',
    template: Template,
    initialize: function(opts) {
        this.collection = opts.collection
        this.render()
    },
    render: function() {
        this.$el.html(this.template())
        this.collection.each(this.addRow, this)
    },
    addRow: function(model) {
        var data = model.toJSON()
        this.$('tbody').append(TrTemplate(data))
    }
})