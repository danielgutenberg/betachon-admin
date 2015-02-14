var Backbone = require('libs/backbone'),
    _ = require('underscore'),
    // views
    NavbarView = require('js/navbar/views/navbar.js'),
    PageView = require('js/body/body.js'),
    LoginView = require('js/login/login.js'),
    DashboardView = require('js/dashboard/views/dashboard.js'),
    ClientView = require('js/clients/views/clients.js'),
    AnalyticsView = require('js/analytics/views/analytics.js'),
    InvoicesView = require('js/invoices/views/invoices.js'),
    // ContestView = require('js/contest/views/contest.js'),
    // ContentPagesView = require('js/contentPages/views/page.js'),
    EditProfileView = require('js/clients/views/editProfile.js'),
    // AccountHistoryView = require('js/history/views/accountHistory.js'),
    // DepositView = require('js/deposit/views/depositPage.js'),
    User = require('js/user/user.js'),
    // collections
    
    ClientCollection = require('js/clients/collections/clients.js'),
    InvoiceCollection = require('js/invoices/collections/invoices.js')
    // ContestAthletesColl = require('js/contests/collections/contest_athletes.js'),
    // SportsCollection = require('js/sports/collections/sports.js'),
    // AthletesCollection = require('js/athletes/collections/athletes.js'),
    // ContentSeriesCollections = require('js/contentPages/collections/series.js'),
    // PrizePlanCollection = require('js/prizePlans/collections/prizePlans.js'),
    // UsersCollection = require('js/users/collections/users.js'),
    // TransactionsCollection = require('js/history/collections/transactions.js'),
    // UserContestsCollection = require('js/history/collections/contests.js')

