requirejs.config({
    baseUrl: 'js/app',
    locale: 'en-us',
    paths: {
        //directories
        spec: '../../test/spec',
        template: '../../template',
        //libraries
        async: '../lib/async-0.9.0',
        backbone: '../lib/backbone-1.1.2.min',
        bootstrap: '../../bootstrap/js/bootstrap.min',
        'bootstrap.notify': '../../bootstrap/components/notify/bootstrap-notify.min',
        'bootstrap.switch': '../../bootstrap/components/switch/js/bootstrap-switch.min',
        'createjs.easel': '../lib/createjs.easel-NEXT.min',
        'createjs.tween': '../lib/createjs.tween-NEXT.min',
        modernizr: '../lib/modernizr.custom-2.8.2.min',
        moment: '../lib/moment-2.7.0.min',
        'moment-timezone': '../lib/moment.timezone-0.1.0.min',
        jasmine: '../../test/lib/jasmine',
        'jasmine-html': '../../test/lib/jasmine-html',
        'jasmine-boot': '../../test/lib/boot',
        jquery: '../lib/jquery-1.11.1.min',
        'jquery.mobile': '../lib/jquery.mobile.custom.min',
        'jquery.ui': '../lib/jquery.ui.custom-1.10.4.min',
        raygun: '../lib/raygun-1.8.4.min',
        'require.locale': '../lib/require.i18n-2.0.4',
        'require.text': '../lib/require.text-2.0.12',
        underscore: '../lib/lodash.compat-2.4.1.min'
    },
    shim: {
        bootstrap: ['jquery'],
        'bootstrap.notify': ['bootstrap'],
        'bootstrap.switch': ['bootstrap'],
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        },
        'jasmine-boot': {
            deps: ['jasmine', 'jasmine-html'],
            exports: 'jasmine'
        },
        'jquery.mobile': ['jquery'],
        'jquery.ui': ['jquery'],
        'moment-timezone': ['moment']
    },
    urlArgs: function() {
        if (document.location.hostname === 'localhost') {
            return "bust=" + (new Date()).getTime();
        }
    }(),
    waitSeconds: 120
});

//creates the global skritter namespace
window.skritter = (function(skritter) {
    skritter._vars = {};
    skritter._vars.languageCode = '@@languageCode';
    skritter._vars.trackingID = '@@trackingID';
    skritter._vars.version = '@@version';
    return skritter;
})(window.skritter || {});
window.skritter.getLanguageCode = function() {
    var languageCode = skritter._vars.languageCode;
    return languageCode.indexOf('@@') === -1 ? languageCode : undefined;
};
window.skritter.getTrackingID = function() {
    return skritter._vars.trackingID;
};
window.skritter.getVersion = function() {
    var version = skritter._vars.version;
    return version.indexOf('@@') === -1 ? version : 'edge';
};

requirejs(['Libraries'], function() {
    //main run function that loads application specific files
    var run = function() {
        //load analytics tracking before initialize
        if (window.cordova) {
            navigator.analytics.startTrackerWithId(skritter.getTrackingID());
        }
        //load raygun error tracking as guest
        if (window.Raygun) {
            if (window.cordova) {
                Raygun.init('906oc84z1U8uZga3IJ9uPw==').attach();
                Raygun.setUser('guest');
                Raygun.setVersion(window.skritter.getVersion());
            } else {
                //TODO: load tracking for other environments
            }
        }
        //load the application module
        requirejs(['Application'], function(Application) {
            $(document).ready(function() {
                Application.initialize();
            });
        });
    };
    //checks for cordova and runs the application when ready
    if (window.cordova) {
        document.addEventListener('deviceready', run, false);
    } else {
        run();
    }
});