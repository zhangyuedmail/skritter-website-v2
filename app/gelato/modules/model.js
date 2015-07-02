/**
 * @class GelatoModel
 * @extends {Backbone.Model}
 */
module.exports = Backbone.Model.extend({
    /**
     * @method equals
     * @param {String} attribute
     * @param {Number|String} value
     * @returns {Boolean}
     */
    equals: function(attribute, value) {
        return this.get(attribute) === value;
    }
});
