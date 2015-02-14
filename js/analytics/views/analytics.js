var Backbone = require('backbone'),
    _ = require('underscore'),
    Template = require('templates/analytics.hbs'),
    TrTemplate = require('templates/analyticsTr.hbs')

module.exports = Backbone.View.extend({
    tagName: 'form',
    template: Template,
    initialize: function(opts) {
        this.clients = opts.clients
        this.invoices = opts.invoices
        this.render()
    },
    render: function() {
        this.$el.html(this.template())
        this.clients.each(this.getInvoices, this)
    },
    addRow: function(model) {
        var data = model.toJSON()
        this.$('tbody').append(TrTemplate(data))
    },
    getInvoices: function(model) {
        var a = this.invoices.where({account_number: model.get('client_account_number')})
        var Collection =  Backbone.Collection.extend({
        });
        model.invoices = a
        this.addRow(model)
    }
})