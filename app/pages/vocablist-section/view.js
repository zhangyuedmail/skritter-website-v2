var GelatoPage = require('gelato/page');
var Vocabs = require('collections/vocabs');
var ProgressDialog = require('dialogs/progress/view');
var VocabActionMixin = require('mixins/vocab-action');
var User = require('models/user');
var DefaultNavbar = require('navbars/default/view');
var Vocablist = require('models/vocablist');
var VocablistSection = require('models/vocablist-section');
var rowTemplate = require('./row-template');

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
        this.listenToOnce(this.section, 'state', this.handleSectionLoaded);
        this.listenTo(this.vocabs, 'state', this.renderTable);
        this.action = {};
        this.vocabMap = {};
        this.listenTo(this.vocabs, 'add', function(vocab) {
            this.vocabMap[vocab.id] = vocab;
        });
        this.editing = false;
        this.lastSearchRequest = '';
        this.autocompleteOpen = false;
        this.removingRow = false;
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

        this.$('.table-oversized-wrapper').replaceWith(rendering.find('.table-oversized-wrapper'));
    },
    /**
     * @method handleSectionLoaded
     */
    handleSectionLoaded: function() {
        this.render();
        var vocabIds = [];
        _.forEach(this.section.get('rows'), function(row) {
            vocabIds.push(row.vocabId);
            vocabIds.push(row.tradVocabId);
        }, this);
        vocabIds = _.uniq(_.filter(vocabIds));
        this.chunks = _.chunk(vocabIds, 50);
        this.loadVocabChunks();
    },
    /**
     * @method loadVocabChunks
     */
    loadVocabChunks: function() {
        if (!this.chunks.length) {
            this.renderTable();
            this.stopListening(this.vocabs, 'state', this.renderTable);
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
        'click tr': 'handleClickTableRow',
        'change #action-select': 'handleChangeActionSelect',
        'click #edit-section-btn': 'handleClickEditSectionButton',
        'click #cancel-edit-section-link': 'handleCancelEditSectionLink',
        'click #save-edit-section-btn': 'handleClickSaveEditSectionButton',
        'keydown tr input': 'handleKeydownInput',
        'blur tr input': 'stopEditingRow',
        'click .remove-td': 'handleClickRemoveCell',
        'click .study-writing-link': 'handleClickStudyWritingLink'
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
    handleClickTableRow: function(e) {
        if(this.editing) {
            if ($(e.target).closest('tr').is(this.rowEditing)) {
                return;
            }
            if (this.rowEditing) {
                this.stopEditingRow();
            }
            if ($(e.target).closest('#add-word-row').length) {
                var newRow = this.createNewRow();
                newRow.insertBefore($(e.target).closest('tr'));
                this.startEditingRow(newRow);
            }
            else {
                this.startEditingRow($(e.target).closest('tr'));
            }
            return;
        }

        var vocabId = $(e.target).closest('tr').data('vocab-id');
        var tradVocabId = $(e.target).closest('tr').data('trad-vocab-id');
        var vocab = this.vocabMap[vocabId];
        var tradVocab = this.vocabMap[tradVocabId];

        var checkbox = $(e.target);
        if ($(e.target).is(':not(input[type="checkbox"])')) {
            // propagate downward
            $(e.target).closest('tr').find('input[type="checkbox"]').click();
            return;
        }

        var anyChecked = this.$('input:checked').length;
        this.$('#action-select').attr('disabled', !anyChecked);
        vocab.set('checked', checkbox.is(':checked'));
        if (tradVocab) {
            tradVocab.set('checked', checkbox.is(':checked'));
        }
    },
    /**
     * @method startEditingRow
     * @param {jQuery} rowEl
     */
    startEditingRow: function(rowEl) {
        var rowString = this.createRowString(rowEl.data('vocab-id'), rowEl.data('trad-vocab-id'));
        var editCell = rowEl.find('td.edit-cell');
        var input = editCell.find('input');
        var view = this;

        rowEl.find('td').addClass('hide');
        editCell.removeClass('hide');
        input.val(rowString);
        input.focus();
        this.rowEditing = rowEl;
        input.autocomplete({
            source: _.bind(this.vocabAutocompleteSource, this)
        });
        input.on('autocompletesearch', function() {
            $(editCell[0]).append($(" <i class='fa fa-2x fa-spinner fa-pulse' />"));
        });
        input.on('autocompleteopen', function() {
            view.autocompleteOpen = true;
        });
        input.on('autocompleteresponse', function() {
            editCell.find('i.fa-spinner').remove();
        });
        input.on('autocompleteclose', function() {
            view.autocompleteOpen = false;
        });
        input.on('autocompletefocus', function(event, ui) {
            if(event.which) {
                event.preventDefault();
                input.val(ui.item.label);
                rowEl.data('vocab-id', ui.item.value[0]);
                rowEl.data('trad-vocab-id', ui.item.value[1]);
            }
        });
        input.on('autocompleteselect', function(event, ui) {
            event.preventDefault();
            input.val(ui.item.label);
            rowEl.data('vocab-id', ui.item.value[0]);
            rowEl.data('trad-vocab-id', ui.item.value[1]);
        });
        this.lastSearchRequest = '';
    },
    /**
     * @method createRowString
     * @param {String} vocabId
     * @param {String} tradVocabId
     */
    createRowString: function(vocabId, tradVocabId) {
        var vocab = this.vocabMap[vocabId];
        var tradVocab = this.vocabMap[tradVocabId];
        var rowStringParts = [];
        if (vocab) {
            rowStringParts = [vocab.getWriting(), vocab.getReading(), vocab.getDefinition()];
        }
        if (tradVocab && tradVocab.id !== vocab.id) {
            rowStringParts.splice(1, 0, [tradVocab.getWriting()]);
        }
        return rowStringParts.join(' ');
    },
    /**
     * @method vocabAutocompleteSource
     * @param {Object} request
     * @param {Function} response
     */
    vocabAutocompleteSource: function(request, response) {
        if (!request || this.lastSearchRequest === request.term) {
            return;
        }
        this.lastSearchRequest = request.term;
        var vocabSearch = new Vocabs();
        var lang = this.vocablist.get('lang');
        vocabSearch.fetch({
            data: {
                lang: lang,
                q: request.term,
                limit: 10
            },
            remove: false
        });


        this.listenTo(vocabSearch, 'sync', function() {
            this.vocabs.add(vocabSearch.models);
            var groups = vocabSearch.groupBy(function(vocab) { return vocab.getBase(); });
            var rows = [];
            _.forEach(groups, function(group) {
                // make an input for each simp/trad vocab pair
                group = _.sortBy(group, function(vocab) { return vocab.getVariation(); });
                if (lang === 'zh' && group[0].getVariation() !== 0) {
                    throw Error('Got a group of Chinese vocabs w/out a simplified character.');
                }
                if (lang === 'ja') {
                    _.forEach(group, function(vocab) {
                        rows.push({
                            label: this.createRowString(vocab.id, vocab.id),
                            value: [vocab.id, vocab.id]
                        });
                    }, this);
                }
                else if (group.length === 1) {
                    rows.push({
                        label: this.createRowString(group[0].id, group[0].id),
                        value: [group[0].id, group[0].id]
                    });
                }
                else {
                    for (var i = 1; i < group.length; i++) {
                        rows.push({
                            label: this.createRowString(group[0].id, group[i].id),
                            value: [group[0].id, group[i].id]
                        });
                    }
                }
            }, this);
            response(rows);
            this.stopListening(vocabSearch);
        });

        this.listenTo(vocabSearch, 'error', function() {
            response([]);
            this.stopListening(vocabSearch);
        });
    },
    /**
     * @method stopEditingRow
     */
    stopEditingRow: function() {
        if (!this.rowEditing || this.removingRow) {
            return;
        }

        var vocabId = this.rowEditing.data('vocab-id');
        var tradVocabId = this.rowEditing.data('trad-vocab-id');
        if (!vocabId) {
            this.removingRow = true;
            this.rowEditing.remove();
            this.removingRow = false;
        }
        else {
            var rowData = {
                vocabId: vocabId,
                tradVocabId: tradVocabId,
            };
            if (this.vocablist.get('lang') === 'ja') {
                var studyLink = this.rowEditing.find('.study-writing-link');
                rowData.studyWriting = !studyLink.hasClass('text-muted');
            }
            var newRow = $(rowTemplate({
                view: this,
                row: rowData
            }));
            newRow.find('.glyphicon-option-vertical, .glyphicon-trash').removeClass('hide');
            newRow.find('input[type="checkbox"]').addClass('hide');
            this.removingRow = true;
            this.rowEditing.replaceWith(newRow);
            this.removingRow = false;
        }
        this.rowEditing = null;
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
        var vocabs = new Vocabs(this.vocabs.filter(function(vocab) {
            return vocab.get('checked');
        }));
        this.$('input[type="checkbox"]').attr('checked', false);
        this.beginVocabAction(action, vocabs);
    },
    /**
     * @method handleClickStudyWritingLink
     * @param {Event} e
     */
    handleClickStudyWritingLink: function(e) {
        if (!this.editing) {
            return;
        }
        $(e.target).toggleClass('text-muted');
        e.stopPropagation();
    },
    /**
     * @method handleClickEditSectionButton
     */
    handleClickEditSectionButton: function() {
        this.$('.glyphicon-option-vertical, .glyphicon-trash').removeClass('hide');
        this.$('input[type="checkbox"]').addClass('hide');
        this.$('#static-header-row').addClass('hide');
        this.$('#editing-header-row').removeClass('hide');
        this.$('#add-word-row').removeClass('hide');
        $(this.el).find('tbody').sortable({
            handle:'.glyphicon-option-vertical'
        });
        this.editing = true;
    },
    /**
     * @method handleCancelEditSectionLink
     */
    handleCancelEditSectionLink: function() {
        this.renderTable();
        this.$('#static-header-row').removeClass('hide');
        this.$('#editing-header-row').addClass('hide');
        this.$('#add-word-row').addClass('hide');
        this.editing = false;
    },
    /**
     * @method handleClickSaveEditSectionButton
     */
    handleClickSaveEditSectionButton: function() {
        var rows = [];
        var lang = this.vocablist.get('lang');
        _.forEach(this.$('tr'), function(el, i) {
            var vocabID = $(el).data('vocab-id');
            var tradVocabID = $(el).data('trad-vocab-id');
            if (!vocabID) {
                return;
            }
            var rowData = { vocabId: vocabID, tradVocabId: tradVocabID };
            if (lang === 'ja') {
                var studyLink = $(el).find('.study-writing-link');
                rowData.studyWriting = !studyLink.hasClass('text-muted');
            }
            rows.push(rowData);
        }, this);
        this.section.set('rows', rows);
        this.section.set('name', this.$('#name-input').val());
        this.section.save();
        this.renderTable();
        this.$('#static-header-row').removeClass('hide');
        this.$('#editing-header-row').addClass('hide');
        this.$('#add-word-row').addClass('hide');
        this.editing = false;
    },
    /**
     * @method handleKeydownInput
     * @param {Event} e
     */
    handleKeydownInput: function(e) {
        if (_.any([
              !_.contains([38, 40, 27, 13], e.which),
              this.autocompleteOpen
          ])) {
            return;
        }

        var fromRow = $(e.target).closest('tr');
        var toRow = null;
        var newRow = this.createNewRow();

        if (e.which === 38) { // up-arrow
            toRow = fromRow.prev();
            if (!toRow.length) {
                toRow = newRow.insertBefore(fromRow);
            }
        }
        if (e.which === 40) { // down-arrow
            toRow = fromRow.next();
            if (!toRow.length) {
                toRow = newRow.insertAfter(fromRow);
            }
        }
        if (e.which === 13) { // enter-key
            toRow = newRow.insertAfter(fromRow);
        }
        if (e.which === 27) { // escape-key
            this.stopEditingRow();
            return;
        }

        if (this.rowEditing) {
            this.stopEditingRow();
        }
        this.startEditingRow(toRow);
    },
    /**
     * @method createNewRow
     * @returns {jQuery}
     */
    createNewRow: function() {
      return $(rowTemplate({
          view: this,
          row: {
              vocabId: '',
              tradVocabId: ''
          }
      }));
    },
    /**
     * @method handleClickRemoveCell
     * @param {Event} e
     */
    handleClickRemoveCell: function(e) {
        if (!this.editing) {
            return;
        }
        this.stopEditingRow();
        $(e.target).closest('tr').remove();
    }
});

_.extend(module.exports.prototype, VocabActionMixin);
