/**
 * @module Application
 */
define([], function() {
    /**
     * @method mergeObjectArrays
     * @param {Object} object1
     * @param {Object} object2
     * @returns {Object}
     */
    function mergeObjectArrays(object1, object2) {
        for (var key in object2) {
            if (object1[key]) {
                if (Array.isArray(object1[key])) {
                    object1[key] = object1[key].concat(object2[key]);
                } else {
                    object1[key] = object2[key];
                }
            } else {
                object1[key] = object2[key];
            }
        }
        return object1;
    }

    return {
        mergeObjectArrays: mergeObjectArrays
    }
});