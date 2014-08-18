app ? app.configs.optional = {
    deps: [],
    paths: {
        //optional libraries
        "async": "www/js/libs/async-0.9.0.min",
        "chart": "www/js/libs/chartjs-1.0.1.min",
        "createjs.easel": "www/js/libs/createjs.easel-NEXT.min",
        "createjs.tween": "www/js/libs/createjs.tween-NEXT.min",
        "moment": "www/js/libs/moment-2.8.1",
        "moment.timezone": "www/js/libs/moment.timezone-0.2.1"
    },
    shim: {
        //optional shims
        "moment.timezone": ["moment"]
    }
} : {};