var GelatoComponent = require('gelato/component');

/**
 * @class PromptDetails
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
    template: require('components/prompt-details/template'),
    /**
     * @method render
     * @returns {PromptDetails}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method renderFields
     * @returns {PromptDetails}
     */
    renderFields: function() {
        this.$('#vocab-definition .value').html(this.prompt.reviews.vocab.getDefinition());

        var mnemonic = this.prompt.reviews.vocab.getMnemonicText();
        if (mnemonic) {
            this.hideMnemonic();
            this.$('#vocab-mnemonic .value').html(mnemonic);
        } else {
            this.$('#vocab-mnemonic').hide();
        }

        this.$('#vocab-reading .value').html(this.prompt.reviews.vocab.getReadingElement());

        var sentence = this.prompt.reviews.vocab.getSentenceWriting();
        if (sentence) {
            this.hideSentence();
            this.$('#vocab-sentence .value').addClass(this.prompt.reviews.vocab.getFontClass());
            this.$('#vocab-sentence .value').html(sentence);
        } else {
            this.$('#vocab-sentence').hide();
        }

        this.$('#vocab-style .value').html(this.prompt.reviews.vocab.getStyle());
        this.$('#vocab-writing .value').addClass(this.prompt.reviews.vocab.getFontClass());
        this.$('#vocab-writing .value').html(this.prompt.reviews.vocab.getWritingElement());
        this.updateDetailBanned();
        this.updateDetailStarred();
        return this;
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'vclick #vocab-mnemonic button': 'handleClickRevealMnemonic',
        'vclick #vocab-sentence button': 'handleClickRevealSentence',
        'vclick #button-detail-audio': 'handleClickDetailAudio',
        'vclick #button-detail-ban': 'handleClickDetailBan',
        'vclick #button-detail-edit': 'handleClickDetailEdit',
        'vclick #button-detail-info': 'handleClickDetailInfo',
        'vclick #button-detail-star': 'handleClickDetailStar',
        'vclick #vocab-writing .writing-element': 'handleClickWritingElement'
    },
    /**
     * @method handleClickDetailAudio
     * @param {Event} event
     */
    handleClickDetailAudio: function(event) {
        event.preventDefault();
        this.prompt.reviews.vocab.play();
    },
    /**
     * @method handleClickDetailBan
     * @param {Event} event
     */
    handleClickDetailBan: function(event) {
        event.preventDefault();
        this.prompt.reviews.vocab.toggleBanned();
        this.updateDetailBanned();
    },
    /**
     * @method handleClickDetailEdit
     * @param {Event} event
     */
    handleClickDetailEdit: function(event) {
        event.preventDefault();
    },
    /**
     * @method handleClickDetailInfo
     * @param {Event} event
     */
    handleClickDetailInfo: function(event) {
        event.preventDefault();
        app.openDialog('vocab');
        app.dialog.set(this.prompt.reviews.vocab.id);
    },
    /**
     * @method handleClickDetailStar
     * @param {Event} event
     */
    handleClickDetailStar: function(event) {
        event.preventDefault();
        this.prompt.reviews.vocab.toggleStarred();
        this.updateDetailStarred();
    },
    /**
     * @method handleClickRevealMnemonic
     * @param {Event} event
     */
    handleClickRevealMnemonic: function(event) {
        event.preventDefault();
        this.showMnemonic();
    },
    /**
     * @method handleClickRevealSentence
     * @param {Event} event
     */
    handleClickRevealSentence: function(event) {
        event.preventDefault();
        this.showSentence();
    },
    /**
     * @method handleClickWritingElement
     * @param {Event} event
     */
    handleClickWritingElement: function(event) {
        event.preventDefault();
        var $element = $(event.currentTarget);
        this.prompt.reviews.position = parseInt($element.data('position'), 10);
        this.prompt.renderPrompt();
    },
    /**
     * @method hideDefinition
     */
    hideDefinition: function() {
        this.$('#vocab-definition .value').hide();
    },
    /**
     * @method hideMnemonic
     */
    hideMnemonic: function() {
        this.$('#vocab-mnemonic .button').show();
        this.$('#vocab-mnemonic .value').hide();
    },
    /**
     * @method hideReading
     * @param {Number} [position]
     */
    hideReading: function(position) {
        if (position !== undefined) {
            this.$('#vocab-reading .segment[data-segment="' + position + '"]').addClass('mask');
        } else {
            this.$('#vocab-reading .segment').addClass('mask');
        }
    },
    /**
     * @method hideReadingTone
     * @param {Number} [position]
     */
    hideReadingTone: function(position) {
        if (position !== undefined) {
            this.$('#vocab-reading .segment[data-segment="' + position + '"] .raw').removeClass('hidden');
            this.$('#vocab-reading .segment[data-segment="' + position + '"] .tone').addClass('hidden');
        } else {
            this.$('#vocab-reading .segment .raw').removeClass('hidden');
            this.$('#vocab-reading .segment .tone').addClass('hidden');
        }
    },
    /**
     * @method hideSentence
     */
    hideSentence: function() {
        this.$('#vocab-sentence .button').show();
        this.$('#vocab-sentence .value').hide();
    },
    /**
     * @method hideWriting
     * @param {Number} [position]
     */
    hideWriting: function(position) {
        if (position !== undefined) {
            this.$('#writing-reading [data-position="' + position + '"]').addClass('mask');
        } else {
            this.$('#writing-reading .writing-element').addClass('mask');
        }
    },
    /**
     * @method showDefinition
     */
    showDefinition: function() {
        this.$('#vocab-definition .value').show();
    },
    /**
     * @method showMnemonic
     */
    showMnemonic: function() {
        this.$('#vocab-mnemonic .button').hide();
        this.$('#vocab-mnemonic .value').show();
    },
    /**
     * @method showReading
     * @param {Number} [position]
     */
    showReading: function(position) {
        if (position !== undefined) {
            this.$('#vocab-reading .segment[data-segment="' + position + '"]').removeClass('mask');
        } else {
            this.$('#vocab-reading .segment').removeClass('mask');
        }
    },
    /**
     * @method showReadingTone
     * @param {Number} [position]
     */
    showReadingTone: function(position) {
        if (position !== undefined) {
            this.$('#vocab-reading .segment[data-segment="' + position + '"] .raw').addClass('hidden');
            this.$('#vocab-reading .segment[data-segment="' + position + '"] .tone').removeClass('hidden');
        } else {
            this.$('#vocab-reading .segment .raw').addClass('hidden');
            this.$('#vocab-reading .segment .tone').removeClass('hidden');
        }
    },
    /**
     * @method showSentence
     */
    showSentence: function() {
        this.$('#vocab-sentence .button').hide();
        this.$('#vocab-sentence .value').show();
    },
    /**
     * @method showWriting
     * @param {Number} [position]
     */
    showWriting: function(position) {
        if (position === undefined) {
            this.$('#vocab-writing .writing-element').removeClass('mask');
        } else {
            this.$('#vocab-writing [data-position="' + position + '"]').removeClass('mask');
        }
    },
    /**
     * @method selectWriting
     * @param {Number} position
     */
    selectWriting: function(position) {
        this.$('#vocab-writing .writing-element').removeClass('active');
        this.$('#vocab-writing [data-position="' + position + '"]').addClass('active');
    },
    /**
     * @method updateDetailBanned
     */
    updateDetailBanned: function() {
        if (this.prompt.reviews.vocab.isBanned()) {
            this.$('#button-detail-ban').css('background-color', 'red');
        } else {
            this.$('#button-detail-ban').css('background-color', '');
        }
    },
    /**
     * @method updateDetailStarred
     */
    updateDetailStarred: function() {
        if (this.prompt.reviews.vocab.isStarred()) {
            this.$('#button-detail-star').removeClass('fa-star-o');
            this.$('#button-detail-star').addClass('fa-star text-gold');
        } else {
            this.$('#button-detail-star').removeClass('fa-star text-gold');
            this.$('#button-detail-star').addClass('fa-star-o');
        }
    }
});