(function() {

    function mergeConfigs(config1, config2) {
        for (var key in config2) {
            config1[key] = config2[key];
        }
        return config1;
    }

    require.config({
        baseUrl: '/base',
        callback: loaded,
        deps: app.config.core.deps.concat(app.config.optional.deps),
        locale: "en-us",
        paths: mergeConfigs(app.config.core.paths, app.config.optional.paths),
        shim: mergeConfigs(app.config.core.shim, app.config.optional.shim),
        waitSeconds: 60
    });

    function loaded() {
        requirejs(["framework/Libraries"], function() {
            requirejs(["framework/Gelato", "app/Libraries"], function(Gelato) {
                window.gelato = new Gelato();
                requirejs([
                    "app/Application",
                    "requirejs.i18n!www/locale/nls/strings"
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