app = (function() {
    return {
        configs: {
            paths: {
                //libraries
                async: 'libraries/async-0.9.0.min',
                backbone: 'libraries/backbone-1.1.2.min',
                'backbone.routefilter': 'libraries/backbone.routefilter-0.2.0.min',
                bootstrap: 'libraries/bootstrap-3.2.0.min',
                'bootstrap.switch': 'libraries/bootstrap.switch-3.0.2.min',
                jquery: 'libraries/jquery-1.11.1.min',
                handlebars: 'libraries/handlebars-1.3.0.min',
                modernizr: 'libraries/modernizr.custom-2.8.3.min',
                moment: 'libraries/moment-2.8.2.min',
                'moment.timezone': 'libraries/moment.timezone-0.2.1.min',
                'require.i18n': 'libraries/require.i18n-2.0.4',
                'require.text': 'libraries/require.text-2.0.12',
                underscore: 'libraries/lodash.underscore-2.4.1.min'
            },
            shim: {
                backbone: ['jquery', 'underscore'],
                'backbone.routefilter': ['backbone'],
                bootstrap: ['jquery'],
                'bootstrap.switch': ['bootstrap'],
                'moment.timezone': ['moment']
            }
        },
        isLocalhost: function() {
            return location.hostname === 'localhost';
        }
    };
})();