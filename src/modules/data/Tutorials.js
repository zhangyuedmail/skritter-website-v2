/**
 * @module Application
 * @submodule Data
 * @class Tutorials
 */
define([], function() {

    /**
     * @property data
     * @type Array
     */
    var data = [
        {
            id: 1,
            content: 'Write top to bottom, left to right.',
            language: 'chinese',
            title: 'Stroke Order - Rule #1',
            vocabId: 'zh-一-0'
        },
        {
            id: 2,
            content: 'Horizontal strokes first.',
            language: 'chinese',
            title: 'Stroke Order - Rule #2',
            vocabId: 'zh-十-0'
        },
        {
            id: 3,
            content: 'Cutting strokes last.',
            language: 'chinese',
            title: 'Stroke Order - Rule #3',
            vocabId: 'zh-羊-0'
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