var Backbone = require('backbone')

module.exports = Backbone.Model.extend({
    defaults: {
        client_id: '',
        client_name: '',
        client_phone: ''
    }
})