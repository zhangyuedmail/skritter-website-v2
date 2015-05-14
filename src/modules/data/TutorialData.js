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
            blurbHeader: 'Stroke Order Help',
            blurbImage: '<img src="http://placehold.it/20x20" alt="">',
            blurbText: 'Ever wondered about stroke order? Skritter clears up any such questions.',
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
            blurbHeader: 'Smart Flashcards',
            blurbImage: '<img src="http://placehold.it/20x20" alt="">',
            blurbText: 'Skritter gives you immediate stroke-level feedback and helps you review hard characters more often.',
            content: 'Center verticals before outside wings.',
            module: 'chinese-stroke-order',
            part: 'rune',
            title: 'Stroke Order - Rule #5',
            vocabId: 'zh-水-0'
        },
        {
            blurbHeader: 'Efficient Reviewing',
            blurbImage: '<img src="http://placehold.it/20x20" alt="">',
            blurbText: 'Learn new characters in less than a minute, and remember 95% of what you learn.',
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
            blurbHeader: 'Brian Jackson (Economist, Alaska)',
            blurbImage: '<img src="http://placehold.it/20x20" alt="">',
            blurbText: 'Learning to write Chinese characters has never been so fun. From writing zero to 2000+ characters in six months!',
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
            blurbHeader: 'Tone Practice',
            blurbImage: '<img src="http://placehold.it/20x20" alt="">',
            blurbText: 'Draw the tone marks for each character to enhance your comprehension.',
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