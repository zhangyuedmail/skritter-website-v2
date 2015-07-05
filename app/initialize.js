var Application = require('application');
var Functions = require('functions');
var Router = require('router');

module.exports = (function() {

    $(document).ready(function(){
        window.app = new Application();
        window.app.fn = Functions;
        window.app.router = new Router();
        window.app.start();
    });

})();
