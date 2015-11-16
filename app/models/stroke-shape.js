var Model = require('base/model');

/**
 * @class StrokeShape
 * @extends {Model}
 */
module.exports = Model.extend({
    /**
     * @property idAttribute
     * @type {String}
     */
    idAttribute: 'id',
    /**
     * @method defaults
     * @returns {Object}
     */
    defaults: function () {
        return {
            contains: [],
            corners: [],
            strokeId: undefined
        };
    }
});
