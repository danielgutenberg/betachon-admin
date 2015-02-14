var i18n = require('i18next-client'),
    b = require('bootstrap'),
    Backbone = require('../libs/backbone.js'),
    Nest = require('backbone-nest'),
    Handlebars = require('hbsfy/runtime'),
    Router = require('js/router.js')

// set up i18next-client
// var opts = {
//     resStore: require('../strings'),
//     //debug: true,
//     lng: 'en-us',
//     lowerCaseLng: true
// }

// i18n.init(opts);

// set up handelbars helpers
Handlebars.registerHelper('t', function(key) {
    var result = i18n.t(key);

    return new Handlebars.SafeString(result);
});

Handlebars.registerHelper('tx', function(context, options) {
    var opts = i18n.functions.extend(options.hash, context);
    if (options.fn) opts.defaultValue = options.fn(context);

    var result = i18n.t(opts.key, opts);
    return new Handlebars.SafeString(result);
})
/*
if (window.init) {
    global.window.app = new Router({init: window.init})
} else {
    var init = {}
    $.get('/boot')
    .done(function(data) {
        global.window.app = new Router({init: data})
    })
}
*/
global.window.app = new Router()
//global.window.Backbone = Backbone
//global.window._ = require('underscore')
