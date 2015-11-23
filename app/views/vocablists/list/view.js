var GelatoPage = require('gelato/page');

var DefaultNavbar = require('navbars/default/view');
var EditorSections = require('./editor-sections/view');
var Sidebar = require('./sidebar/view');
var Vocablist = require('models/vocablist');
var VocablistSection = require('models/vocablist-section');
var User = require('models/user');

/**
 * @class VocablistsListPage
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
        this.vocablistSection = new VocablistSection({vocablistId: options.vocablistId});
        this.editor = new EditorSections({vocablist: this.vocablist, vocablistSection: this.vocablistSection});
        this.navbar = new DefaultNavbar();
        this.sidebar = new Sidebar({vocablist: this.vocablist});
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
                if (this.vocablist.get('sections').length === 1) {
                    this.vocablistSection.set('id', this.vocablist.get('sections')[0].id);
                    this.vocablistSection.fetch({
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
            }, this),
            _.bind(function(callback) {
                callback();
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
        'vclick #edit-list': 'handleClickEditList',
        'vclick #save-sections': 'handleClickSaveSections'
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
     * @returns {VocablistsListPage}
     */
    render: function() {
        this.renderTemplate();
        this.editor.setElement('#editor-container').render();
        this.navbar.setElement('#navbar-container').render();
        this.sidebar.setElement('#sidebar-container').render();
        if (this.vocablist.has('name')) {
            document.title = this.vocablist.get('name') + ' - Vocablist - Skritter';
        }
        return this;
    },
    /**
     * @method handleClickAddSection
     * @param {Event} event
     */
    handleClickAddSection: function(event) {
        event.preventDefault();
        this.vocablist.get('sections').push({rows: []});
        this.editor.render();
        this.render();
    },
    /**
     * @method handleClickEditList
     * @param {Event} event
     */
    handleClickEditList: function(event) {
        event.preventDefault();
        if (this.editing) {
            this.editing = false;
            this.editor.editing = false;
            this.editor.$('#vocablist-sections')
                .children('.row')
                .each((function(index, element) {
                    var name = $(element).find('#section-name').val();
                    var section = this.vocablist.get('sections')[index];
                    section.name = name;
                }).bind(this));
            this.vocablist.set({
                description: this.$('.list-description').val(),
                name: this.$('.list-name').val()
            }).save(null, {patch: true});
        } else {
            this.editing = true;
            this.editor.editing = true;
        }
        this.editor.render();
        this.render();
    },
    /**
     * @method handleClickSaveSections
     * @param {Event} event
     */
    handleClickSaveSections: function(event) {
        event.preventDefault();
        this.editor.editing = false;
        this.editor.render();
        this.vocablist.save();
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
        this.sidebar.render();
        this.render();
    },
    /**
     * @method remove
     * @returns {VocablistsListPage}
     */
    remove: function() {
        this.editor.remove();
        this.navbar.remove();
        this.sidebar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
