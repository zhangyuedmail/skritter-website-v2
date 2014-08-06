window.app = (function() {
    return {
        config: {
            core: {
                deps: ["jquery", "underscore"],
                paths: {
                    //directories
                    "app": "www/js/app",
                    "framework": "framework/js/core",
                    "framework.specs": "framework/specs",
                    "libs": "www/js/libs",
                    "specs": "www/specs",
                    "templates": "www/templates",
                    //core libraries
                    "backbone": "framework/js/libs/backbone-1.1.2.min",
                    "backbone.routefilter": "framework/js/libs/backbone.routefilter-0.2.0.min",
                    "bootstrap": "framework/bootstrap/js/bootstrap.min",
                    "bootstrap.switch": "framework/bootstrap/components/switch/js/bootstrap-switch.min",
                    "handlebars": "framework/js/libs/handlebars-1.3.0",
                    "jquery": "framework/js/libs/jquery-1.11.1.min",
                    "jquery.mobile.touch": "framework/js/libs/jquery.mobile.touch-1.4.3.min",
                    "jquery.ui.effects": "framework/js/libs/jquery.ui.effects-1.11.0.min",
                    "modernizr": "framework/js/libs/modernizr.custom-2.8.3.min",
                    "require.i18n": "framework/js/libs/requirejs.i18n-2.0.4",
                    "require.text": "framework/js/libs/requirejs.text-2.0.12",
                    "underscore": "framework/js/libs/lodash-2.4.1.min"
                },
                shim: {
                    //core shims
                    "backbone.routefilter": ["backbone"],
                    "bootstrap.switch": ["bootstrap"]
                }
            }
        }
    };
}());