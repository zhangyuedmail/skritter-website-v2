var Page = require('base/page');

var DefaultNavbar = require('navbars/default/view');
var EditorRows = require('../editor-rows/view');
var Vocablist = require('models/vocablist');
var VocablistSection = require('models/vocablist-section');
var User = require('models/user');

/**
 * @class VocablistsListSectionPage
 * @extends {Page}
 */
module.exports = Page.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function(options) {
        this.editing = false;
        this.vocablist = new Vocablist({id: options.vocablistId});
        this.vocablistSection = new VocablistSection({vocablistId: options.vocablistId, id: options.sectionId});
        this.editor = new EditorRows({vocablist: this.vocablist, vocablistSection: this.vocablistSection});
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
                this.editor.loadRows({
                    error: function(error) {
                        callback(error);
                    },
                    success: function() {
                        callback();
                    }
                });
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
        'vclick #discard-changes': 'handleClickDiscardChanges',
        'vclick #edit-section': 'handleClickEditSection',
        'vclick #save-changes': 'handleClickSaveChanges'
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
     * @returns {VocablistsListSectionPage}
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
     * @method handleClickDiscardChanges
     * @param {Event} event
     */
    handleClickDiscardChanges: function(event) {
        event.preventDefault();
        this.editor.discardChanges();
    },
    /**
     * @method handleClickEditSection
     * @param {Event} event
     */
    handleClickEditSection: function(event) {
        event.preventDefault();
        if (this.editing) {
            this.editing = false;
            this.vocablistSection.set('name', this.$('#section-name').val());
            this.vocablistSection.save();
        } else {
            this.editing = true;
        }
        this.render();
    },
    /**
     * @method handleClickSaveChanges
     * @param {Event} event
     */
    handleClickSaveChanges: function(event) {
        event.preventDefault();
        this.vocablistSection.set('rows', this.editor.rows);
        this.vocablistSection.save();
    },
    /**
     * @method handleKeydownAddInput
     * @param {Event} event
     */
    handleKeydownAddInput: function(event) {
        if (event.keyCode === 13) {
            var $input = $(event.target);
            this.editor.addRow($(event.target).val());
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
     * @returns {VocablistsListSectionPage}
     */
    remove: function() {
        this.editor.remove();
        this.navbar.remove();
        return Page.prototype.remove.call(this);
    }
});
