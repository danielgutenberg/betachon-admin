var Backbone = require('backbone'),
    _ = require('underscore'),
    Template = require('templates/invoices/invoices.hbs'),
    TrTemplate = require('templates/invoices/invoicesTr.hbs')

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
        this.$('#mainTbl tbody').append(TrTemplate(data))
    }
})