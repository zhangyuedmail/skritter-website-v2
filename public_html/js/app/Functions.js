define([], function() {
    /**
     * @method convertBytesToSize
     * @param {Number} bytes
     * @returns {String}
     */
    var convertBytesToSize = function(bytes) {
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes > 0) {
            var value = window.parseFloat(Math.floor(Math.log(bytes) / Math.log(1024)));
            return (bytes / Math.pow(1024, value)).toFixed(2) + ' ' + sizes[value];
        }
    };
    /**
     * @method getGuid
     * @returns {String}
     */
    var getGuid = function() {
        return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
    };
    /**
     * @method getUnixTime
     * @param {Boolean} formatMilliseconds
     * @returns {Number}
     */
    var getUnixTime = function(formatMilliseconds) {
        return formatMilliseconds ? new Date().getTime() : Math.round(new Date().getTime() / 1000);
    };
    /**
     * @method hasCordova
     * @returns {Boolean}
     */
    var hasCordova = function() {
        return window.cordova ? true : false;
    };
    /**
     * @method isKana
     * @param {String} text
     * @returns {Boolean}
     */
    var isKana = function(text) {
        var chars = text.split('');
        if (chars.length === 0) {
            return false;
        } else {
            for (var i = 0, length = chars.length; i < length; i++) {
                var charCode = text.charCodeAt(i);
                if (!(charCode >= 12353 && charCode <= 12436) && !(charCode >= 12449 && charCode <= 12540) && charCode !== 65374) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * @method isNumber
     * @param {Number} number
     * @returns {Boolean}
     */
    var isNumber = function(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    };

    return {
        convertBytesToSize: convertBytesToSize,
        getGuid: getGuid,
        getUnixTime: getUnixTime,
        hasCordova: hasCordova,
        isKana: isKana,
        isNumber: isNumber
    };
});