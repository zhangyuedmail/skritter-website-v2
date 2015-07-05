var GelatoComponent = require('gelato/modules/component');

/**
 * @class PromptToolbar
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @param {Object} [options]
     * @constructor
     */
    initialize: function(options) {
        options = options || {};
        this.prompt = options.prompt;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/prompt-toolbar/template'),
    /**
     * @method render
     * @returns {PromptToolbar}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'vclick #toolbar-correct': 'handleClickOptionCorrect',
        'vclick #toolbar-erase': 'handleClickOptionErase',
        'vclick #toolbar-show': 'handleClickOptionShow',
        'vclick #toolbar-stroke-order': 'handleClickOptionTeach'
    },
    /**
     * @method disable
     */
    disable: function() {
        this.$('button i').addClass('disabled');
    },
    /**
     * @method disableCorrect
     */
    disableCorrect: function() {
        this.$('#toolbar-correct i').addClass('disabled');
    },
    /**
     * @method disableErase
     */
    disableErase: function() {
        this.$('#toolbar-erase i').addClass('disabled');
    },
    /**
     * @method disableShow
     */
    disableShow: function() {
        this.$('#toolbar-show i').addClass('disabled');
    },
    /**
     * @method disableStrokeOrder
     */
    disableStrokeOrder: function() {
        this.$('#toolbar-stroke-order i').addClass('disabled');
    },
    /**
     * @method enable
     */
    enable: function() {
        this.$('button i').removeClass('disabled');
    },
    /**
     * @method enableCorrect
     */
    enableCorrect: function() {
        this.$('#toolbar-correct i').removeClass('disabled');
    },
    /**
     * @method enableErase
     */
    enableErase: function() {
        this.$('#toolbar-erase i').removeClass('disabled');
    },
    /**
     * @method enableShow
     */
    enableShow: function() {
        this.$('#toolbar-show i').removeClass('disabled');
    },
    /**
     * @method enableStrokeOrder
     */
    enableStrokeOrder: function() {
        this.$('#toolbar-stroke-order i').removeClass('disabled');
    },
    /**
     * @method handleClickOptionCorrect
     * @param {Event} event
     */
    handleClickOptionCorrect: function(event) {
        event.preventDefault();
        var review = this.prompt.review();
        if (review.get('score') < 2) {
            review.set('score', 3);
            this.prompt.grading.select(3);
            this.toggleCorrect();
        } else {
            review.set('score', 1);
            this.prompt.grading.select(1);
            this.toggleIncorrect();
        }
    },
    /**
     * @method handleClickOptionErase
     * @param {Event} event
     */
    handleClickOptionErase: function(event) {
        event.preventDefault();
        this.prompt.erase();
    },
    /**
     * @method handleClickOptionShow
     * @param {Event} event
     */
    handleClickOptionShow: function(event) {
        event.preventDefault();
        this.prompt.reveal();
    },
    /**
     * @method handleClickOptionTeach
     * @param {Event} event
     */
    handleClickOptionTeach: function(event) {
        event.preventDefault();
        this.prompt.enableTeaching();
    },
    /**
     * @method toggleCorrect
     */
    toggleCorrect: function() {
        this.$('#toolbar-correct i').removeClass('icon-study-incorrect');
        this.$('#toolbar-correct i').addClass('icon-study-correct');
    },
    /**
     * @method toggleIncorrect
     */
    toggleIncorrect: function() {
        this.$('#toolbar-correct i').removeClass('icon-study-correct');
        this.$('#toolbar-correct i').addClass('icon-study-incorrect');
    }
});