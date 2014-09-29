/**
 * @module Application
 * @class Kana
 */
define([], function() {
    /**
     * @property data
     * @type Array
     */
    var data = [
        {
            "lang": "ja",
            "rune": "あ",
            "kana": true,
            "strokes": [
                [
                    [600, 0.23, 0.318, 0.5, 0.5, 0],
                    [601, 0.41, 0.11, 0.5, 0.5, 0],
                    [602, 0.17, 0.436, 0.5, 0.5, 0]
                ]
            ]
        }
    ];
    /**
     * @method getData
     * @returns {Array}
     */
    function getData() {
        return data;
    }

    return {
        getData: getData
    };
});
