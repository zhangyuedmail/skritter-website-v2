/**
 * @module Application
 */
define([], function() {
    /**
     * @method addAllObjectAttributes
     * @param {Array} array
     * @param {String} attribute
     * @returns {Number}
     */
    function addAllObjectAttributes(array, attribute) {
        var total = 0;
        for (var i = 0, length = array.length; i < length; i++) {
            if (array[i][attribute]) {
                total += array[i][attribute];
            }
        }
        return total;
    }
    /**
     * @method convertBytesToSize
     * @param {Number} bytes
     * @returns {String}
     */
    function convertBytesToSize(bytes) {
        var sizes = ["B", "KB", "MB", "GB", "TB"];
        if (bytes > 0) {
            var value = parseFloat(Math.floor(Math.log(bytes) / Math.log(1024)));
            return (bytes / Math.pow(1024, value)).toFixed(2) + " " + sizes[value];
        }
        return "0 B";
    }
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
        addAllObjectAttributes: addAllObjectAttributes,
        convertBytesToSize: convertBytesToSize,
        mergeObjectArrays: mergeObjectArrays
    };
});