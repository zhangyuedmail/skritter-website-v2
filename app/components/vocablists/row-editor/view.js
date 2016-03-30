var GelatoComponent = require('gelato/component');

var Vocab = require('models/vocab');
var Vocabs = require('collections/vocabs');
var VocabCreatorDialog = require('dialogs1/vocab-creator/view');

/**
 * @class VocablistsListEditorRows
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.changed = false;
        this.editing = false;
        this.rows = [];
        this.saved = [];
        this.vocablist = options.vocablist;
        this.vocablistSection = options.vocablistSection;
        this.listenTo(this.vocablistSection, 'state', this.render);
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick .add-entry': 'handleClickAddEntry',
        'vclick .remove-row': 'handleClickRemoveRow',
        'vclick .result-row': 'handleClickResultRow',
        'vclick .show-results': 'handleClickShowResults',
        'vclick .study-writing': 'handleClickStudyWriting'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistsListEditorRows}
     */
    render: function() {
        this.renderTemplate();
        this.$('#vocablist-section-rows').sortable({update: _.bind(this.handleUpdateSort, this)});
    },
    /**
     * @method addRow
     * @param {String} query
     */
    addRow: function(query) {
        var queryVocabs = new Vocabs();
        var row = {query: query, state: 'loading'};
        this.rows.push(row);
        queryVocabs.fetch({
            data: {q: query},
            error: function(a, b) {},
            success: _.bind(function(collection) {
                var results = [];
                var groups = collection.groupBy(function(vocab) {
                    return vocab.getBase();
                });
                for (var writing in groups) {
                    if (groups.hasOwnProperty(writing)) {
                        var group = groups[writing];
                        if (group[0].isJapanese()) {
                            for (var a = 0, lengthA = group.length; a < lengthA; a++) {
                                results.push({vocabs: [group[a], group[a]]});
                            }
                        } else if (group.length === 1) {
                            results.push({vocabs: [group[0], group[0]]});
                        } else {
                            for (var b = 1, lengthB = group.length; b < lengthB; b++) {
                                results.push({vocabs: [group[0], group[b]]});
                            }
                        }
                    }
                }
                if (results.length) {
                    row.lang = results[0].vocabs[0].get('lang');
                    row.results = results;
                    row.vocabs = results[0].vocabs;
                    row.vocabId = results[0].vocabs[0].id;
                    row.tradVocabId = results[0].vocabs[1].id;
                    row.studyWriting = true;
                    row.id = row.vocabId + '-' + row.tradVocabId;
                    if (app.getLanguage() === 'ja') {
                        row.id = row.vocabId;
                    }
                    row.state = 'loaded';
                } else {
                    row.id = query;
                    row.state = 'not-found';
                }
                this.render();
            }, this)
        });
        this.render();
    },
    /**
     * @method discardChanges
     */
    discardChanges: function() {
        this.rows = _.clone(this.saved);
        this.render();
    },
    /**
     * @method handleClickAddEntry
     * @param {Event} event
     */
    handleClickAddEntry: function(event) {
        var self = this;
        event.preventDefault();
        var $row = $(event.target).closest('.row');
        var index = $row.data('index');
        this.dialog = new VocabCreatorDialog();
        this.dialog.open({writing: $row.data('row-id')});
        this.dialog.on(
            'vocab',
            function(vocab) {
                self.removeRow(index);
                self.addRow(vocab.get('writing'));
            }
        );
    },
    /**
     * @method handleClickRemoveRow
     * @param {Event} event
     */
    handleClickRemoveRow: function(event) {
        event.preventDefault();
        var $row = $(event.target).closest('.row');
        this.removeRow($row.data('index'));
        this.render();
    },
    /**
     * @method handleClickResultRow
     * @param {Event} event
     */
    handleClickResultRow: function(event) {
        event.preventDefault();
        var $row = $(event.target).closest('.row');
        var $result = $(event.target).closest('.result-row');
        var row = this.rows[parseInt($row.data('index'), 10)];
        var result = row.results[parseInt($result.data('index'), 10)];
        row.vocabs = result.vocabs;
        row.vocabId = result.vocabs[0].id;
        row.tradVocabId = result.vocabs[1].id;
        this.render();
    },
    /**
     * @method handleClickShowResults
     * @param {Event} event
     */
    handleClickShowResults: function(event) {
        event.preventDefault();
        var $row = $(event.target).closest('.row');
        var $resultRows = $row.children('.result-rows');
        if ($resultRows.hasClass('hidden')) {
            $resultRows.removeClass('hidden');
        } else {
            $resultRows.addClass('hidden');
        }
    },
    /**
     * @method handleClickStudyWriting
     * @param {Event} event
     */
    handleClickStudyWriting: function(event) {
        event.preventDefault();
        var $row = $(event.target).closest('.row');
        var $toggle = $row.find('.study-writing');
        var row = this.rows[parseInt($row.data('index'), 10)];
        row.studyWriting = $toggle.hasClass('active') ? false : true;
        this.render();
    },
    /**
     * @method handleUpdateSort
     * @param {Event} event
     */
    handleUpdateSort: function(event) {
        var rows = this.rows;
        var sortedRows = [];
        this.$('#vocablist-section-rows')
            .children('.row')
            .map(function(index, element) {
                var row = _.find(rows, {id: $(element).data('row-id')});
                sortedRows.push(row);
            });
        this.rows = sortedRows;
        this.render();
    },
    /**
     * @method loadRows
     * @param {Object} [options]
     */
    loadRows: function(options) {
        var rows = this.vocablistSection.get('rows');
        var uniqueVocabIds = this.vocablistSection.getUniqueVocabIds();
        var vocabs = new Vocabs();
        async.each(
            _.chunk(uniqueVocabIds, 50),
            _.bind(function(chunk, callback) {
                vocabs.fetch({
                    data: {
                        ids: chunk.join('|')
                    },
                    remove: false,
                    error: function(error) {
                        callback(error);
                    },
                    success: function(vocabs) {
                        callback();
                    }
                });
            }, this),
            _.bind(function(error) {
                rows.forEach(function(row) {
                    var vocab1 = vocabs.get(row.vocabId);
                    var vocab2 = vocabs.get(row.tradVocabId) || vocab1;

                    row.id = row.vocabId + '-' + row.tradVocabId;

                    if (app.getLanguage() === 'ja') {
                        row.id = row.vocabId;
                    }
                    row.lang = vocab1.get('lang');
                    row.state = 'loaded';
                    row.vocabs = [vocab1, vocab2];
                });
                this.rows = _.clone(rows);
                this.saved = _.clone(rows);
                if (error) {
                    if (options && typeof options.error === 'function') {
                        options.error(error);
                    }
                } else {
                    if (options && typeof options.success === 'function') {
                        options.success(rows);
                    }
                }
            }, this)
        );
    },
    /**
     * @method removeRow
     * @param {Number} index
     * @returns {Object}
     */
    removeRow: function(index) {
        return this.rows.splice(index, 1);
    }
});
