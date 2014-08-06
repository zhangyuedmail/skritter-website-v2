(function() {

    function mergeConfigs(config1, config2) {
        for (var key in config2) {
            config1[key] = config2[key];
        }
        return config1;
    }

    requirejs.config({
        baseUrl: "./",
        callback: loaded,
        deps: app.config.core.deps.concat(app.config.optional.deps),
        locale: "en-us",
        paths: mergeConfigs(app.config.core.paths, app.config.optional.paths),
        shim: mergeConfigs(app.config.core.shim, app.config.optional.shim),
        urlArgs: function() {
            if (document.location.hostname === "localhost") {
                return "bust=" + (new Date()).getTime();
            }
        }(),
        waitSeconds: 60
    });

    function loaded() {
        requirejs(["framework/Libraries"], function() {
            function initializeApplication() {
                requirejs([
                    "app/Application",
                    "app/Router",
                    "require.i18n!www/locale/nls/strings"
                ], function(Application, Router, i18n) {
                    window.app.strings = i18n;
                    window.app.router = new Router();
                    window.app = $.extend(new Application(), window.app);
                    Backbone.history.start();
                });
            }
            function initializeTests() {
                requirejs([
                    "app/Application",
                    "require.i18n!www/locale/nls/strings"
                ], function(Application, i18n) {
                    window.app.strings = i18n;
                    window.app = $.extend(new Application(), window.app);
                    requirejs([
                        "framework.specs/runner",
                        "specs/runner"
                    ], function() {
                        window.executeTests();
                    });
                });
            }
            requirejs(["framework/Gelato", "app/Libraries"], function(Gelato) {
                window.gelato = new Gelato();
                if (document.location.pathname.indexOf("tests.html") !== -1) {
                    initializeTests();
                } else {
                    if (gelato.isNative()) {
                        document.addEventListener("deviceready", initializeApplication, false);
                        requirejs(["cordova.js"]);
                    } else {
                        initializeApplication();
                    }
                }
            });
        });
    }

})();