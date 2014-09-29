app = (function() {
    return {
        configs: {
            core: {
                deps: ["jquery", "underscore"],
                modules: [
                    {
                        name: "framework/Libraries",
                        exclude: ["jquery", "underscore"]
                    },
                    {
                        name: "app/Application"
                    },
                    {
                        name: "app/Libraries"
                    }
                ],
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
            },
            getCombined: function() {
                function clone(object) {
                    var clonedObject = {};
                    for (var key in object) {
                        clonedObject[key] = object[key];
                    }
                    return clonedObject;
                }
                function merge(object1, object2) {
                    for (var key in object2) {
                        if (["deps"].indexOf(key) > -1) {
                            object1[key] = object1[key].concat(object2[key]);
                        } else if (object2[key]) {
                            if (object1[key] && typeof object2[key] === "object") {
                                merge(object1[key], object2[key]);
                            } else {
                                object1[key] = object2[key];
                            }
                        } else {
                            object1[key] = object2[key];
                        }
                    }

                    return object1;
                }
                return merge(clone(this.core), clone(this.optional));
            }
        }
    };
}());