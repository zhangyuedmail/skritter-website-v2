var GelatoPage = require('gelato/page');

var DefaultNavbar = require('navbars/default/view');
var EditorRows = require('components/vocablists/row-editor/view');
var Vocablist = require('models/vocablist');
var VocablistSection = require('models/vocablist-section');
var ConfirmGenericDialog = require('dialogs1/confirm-generic/view');

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
        'click #back-link': 'handleClickBackLink',
        'click #discard-changes': 'handleClickDiscardChanges',
        'click #edit-section': 'handleClickEditSection',
        'click #save-changes': 'handleClickSaveChanges'
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
     * @method handleClickBackLink
     * @param {Event} event
     */
    handleClickBackLink: function(event) {
        var self = this;
        if (this.editor.editing) {
            event.preventDefault();
            this.dialog = new ConfirmGenericDialog({
                body: 'You have some unsaved changes that will be lost if you continue.',
                buttonConfirm: 'Continue',
                title: 'Unsaved changes detected'
            });
            this.dialog.once(
                'confirm',
                function() {
                    app.router.navigate('vocablists/view/' + self.vocablist.id, {trigger: true});
                    self.dialog.close();
                }
            );
            this.dialog.open();
        }
    },
    /**
     * @method handleClickDiscardChanges
     * @param {Event} event
     */
    handleClickDiscardChanges: function(event) {
        var self = this;
        event.preventDefault();
        this.dialog = new ConfirmGenericDialog({
            body: 'This will discard all unsaved changes this current list section.',
            buttonConfirm: 'Discard',
            title: 'Discard all changes?'
        });
        this.dialog.once(
            'confirm',
            function() {
                self.editor.editing = false;
                self.editor.discardChanges();
                self.dialog.close();

            }
        );
        this.dialog.once(
            'hidden',
            function() {
                self.render();
            }
        );
        this.dialog.open();
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
        this.editor.rows = this.editor.getRows();
        this.vocablistSection.set('name', this.$('#section-name').val());
        this.vocablistSection.set('rows', this.editor.rows);
        this.vocablistSection.save();
        //remove all results button
        _.forEach(
            this.editor.rows,
            function(row) {
                delete row.results;
            }
        );
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
            window.scrollTo(0, document.body.scrollHeight);
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
