/**
 * @module Skritter
 * @author Joshua McFarland
 */
requirejs.config({
    baseUrl: 'js/app',
    locale: 'en-us',
    paths: {
        //directories
        template: '../../template',
        spec: '../../test/spec',
        //libraries
        async: '../lib/async-0.8.0',
        jasmine: '../../test/lib/jasmine',
        'jasmine-html': '../../test/lib/jasmine-html',
        'jasmine-boot': '../../test/lib/boot',
        moment: '../lib/moment-2.6.0.min',
        'require.locale': '../lib/require.i18n-2.0.4',
        'require.text': '../lib/require.text-2.0.10'
    },
    shim: {
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
        }
    },
    waitSeconds: 120
});

requirejs(['Libraries'], function() {
    //main run function that loads application specific files
    function run() {
        requirejs(['Application'], function(Application) {
            $(document).ready(function() {
                Application.initialize();
            });
        });
    }
    //checks for cordova and runs the application when ready
    if (window.cordova) {
        document.addEventListener('deviceready', run, false);
    } else {
        run();
    }
});