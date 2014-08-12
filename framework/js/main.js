(function() {

    var config = app.configs.getCombined();

    requirejs.config({
        baseUrl: "./",
        callback: loaded,
        deps: config.deps,
        locale: "en-us",
        paths: config.paths,
        shim: config.shim,
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
                    "app/Application"
                ], function(Application) {
                    window.app = $.extend(new Application(), window.app);
                    Backbone.history.start();
                });
            }
            function initializeTests() {
                requirejs([
                    "app/Application"
                ], function(Application) {
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