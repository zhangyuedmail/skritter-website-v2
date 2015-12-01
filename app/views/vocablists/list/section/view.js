var GelatoPage = require('gelato/page');

var DefaultNavbar = require('navbars/default/view');
var EditorRows = require('../editor-rows/view');
var Vocablist = require('models/vocablist');
var VocablistSection = require('models/vocablist-section');
var User = require('models/user');

/**
 * @class VocablistsListSectionPage
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
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
            /**
            _.bind(function(callback) {
                this.vocablistSection.save({name: 'Section 3'}, {
                    error: function(error) {
                        callback(error);
                    },
                    success: function() {
                        callback();
                    }
                });
            }, this),
             **/
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
            document.title = this.vocablist.get('name') + ' - Vocablist - Skritter';
        }
        return this;
    },
    /**
     * @method handleClickDiscardChanges
     * @param {Event} event
     */
    handleClickDiscardChanges: function(event) {
        event.preventDefault();
        this.editor.editing = false;
        this.editor.discardChanges();
        this.render();
    },
    /**
     * @method handleClickEditSection
     * @param {Event} event
     */
    handleClickEditSection: function(event) {
        event.preventDefault();
        this.editor.editing = !this.editor.editing;
        this.render();
    },
    /**
     * @method handleClickSaveChanges
     * @param {Event} event
     */
    handleClickSaveChanges: function(event) {
        event.preventDefault();
        this.editor.editing = false;
        this.vocablistSection.set('name', this.$('#section-name').val());
        this.vocablistSection.set('rows', this.editor.rows);
        this.vocablistSection.save();
        this.render();
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
        return GelatoPage.prototype.remove.call(this);
    }
});
