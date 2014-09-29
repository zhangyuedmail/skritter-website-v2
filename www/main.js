(function() {

    requirejs.config({
        baseUrl: './',
        callback: loadLibraries,
        locale: undefined,
        paths: app.configs.paths,
        shim: app.configs.shim,
        urlArgs: app.isLocalhost() ? 'bust=' + (new Date()).getTime() : undefined
    });

    function loadLibraries() {
        requirejs(['application/Libraries'], function() {
            if (app.isNative()) {
                raygun.init('HovAfmmtQxgDLtXszGJ7NA==').attach().setUser('guest', true);
                requirejs(['cordova.js'], function() {
                    document.addEventListener('deviceready', loadApplication, false);
                });
            } else {
                $(document).ready(loadApplication);
            }
        });
    }

    function loadApplication() {
        requirejs(['application/Application'], function(Application) {
            window.plugins = $.extend({}, window.plugins);
            window.app = $.extend(new Application(), window.app);
            window.app.start();
        });
    }

})();