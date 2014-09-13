(function() {

    var config = app.configs.getCombined();

    require.config({
        baseUrl: '/base',
        callback: loaded,
        deps: config.deps,
        locale: "en-us",
        paths: config.paths,
        shim: config.shim,
        waitSeconds: 60
    });

    function loaded() {
        requirejs(["framework/Libraries"], function() {
            requirejs(["framework/Gelato", "app/Libraries"], function(Gelato) {
                window.gelato = new Gelato();
                requirejs([
                    "app/Application",
                    "require.i18n!www/locale/nls/strings"
                ], function(Application, i18n) {
                    window.app.strings = i18n;
                    window.app = $.extend(new Application(), window.app);
                    requirejs(["framework.specs/runner", "specs/runner"], function() {
                        window.__karma__.start();
                    });
                });
            });
        });
    }

})();