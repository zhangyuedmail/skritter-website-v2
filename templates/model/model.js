var GelatoModel = require('gelato/model');

/**
 * @class Model
 * @extends {GelatoModel}
 */
var Model = GelatoModel.extend({
    /**
     * @method initialize
     * @param {Object} [attributes]
     * @param {Object} [options]
     * @constructor
     */
    initialize: function(attributes, options) {},
    /**
     * @method defaults
     * @returns {Function|Object}
     */
    defaults: function() {
        return {};
    },
    /**
     * @property idAttribute
     * @type {String}
     */
    idAttribute: 'id'

});

module.exports = Model;
