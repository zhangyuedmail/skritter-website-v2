var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var User = require('models/user');
var Vocablist = require('models/vocablist');
var VocablistSection = require('models/vocablist-section');
var Vocabs = require('collections/vocabs');
var ProgressDialog = require('dialogs/progress/view');

/**
 * @class VocablistView
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
    /**
     * @method initialize
     * @constructor
     */
    initialize: function(options) {
        this.navbar = new DefaultNavbar();
        this.vocablist = new Vocablist({id: options.vocablistId});
        this.vocablist.fetch();
        this.section = new VocablistSection({vocablistId: options.vocablistId, id:options.sectionId});
        this.section.fetch();
        this.vocabs = new Vocabs();
        this.listenTo(this.vocablist, 'state', this.render);
        this.listenTo(this.section, 'state', this.handleSectionLoaded);
        this.listenTo(this.vocabs, 'state', this.renderTable);
        this.showTrad = app.user.get('reviewTraditional');
        this.showSimp = app.user.get('reviewSimplified') || this.vocablist.get('lang') === 'ja';
        this.action = {}; // see handleChangeActionSelect
    },
    /**
     * @method renderTable
     */
    renderTable: function() {
        // this works
        var context = require('globals');
        context.view = this;
        var rendering = $(this.template(context));

        // this does not
        //var rendering = $(this.template(require('globals')));

        this.$('table').replaceWith(rendering.find('table'));
    },
    /**
     * @method handleSectionLoaded
     */
    handleSectionLoaded: function() {
        this.render();
        var vocabIds = [];
        _.forEach(this.section.get('rows'), function(row) {
            if (this.showSimp) {
                vocabIds.push(row.vocabId);
            }
            if (this.showTrad) {
                vocabIds.push(row.tradVocabId);
            }
        }, this);
        var vocabIds = _.uniq(_.filter(vocabIds));
        this.chunks = _.chunk(vocabIds, 50);
        this.loadVocabChunks();
    },
    /**
     * @method loadVocabChunks
     */
    loadVocabChunks: function() {
        if (!this.chunks.length) {
            this.renderTable();
            return;
        }
        var chunk = this.chunks.shift();
        this.vocabs.fetch({
            data: { ids: chunk.join('|') },
            remove: false
        });
        this.listenToOnce(this.vocabs, 'sync', function() {
            this.loadVocabChunks();
        })
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick .checkbox-td': 'handleClickCheckboxTd',
        'change #action-select': 'handleChangeActionSelect'
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Vocab List Section - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistView}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        return this;
    },
    /**
     * @method remove
     * @returns {VocablistView}
     */
    remove: function() {
        this.navbar.remove();
        return GelatoPage.prototype.remove.call(this);
    },
    /**
     * Widens the click area to the table cell element.
     * Disables/enables select box depending on if anything is selected.
     * Keeps vocab.checked property up to date.
     *
     * @method handleClickTdCheckbox
     * @param {Event} e
     */
    handleClickCheckboxTd: function(e) {
        var checkbox = $(e.target);
        if ($(e.target).is('.checkbox-td')) {
            // propagate downward
            $(e.target).find('input').click();
            return;
        }

        var anyChecked = this.$('input:checked').length;
        this.$('#action-select').attr('disabled', !anyChecked);
        var vocabId = checkbox.closest('tr').data('vocab-id');
        var vocab = this.vocabs.get(vocabId);
        vocab.set('checked', checkbox.is(':checked'));
    },
    /**
     * Initializes the action object runAction uses to serially process words
     * @method handleChangeActionSelect
     */
    handleChangeActionSelect: function(e) {
        var action = $(e.target).val();
        if (!action) {
            return;
        }
        $(e.target).val('');
        var selected = new Vocabs(this.vocabs.filter(function(vocab) {
            return vocab.get('checked');
        }));

        var progressDialog = new ProgressDialog();
        progressDialog.render().open();

        this.action = {
            name: action,
            queue: selected,
            total: selected.size(),
            dialog: progressDialog
        };
        this.runAction();
    },
    /**
     * @method runAction
     */
    runAction: function() {
        var vocab = this.action.queue.shift();
        if (!vocab) {
            return this.finishAction();
        }
        if (this.action.name === 'ban') {
            if (vocab.isBanned()) {
                return this.runAction();
            }
            vocab.toggleBanned();
        }
        else if (this.action.name === 'unban') {
            if (!vocab.isBanned()) {
                return this.runAction();
            }
            vocab.toggleBanned();
        }
        else {
            return this.finishAction();
        }
        var attrs = {
            id: vocab.id,
            bannedParts: vocab.get('bannedParts')
        };
        vocab.save(attrs, { patch: true, 'method': 'PUT' });
        this.listenToOnce(vocab, 'sync', function() {
            this.action.dialog.setProgress(100 * (this.action.total - this.action.queue.size()) / this.action.total);
            this.runAction();
        });
    },
    /**
     * @method finishAction
     */
    finishAction: function() {
        this.action.dialog.close();
        this.action = {};
        this.$('input[type="checkbox"]').attr('checked', false);
    }
});
