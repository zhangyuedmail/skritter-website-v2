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
            content: 'Write top to bottom, left to right.',
            module: 'chinese-stroke-order',
            part: 'rune',
            title: 'Stroke Order - Rule #1',
            vocabId: 'zh-一-0'
        },
        {
            content: 'Horizontal strokes first.',
            module: 'chinese-stroke-order',
            part: 'rune',
            title: 'Stroke Order - Rule #2',
            vocabId: 'zh-十-0'
        },
        {
            content: 'Cutting strokes last.',
            module: 'chinese-stroke-order',
            part: 'rune',
            title: 'Stroke Order - Rule #3',
            vocabId: 'zh-羊-0'
        },
        {
            content: 'Diagonals right-to-left, then diagonals left-to-right.',
            module: 'chinese-stroke-order',
            part: 'rune',
            title: 'Stroke Order - Rule #4',
            vocabId: 'zh-父-0'
        },
        {
            content: 'Center verticals before outside wings.',
            module: 'chinese-stroke-order',
            part: 'rune',
            title: 'Stroke Order - Rule #5',
            vocabId: 'zh-水-0'
        },
        {
            content: 'Outside before inside.',
            module: 'chinese-stroke-order',
            part: 'rune',
            title: 'Stroke Order - Rule #6',
            vocabId: 'zh-用-0'
        },
        {
            content: 'Left vertical, then enclosing.',
            module: 'chinese-stroke-order',
            part: 'rune',
            title: 'Stroke Order - Rule #7',
            vocabId: 'zh-口-0'
        },
        {
            content: 'Bottom enclosing line last.',
            module: 'chinese-stroke-order',
            part: 'rune',
            title: 'Stroke Order - Rule #8',
            vocabId: 'zh-回-0'
        },
        {
            content: 'Dots and minor strokes last.',
            module: 'chinese-stroke-order',
            part: 'rune',
            title: 'Stroke Order - Rule #9',
            vocabId: 'zh-点-0'
        },
        {
            content: '',
            module: 'chinese-tones',
            part: 'tone',
            title: 'Tones - 1st',
            vocabId: 'zh-天-0'
        },
        {
            content: '',
            module: 'chinese-tones',
            part: 'tone',
            title: 'Tones - 2nd',
            vocabId: 'zh-人-0'
        },
        {
            content: '',
            module: 'chinese-tones',
            part: 'tone',
            title: 'Tones - 3rd',
            vocabId: 'zh-有-0'
        },
        {
            content: '',
            module: 'chinese-tones',
            part: 'tone',
            title: 'Tones - 4th',
            vocabId: 'zh-不-0'
        },
        {
            content: '',
            module: 'chinese-tones',
            part: 'tone',
            title: 'Tones - Neutral',
            vocabId: 'zh-吗-0'
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