module.exports = Backbone.Router.extend({
    // wasPreloaded: false,
    routes: {
        '': 'login',
        'dashboard': 'dashboard',
        'clients': 'clients',
        'analytics': 'analytics',
        'logout': 'login',
        'editClient/:id': 'editProfile',
        'invoice': 'invoices',
        // 'deposit': 'deposit'
    },
    collections: {},
    models: {},
    views: {},
    initialize: function(){
        //user
        // this.collections.users      = new UsersCollection()
        this.models.user = new User()
        this.collections.clients = new ClientCollection()
        this.collections.invoices = new InvoiceCollection()

        // collections

        // other setup

        // start <a> handler
        this.aHandler()
        // route to the currently requested url
        this.root = $('head > base').attr('href')
            .replace(
                window.location.origin.replace(window.location.protocol, ''),
            '')
        var url = window.location.pathname.replace(/\/$/, '')
        url = url == this.root ? '' : url.replace(this.root, '')

        Backbone.$(document).ready(function(){
            this.views.navbar = new NavbarView({
                user: this.models.user
            })
            this.views.page = new PageView()

            Backbone.history.start({
                pushState: true,
                root: this.root
            })
            this.navigate(url, {trigger: true})
        }.bind(this))

    },
    
    login: function() {
        this.models.user.set('loggedIn', false)
        this.views.page.set(new LoginView({
            user: this.models.user
        }))
    },
    
    dashboard: function() {
        this.views.page.set(new DashboardView())
    },
    
    clients: function() {
        this.views.page.set(new ClientView({
            collection: this.collections.clients
        }))
    },
    
    analytics: function() {
        this.views.page.set(new AnalyticsView({
            clients: this.collections.clients,
            invoices: this.collections.invoices
        }))
    },
    invoices: function() {
        this.views.page.set(new InvoicesView({
            collection:this.collections.invoices
        }))
    },
    editProfile: function(id) {
        var client = this.collections.clients.findWhere({client_id: id})
        this.views.page.set(new EditProfileView({
            client: client
        }))
    },
    // contests: function() {
    //     this.views.page.set(new ContestsView({
    //         collection: this.collections.contests,
    //         sports: this.collections.sports,
    //         prizes: this.collections.prizePlans,
    //         user: this.models.user
    //     }))
    // },
    // contest: function(id) {
    //     var contest = this.collections.contests.get(id)
    //     if (!contest.athletes) {
    //         contest.athletes = new ContestAthletesColl({id: id})
    //     }
    //     this.views.page.set(new ContestView({
    //         contest: contest,
    //         athletes: this.collections.athletes,
    //         user: this.models.user,
    //         prizePlans: this.collections.prizePlans,
    //         sports: this.collections.sports
    //     }))
    // },
    // pages: function (id) {
    //     this.views.page.set(new ContentPagesView({
    //         id: id,
    //         collection: this.collections.series
    //     }))
    // },
    // editProfile: function(id) {
    //     this.views.page.set(new EditProfileView({
    //         id: id,
    //         users: this.collections.users,
    //         user: this.models.user
    //     }))
    // },
    // accountHistory: function(id) {
    //     this.views.page.set(new AccountHistoryView({
    //         id: id,
    //         sports: this.collections.sports,
    //         contests: this.collections.contests,
    //         transactions: this.transactions,
    //         userContests: this.userContests
    //     }))
    // },
    // deposit: function() {
    //     this.views.page.set(new DepositView({
    //         model: this.models.user,
    //         root: this.root,
    //         content: this.collections.series
    //     }))
    // },
    // logout: function() {
    //     var that = this
    //     this.views.navbar.model.logout(function(){
    //         that.navigate('/', {trigger: true, replace: true})
    //     })
    // },
    aHandler: function() {
        //trap clicks, and process them locally.
        Backbone.$(document).on("click", "a[href]:not([data-dest='external'])", function(e) {
            var href = $(e.currentTarget).attr('href');

            //Allow shift+click for new tabs, etc.
            if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
                return true;
            }

            var isHttp = href.search(/^http[s]:\/\//i);
            //ignore external links
            if (isHttp === 0 && href.indexOf(window.location.origin) !== 0) {
                return true;
            }

            //ignore handler links
            if (isHttp !==0 && href.search(/^[a-zA-Z]+:/) === 0) {
                return true;
            }

            e.preventDefault();
            Backbone.history.navigate(href, {trigger:true})

            return false;
        });
    },
    // execute: function(callback, args, name) {
    //     var router = this
    //     this.preloader.call(this, name, args, function() {
    //         if (callback) callback.apply(router, args);
    //         router.after.call(router, name, args)
    //     })

    // },
    // preloader: function(name, args, done) {
    //     if (this.wasPreloaded) {
    //         return done()
    //     }
    //     if (!this.hasCollections(name) && !this.hasFetcher(name)) {
    //         return done()
    //     }

    //     if (this.hasFetcher(name)) {
    //         $.when(this.preload[name].fetcher.apply(this, args))
    //             .done(function(data){
    //                 _(this.preload[name].collections)
    //                 .each(function(col){
    //                     this.collections[col].setAll(data[col])
    //                  }, this)

    //                  return done()
    //             }.bind(this))
    //     } else {

    //         var parents = _(this.preload[name].collections)
    //         .reduce(function(p, object) {
    //             p.push(this.collections[object].fetchAll())
    //             return p
    //         }, [], this)

    //         $.when.apply($, parents).done(function(){
    //             $.when.apply($, _.flatten(arguments)).done(done)
    //         })
    //         //done.call(this)
    //     }


    // },
    // hasCollections: function(name) {
    //     return _(this.preload).has(name)
    //         && _(this.preload[name]).has('collections')
    // },
    // hasFetcher: function(name) {
    //     return _(this.preload).has(name)
    //         && _(this.preload[name]).has('fetcher')
    // },
    // after: function(name, args) {
    //     if (this.wasPreloaded) {
    //         return true
    //     }

    //     var defered = _(this.collections)
    //         .chain()
    //         .reject(function(object, index){
    //             return this.hasCollections(name)
    //                 // was preloaded
    //                 && _(this.preload[name].collections).contains(index)
    //                 // or is marked to be reloaded
    //                 && (
    //                     !_.has(this.preload[name], 'partials')
    //                     || !_(this.preload[name].partials).contains(index)
    //                   )
    //         }, this)
    //         .map(function(collection, index, list){
    //             collection.fetchAll()
    //         })
    //         .value()

    //     $.when(defered).done(function() {
    //         this.wasPreloaded = true
    //     }.bind(this))
    // },
    // track: function() {
    //     /* jshint ignore:start */
    //     (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    //     (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    //     m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    //     })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    //     /* jshint ignore:end */

    //     // only track in live
    //     if (location.hostname.split('.')[0] != 'www') {
    //         return true
    //     }

    //     ga('create', 'UA-42732134-1', 'auto');
    //     ga('require', 'displayfeatures');
    //     this.sendPageview()
    //     this.on('route', this.sendPageview)

    //     var user = this.collections.users.currentUser
    //     user.on('change:id', user.sendTracker)

    //     if (user.get('id')) {
    //         user.sendTracker()
    //     }
    // },
    // sendPageview: function() {
    //     ga('send', 'pageview', '/' + Backbone.history.getFragment());
    // }
})
