var Backbone = require('backbone'),
    Model = require('js/clients/models/client.js')

module.exports = Backbone.Collection.extend({
    model: Model,
    url: '/api/invoices',
    initialize: function() {
        this.fetchAll()
    }
})