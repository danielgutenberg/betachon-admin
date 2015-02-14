var Backbone = require('backbone'),
    _ = require('underscore'),
    Router = require('js/router.js')

module.exports = Backbone.Model.extend({
    defaults: {
        'email'   : '',
        'password': '',
        'loggedIn': false,
    },
    
    logout: function(done) {
        var that = this
        $.get('/users/logout')
            .done(function(){
                that.users.reset()
                that.clear()
                if (done) {
                    done()
                }
            })
    },
    login: function(data) {
        var that = this
        
        
        return $.ajax({
                type: 'POST',
                url: '/api/login',
                username: data.email,
                password: data.password,
                data: JSON.stringify(data),
                contentType: 'application/json',
                processData: false
            })
            .done(function(){
                that.set('email', data.email)
                that.set('password', data.password)
                that.set('loggedIn', true)
                Backbone.history.navigate('dashboard', {trigger: true})
            })
            .error(function(xhr){
                if (xhr.status == 403) {
                    that.errorMessage(xhr)    
                }
            })
    }
})