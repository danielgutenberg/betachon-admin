var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),
    callbacks = require('backbone-callbacks')
    // TableView = require('js/CollectionTable/views/table.js')

$.ajaxPrefilter(function(opts, userOpts, jqXHR) {
    opts.crossDomain = {
        crossDomain: true
    };
    opts.xhrFields = {
        withCredentials: true
    };

    if (opts.url.indexOf('http') < 0) {
        opts.url = $('head > base').attr('href') + opts.url
    }
})

// our jquery functions
jQuery.fn.extend({
    formObject: function() {
        return _(this.serializeArray())
            .reduce(function (data, field) {

                // single value
                if (!data[field.name]) {
                    data[field.name] = field.value
                // multiple values
                } else {
                    // convert value to array if it isn't already
                    if (!$.isArray(data[field.name])) {
                        var prev = data[field.name]
                        data[field.name] = []
                        data[field.name].push(prev)
                    }

                    // append value to field
                    data[field.name].push(field.value)
                }

                return data
            }, {})
    }
})
Backbone.$ = $
callbacks.attach(Backbone)

// remove all items in an object by calling .remove() and then deleting them
// returns the modified object
Backbone.View.prototype.removeChildren = function(views) {
    if (views instanceof Backbone.View) {
        throw new Error('removeChildren should be called on an object of views, not on a view')
    }
    if (_.isEmpty(views)) {
        return {}
    }
    views = _.each(views, function(view, index, list){
        view.remove()
        delete list[index]
    })
}

// shortcut for calling the origional remove method
Backbone.View.prototype.superRemove = Backbone.View.prototype.remove

// Backbone.TableView = TableView

// temporarily inlcude git.io/iCZxtA
Backbone.Router.prototype.route = function(route, name, callback) {
  if (!_.isRegExp(route)) route = this._routeToRegExp(route);
  if (_.isFunction(name)) {
    callback = name;
    name = '';
  }
  if (!callback) callback = this[name];
  var router = this;
  Backbone.history.route(route, function(fragment) {
    var args = router._extractParameters(route, fragment);
    router.execute(callback, args, name); // <---- git.io/iCZxtA
    router.trigger.apply(router, ['route:' + name].concat(args));
    router.trigger('route', name, args);
    Backbone.history.trigger('route', router, name, args);
  });
  return this;
}
module.exports = Backbone
