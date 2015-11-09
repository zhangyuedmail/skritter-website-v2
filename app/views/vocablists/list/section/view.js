var Page = require('base/page');

var DefaultNavbar = require('navbars/default/view');
var Editor = require('../editor/view');
var Vocablist = require('models/vocablist');
var VocablistSection = require('models/vocablist-section');
var User = require('models/user');

/**
 * @class VocablistsListPage
 * @extends {Page}
 */
module.exports = Page.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function(options) {
        this.vocablist = new Vocablist({id: options.vocablistId});
        this.vocablistSection = new VocablistSection({vocablistId: options.vocablistId, id: options.sectionId});
        this.editor = new Editor({vocablist: this.vocablist, vocablistSection: this.vocablistSection});
        this.navbar = new DefaultNavbar();
        async.series([
            _.bind(function(callback) {
                this.vocablist.fetch({
                    error: function(error) {
                        callback(error);
                    },
                    success: function() {
                        callback();
                    }
                });
            }, this),
            _.bind(function(callback) {
                this.vocablistSection.fetch({
                    error: function(error) {
                        callback(error);
                    },
                    success: function() {
                        callback();
                    }
                });
            }, this),
            _.bind(function(callback) {
                if (this.vocablistSection.has('rows')) {
                    this.vocablistSection.fetchVocabs({
                        error: function(error) {
                            callback(error);
                        },
                        success: function() {
                            callback();
                        }
                    });
                } else {
                    callback();
                }
            }, this)
        ], _.bind(function(error) {
            this.listenTo(this.vocablist, 'state:standby', this.handleVocablistState);
            this.render();
        }, this));
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'keydown #add-input': 'handleKeydownAddInput',
        'vclick #add-section': 'handleClickAddSection',
        'vclick #add-word': 'handleClickAddWord'
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Vocablist - Skritter',
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistsListPage}
     */
    render: function() {
        this.renderTemplate();
        this.editor.setElement('#editor-container').render();
        this.navbar.setElement('#navbar-container').render();
        if (this.vocablist.has('name')) {
            this.setTitle(this.vocablist.get('name') + ' - Vocablist - Skritter');
        }
        return this;
    },
    /**
     * @method handleClickAddSection
     * @param {Event} event
     */
    handleClickAddSection: function(event) {
        event.preventDefault();
        var $input = $(event.target);
        this.editor.addSection($input.val());
        $input.val('');
        $input.focus();
    },
    /**
     * @method handleClickAddWord
     * @param {Event} event
     */
    handleClickAddWord: function(event) {
        event.preventDefault();
        var $input = $(event.target);
        this.editor.addWord($input.val());
        $input.val('');
        $input.focus();
    },
    /**
     * @method handleKeydownAddInput
     * @param {Event} event
     */
    handleKeydownAddInput: function(event) {
        if (event.keyCode === 13) {
            var $input = $(event.target);
            this.editor.addWord($(event.target).val());
            $input.val('');
            $input.focus();
        }
    },
    /**
     * @method handleVocablistState
     */
    handleVocablistState: function() {
        this.render();
    },
    /**
     * @method remove
     * @returns {VocablistsListPage}
     */
    remove: function() {
        this.editor.remove();
        this.navbar.remove();
        return Page.prototype.remove.call(this);
    }
});
