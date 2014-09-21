/**
 * @module Application
 * @class Bootstrap
 */
define(function() {
    /**
     * @method alert
     * @param {String} html
     * @param {Object} [options]
     * @returns {String}
     */
    var alert = function(html, options) {
        html = html ? html : '';
        options = options ? options : {};
        options.dismissible = options.dismissible ? ' alert-dismissible' : '';
        options.level = options.level ? options.level : 'info';
        var div = "<div class='alert alert-" + options.level + options.dismissible + "' role='alert'>";
        if (options.dismissible) {
            div += "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>";
        }
        div += html;
        div += "</div>";
        return div;
    };

    return {
        alert: alert
    };
});
