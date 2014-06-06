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
        'bootstrap.switch': '../../bootstrap/components/switch/js/bootstrap-switch.min',
        'createjs.easel': '../lib/createjs.easel-NEXT.min',
        'createjs.tween': '../lib/createjs.tween-NEXT.min',
        moment: '../lib/moment-2.6.0.min',
        'moment.timezone': '../lib/moment.timezone-0.0.6.min',
        'moment.timezone.data': '../lib/moment.timezone.data',
        fastclick: '../lib/fastclick-1.0.2',
        jasmine: '../../test/lib/jasmine',
        'jasmine-html': '../../test/lib/jasmine-html',
        'jasmine-boot': '../../test/lib/boot',
        jquery: '../lib/jquery-1.11.1.min',
        'jquery.mobile': '../lib/jquery.mobile.custom.min',
        'jquery.ui': '../lib/jquery.ui.custom-1.10.4.min',
        raygun: '../lib/raygun-1.8.4.min',
        'require.locale': '../lib/require.i18n-2.0.4',
        'require.text': '../lib/require.text-2.0.10',
        underscore: '../lib/lodash.compat-2.4.1.min'
    },
    shim: {
        bootstrap: ['jquery'],
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
        'jquery.ui': ['jquery']
    },
    urlArgs: "bust=" +  (new Date()).getTime(),
    waitSeconds: 120
});

requirejs(['Libraries'], function() {
    //main run function that loads application specific files
    var run = function() {
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