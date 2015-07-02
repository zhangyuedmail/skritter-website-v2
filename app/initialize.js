var Application = require('application');
var Router = require('router');

module.exports = (function() {

    $(document).ready(function(){
        window.app = new Application();
        window.app.router = new Router();
        window.app.start();
    });

})();
