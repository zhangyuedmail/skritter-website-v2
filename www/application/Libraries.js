define([
    'async',
    'fastclick',
    'moment.timezone',
    'backbone.routefilter',
    'bootstrap.switch',
    'createjs.easel',
    'createjs.tween',
    'handlebars',
    'jquery.mobile',
    'jquery.ui',
    'modernizr',
    'raygun',
    'require.i18n',
    'require.text'
], function(Async, FastClick, Moment) {
    window.async = Async;
    window.fastclick = new FastClick(document.body);
    window.moment = Moment;
});