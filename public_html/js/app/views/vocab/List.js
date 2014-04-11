/**
 * @module Skritter
 * @submodule Views
 * @param templateVocabList
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocab-list.html'
], function(templateVocabList) {
    /**
     * @class VocabList
     */
    var VocabList = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabList.id = null;
            VocabList.list = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabList);
            if (VocabList.list) {
                this.$('#list-title').text(VocabList.list.name);
                this.$('#list-mode').html('');
                switch (VocabList.list.studyingMode) {
                    case 'adding':
                        this.$('#list-mode').append("<button id='mode-pause' type='button' class='btn btn-warning'>Pause</button>");
                        this.$('#list-mode').append("<button id='mode-remove' type='button' class='btn btn-danger'>Remove</button>");
                        break;
                    case 'finished':
                        break;
                    case 'reviewing':
                        this.$('#list-mode').append("<button id='mode-add' type='button' class='btn btn-success'>Start</button>");
                        this.$('#list-mode').append("<button id='mode-remove' type='button' class='btn btn-danger'>Remove</button>");
                        break;
                    default:
                        this.$('#list-mode').append("<button  id='mode-add' type='button' class='btn btn-success'>Add</button>");
                        break;
                }

                this.$('#list-description').text(VocabList.list.description);
            }
            return this;
        },
        /**
         * @property {Object} function
         */
        events: {
            'click.VocabList #vocab-list-view #list-mode button': 'handleStudyModeButtonClicked'
        },
        /**
         * @method handleStudyModeButtonClicked
         * @param {Object} event
         */
        handleStudyModeButtonClicked: function(event) {
            switch (event.currentTarget.id.replace('mode-', '')) {
                case 'add':
                    this.toggleMode('adding');
                    break;
                case 'pause':
                    this.toggleMode('reviewing');
                    break;
                case 'remove':
                    this.toggleMode('not studying');
                    break;
            }
            event.preventDefault();
        },
        /**
         * @method load
         * @param listId
         */
        load: function(listId) {
            VocabList.id = listId;
            skritter.api.getVocabList(listId, null, _.bind(function(list) {
                VocabList.list = list;
                this.render();
            }, this));
        },
        toggleMode: function(mode) {
            skritter.api.updateVocabList({id: VocabList.list.id, studyingMode: mode}, _.bind(function(list) {
                VocabList.list = list;                
                this.render();
            }, this));
        }
    });

    return VocabList;
});